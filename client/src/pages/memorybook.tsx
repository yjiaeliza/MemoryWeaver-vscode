import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { Download, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GeneratedStory } from "@shared/schema";

export default function MemoryBook() {
  const { spaceId } = useParams<{ spaceId: string }>();
  const journalRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const { data: generatedStory, isLoading } = useQuery<GeneratedStory | null>({
    queryKey: ['/api/story', spaceId],
    enabled: !!spaceId,
  });

  const handleDownloadImage = async () => {
    if (!journalRef.current) return;
    
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(journalRef.current, {
        backgroundColor: '#f5f1e8',
        scale: 2,
        logging: false,
        windowWidth: journalRef.current.scrollWidth,
        windowHeight: journalRef.current.scrollHeight,
      });

      const link = document.createElement('a');
      link.download = `memory-book-${spaceId}-${Date.now()}.png`;
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

  if (!generatedStory) {
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

  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    const output: string[] = [];
    let currentParagraph: string[] = [];
    
    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        output.push(`<p class="mb-4">${currentParagraph.join(' ')}</p>`);
        currentParagraph = [];
      }
    };
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      if (!trimmed) {
        flushParagraph();
        continue;
      }
      
      if (trimmed.startsWith('## ')) {
        flushParagraph();
        output.push(`<h2 class="font-handwritten text-2xl mt-6 mb-3">${trimmed.slice(3)}</h2>`);
      } else if (trimmed.startsWith('# ')) {
        flushParagraph();
        output.push(`<h1 class="font-handwritten text-3xl mb-4">${trimmed.slice(2)}</h1>`);
      } else {
        currentParagraph.push(trimmed);
      }
    }
    
    flushParagraph();
    return output.join('');
  };

  return (
    <div className="min-h-screen bg-background">
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

      {/* Journal Content */}
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div
          ref={journalRef}
          className="bg-card/50 backdrop-blur border-2 rounded-lg shadow-lg p-8 md:p-12"
          data-testid="container-memory-book"
        >
          <div className="mb-8 text-center">
            <h1 className="font-handwritten text-4xl md:text-5xl mb-2" data-testid="text-memory-book-title">
              {generatedStory.story_text.match(/^# (.+)$/m)?.[1] || "My Memory Book"}
            </h1>
            <div className="h-1 w-24 bg-primary/30 mx-auto rounded-full" />
          </div>

          <div
            className="prose prose-lg max-w-none font-serif leading-relaxed"
            data-testid="text-memory-book-content"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(generatedStory.story_text) }}
          />
          
          <div className="mt-12 pt-6 border-t text-center text-sm text-muted-foreground">
            <p>Created with YouSpace</p>
          </div>
        </div>
      </div>
    </div>
  );
}
