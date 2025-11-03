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

  const prompt = `You are a hand journal writer who creates realistic, authentic personal journals from shared memories. You have been given a collection of photos and notes from a shared space where people have documented their life experiences.

Your task is to create a realistic, documentary-style hand journal in Markdown format. The journal should:

1. **Analyze the context** - Read the notes/memories to understand the scenario type:
   - Travel → describe journey, landscapes, discoveries
   - Work/Project → describe process, teamwork, reflections, progress
   - Study → describe learning moments, challenges, insights
   - Daily Life → describe small moments, mood, personal growth
   - Events → describe celebrations, gatherings, special occasions
   - Friendship/Relationships → describe shared memories, feelings, connections
   
2. **Use first-person voice ("I")** - Write as if you are the person experiencing these moments

3. **Match the tone to scenario**:
   - Keep it calm, reflective, and real (not poetic or fictional)
   - Avoid exaggeration or inventing events not mentioned in the notes
   - Reference the uploaded photos and notes authentically
   
4. **Structure with Markdown**:
   - Use # for the title
   - Use ## for section headings with light emoji that match the scenario (e.g., 🌿 Morning Notes, 🏙 Project Wrap-up, 💬 Reflections, 🍃 Weekend Thoughts)
   - Each section should have 3-4 short, authentic sentences
   - Organize chronologically when possible
   
5. **Length**: 300-600 words total

6. **Sound human** - Write like a real person documenting their actual experiences in their hand journal

Here are the memories to transform into a journal:

${memoriesText}

Format your response as JSON with two fields:
- "title": A simple, realistic title that matches the scenario (e.g., "Weekend Reflections", "Project Notes", "Study Session", "Coffee with Friends")
- "content": The full journal in Markdown format with ## headings for each section

Example formats for different scenarios:

TRAVEL:
## 🏞 Morning Start
I arrived early at the trailhead. The air was crisp and fresh. I was excited to begin the hike.

WORK/PROJECT:
## 💼 Getting Started
I began working on the new feature today. The team was supportive and helpful. I learned a lot about the codebase.

DAILY LIFE:
## 🌅 Morning Thoughts
I woke up feeling refreshed. The coffee tasted better than usual. I spent some time reading before starting my day.`;

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
