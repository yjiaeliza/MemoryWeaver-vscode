import { generateMemoryStory } from './server/deepseek';

async function testDeepSeekIntegration() {
  try {
    console.log('🧪 测试 DeepSeek 记忆书生成...');
    
    const testMemories = [
      {
        displayName: '测试用户',
        note: '在公园看到的美丽日落',
        photoUrl: 'https://example.com/sunset.jpg'
      },
      {
        displayName: '测试用户', 
        note: '和朋友一起喝咖啡',
        photoUrl: 'https://example.com/coffee.jpg'
      }
    ];
    
    const result = await generateMemoryStory(testMemories);
    
    console.log('✅ 生成成功！');
    console.log('标题:', result.title);
    console.log('配文:');
    result.captions.forEach((caption, index) => {
      console.log(`  ${index + 1}. ${caption.caption} ${caption.emoji}`);
    });
    
  } catch (error: any) {
    console.error('❌ 集成测试失败:', error.message);
  }
}

testDeepSeekIntegration();
