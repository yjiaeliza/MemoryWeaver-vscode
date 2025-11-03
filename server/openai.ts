import OpenAI from "openai";

// Using Replit's AI Integrations service (blueprint:javascript_openai_ai_integrations)
// This provides OpenAI-compatible API access without requiring your own API key
const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY
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

  // User requested gpt-4o-mini, so we'll use that instead of the latest model
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    max_tokens: 1500,
  });

  const result = JSON.parse(response.choices[0]?.message?.content || "{}");
  
  return {
    title: result.title || "Our Memory Book",
    captions: result.captions || [],
  };
}
