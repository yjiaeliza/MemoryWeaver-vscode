import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { Download, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export default function MemoryBook() {
  const { spaceId } = useParams<{ spaceId: string }>();
  const posterRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

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

  const handleDownloadImage = async () => {
    if (!posterRef.current) return;
    
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(posterRef.current, {
        backgroundColor: '#f5f1e8',
        scale: 2,
        logging: false,
        windowWidth: 1080,
        windowHeight: posterRef.current.scrollHeight,
      });

      const link = document.createElement('a');
      link.download = `memory-poster-${spaceId}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error downloading image:', error);
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

          {/* Photo Grid with Captions */}
          <div className="space-y-12">
            {storyData.captions.map((item, index) => {
              const isEven = index % 2 === 0;
              const rotation = index % 3 === 0 ? 'rotate-[-1deg]' : index % 3 === 1 ? 'rotate-[1deg]' : 'rotate-[-0.5deg]';
              
              return (
                <div
                  key={index}
                  className={`flex gap-6 items-start ${isEven ? 'flex-row' : 'flex-row-reverse'}`}
                  data-testid={`photo-item-${index}`}
                >
                  {/* Photo Frame */}
                  <div className={`flex-1 ${rotation} transition-transform hover:rotate-0`}>
                    <div className="relative group">
                      {/* Washi Tape Decoration */}
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-8 bg-gradient-to-r from-[#d4a574]/40 to-[#c9985f]/40 backdrop-blur-sm rounded-sm transform rotate-1 z-10" />
                      
                      {/* Photo Container */}
                      <div className="bg-white p-4 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-[#e8dcc8]">
                        <img
                          src={item.photoUrl}
                          alt={item.caption}
                          className="w-full h-64 object-cover rounded"
                          data-testid={`photo-image-${index}`}
                        />
                      </div>
                      
                      {/* Decorative Corner */}
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-2 border-b-2 border-[#d4a574]/30 rounded-br-lg" />
                    </div>
                  </div>

                  {/* Caption */}
                  <div className="flex-1 flex items-center">
                    <div className="w-full">
                      <div className="relative bg-white/60 backdrop-blur-sm p-6 rounded-lg border-l-4 border-[#d4a574] shadow-sm">
                        <p className="font-serif text-lg leading-relaxed text-[#5c4a3a] mb-2" data-testid={`photo-caption-${index}`}>
                          {item.caption}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl" data-testid={`photo-emoji-${index}`}>{item.emoji}</span>
                          <div className="flex-1 h-px bg-gradient-to-r from-[#d4a574]/40 to-transparent" />
                        </div>
                      </div>
                      
                      {/* Decorative Dots */}
                      {index < storyData.captions.length - 1 && (
                        <div className="flex justify-center gap-1 mt-4">
                          <div className="w-1 h-1 rounded-full bg-[#d4a574]/40" />
                          <div className="w-1 h-1 rounded-full bg-[#d4a574]/40" />
                          <div className="w-1 h-1 rounded-full bg-[#d4a574]/40" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t-2 border-dashed border-[#d4a574]/30 text-center">
            <p className="font-handwritten text-xl text-[#8c7a6a]">Created with YouSpace</p>
          </div>
        </div>
      </div>
    </div>
  );
}
