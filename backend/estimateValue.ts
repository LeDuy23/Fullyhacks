
import * as functions from 'firebase-functions';
import { Configuration, OpenAIApi } from 'openai';
import * as admin from 'firebase-admin';

// Initialize OpenAI API
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Static fallback data
import * as fallbackData from '../data/item_prices.json';

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
    
    // Call OpenAI API
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 50,
      temperature: 0.3,
    });
    
    // Process the response
    const content = response.data.choices[0].text?.trim() || '';
    
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
    
    // Try to get the value from the static data
    const roomKey = roomType ? roomType.toLowerCase().replace(' ', '_') : '';
    const itemKey = itemName.toLowerCase();
    
    let fallbackValue = 100; // Default fallback
    
    if (roomKey && fallbackData[roomKey] && fallbackData[roomKey][itemKey]) {
      fallbackValue = fallbackData[roomKey][itemKey];
    }
    
    return { 
      estimatedValue: fallbackValue,
      isEstimate: false,
      isFallback: true
    };
  }
};
