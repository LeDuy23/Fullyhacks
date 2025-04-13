
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
      // First, try to extract a JSON array if it's wrapped in other text
      const jsonMatch = content.match(/\[[\s\S]*?\]/s);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // If that fails, try to parse the entire content as JSON
      try {
        return JSON.parse(content);
      } catch (innerError) {
        // If both methods fail, try to extract individual items using regex
        const itemsMatch = content.match(/"([^"]*)"/g);
        if (itemsMatch) {
          return itemsMatch.map(item => item.replace(/"/g, ''));
        }
        
        throw new Error('Unable to parse response format');
      }
    } catch (error) {
      console.error('Error parsing Cerebras response:', error);
      throw new Error('Invalid response format from Cerebras');
    }
  } catch (error) {
    console.error('Cerebras API error:', error);
    
    // Return fallback items based on room
    const fallbacks: Record<string, string[]> = {
       'Kitchen': ['refrigerator', 'microwave', 'dishwasher', 'stove', 'toaster', 'coffee maker', 'blender', 'pots and pans', 'utensils', 'dishes', 'airfryer'],
        'living room': ['sofa', 'coffee table', 'television', 'bookshelf', 'lamp', 'entertainment center', 'side table', 'rug', 'curtains', 'armchair'],
        'bedroom': ['bed', 'mattress', 'dresser', 'nightstand', 'wardrobe', 'mirror', 'bedding', 'pillows', 'lamp', 'rug' , 'television'],
        'Bathroom': ['shower', 'sink', 'toilet', 'medicine cabinet', 'towel rack', 'mirror', 'toilet paper holder', 'shower curtain', 'bath mat', 'toiletries'],
         'laundry room': ['washing machine', 'dryer', 'iron', 'ironing board', 'drying rack', 'storage bins', 'shelving', 'laundry basket', 'laundry detergent', 'laundry soap'], 
          'garage': ['tools', 'workbench', 'lawn mower', 'shelving', 'bicycle', 'garden tools', 'storage bins', 'ladder', 'power tools', 'car supplies'],
          'backyard': ['grill', 'patio furniture', 'garden tools', 'outdoor lighting', 'bbq', 'garden furniture', 'outdoor decor', 'pool', 'garden'],   
        'basement': ['storage bins', 'shelving', 'tools', 'workbench', 'furniture', 'appliances', 'electronics', 'sports equipment', 'gym equipment', 'office supplies']
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
    // This improved regex handles numbers with commas or currency symbols
    const numberMatch = content.match(/[\$£€]?[\s]?([0-9,]+(\.[0-9]+)?)/);
    if (numberMatch) {
      // Remove any commas and currency symbols before parsing
      const cleanedNumber = numberMatch[1].replace(/,/g, '');
      return parseFloat(cleanedNumber);
    }
    
    // If specific number pattern not found, try to find any numeric value
    const anyNumberMatch = content.match(/\d+(\.\d+)?/);
    if (anyNumberMatch) {
      return parseFloat(anyNumberMatch[0]);
    }
    
    throw new Error('Invalid response format from Cerebras');
  } catch (error) {
    console.error('Cerebras API error:', error);
    
    // Return an educated guess based on the item type
    const commonItems = {
      "refrigerator": 1200,
      "tv": 800, 
      "television": 800,
      "sofa": 1000,
      "couch": 1000,
      "bed": 900,
      "chair": 150,
      "table": 300,
      "desk": 350,
      "computer": 1200,
      "laptop": 1000,
      "dresser": 400,
      "wardrobe": 500,
      "bicycle": 250,
      "microwave": 150,
      "dishwasher": 700,
      "stove": 900,
      "oven": 850
    };
    
    // Try to match the item name to common items
    const itemKey = itemName.toLowerCase();
    for (const [key, value] of Object.entries(commonItems)) {
      if (itemKey.includes(key)) {
        return value;
      }
    }
    
    // If no match, return a reasonable default based on room type
    const roomDefaults: Record<string, number> = {
      "kitchen": 250,
      "living_room": 300,
      "bedroom": 200,
      "bathroom": 150,
      "office": 300,
      "garage": 200,
      "basement": 150
    };
    
    const roomKey = roomType?.toLowerCase().replace(/\s+/g, '_');
    return roomDefaults[roomKey as keyof typeof roomDefaults] || 100;
  }
}
