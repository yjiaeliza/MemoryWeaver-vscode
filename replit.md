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
2. **Photo Uploads**: Upload photos using Replit Object Storage with presigned URLs
3. **Memory Notes**: Add short notes to accompany each photo
4. **Masonry Gallery**: Beautiful responsive masonry grid layout for photos
5. **AI Story Generation**: Generate warm, cohesive narratives from memories using OpenAI (gpt-4o-mini)
6. **No Authentication**: Public file uploading for simplicity (MVP)

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
- **Storage**: In-memory storage (MemStorage) for MVP
- **Object Storage**: Replit Object Storage integration
- **AI**: Replit AI Integrations (OpenAI gpt-4o-mini)
- **Validation**: Zod with drizzle-zod

### Development
- **Build Tool**: Vite
- **Package Manager**: npm
- **Runtime**: Node.js with tsx

## Architecture

### Data Models (shared/schema.ts)
- **Memory**: id, spaceId, displayName, photoUrl, note, uploadedAt
- **Space**: id, name (derived from first memory)
- **GeneratedStory**: id, spaceId, storyTitle, storyContent, generatedAt

### Storage Interface (server/storage.ts)
- In-memory storage implementing IStorage interface
- Methods for memories, spaces, and generated stories
- Type-safe operations using types from shared/schema.ts

### API Routes (server/routes.ts)
- `POST /api/objects/upload` - Get presigned URL for photo upload
- `GET /objects/:objectPath` - Serve uploaded photos with proper ACL
- `POST /api/memories` - Create new memory with photo and note
- `GET /api/memories/:spaceId` - Get all memories for a space
- `POST /api/generate-story` - Generate AI story from memories
- `GET /api/story/:spaceId` - Get generated story for a space

### Services
- **ObjectStorageService** (server/objectStorage.ts): Handle photo uploads with presigned URLs
- **ObjectAcl** (server/objectAcl.ts): Serve uploaded photos with proper access control
- **OpenAI Service** (server/openai.ts): Generate memory books using gpt-4o-mini

### Frontend Components (client/src/)
- **home.tsx**: Main page with all sections
- **ObjectUploader.tsx**: Reusable file upload component using Uppy
- **App.tsx**: Application shell with routing
- **index.css**: Design tokens and custom utility classes (hover-elevate, etc.)

## Environment Variables (Automatically Set by Replit)
- `PRIVATE_OBJECT_DIR` - Private object storage directory
- `PUBLIC_OBJECT_SEARCH_PATHS` - Public object search paths
- `AI_INTEGRATIONS_OPENAI_BASE_URL` - OpenAI API base URL
- `AI_INTEGRATIONS_OPENAI_API_KEY` - OpenAI API key
- `SESSION_SECRET` - Session secret for Express

## Recent Changes (November 3, 2025)

### Completed Implementation
1. **Schema & Frontend**:
   - Defined all data models in shared/schema.ts
   - Configured design tokens in tailwind.config.ts with handwritten font family
   - Added Crimson Text and Caveat fonts from Google Fonts
   - Built all React components with warm, cozy aesthetic
   - Created beautiful masonry gallery with hover effects
   - Implemented elegant story display with paper-like texture

2. **Backend**:
   - Implemented complete storage interface with type-safe operations
   - Created all API endpoints for memories, photos, and story generation
   - Set up ObjectStorageService for presigned URL uploads
   - Integrated OpenAI gpt-4o-mini for story generation
   - Added proper error handling and validation

3. **Integration & Polish**:
   - Connected frontend to backend via TanStack Query
   - Fixed DashboardModal import (changed from `@uppy/react` to `@uppy/react/dashboard-modal`)
   - Added loading states with beautiful animations
   - Implemented error handling with elegant messages
   - Verified all environment variables are properly set

### Technical Notes
- **Uppy Import Fix**: DashboardModal must be imported from `@uppy/react/dashboard-modal` (not from main export)
- **Object Storage**: Uses Replit's built-in object storage with presigned URLs for secure uploads
- **AI Integration**: Uses Replit AI Integrations (charges to Replit credits, no separate API key needed)
- **Storage Pattern**: In-memory storage for MVP simplicity

## User Journey
1. User enters or creates a Space ID
2. User adds their display name
3. User uploads photos using beautiful Uppy modal
4. User adds notes to memories
5. Photos appear in masonry gallery
6. When ready, user clicks "Generate Our Memory Book"
7. AI generates warm, cohesive story from all memories
8. Story displays with elegant typography on paper-like background

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
