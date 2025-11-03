# YouSpace - AI-Powered Shared Memory Book

## Overview
YouSpace is a warm, cozy web application where users can continuously upload photos and short notes into shared spaces. Multiple users can contribute to the same space using a Space ID. The AI generates cohesive storybook narratives from uploaded memories, creating beautiful memory books.

## Design Philosophy
- **Aesthetic**: Moleskine journal aesthetic - warm, minimal, cozy
- **Typography**: 
  - Crimson Text (serif) for body text and story content
  - Caveat (handwritten) for playful accents, taglines, and captions
  - Noto Serif (clean serif) for descriptive text and labels
- **Color Palette**: Warm tones with cream/sepia backgrounds, brown/tan accents
- **User Experience**: Simple, intuitive, emotionally resonant
- **Scrapbook Elements**: Diverse text notes, decorative stamps, visual connectors

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
- **Fonts**: Google Fonts (Crimson Text, Caveat, Noto Serif)

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
     * 4 distinct photo frame styles (polaroid, torn-edge, scotch-tape, regular-photo)
     * Asymmetric CSS Grid layout with varying column spans for non-linear arrangement
     * Random rotation (-3deg to +3deg) for authentic scrapbook aesthetic
     * Short captions with emoji displayed below photos
     * Beige paper texture background (#f5f1e8)
     * Handwritten fonts for title, serif for captions
   - Download as Image functionality using html2canvas
   - Updated navigation flow to redirect to MemoryBook poster page after generation
   - Fixed userName persistence bug: user name now persists between memory additions

5. **html2canvas Compatibility**:
   - Replaced clip-path in torn-edge frame with box-shadows and gradients
   - All CSS effects now compatible with html2canvas export
   - CORS-enabled image loading with waitForImages helper
   - Proper image preloading before poster export

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
- **Layout**: 1080px width, vertical scrollable poster with asymmetric CSS Grid
- **Background**: Soft beige paper texture (#f5f1e8)
- **Photos**: 4 distinct frame styles rotating through photos:
  * Polaroid Frame: Classic instant photo with white background and extra bottom space
  * Torn-Edge Frame: Paper torn effect with textured borders and inset shadows
  * Scotch-Tape Frame: Semi-transparent tape pieces on top corners
  * Regular Photo: Simple rounded corners with shadow
- **Rotation**: Random rotation between -3deg and +3deg for scrapbook aesthetic
- **Grid Layout**: 12-column CSS Grid with asymmetric column spans (7, 5, 6, 8, 4-column items)

### Text Note System (Part 2/3 Enhancement)
- **Three Text Note Styles** rotating through captions:
  1. **Sticky Note Yellow**: Classic sticky note with folded corner effect, handwritten font
  2. **Handwritten Paper**: Kraft paper texture with irregular edges, larger handwritten font
  3. **Default Style**: Clean white background with border accent, serif font
- **Typography Hierarchy**:
  * Handwritten: Caveat font (lg, md, sm) for captions and personal notes
  * Clean Serif: Noto Serif (lg, md, sm) for descriptive text
- **Decorative Elements**:
  * Mood Stamp: Circular border with emoji, slight rotation
  * Flag Label: Triangular-ended label for tags
  * Dividers: Hand-drawn dashed and wave patterns
- **Connector System**:
  * Arrow connectors: Solid line with arrowhead pointing down
  * Dotted connectors: Dotted line connecting elements
  * Example: "First Memory" flag label connects to first photo
- **Colors**: Warm browns and beiges (#5c4a3a, #d4a574, #8c7a6a), yellow (#fef9c3), kraft (#f5f0e8)
- **html2canvas Compatible**: All CSS effects work with image export (gradients, borders, transforms only)

### Layout Polish System (Part 3/3 Enhancement)
- **Grid Pattern Variations**: 4 distinct patterns rotating deterministically based on spaceId hash:
  1. **Balanced Flow**: 8-item cycle with even distribution, z-index 3-8
  2. **Dense & Sparse**: 6-item cycle alternating tight clusters with open space
  3. **Diagonal Flow**: 7-item cycle creating diagonal visual movement
  4. **Organic Scatter**: 9-item cycle with natural scattered appearance
- **Enhanced Depth & Layering**:
  * Multi-layer shadow system on all frames (2-4 layers per frame)
  * Strategic z-index values for intentional overlapping (base 3-8, hover 20)
  * Negative margins (-2.5rem to -1rem) create authentic overlaps
- **Spacing & Breathing Room**:
  * Increased grid gap: 3rem vertical × 2rem horizontal
  * Grid padding: 3rem vertical, 2rem horizontal
  * Item margin: 1rem vertical for additional separation
- **Hover Interactions** (html2canvas compatible):
  * CSS custom property `--item-rotation` for deterministic rotation
  * Base transform: `rotate(var(--item-rotation))`
  * Hover combines rotation + lift: `rotate(var(--item-rotation)) translateY(-4px) scale(1.02)`
  * Smooth cubic-bezier(0.4, 0, 0.2, 1) transition
  * Enhanced 3-layer shadows on hover for depth effect
- **Grid Pattern Selection**: Deterministic hash function ensures consistent layout across renders and exports
- **html2canvas Export**: All effects use supported properties (transforms, shadows, gradients, borders)

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
