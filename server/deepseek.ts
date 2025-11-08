/*
// server/deepseek.ts
import { OpenAI } from 'openai';
import { config } from 'dotenv';

config();

// 使用 DeepSeek 替换原有的 OpenAI
const deepseek = new OpenAI({
  baseURL: process.env.DEEPSEEK_API_BASE || 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY
});

export interface MemoryForStory {
  displayName: string;
  note: string;
  photoUrl: string;
}

export interface PhotoCaption {
  photoUrl: string;
  caption: string;
  emoji: string;
}

export async function generateMemoryStory(memories: MemoryForStory[]): Promise<{ title: string; captions: PhotoCaption[] }> {
  const memoriesText = memories.map((m, idx) => 
    `Photo ${idx + 1} by ${m.displayName}: "${m.note}"\nPhoto URL: ${m.photoUrl}`
  ).join('\n\n');

  const prompt = `You are creating a visual scrapbook-style memory book from uploaded photos and notes. Each photo needs a short, poetic caption that captures the moment.

Your task is to generate short captions (max 20 words each) for each photo that feel human, calm, and reflective.

## CAPTION STYLE:

1. **Short & poetic** (max 20 words)
   - Calm, reflective tone
   - Reference what's in the note
   - Add appropriate emoji at the end

2. **Emotional tone by scenario**:
   - Travel → "The sunlight fell perfectly on this street 🌿"
   - Daily Life → "Quiet moments before everything began"
   - Events → "We laughed too much to take this photo seriously 😂"
   - Work/Project → "Progress felt slow, but we kept going 💼"
   - Study → "Finally understanding after hours of trying 📚"
   - Friendship → "The best kind of afternoon ☕"

3. **Keep it natural**:
   - No over-explanation
   - Reference the user's note content
   - Match the mood of the moment

## EXAMPLES:

**Travel:**
- Caption: "The mountains looked endless from here, cold wind but warm sun 🏔"
- Caption: "Found this quiet path just before sunset 🌅"

**Daily Life:**
- Caption: "Morning coffee by the window, nothing special, just peace ☕"
- Caption: "The light was soft, the world still waking up 🌤"

**Events:**
- Caption: "Everyone arrived at once, laughter everywhere 🎉"
- Caption: "By midnight, just us and the quiet 🌙"

**Friendship:**
- Caption: "Same spot, same drinks, always feels like home ☕"
- Caption: "Walking back, not wanting it to end 💬"

---

Here are the photos and notes:

${memoriesText}

Format your response as JSON:
{
  "title": "Simple title for the memory book (e.g., 'Weekend Memories', 'Our Days Together')",
  "captions": [
    {
      "photoUrl": "exact photo URL from above",
      "caption": "short caption (max 20 words)",
      "emoji": "single emoji that fits the mood"
    }
  ]
}

Generate a caption for EACH photo. Match the emotional tone to the context. Keep captions short, natural, and grounded.`;

  try {
    console.log('🧠 使用 DeepSeek 生成记忆故事...');
    
    const response = await deepseek.chat.completions.create({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      max_tokens: 1500,
    });

    const result = JSON.parse(response.choices[0]?.message?.content || "{}");
    
    console.log('✅ DeepSeek 生成成功');
    return {
      title: result.title || "Our Memory Book",
      captions: result.captions || [],
    };
    
  } catch (error: any) {
    console.error('❌ DeepSeek 生成失败:', error.message);
    
    // 优雅降级：返回默认内容
    return getFallbackMemoryStory(memories);
  }
}

// 优雅降级方案
function getFallbackMemoryStory(memories: MemoryForStory[]): { title: string; captions: PhotoCaption[] } {
  console.log('🔄 使用降级方案生成记忆故事');
  
  const fallbackTitles = [
    "珍贵回忆",
    "美好时光", 
    "记忆碎片",
    "生活瞬间",
    "我们的故事"
  ];
  
  const fallbackCaptions = [
    { text: "阳光正好，心情很美 🌞", emoji: "🌞" },
    { text: "温暖的日常时刻 ☀️", emoji: "☀️" },
    { text: "值得珍藏的瞬间 ✨", emoji: "✨" },
    { text: "简单而美好的日子 🌈", emoji: "🌈" },
    { text: "生活中的小确幸 💫", emoji: "💫" },
    { text: "难忘的相聚时光 👫", emoji: "👫" },
    { text: "宁静的午后时光 🍃", emoji: "🍃" },
    { text: "快乐的记忆碎片 🎈", emoji: "🎈" }
  ];

  const title = fallbackTitles[Math.floor(Math.random() * fallbackTitles.length)];
  
  const captions = memories.map((memory, index) => {
    const fallback = fallbackCaptions[index % fallbackCaptions.length];
    return {
      photoUrl: memory.photoUrl,
      caption: memory.note ? `${memory.note} ${fallback.text}` : fallback.text,
      emoji: fallback.emoji
    };
  });

  return { title, captions };
}

// 导出原有接口以保持兼容性
export default {
  generateMemoryStory
};

*/
// ⚠️ 临时禁用 DeepSeek 模块，避免要求 OPENAI_API_KEY
console.warn("⚠️ DeepSeek 模块已禁用。");

export default null;
