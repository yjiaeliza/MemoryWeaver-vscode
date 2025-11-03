# YouSpace - AI-Powered Shared Memory Book

## Overview
YouSpace is a warm, cozy web application where users can continuously upload photos and short notes into shared spaces. Multiple users can contribute to the same space using a Space ID. The AI generates cohesive storybook narratives from uploaded memories, creating beautiful memory books.

## Design Philosophy
- **Aesthetic**: Moleskine journal aesthetic - warm, minimal, cozy
- **Typography**: 
  - Crimson Text (serif) for body text and story content
  - Caveat (handwritten) for playful accents, taglines, and headings
- **Color Palette**: Warm tones with cream/sepia backgrounds, brown/tan accents
- **User Experience**: Simple, intuitive, emotionally resonant

## Key Features
1. **Shared Spaces**: Multiple users can contribute to the same space via Space ID
2. **Photo Uploads**: Upload photos using Supabase Storage
3. **Memory Notes**: Add short notes to accompany each photo
4. **Memory Cards Gallery**: Beautiful card-based layout for uploaded memories
5. **Visual Poster Generation**: AI-generated scrapbook-style memory posters with photos and short captions using OpenAI (gpt-4o-mini)
6. **Dedicated Poster Page**: View generated visual posters on a dedicated page at /memorybook/:spaceId with vertical scrollable layout
7. **Download as Image**: Export the full poster as a single vertical image (1080px width) using html2canvas
8. **No Authentication**: Public file uploading for simplicity (MVP)

## Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter
- **State Management**: TanStack Query v5
- **UI Components**: Shadcn UI + Radix UI primitives
- **Styling**: Tailwind CSS
- **File Upload**: Uppy (@uppy/core, @uppy/react, @uppy/aws-s3)
- **Fonts**: Google Fonts (Crimson Text, Caveat)

### Backend
- **Server**: Express.js
- **Database**: Supabase PostgreSQL with @supabase/supabase-js client
- **Object Storage**: Supabase Storage for photo uploads
- **AI**: Replit AI Integrations (OpenAI gpt-4o-mini)
- **Validation**: Zod with drizzle-zod

### Development
- **Build Tool**: Vite
- **Package Manager**: npm
- **Runtime**: Node.js with tsx

## Architecture

### Data Models (shared/schema.ts)
- **Memory**: id, space_id, user_name, photo_url, note, created_at
- **GeneratedStory**: id, space_id, story_text (Markdown format), created_at

### Storage Interface (server/storage.ts)
- SupabaseStorage class implementing IStorage interface
- Uses @supabase/supabase-js client for database operations
- Methods for memories and generated stories
- Type-safe operations using types from shared/schema.ts

### API Routes (server/routes.ts)
- `POST /api/objects/upload` - Get presigned URL for photo upload
- `GET /objects/:objectPath` - Serve uploaded photos with proper ACL
- `POST /api/memories` - Create new memory with photo and note
- `GET /api/memories/:spaceId` - Get all memories for a space
- `POST /api/generate-story` - Generate AI story from memories
- `GET /api/generated-story/:spaceId` - Get generated story for a space

### Services
- **Supabase Service** (server/supabase.ts): Initialize Supabase client and handle photo uploads
- **OpenAI Service** (server/openai.ts): Generate context-aware hand journals for all life scenarios using gpt-4o-mini

### Frontend Components (client/src/)
- **home.tsx**: Main page with space management, photo uploads, and memory gallery
- **memorybook.tsx**: Dedicated page for viewing generated journals with download functionality
- **App.tsx**: Application shell with routing
- **index.css**: Design tokens and custom utility classes (hover-elevate, etc.)

## Environment Variables
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous public key
- `AI_INTEGRATIONS_OPENAI_BASE_URL` - OpenAI API base URL (from Replit AI Integrations)
- `AI_INTEGRATIONS_OPENAI_API_KEY` - OpenAI API key (from Replit AI Integrations)

## Recent Changes (November 3, 2025)

### Migration to Supabase
1. **Database Migration**:
   - Migrated from Replit PostgreSQL to Supabase
   - Created SupabaseStorage class using @supabase/supabase-js client
   - Updated schema to match Supabase structure (user_name, story_text columns)
   - Removed authentication system (no more users/sessions tables)

2. **Storage Migration**:
   - Replaced Replit Object Storage with Supabase Storage
   - Updated photo upload flow to use Supabase Storage SDK
   - Configured public bucket for photo access

3. **AI Enhancement (Visual Poster Format)**:
   - Changed from long journal entries to short, poetic photo captions (max 20 words each)
   - AI generates one caption per photo with appropriate emoji
   - Captions are calm, reflective, and scenario-aware
   - Examples: "The sunlight fell perfectly on this street 🌿", "Quiet moments before everything began"
   - Output stored as JSON with title and captions array

