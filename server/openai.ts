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

Your task is to create a realistic, documentary-style hand journal in Markdown format that feels human, grounded, and emotionally real.

## CORE PRINCIPLES:

1. **Analyze the context** - Read the notes/memories to understand the scenario type and adapt your emotional tone:
   - Travel → Wonder, reflection, landscape focus, sense of place
   - Work/Project → Growth, teamwork, purpose, learning
   - Study → Curiosity, progress, inner thoughts, breakthroughs
   - Daily Life → Stillness, small joys, subtle changes, quiet moments
   - Events → Excitement, connection, atmosphere, shared energy
   - Friendship/Relationships → Warmth, intimacy, nostalgia, presence

2. **Write in first-person voice ("I")** - Write as if you are the person experiencing these moments. Make it personal, not observational.

3. **Add sensory details** to make moments vivid and grounded:
   - Sound (birds chirping, chatter, silence, music, footsteps)
   - Light (golden hour, harsh afternoon sun, dim lights, shadows)
   - Smell (coffee, rain, fresh air, food, etc.)
   - Weather (warm breeze, cold wind, humidity, clear skies)
   - Time of day (early morning, late afternoon, dusk, midnight)
   - Physical sensations (tired legs, warm cup, cool breeze)

4. **Use natural transitions** between sections:
   - "Later in the afternoon…"
   - "By the time we got home…"
   - "Around midday…"
   - "After a while…"
   - "As evening came…"
   - "The next morning…"

5. **Authentic pacing** - Write like a real person:
   - Small, personal reflections instead of generic summaries
   - Short, natural sentences (3-4 per section)
   - Avoid over-explanation or fake enthusiasm
   - Include quiet moments and pauses
   - Reference only what's in the uploaded notes/photos - do NOT invent

6. **Structure with Markdown**:
   - Use # for the title (simple, realistic)
   - Use ## for section headings with light emoji matching the scenario
   - Organize chronologically when possible
   - 300-600 words total

## EXAMPLES BY SCENARIO:

**TRAVEL:**
## 🌄 Early Morning
The trailhead was quiet when I arrived, just after sunrise. Cold air, but the sun was already warming the rocks. I could hear a stream somewhere below. Started walking slowly, taking it all in.

## 🏞 Up the Ridge
By midday I'd climbed higher than expected. The view opened up — mountains in every direction. I sat for a while, just breathing. My legs were tired but I felt good.

**WORK/PROJECT:**
## 💼 Getting Started
Opened the project files this morning, coffee still hot. The codebase felt overwhelming at first. But after an hour or so, things started clicking. Small progress, but it mattered.

## 🤝 Team Sync
Later in the afternoon, we had a call with the team. Someone explained the architecture in a way that finally made sense. I took notes. Felt like I was actually learning something real.

**DAILY LIFE:**
## ☕ Morning Quiet
Woke up earlier than usual. The house was still. Made coffee and sat by the window. The light was soft, just starting to fill the room. I didn't check my phone right away.

## 🌅 Afternoon Lull
By midday, the day had warmed up. I went for a short walk around the block. Nothing special happened. Just needed to move. The air smelled like rain coming.

**STUDY:**
## 📚 Diving In
Started reading the new chapter around 10 AM. The library was quiet, just the sound of pages turning. It was dense — had to re-read a few paragraphs. But slowly, it started making sense.

## 💡 Breakthrough
Later in the afternoon, something finally connected. I sat back and just stared out the window for a moment. The evening light was coming in. Felt good to understand. Took a break, felt lighter.

**EVENTS:**
## 🎉 Gathering
People started arriving around 7. The room filled up fast — voices, laughter, music playing softly in the background. It was warm, a little chaotic in a good way. The smell of food filled the air. Everyone seemed happy to be there.

## 🌙 Winding Down
By the end of the night, just a few of us were left. We sat on the floor and talked quietly. The music had stopped. The energy had shifted — calmer, more intimate. I didn't want it to end.

**FRIENDSHIP/RELATIONSHIPS:**
## ☕ Coffee and Conversation
We met at the usual spot, mid-afternoon. The place was busy, people talking all around us. Ordered the same drinks we always do. We talked about everything and nothing — just catching up. The coffee was warm. It felt easy, familiar.

## 💬 Walking Home
After a while, we walked together toward the train. The sun was setting, casting long shadows on the sidewalk. We didn't rush. The air had cooled down. I realized how much I'd needed this.

---

Here are the memories to transform into a journal:

${memoriesText}

Format your response as JSON with two fields:
- "title": A simple, realistic title that matches the scenario (e.g., "Weekend in the Mountains", "Project Week", "Study Notes", "Saturday with Friends")
- "content": The full journal in Markdown format with ## headings for each section

Remember: Keep it human, grounded, and real. Add sensory details. Use natural transitions. Match the emotional tone to the scenario. Reference only what's in the notes — don't invent.`;

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
