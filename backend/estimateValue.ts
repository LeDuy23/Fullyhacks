
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import fetch from 'node-fetch';

// Cerebras API configuration
const CEREBRAS_API_URL = process.env.CEREBRAS_API_URL || 'https://api.cerebras.ai/v1';
const CEREBRAS_API_KEY = process.env.CEREBRAS_API_KEY;

interface EstimateValueRequest {
  itemName: string;
  description?: string;
  roomType?: string;
}

// Estimate the value of an item using OpenAI
export const estimateValue = async (
  data: EstimateValueRequest,
  context: functions.https.CallableContext
) => {
  // Check auth
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'You must be logged in to estimate item values.'
    );
  }
  
  // Extract request data
  const { itemName, description, roomType } = data;
  
  if (!itemName) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'The function must be called with an item name.'
    );
  }
  
  try {
    // Prepare the prompt
    const prompt = `Estimate the average replacement cost in USD for a ${itemName} ${description ? `described as: ${description}` : ''} ${roomType ? `in a ${roomType}` : ''}. Return only a number with no additional text, symbols, or formatting.`;
    
    // Log the request to Firestore
    const logRef = admin.firestore().collection('aiPromptLogs').doc();
    await logRef.set({
      userId: context.auth.uid,
      prompt,
      type: 'estimate_value',
      model: 'gpt-3.5-turbo',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      success: false, // Will update to true if successful
    });
    
    // Call Cerebras API
    const response = await fetch(`${CEREBRAS_API_URL}/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CEREBRAS_API_KEY}`
      },
      body: JSON.stringify({
        prompt,
        max_tokens: 50,
        temperature: 0.3
      })
    });
    
    if (!response.ok) {
      throw new Error(`Cerebras API error: ${response.statusText}`);
    }
    
    const responseData = await response.json();
    const content = responseData.choices[0].text?.trim() || '';
    
    // Extract the number from the response
    const numberMatch = content.match(/\d+(\.\d+)?/);
    let estimatedValue = 0;
    
    if (numberMatch) {
      estimatedValue = parseFloat(numberMatch[0]);
    } else {
      throw new Error('Invalid response format from OpenAI');
    }
    
    // Update the log entry with success
    await logRef.update({
      response: content,
      success: true,
      estimatedValue,
    });
    
    return { estimatedValue };
  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // Use an intelligent fallback system with common item estimates
    const commonItems = {
      "refrigerator": 1200,
      "tv": 500, 
      "sofa": 1000,
      "couch": 1000,
      "bed": 900,
      "chair": 200,
      "table": 300,
      "desk": 250,
      "computer": 1200,
      "laptop": 1000,
      "dresser": 400,
      "wardrobe": 500,
      "bicycle": 250,
      "microwave": 120,
      "dishwasher": 800,
      "stove && oven": 1200,
    };
    
    // Try to match the item name to common items
    const itemKey = itemName.toLowerCase();
    let fallbackValue = 100; // Default fallback
    
    for (const [key, value] of Object.entries(commonItems)) {
      if (itemKey.includes(key)) {
        fallbackValue = value;
        break;
      }
    }
    
    // If no match found, use room-based defaults
    if (fallbackValue === 100 && roomType) {
      const roomDefaults = {
        "kitchen": 250,
        "living_room": 300,
        "living room": 300,
        "bedroom": 200,
        "bathroom": 150,
        "office": 300,
        "garage": 200,
        "basement": 150
      };
      
      const roomKey = roomType.toLowerCase();
      if (roomDefaults[roomKey]) {
        fallbackValue = roomDefaults[roomKey];
      }
    }
    
    return { 
      estimatedValue: fallbackValue,
      isEstimate: false,
      isFallback: true
    };
  }
};
