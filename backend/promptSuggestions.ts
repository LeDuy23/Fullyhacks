
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import fetch from 'node-fetch';

// Cerebras API configuration
const CEREBRAS_API_URL = process.env.CEREBRAS_API_URL || 'https://api.cerebras.ai/v1';
const CEREBRAS_API_KEY = process.env.CEREBRAS_API_KEY;

// Fallback suggestions
const fallbackSuggestions = {
  'Kitchen': ['refrigerator', 'microwave', 'dishwasher', 'stove', 'toaster', 'coffee maker', 'blender', 'pots and pans', 'utensils', 'dishes', 'airfryer'],
  'living room': ['sofa', 'coffee table', 'television', 'bookshelf', 'lamp', 'entertainment center', 'side table', 'rug', 'curtains', 'armchair'],
  'bedroom': ['bed', 'mattress', 'dresser', 'nightstand', 'wardrobe', 'mirror', 'bedding', 'pillows', 'lamp', 'rug' , 'television'],
  'Bathroom': ['shower', 'sink', 'toilet', 'medicine cabinet', 'towel rack', 'mirror', 'toilet paper holder', 'shower curtain', 'bath mat', 'toiletries'],
   'laundry room': ['washing machine', 'dryer', 'iron', 'ironing board', 'drying rack', 'storage bins', 'shelving', 'laundry basket', 'laundry detergent', 'laundry soap'], 
    'garage': ['tools', 'workbench', 'lawn mower', 'shelving', 'bicycle', 'garden tools', 'storage bins', 'ladder', 'power tools', 'car supplies'],
    'backyard': ['grill', 'patio furniture', 'garden tools', 'outdoor lighting', 'bbq', 'garden furniture', 'outdoor decor', 'pool', 'garden'],  
  'basement': ['storage bins', 'shelving', 'tools', 'workbench', 'furniture', 'appliances', 'electronics', 'sports equipment', 'gym equipment', 'office supplies']
  
};

interface SuggestItemsRequest {
  roomType: string;
}

// Get item suggestions for a specific room using Cerebras AI
export const promptSuggestions = async (
  data: SuggestItemsRequest,
  context: functions.https.CallableContext
) => {
  // Check auth
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'You must be logged in to get item suggestions.'
    );
  }
  
  // Extract request data
  const { roomType } = data;
  
  if (!roomType) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'The function must be called with a room type.'
    );
  }
  
  try {
    // Prepare the prompt
    const prompt = `List 10 common items found in a ${roomType} that might be included in an insurance claim. Return only a JSON array of strings with no additional text.`;
    
    // Log the request to Firestore
    const logRef = admin.firestore().collection('aiPromptLogs').doc();
    await logRef.set({
      userId: context.auth.uid,
      prompt,
      type: 'suggest_items',
      model: 'cerebras',
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
        max_tokens: 250,
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      throw new Error(`Cerebras API error: ${response.statusText}`);
    }
    
    const responseData = await response.json();
    const content = responseData.choices[0].text?.trim() || '';
    
    // Extract JSON array from the response
    let suggestions = [];
    try {
      // Sometimes the API returns valid JSON, other times it might include markdown formatting
      const jsonMatch = content.match(/\[.*\]/s);
      if (jsonMatch) {
        suggestions = JSON.parse(jsonMatch[0]);
      } else {
        suggestions = JSON.parse(content);
      }
    } catch (error) {
      throw new Error('Invalid response format from Cerebras');
    }
    
    // Update the log entry with success
    await logRef.update({
      response: content,
      success: true,
      suggestions,
    });
    
    return { suggestions };
  } catch (error) {
    console.error('Cerebras API error:', error);
    
    // Provide fallback suggestions based on room type
    const roomKey = roomType.toLowerCase();
    const suggestions = fallbackSuggestions[roomKey] || ['chair', 'table', 'lamp', 'shelf', 'cabinet', 'rug', 'artwork', 'electronics', 'appliance', 'furniture'];
    
    return { 
      suggestions,
      isAI: false,
      isFallback: true
    };
  }
};