4. **Frontend Updates (Visual Poster Design)**:
   - Removed Sign In/Sign Out UI
   - Restored simple display name input (no authentication)
   - Created visual poster layout at /memorybook/:spaceId with scrapbook aesthetic
   - Poster features:
     * 1080px width vertical scrollable design
     * Photos in rounded frames with decorative shadows
     * Washi tape decorations on photos
     * Alternating left/right photo-caption layout
     * Short captions with emoji in styled boxes
     * Beige paper texture background
     * Handwritten fonts for title, serif for captions
     * Decorative elements (dotted lines, corner accents)
   - Download as Image functionality using html2canvas
   - Updated navigation flow to redirect to MemoryBook poster page after generation

### Technical Notes
- **Database**: Uses Supabase PostgreSQL with environment variables (SUPABASE_URL, SUPABASE_ANON_KEY)
- **Storage**: Supabase Storage with public 'memories' bucket
- **AI Output**: JSON format with title and array of photo captions
- **Poster Format**: 1080px width, vertical scroll, scrapbook-style visual layout
- **Authentication**: None - public access with display names only

## User Journey
1. User enters or creates a Space ID
2. User adds their display name
3. User uploads photos using file input
4. User adds notes to memories
5. Photos appear in memory cards gallery
6. When ready, user clicks "Generate Our Memory Book"
7. AI generates short, poetic captions (max 20 words) for each photo with appropriate emoji
8. User is redirected to /memorybook/:spaceId with the visual poster
9. User sees a beautiful scrapbook-style poster with photos in frames, decorative elements, and captions
10. User can download the full poster as a single vertical image (1080px width)

## AI Output Format
The AI generates short, poetic captions for each photo in a visual poster format:

### Caption Style
- **Length**: Maximum 20 words per caption
- **Tone**: Calm, reflective, scenario-aware
- **Emoji**: One appropriate emoji per caption matching the mood
- **References**: Based on user's notes and photo context

### Context-Aware Captions by Scenario
- **Travel** → "The sunlight fell perfectly on this street 🌿", "Found this quiet path just before sunset 🌅"
- **Daily Life** → "Morning coffee by the window, nothing special, just peace ☕", "The light was soft, the world still waking up 🌤"
- **Events** → "Everyone arrived at once, laughter everywhere 🎉", "By midnight, just us and the quiet 🌙"
- **Work/Project** → "Progress felt slow, but we kept going 💼"
- **Study** → "Finally understanding after hours of trying 📚"
- **Friendship/Relationships** → "Same spot, same drinks, always feels like home ☕", "Walking back, not wanting it to end 💬"

### Poster Visual Design
- **Layout**: 1080px width, vertical scrollable poster
- **Background**: Soft beige paper texture (#f5f1e8)
- **Photos**: Displayed in rounded white frames with shadows, slight rotation effects
- **Decorations**: Washi tape accents, corner details, dotted line separators
- **Captions**: Displayed in styled boxes with border accents
- **Typography**: Handwritten font (Caveat) for title, serif font (Crimson Text) for captions
- **Arrangement**: Alternating left-right photo-caption layout
- **Colors**: Warm browns and beiges (#5c4a3a, #d4a574, #8c7a6a)

### JSON Output Structure
```json
{
  "title": "Weekend Memories",
  "captions": [
    {
      "photoUrl": "https://...",
      "caption": "Morning coffee by the window, nothing special, just peace",
      "emoji": "☕"
    }
  ]
}
```

## File Structure
```
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/          # Shadcn UI components
│   │   │   └── ObjectUploader.tsx
│   │   ├── pages/
│   │   │   ├── home.tsx     # Main page
│   │   │   └── not-found.tsx
│   │   ├── lib/
│   │   │   └── queryClient.ts
│   │   ├── App.tsx
│   │   ├── index.css        # Design tokens + custom utilities
│   │   ├── uppy-core.css
│   │   └── uppy-dashboard.css
│   └── index.html           # Google Fonts imports
├── server/
│   ├── index.ts             # Express server entry
│   ├── routes.ts            # API routes
│   ├── storage.ts           # Storage interface + MemStorage
│   ├── objectStorage.ts     # ObjectStorageService
│   ├── objectAcl.ts         # ObjectAcl for serving files
│   └── openai.ts            # OpenAI integration
├── shared/
│   └── schema.ts            # Shared types and schemas
├── design_guidelines.md     # Comprehensive design system
└── tailwind.config.ts       # Tailwind configuration
```

## Development Commands
- `npm run dev` - Start development server (Express + Vite)
- Workflow: "Start application" runs automatically on file changes

## Future Enhancements
- Add authentication for private spaces
- Persistent database storage (PostgreSQL)
- Real-time collaboration updates
- Photo editing capabilities
- Export memory books as PDF
- Share generated stories via link
- Add more AI customization options

## Design Guidelines
See `design_guidelines.md` for comprehensive design system including:
- Typography scale and usage
- Color palette and semantic tokens
- Component specifications
- Spacing system
- Interaction patterns
- Visual hierarchy principles
