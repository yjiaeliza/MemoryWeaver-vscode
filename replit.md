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
4. **Masonry Gallery**: Beautiful responsive masonry grid layout for photos
5. **AI Hand Journal Generation**: Generate realistic, context-aware hand journals for all life scenarios (travel, work, study, daily life, events, relationships) in Markdown format using OpenAI (gpt-4o-mini)
6. **Dedicated Journal Page**: View generated journals on a dedicated page at /memorybook/:spaceId with vertical scrollable layout
7. **Download as Image**: Export the full journal as a single vertical image using html2canvas
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

3. **AI Enhancement**:
   - Changed from poetic stories to context-aware hand journals for all life scenarios
   - AI analyzes content to determine scenario type (travel, work, study, daily life, events, relationships)
   - Uses first-person voice ("I") with realistic, calm, reflective tone
   - Output in Markdown format with emoji section markers matching the scenario
   - Chronological organization with short, authentic sentences (3-4 per section)
   - Avoids exaggeration and invention - references only uploaded photos and notes

4. **Frontend Updates**:
   - Removed Sign In/Sign Out UI
   - Restored simple display name input (no authentication)
   - Created dedicated MemoryBook page at /memorybook/:spaceId
   - Added Download as Image functionality using html2canvas
   - Updated navigation flow to redirect to MemoryBook page after generation
   - Removed inline story display from home page

### Technical Notes
- **Database**: Uses Supabase PostgreSQL with environment variables (SUPABASE_URL, SUPABASE_ANON_KEY)
- **Storage**: Supabase Storage with public 'memories' bucket
- **AI Output**: Documentary-style travel journal in Markdown format
- **Authentication**: None - public access with display names only

## User Journey
1. User enters or creates a Space ID
2. User adds their display name
3. User uploads photos using file input
4. User adds notes to memories
5. Photos appear in memory cards
6. When ready, user clicks "Generate Our Memory Book"
7. AI analyzes context and generates appropriate hand journal for the scenario (travel, work, study, daily life, events, relationships)
8. User is redirected to /memorybook/:spaceId with the generated journal
9. User can read the journal in vertical scrollable layout
10. User can download the full journal as a single image

## AI Output Format
The AI generates context-aware hand journals with depth, realism, and emotional authenticity:

### Context Analysis & Emotional Tone
Automatically detects scenario type and adapts emotional tone accordingly:
- **Travel** → Wonder, reflection, landscape focus, sense of place
- **Work/Project** → Growth, teamwork, purpose, learning
- **Study** → Curiosity, progress, inner thoughts, breakthroughs
- **Daily Life** → Stillness, small joys, subtle changes, quiet moments
- **Events** → Excitement, connection, atmosphere, shared energy
- **Friendship/Relationships** → Warmth, intimacy, nostalgia, presence

### Writing Style
- **Voice**: First-person ("I") - writes as if the person experiencing these moments
- **Tone**: Calm, reflective, real-life diary style (not poetic or fictional)
- **Pacing**: Authentic and unhurried - small, personal reflections instead of generic summaries
- **Sensory Details**: Includes sound, light, smell, weather, time of day, and physical sensations to make moments vivid and grounded
- **Natural Transitions**: Uses phrases like "Later in the afternoon...", "By the time we got home...", "Around midday..." to connect sections organically

### Structure & Format
- **Format**: Markdown with # title and ## section headings
- **Sections**: Chronological organization with emoji markers matching the scenario (e.g., 🌄 Early Morning, 🏞 Up the Ridge, 💼 Getting Started)
- **Content**: 3-4 short, authentic sentences per section
- **Length**: 300-600 words total
- **Authenticity**: References only uploaded photos and notes - no invention or exaggeration

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
