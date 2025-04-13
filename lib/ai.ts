
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.CEREBRAS_API_KEY,
});

// Get item suggestions for a specific room
export async function getSuggestionsForRoom(room: string): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant for a wildfire insurance claim app."
        },
        {
          role: "user",
          content: `List 10 common items found in a ${room} that might be included in an insurance claim. Return only a JSON array of strings with no additional text.`
        }
      ],
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    
    if (!content) {
      throw new Error('No content in OpenAI response');
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
      console.error('Error parsing OpenAI response:', error);
      throw new Error('Invalid response format from OpenAI');
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    
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
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant for estimating the value of items for insurance claims."
        },
        {
          role: "user",
          content: `Estimate the average replacement cost in USD for a ${itemName} ${itemDescription ? `described as: ${itemDescription}` : ''} ${roomType ? `in a ${roomType}` : ''}. Return only a number with no additional text, symbols, or formatting.`
        }
      ],
      temperature: 0.3,
    });

    const content = response.choices[0].message.content;
    
    if (!content) {
      throw new Error('No content in OpenAI response');
    }
    
    // Extract the number from the response
    const numberMatch = content.match(/\d+(\.\d+)?/);
    if (numberMatch) {
      return parseFloat(numberMatch[0]);
    }
    
    throw new Error('Invalid response format from OpenAI');
  } catch (error) {
    console.error('OpenAI API error:', error);
    
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
