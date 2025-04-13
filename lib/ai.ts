
// Cerebras AI API client
const CEREBRAS_API_URL = process.env.CEREBRAS_API_URL || 'https://api.cerebras.ai/v1';
const CEREBRAS_API_KEY = process.env.CEREBRAS_API_KEY;

// Helper function to call Cerebras API
async function callCerebrasAPI(prompt: string, options: any = {}) {
  const response = await fetch(`${CEREBRAS_API_URL}/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CEREBRAS_API_KEY}`
    },
    body: JSON.stringify({
      prompt,
      max_tokens: options.maxTokens || 150,
      temperature: options.temperature || 0.7,
      ...options
    })
  });

  if (!response.ok) {
    throw new Error(`Cerebras API error: ${response.statusText}`);
  }

  return await response.json();
}

// Get item suggestions for a specific room
export async function getSuggestionsForRoom(room: string): Promise<string[]> {
  try {
    const prompt = `List 10 common items found in a ${room} that might be included in an insurance claim. Return only a JSON array of strings with no additional text.`;
    
    const response = await callCerebrasAPI(prompt, {
      temperature: 0.7,
      maxTokens: 250
    });

    const content = response.choices?.[0]?.text || '';
    
    if (!content) {
      throw new Error('No content in Cerebras response');
    }
    
    // Extract JSON array from the response
    try {
      // Sometimes the API returns valid JSON, other times it might include markdown formatting
      const jsonMatch = content.match(/\[.*\]/s);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(content);
    } catch (error) {
      console.error('Error parsing Cerebras response:', error);
      throw new Error('Invalid response format from Cerebras');
    }
  } catch (error) {
    console.error('Cerebras API error:', error);
    
    // Return fallback items based on room
    const fallbacks: Record<string, string[]> = {
      'kitchen': ['refrigerator', 'microwave', 'dishwasher', 'stove', 'toaster', 'coffee maker'],
      'living room': ['sofa', 'coffee table', 'television', 'bookshelf', 'lamp'],
      'bedroom': ['bed', 'dresser', 'nightstand', 'wardrobe', 'mirror'],
      'bathroom': ['shower', 'sink', 'toilet', 'medicine cabinet', 'towel rack'],
      'office': ['desk', 'office chair', 'computer', 'printer', 'filing cabinet'],
      'garage': ['tools', 'workbench', 'lawn mower', 'bicycle', 'shelving'],
    };
    
    return fallbacks[room.toLowerCase()] || ['chair', 'table', 'lamp', 'shelf', 'cabinet'];
  }
}

// Estimate the value of an item
export async function estimateItemValue(
  itemName: string,
  itemDescription: string = '',
  roomType: string = ''
): Promise<number> {
  try {
    const prompt = `Estimate the average replacement cost in USD for a ${itemName} ${itemDescription ? `described as: ${itemDescription}` : ''} ${roomType ? `in a ${roomType}` : ''}. Return only a number with no additional text, symbols, or formatting.`;
    
    const response = await callCerebrasAPI(prompt, {
      temperature: 0.3,
      maxTokens: 50
    });

    const content = response.choices?.[0]?.text || '';
    
    if (!content) {
      throw new Error('No content in Cerebras response');
    }
    
    // Extract the number from the response
    const numberMatch = content.match(/\d+(\.\d+)?/);
    if (numberMatch) {
      return parseFloat(numberMatch[0]);
    }
    
    throw new Error('Invalid response format from Cerebras');
  } catch (error) {
    console.error('Cerebras API error:', error);
    
    // Return a fallback value
    // Try to get the value from the static data
    const fallbackData = require('../data/item_prices.json');
    const roomKey = roomType.toLowerCase().replace(' ', '_');
    const itemKey = itemName.toLowerCase();
    
    if (fallbackData[roomKey] && fallbackData[roomKey][itemKey]) {
      return fallbackData[roomKey][itemKey];
    }
    
    // Generic fallback
    return 100;
  }
}
