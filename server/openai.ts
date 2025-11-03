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

export async function generateMemoryStory(memories: MemoryForStory[]): Promise<{ title: string; content: string }> {
  const memoriesText = memories.map((m, idx) => 
    `Memory ${idx + 1} by ${m.displayName}: "${m.note}"`
  ).join('\n\n');

  const prompt = `You are a documentary-style travel journal writer who creates realistic, authentic travel journals from shared memories. You have been given a collection of photos and notes from a shared space where people have documented their experiences.

Your task is to create a realistic, documentary-style travel journal in Markdown format. The journal should:

1. Use a calm, reflective, real-life diary tone (not poetic or fictional)
2. Organize chronologically with emoji section markers (e.g., 🏞 Start, 🌲 Path, ❄️ Snow, 🏕 Return)
3. Include short, authentic sentences (3-4 per section) that match the uploaded notes
4. Avoid exaggeration or imagination — keep it real and human
5. Use Markdown headings (# for title, ## for each section)
6. Be between 300-600 words total
7. Sound like a real person documenting their actual experiences

Here are the memories to transform into a journal:

${memoriesText}

Format your response as JSON with two fields:
- "title": A simple, realistic title (e.g., "Weekend at the Lake", "City Exploration", "Mountain Hike")
- "content": The full journal in Markdown format with ## headings for each chronological section

Example format:
## 🏞 Morning Start
We arrived early at the trailhead. The air was crisp and fresh. Everyone was excited to begin the hike.

## 🌲 Through the Forest
The path wound through tall pines. We stopped to take photos of the view. The sounds of nature were everywhere.`;

  // User requested gpt-4o-mini, so we'll use that instead of the latest model
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    max_tokens: 2000,
  });

  const result = JSON.parse(response.choices[0]?.message?.content || "{}");
  
  return {
    title: result.title || "Our Travel Journal",
    content: result.content || "A collection of moments from our journey.",
  };
}
