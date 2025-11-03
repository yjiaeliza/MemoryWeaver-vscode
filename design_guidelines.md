# YouSpace Design Guidelines

## Design Approach

**Selected Approach:** Reference-Based Design drawing from personal journaling and memory-sharing applications

**Primary References:**
- Moleskine notebooks (tactile warmth, handcrafted aesthetic)
- Day One journal app (intimate, personal storytelling)
- Instagram (photo-centric galleries with emotional resonance)
- Notion (clean organization with breathing room)

**Design Principles:**
1. Warmth through softness: Rounded corners, gentle shadows, organic spacing
2. Intimacy through scale: Comfortable reading widths, human-scale components
3. Nostalgia through texture: Subtle paper-like textures, handwritten-style accents
4. Clarity through hierarchy: Clear visual separation between upload, gallery, and generated content

---

## Typography System

**Font Families:**
- Primary: 'Crimson Text' or 'Literata' (serif for storybook/generated content)
- Secondary: 'Inter' or 'DM Sans' (sans-serif for UI elements, forms, labels)
- Accent: 'Caveat' or 'Kalam' (handwritten for decorative headers, special touches)

**Type Scale:**
- Hero/Page Title: 3.5rem (56px), serif, medium weight
- Section Headers: 2rem (32px), serif, medium weight
- Generated Story Text: 1.125rem (18px), serif, regular, line-height 1.8
- Body/UI Text: 1rem (16px), sans-serif, regular, line-height 1.6
- Labels/Captions: 0.875rem (14px), sans-serif, medium, letter-spacing slight
- Handwritten Accents: 1.5rem-2rem, handwritten font, irregular baseline

---

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16, 24
- Micro spacing (gaps, padding): 2, 4
- Component spacing (margins, padding): 6, 8, 12
- Section spacing (vertical rhythm): 16, 24

**Container Strategy:**
- Max width: 1200px (max-w-6xl)
- Reading width for generated content: 700px (max-w-prose)
- Form sections: 600px max-width for comfortable input
- Full-width gallery with internal max-width constraint

**Grid Systems:**
- Photo gallery: 2 columns mobile, 3 columns tablet, 4 columns desktop with masonry-style staggering
- Upload form: Single column, centered
- Generated story: Single column, centered, generous margins

---

## Component Library

### Navigation/Header
- Sticky header with app logo/name "YouSpace"
- Handwritten-style tagline: "Your Shared Memory Book"
- Subtle paper texture background
- Minimal, unobtrusive design

### Upload Section
**Layout:** Centered card (max 600px) with soft shadow and rounded corners (rounded-2xl)

**Components:**
- Space ID input field with helper text: "Join or create a shared space"
- Display name input: "Your name for this memory"
- Photo upload dropzone: Large, welcoming dashed border area with icon and "Drop photos here or click to browse" text
- Photo preview grid below dropzone showing thumbnails with remove buttons
- Note textarea: Multi-line with placeholder "Share what made this moment special..."
- Submit button: Rounded, prominent, labeled "Add Memory"

**Visual Treatment:** Soft edges, comfortable padding (p-8), gentle elevation

### Memory Gallery
**Layout:** Full-width section with internal container

**Gallery Grid:**
- Masonry-style photo grid with varying heights
- Each memory card contains:
  - Photo (full-bleed within card)
  - Overlay gradient on hover revealing note preview
  - Display name in handwritten font
  - Timestamp in small serif
- Cards have soft shadows and rounded corners (rounded-xl)
- Generous gaps between cards (gap-6)

**Empty State:** Illustrated placeholder with handwritten message "Start adding memories to your space"

### Generate Memory Book Section
**Layout:** Prominent call-to-action area positioned after gallery

**Components:**
- Centered card with inspiring message: "Ready to weave your memories into a story?"
- Generate button: Large, inviting, with subtle animation on hover
- Loading state: Animated writing/book icon with "Crafting your story..." text

### Generated Story Display
**Layout:** Full-width section with warm background treatment

**Story Container:**
- Centered, max-w-prose (700px)
- Generous vertical padding (py-24)
- Paper-like texture background
- Soft page edges effect

**Story Typography:**
- Title in large serif (2.5rem)
- Handwritten-style date or subtitle
- Generated text in readable serif (1.125rem, line-height 1.8)
- Paragraph spacing (space-y-6)
- First letter drop cap styling for opening paragraph
- Subtle margin decorations (small ornamental dividers between sections)

**Visual Elements:**
- Scattered photo thumbnails integrated into text flow
- Pull quotes in handwritten font
- Page-like shadows and subtle torn-edge effects

---

## Images

### Hero Section: No
This app doesn't use a traditional hero. Instead, it opens directly with a warm, welcoming header and immediate access to the upload section.

### Content Images:
**User-Uploaded Photos:**
- Gallery displays user photos in masonry grid
- Photos appear in generated story as inline illustrations
- Photo thumbnails in upload preview area

**Decorative Elements:**
- Subtle paper texture backgrounds (seamless, low-opacity)
- Optional: Small notebook doodle icons (corner decorations, dividers)
- Optional: Handwritten arrow or underline SVG accents

---

## Page Structure

**Single-Page Layout (Vertical Sections):**

1. **Header** (sticky, minimal height)
   - Logo/app name
   - Tagline

2. **Upload Section** (py-16)
   - Centered upload card
   - Space ID and contributor fields
   - Photo upload and preview
   - Note textarea
   - Submit button

3. **Memory Gallery** (py-24)
   - Section header: "Shared Memories" in serif
   - Masonry photo grid
   - Shows all memories in current space

4. **Generate Section** (py-16)
   - Centered CTA card
   - Generate Memory Book button
   - Status/loading indicator when active

5. **Generated Story Display** (py-24, shown after generation)
   - Full-width warm background
   - Centered story container with paper effect
   - Beautifully formatted AI-generated narrative
   - Integrated photos from gallery

6. **Footer** (py-12)
   - Simple, unobtrusive
   - Brief tagline or credit

---

## Interaction Patterns

**Photo Upload:**
- Drag-and-drop with clear visual feedback
- Click to browse alternative
- Instant thumbnail previews
- Individual remove buttons on thumbnails

**Form Inputs:**
- Soft focus states with subtle border color shift
- Helpful placeholder text
- Label positioning above inputs

**Memory Cards:**
- Hover reveals note overlay with gentle fade-in
- Slight scale-up on hover (1.02)
- Smooth transitions (200-300ms)

**Generate Button:**
- Loading state with animated icon
- Disabled state while processing
- Success scroll to generated story

**Generated Story:**
- Fade-in animation on reveal
- Smooth scroll to story section
- Read-optimized layout with no distractions

---

## Accessibility

- Maintain WCAG AA contrast ratios for all text
- Clear focus indicators on all interactive elements
- Descriptive alt text for uploaded photos
- Semantic HTML structure with proper heading hierarchy
- Keyboard navigation for all functions
- ARIA labels for upload dropzone and buttons