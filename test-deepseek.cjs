require('dotenv').config();

async function testDeepSeek() {
  try {
    const { OpenAI } = require('openai');
    
    const client = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: 'https://api.deepseek.com'
    });

    console.log('🧪 测试 DeepSeek API 连接...');
    
    const response = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'user',
          content: '请用一句话证明API连接成功，回复"🎉 DeepSeek连接成功！"'
        }
      ],
      max_tokens: 50
    });

    console.log('✅', response.choices[0].message.content);
    console.log('🎉 DeepSeek API 连接测试通过！');
    
  } catch (error) {
    console.error('❌ DeepSeek API 连接失败:', error.message);
    console.error('状态码:', error.status);
    console.error('错误类型:', error.type);
  }
}

testDeepSeek();
