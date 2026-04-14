import readline from 'readline';
import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:3000';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function register() {
  const username = await ask('Username: ');
  const password = await ask('Password: ');
  const email = await ask('Email (optional): ');
  
  try {
    const response = await axios.post(`${API_URL}/api/auth/register`, {
      username,
      password,
      email: email || null
    });
    
    console.log('✓ Registration successful');
    console.log(`API Key: ${response.data.api_key}`);
  } catch (error) {
    console.error('✗ Registration failed:', error.response?.data?.error || error.message);
  }
}

async function login() {
  const username = await ask('Username: ');
  const password = await ask('Password: ');
  
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      username,
      password
    });
    
    console.log('✓ Login successful');
    console.log(`Token: ${response.data.token}`);
    console.log(`Balance: $${response.data.user.balance}`);
    return response.data.token;
  } catch (error) {
    console.error('✗ Login failed:', error.response?.data?.error || error.message);
    return null;
  }
}

async function getModels(apiKey) {
  try {
    const response = await axios.get(`${API_URL}/api/models`, {
      headers: { 'X-API-Key': apiKey }
    });
    
    console.log('\nAvailable Models:');
    console.log('─'.repeat(80));
    response.data.forEach(model => {
      console.log(`${model.display_name} (${model.provider})`);
      console.log(`  Input: $${model.input_price}/M tokens, Output: $${model.output_price}/M tokens`);
      console.log(`  Intelligence: ${model.intelligence_level}%, Quality: ${model.quality_level}`);
      console.log('');
    });
  } catch (error) {
    console.error('✗ Failed to get models:', error.response?.data?.error || error.message);
  }
}

async function testChat(apiKey) {
  const model = await ask('Model name (e.g., gpt-5.4): ');
  const message = await ask('Message: ');
  
  try {
    const response = await axios.post(`${API_URL}/api/v1/chat/completions`, {
      model,
      messages: [{ role: 'user', content: message }]
    }, {
      headers: { 'X-API-Key': apiKey }
    });
    
    console.log('\nResponse:');
    console.log(response.data.choices[0].message.content);
    console.log(`\nTokens used: ${response.data.usage.total_tokens}`);
    console.log(`Cost: $${((response.data.usage.prompt_tokens / 1000000) * 15 + (response.data.usage.completion_tokens / 1000000) * 60).toFixed(6)}`);
  } catch (error) {
    console.error('✗ Chat failed:', error.response?.data?.error || error.message);
  }
}

async function getBalance(apiKey) {
  try {
    const response = await axios.get(`${API_URL}/api/auth/profile`, {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    
    console.log(`\nBalance: $${response.data.balance}`);
  } catch (error) {
    console.error('✗ Failed to get balance:', error.response?.data?.error || error.message);
  }
}

async function main() {
  console.log('NexusMind CLI Tool\n');
  
  const action = await ask('Choose action:\n1. Register\n2. Login\n3. Get Models\n4. Test Chat\n5. Get Balance\n> ');
  
  switch (action) {
    case '1':
      await register();
      break;
    case '2':
      await login();
      break;
    case '3':
      const apiKey1 = await ask('API Key: ');
      await getModels(apiKey1);
      break;
    case '4':
      const apiKey2 = await ask('API Key: ');
      await testChat(apiKey2);
      break;
    case '5':
      const apiKey3 = await ask('API Key: ');
      await getBalance(apiKey3);
      break;
    default:
      console.log('Invalid action');
  }
  
  rl.close();
}

main();
