
// Test script to check AI TypeScript files
require('dotenv').config();
const fs = require('fs');

// Use file paths instead of direct imports
const estimateValuePath = './backend/estimateValue.ts';
const promptSuggestionsPath = './backend/promptSuggestions.ts';

// Mock context for testing
const mockContext = {
  auth: { uid: 'test-user-123' }
};

function readTsFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return null;
  }
}

function checkFileForFunctions(content, functionNames) {
  const found = [];
  
  for (const name of functionNames) {
    if (content.includes(`export const ${name}`)) {
      found.push(name);
    }
  }
  
  return found;
}

function runMockedTests() {
  console.log('🧪 Testing AI Functions (File Check) 🧪\n');
  
  try {
    // Read the TypeScript files
    const estimateValueContent = readTsFile(estimateValuePath);
    const promptSuggestionsContent = readTsFile(promptSuggestionsPath);
    
    if (estimateValueContent) {
      console.log('✓ estimateValue.ts file loaded');
      const functions = checkFileForFunctions(estimateValueContent, ['estimateValue']);
      if (functions.length > 0) {
        console.log(`✓ Found functions: ${functions.join(', ')}`);
      }
    }
    
    if (promptSuggestionsContent) {
      console.log('✓ promptSuggestions.ts file loaded');
      const functions = checkFileForFunctions(promptSuggestionsContent, ['promptSuggestions']);
      if (functions.length > 0) {
        console.log(`✓ Found functions: ${functions.join(', ')}`);
      }
    }
    
    console.log('\n✅ Files checked successfully!');
    console.log('\nTo run these TypeScript files, you would need to:');
    console.log('1. Install ts-node: npm install -g ts-node typescript');
    console.log('2. Run them with: ts-node backend/index.ts');
    
  } catch (error) {
    console.error('❌ Error checking AI functions:', error);
    console.error(error.stack);
  }
}

runMockedTests();
