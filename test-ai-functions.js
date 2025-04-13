
// Test script to check AI functions with mocked API responses
require('dotenv').config();
const { estimateValue } = require('./backend/estimateValue');
const { promptSuggestions } = require('./backend/promptSuggestions');

// Mock fetch to avoid actual API calls
jest.mock('node-fetch', () => 
  jest.fn().mockImplementation(() => 
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        choices: [{ text: '150' }] // Mock response for estimateValue
      })
    })
  )
);

// Mock Firebase admin
jest.mock('firebase-admin', () => ({
  firestore: () => ({
    collection: () => ({
      doc: () => ({
        set: jest.fn().mockResolvedValue({}),
        update: jest.fn().mockResolvedValue({})
      })
    }),
    FieldValue: {
      serverTimestamp: jest.fn()
    }
  }),
  initializeApp: jest.fn(),
  credential: {
    cert: jest.fn()
  },
  apps: []
}));

// Mock context for testing
const mockContext = {
  auth: { uid: 'test-user-123' }
};

async function runMockedTests() {
  console.log('🧪 Testing AI Functions With Mocked Responses 🧪\n');
  
  try {
    // Test estimate value
    console.log('Testing estimateValue:');
    const valueResult = await estimateValue(
      { 
        itemName: 'MacBook Pro',
        description: '16-inch, 2021 model', 
        roomType: 'office'
      }, 
      mockContext
    );
    console.log('Result:', valueResult);
    console.log('✓ estimateValue function works\n');
    
    // Test prompt suggestions
    console.log('Testing promptSuggestions:');
    const suggestionsResult = await promptSuggestions(
      { roomType: 'living room' }, 
      mockContext
    );
    console.log('Result:', suggestionsResult);
    console.log('✓ promptSuggestions function works');
    
    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('❌ Error testing AI functions:', error);
    console.error(error.stack);
  }
}

runMockedTests();
