import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { Download, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { GeneratedStory } from "@shared/schema";

interface PhotoCaption {
  photoUrl: string;
  caption: string;
  emoji: string;
}

interface StoryData {
  title: string;
  captions: PhotoCaption[];
}

// Frame class options for diverse scrapbook look
const FRAME_CLASSES = ['polaroid-frame', 'torn-edge-frame', 'scotch-tape-frame', 'regular-photo'];

// Helper to get random frame class based on index (deterministic)
const getFrameClass = (index: number): string => {
  return FRAME_CLASSES[index % FRAME_CLASSES.length];
};

// Helper to get random rotation between -3deg and +3deg (deterministic based on index)
const getRandomRotation = (index: number): number => {
  const rotations = [-3, -2.5, -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5, 3];
  return rotations[index % rotations.length];
};

// Helper to get text note style (deterministic based on index)
const getTextNoteStyle = (index: number): string => {
  const styles = ['sticky-note-yellow', 'handwritten-paper', 'default'];
  return styles[index % styles.length];
};

// Helper to get grid pattern based on spaceId (deterministic per space)
const getGridPattern = (spaceId: string): string => {
  const patterns = ['pattern-1', 'pattern-2', 'pattern-3', 'pattern-4'];
  // Simple hash function to get consistent pattern for same spaceId
  let hash = 0;
  for (let i = 0; i < spaceId.length; i++) {
    hash = ((hash << 5) - hash) + spaceId.charCodeAt(i);
    hash = hash & hash;
  }
  return patterns[Math.abs(hash) % patterns.length];
};

export default function MemoryBook() {
  const { spaceId } = useParams<{ spaceId: string }>();
  const posterRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();
  
  // Get consistent grid pattern for this space
  const gridPattern = spaceId ? getGridPattern(spaceId) : 'pattern-1';

  const { data: generatedStory, isLoading } = useQuery<GeneratedStory | null>({
    queryKey: ['/api/generated-story', spaceId],
    enabled: !!spaceId,
  });

  // Parse the JSON story data
  const storyData: StoryData | null = generatedStory
    ? (() => {
        try {
          return JSON.parse(generatedStory.story_text);
        } catch {
          return null;
        }
      })()
    : null;

  const waitForImages = async (images: HTMLImageElement[], timeoutMs: number): Promise<boolean> => {
    const imageLoadPromises = images.map((img) => {
      if (img.complete) {
        return Promise.resolve();
      }
      return new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });
    });

    let timeoutId: NodeJS.Timeout | null = null;
    const timeoutPromise = new Promise<void>((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error('Image loading timeout')), timeoutMs);
    });

    try {
      await Promise.race([
        Promise.all(imageLoadPromises),
        timeoutPromise
      ]);
      if (timeoutId) clearTimeout(timeoutId);
      return true;
    } catch {
      if (timeoutId) clearTimeout(timeoutId);
      return false;
    }
  };

  const handleDownloadImage = async () => {
    if (!posterRef.current) return;
    
    setIsDownloading(true);
    try {
      // Wait for all images to load with 5-second timeout
      const images = Array.from(posterRef.current.querySelectorAll('img')) as HTMLImageElement[];
      const imagesLoaded = await waitForImages(images, 5000);

      if (!imagesLoaded) {
        toast({
          title: "Images still loading",
          description: "Some images are still loading. Please wait a moment before exporting.",
          variant: "destructive",
        });
        setIsDownloading(false);
        return;
      }

      // Capture with html2canvas using CORS settings
      const canvas = await html2canvas(posterRef.current, {
        backgroundColor: '#f5f1e8',
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
        windowWidth: 1080,
        windowHeight: posterRef.current.scrollHeight,
      });

      const link = document.createElement('a');
      link.download = `memory-poster-${spaceId}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast({
        title: "Download complete!",
        description: "Your memory poster has been saved.",
      });
    } catch (error) {
      console.error('Error downloading image:', error);
      toast({
        title: "Download failed",
        description: "There was an error creating your poster image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your memory book...</p>
        </div>
      </div>
    );
  }

  if (!generatedStory || !storyData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="font-handwritten text-center">No Memory Book Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              This space doesn't have a generated memory book yet.
            </p>
            <Button asChild data-testid="button-back-to-space">
              <Link href={`/?spaceId=${spaceId}`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Space
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f1e8]">
      {/* Fixed Header with Actions */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="ghost"
              size="sm"
              asChild
              data-testid="button-back-to-space"
            >
              <Link href={`/?spaceId=${spaceId}`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Space
              </Link>
            </Button>
            
            <Button
              onClick={handleDownloadImage}
              disabled={isDownloading}
              size="sm"
              data-testid="button-download-image"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download as Image
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Visual Poster Layout */}
      <div className="flex justify-center py-8">
        <div
          ref={posterRef}
          className="w-[1080px] bg-[#f5f1e8] p-12 space-y-8"
          data-testid="container-memory-poster"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h100v100H0z' fill='%23f5f1e8'/%3E%3Cpath d='M0 0h100v100H0z' fill='%23000' fill-opacity='0.02'/%3E%3C/svg%3E")`,
          }}
        >
          {/* Poster Title */}
          <div className="text-center mb-12">
            <h1 className="font-handwritten text-6xl mb-4 text-[#5c4a3a]" data-testid="text-memory-book-title">
              {storyData.title}
            </h1>
            <div className="flex justify-center gap-2">
              <div className="h-1 w-32 bg-[#d4a574] rounded-full" />
              <div className="h-1 w-16 bg-[#d4a574]/60 rounded-full" />
            </div>
          </div>

          {/* Scrapbook Grid with Diverse Frames & Text Notes */}
          <div className={`scrapbook-grid ${gridPattern}`}>
            {storyData.captions.map((item, index) => {
              const frameClass = getFrameClass(index);
              const rotation = getRandomRotation(index);
              const textNoteStyle = getTextNoteStyle(index);
              
              return (
                <div
                  key={index}
                  className="scrapbook-grid-item"
                  data-testid={`photo-item-${index}`}
                  style={{ 
                    '--item-rotation': `${rotation}deg`
                  } as React.CSSProperties}
                >
                  {/* Optional decorative label with connector for first photo */}
                  {index === 0 && (
                    <div className="mb-2 flex justify-center">
                      <div className="flag-label connector-dotted">
                        First Memory
                      </div>
                    </div>
                  )}

                  {/* Photo Frame with diverse styles */}
                  <div className={frameClass}>
                    <img
                      src={item.photoUrl}
                      alt={item.caption}
                      crossOrigin="anonymous"
                      className="w-full h-64 object-cover"
                      data-testid={`photo-image-${index}`}
                    />
                  </div>

                  {/* Caption with varied text note styles */}
                  <div className="mt-4 space-y-3">
                    {textNoteStyle === 'sticky-note-yellow' ? (
                      <>
                        <div className="sticky-note-yellow">
                          <p className="text-handwritten-md" data-testid={`photo-caption-${index}`}>
                            {item.caption}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 pl-2">
                          <span className="text-2xl" data-testid={`photo-emoji-${index}`}>{item.emoji}</span>
                          <div className="flex-1 h-px bg-gradient-to-r from-[#d4a574]/40 to-transparent" />
                        </div>
                      </>
                    ) : textNoteStyle === 'handwritten-paper' ? (
                      <>
                        <div className="handwritten-paper">
                          <p className="text-handwritten-lg" data-testid={`photo-caption-${index}`}>
                            {item.caption}
                          </p>
                        </div>
                        <div className="flex items-center justify-end">
                          <span className="mood-stamp" data-testid={`photo-emoji-${index}`}>{item.emoji}</span>
                        </div>
                      </>
                    ) : (
                      <div className="relative bg-white/80 backdrop-blur-sm p-4 rounded-lg border-l-4 border-[#d4a574] shadow-sm">
                        <p className="text-serif-clean-md text-[#5c4a3a] mb-1" data-testid={`photo-caption-${index}`}>
                          {item.caption}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xl" data-testid={`photo-emoji-${index}`}>{item.emoji}</span>
                          <div className="flex-1 h-px bg-gradient-to-r from-[#d4a574]/40 to-transparent" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Decorative Divider */}
          <div className="divider-dashed" />

          {/* Footer */}
          <div className="mt-16 pt-8 border-t-2 border-dashed border-[#d4a574]/30 text-center">
            <p className="font-handwritten text-xl text-[#8c7a6a]">Created with YouSpace</p>
          </div>
        </div>
      </div>
    </div>
  );
}
