import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Memory, GeneratedStory } from "@shared/schema";
import { ObjectUploader } from "@/components/ObjectUploader";
import type { UploadResult } from "@uppy/core";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Upload, Sparkles, Image as ImageIcon } from "lucide-react";

export default function Home() {
  const [spaceId, setSpaceId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [note, setNote] = useState("");
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const { toast } = useToast();

  const { data: memories = [], isLoading: memoriesLoading } = useQuery<Memory[]>({
    queryKey: ["/api/memories", spaceId],
    enabled: !!spaceId,
  });

  const { data: generatedStory, isLoading: storyLoading } = useQuery<GeneratedStory | null>({
    queryKey: ["/api/generated-story", spaceId],
    enabled: !!spaceId,
  });

  const addMemoryMutation = useMutation({
    mutationFn: async () => {
      if (uploadedPhotos.length === 0) {
        throw new Error("Please upload at least one photo");
      }
      const memoryPromises = uploadedPhotos.map(photoUrl =>
        apiRequest("POST", "/api/memories", {
          spaceId,
          displayName,
          note,
          photoUrl,
        })
      );
      return Promise.all(memoryPromises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/memories", spaceId] });
      setDisplayName("");
      setNote("");
      setUploadedPhotos([]);
      toast({
        title: "Memory added!",
        description: "Your moment has been added to the shared space.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const generateStoryMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/generate-story", { spaceId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/generated-story", spaceId] });
      toast({
        title: "Story generated!",
        description: "Your memory book is ready to read.",
      });
      setTimeout(() => {
        document.getElementById("generated-story")?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    },
    onError: (error: Error) => {
      toast({
        title: "Error generating story",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleGetUploadParameters = async () => {
    const response = await fetch("/api/objects/upload", { method: "POST" });
    const data = await response.json();
    return {
      method: "PUT" as const,
      url: data.uploadURL,
    };
  };

  const handleUploadComplete = (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    const urls = result.successful.map(file => file.uploadURL);
    setUploadedPhotos(prev => [...prev, ...urls]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-handwritten font-bold text-foreground mb-2" data-testid="text-app-title">
              YouSpace
            </h1>
            <p className="text-lg font-serif italic text-muted-foreground" data-testid="text-tagline">
              Your Shared Memory Book
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-6xl space-y-24">
        {/* Upload Section */}
        <section className="flex justify-center" id="upload-section">
          <Card className="w-full max-w-2xl shadow-lg">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-serif text-center">Add Your Memories</CardTitle>
              <CardDescription className="text-center text-base">
                Share your moments with friends and loved ones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="space-id" className="text-sm font-medium">Space ID</Label>
                <Input
                  id="space-id"
                  placeholder="Join or create a shared space (e.g., summer-vacation-2024)"
                  value={spaceId}
                  onChange={(e) => setSpaceId(e.target.value)}
                  className="text-base"
                  data-testid="input-space-id"
                />
                <p className="text-xs text-muted-foreground">
                  Share this ID with others to contribute to the same memory book
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="display-name" className="text-sm font-medium">Your Name</Label>
                <Input
                  id="display-name"
                  placeholder="How should we call you?"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="text-base"
                  data-testid="input-display-name"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Photos</Label>
                <div className="space-y-4">
                  <ObjectUploader
                    maxNumberOfFiles={10}
                    maxFileSize={10485760}
                    onGetUploadParameters={handleGetUploadParameters}
                    onComplete={handleUploadComplete}
                    buttonClassName="w-full"
                  >
                    <div className="flex items-center justify-center gap-2 py-2">
                      <Upload className="w-5 h-5" />
                      <span>Upload Photos</span>
                    </div>
                  </ObjectUploader>
                  
                  {uploadedPhotos.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                      {uploadedPhotos.map((url, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                          <img 
                            src={url} 
                            alt={`Upload ${idx + 1}`}
                            className="w-full h-full object-cover"
                            data-testid={`img-upload-preview-${idx}`}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="note" className="text-sm font-medium">What made this moment special?</Label>
                <Textarea
                  id="note"
                  placeholder="Share the story behind these photos..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={4}
                  className="resize-none text-base"
                  data-testid="input-note"
                />
              </div>

              <Button
                onClick={() => addMemoryMutation.mutate()}
                disabled={!spaceId || !displayName || !note || uploadedPhotos.length === 0 || addMemoryMutation.isPending}
                className="w-full"
                size="lg"
                data-testid="button-add-memory"
              >
                {addMemoryMutation.isPending ? "Adding..." : "Add Memory"}
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Memory Gallery */}
        {spaceId && (
          <section className="space-y-8" id="gallery-section">
            <div className="text-center space-y-2">
              <h2 className="text-3xl md:text-4xl font-serif font-semibold" data-testid="text-gallery-title">
                Shared Memories
              </h2>
              <p className="text-muted-foreground">
                Moments from everyone in <span className="font-handwritten text-lg">{spaceId}</span>
              </p>
            </div>

            {memoriesLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-xl" />
                ))}
              </div>
            ) : memories.length === 0 ? (
              <Card className="p-12">
                <div className="text-center space-y-4">
                  <ImageIcon className="w-16 h-16 mx-auto text-muted-foreground opacity-50" />
                  <div className="space-y-2">
                    <h3 className="text-xl font-serif font-medium">No memories yet</h3>
                    <p className="text-muted-foreground">
                      Be the first to add a memory to this space!
                    </p>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {memories.map((memory) => (
                  <Card key={memory.id} className="overflow-hidden hover-elevate group cursor-pointer" data-testid={`card-memory-${memory.id}`}>
                    <div className="relative aspect-square">
                      <img
                        src={memory.photoUrl}
                        alt={memory.note}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white space-y-1">
                          <p className="text-sm font-medium line-clamp-2">{memory.note}</p>
                          <p className="text-xs font-handwritten opacity-90">{memory.displayName}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Generate Story Section */}
        {spaceId && memories.length > 0 && (
          <section className="flex justify-center" id="generate-section">
            <Card className="w-full max-w-2xl text-center shadow-lg">
              <CardHeader className="space-y-2 pb-6">
                <div className="flex justify-center">
                  <div className="p-3 rounded-full bg-primary/10">
                    <BookOpen className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-serif">
                  Ready to weave your memories into a story?
                </CardTitle>
                <CardDescription className="text-base">
                  Our AI will transform your shared moments into a beautiful, cohesive narrative
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => generateStoryMutation.mutate()}
                  disabled={generateStoryMutation.isPending}
                  size="lg"
                  className="w-full md:w-auto px-8"
                  data-testid="button-generate-story"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  {generateStoryMutation.isPending ? "Crafting your story..." : "Generate Memory Book"}
                </Button>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Generated Story Display */}
        {generatedStory && (
          <section className="py-12 -mx-4 px-4 bg-muted/30" id="generated-story">
            <div className="max-w-3xl mx-auto">
              <Card className="shadow-xl overflow-hidden">
                <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-8 md:p-12 border-b">
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-3" data-testid="text-story-title">
                    {generatedStory.storyTitle}
                  </h2>
                  <p className="text-center text-muted-foreground font-handwritten text-lg">
                    {new Date(generatedStory.createdAt).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
                <CardContent className="p-8 md:p-12">
                  <div className="prose prose-lg max-w-none font-serif">
                    <div 
                      className="whitespace-pre-wrap leading-relaxed text-foreground space-y-6"
                      data-testid="text-story-content"
                    >
                      {generatedStory.storyContent.split('\n\n').map((paragraph, idx) => (
                        <p key={idx} className={idx === 0 ? "first-letter:text-5xl first-letter:font-bold first-letter:mr-1 first-letter:float-left" : ""}>
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-24 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground font-serif italic">
            Made with care for preserving your precious moments
          </p>
        </div>
      </footer>
    </div>
  );
}
