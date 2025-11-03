import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Memory, GeneratedStory } from "@shared/schema";
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
  const [userName, setUserName] = useState("");
  const [note, setNote] = useState("");
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const { data: memories = [], isLoading: memoriesLoading } = useQuery<Memory[]>({
    queryKey: ["/api/memories", spaceId],
    enabled: !!spaceId,
  });

  const { data: generatedStory, isLoading: storyLoading } = useQuery<GeneratedStory | null>({
    queryKey: ["/api/generated-story", spaceId],
    enabled: !!spaceId,
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Get upload URL from Supabase
      const uploadResponse = await apiRequest<{ uploadURL: string; publicURL: string }>("POST", "/api/storage/upload", {
        fileName: file.name,
        fileType: file.type,
      });

      // Upload file to Supabase Storage
      const uploadResult = await fetch(uploadResponse.uploadURL, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadResult.ok) {
        throw new Error("Failed to upload photo");
      }

      setUploadedPhoto(uploadResponse.publicURL);
      toast({
        title: "Photo uploaded!",
        description: "Your photo is ready to be added to the memory.",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload photo",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const addMemoryMutation = useMutation({
    mutationFn: async () => {
      if (!uploadedPhoto) {
        throw new Error("Please upload a photo");
      }
      if (!userName.trim()) {
        throw new Error("Please enter your name");
      }
      if (!note.trim()) {
        throw new Error("Please add a note");
      }
      
      return apiRequest("POST", "/api/memories", {
        space_id: spaceId,
        user_name: userName,
        note,
        photo_url: uploadedPhoto,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/memories", spaceId] });
      setUserName("");
      setNote("");
      setUploadedPhoto(null);
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Space ID Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="font-handwritten text-3xl" data-testid="text-space-section-title">
              Enter Your Space
            </CardTitle>
            <CardDescription className="font-serif">
              Enter a Space ID to join or create a shared memory book
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Enter Space ID (e.g., 'family-vacation-2024')"
                value={spaceId}
                onChange={(e) => setSpaceId(e.target.value)}
                className="font-serif"
                data-testid="input-space-id"
              />
            </div>
          </CardContent>
        </Card>

        {spaceId && (
          <>
            {/* Add Memory Section */}
            <Card className="mb-12">
              <CardHeader>
                <CardTitle className="font-handwritten text-3xl flex items-center gap-2" data-testid="text-add-memory-title">
                  <Upload className="w-6 h-6" />
                  Add a Memory
                </CardTitle>
                <CardDescription className="font-serif">
                  Upload a photo and share your moment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="userName" className="font-serif">
                    Your Name
                  </Label>
                  <Input
                    id="userName"
                    placeholder="Enter your name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="font-serif"
                    data-testid="input-user-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="photo" className="font-serif">
                    Upload Photo
                  </Label>
                  <div className="flex items-center gap-4">
                    <input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("photo")?.click()}
                      disabled={isUploading}
                      data-testid="button-upload-photo"
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      {isUploading ? "Uploading..." : uploadedPhoto ? "Change Photo" : "Choose Photo"}
                    </Button>
                    {uploadedPhoto && (
                      <img
                        src={uploadedPhoto}
                        alt="Uploaded preview"
                        className="w-20 h-20 object-cover rounded border"
                        data-testid="img-photo-preview"
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note" className="font-serif">
                    Your Note
                  </Label>
                  <Textarea
                    id="note"
                    placeholder="Share what makes this moment special..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={4}
                    className="font-serif resize-none"
                    data-testid="input-note"
                  />
                </div>

                <Button
                  onClick={() => addMemoryMutation.mutate()}
                  disabled={addMemoryMutation.isPending || !uploadedPhoto || !userName || !note}
                  className="w-full"
                  data-testid="button-add-memory"
                >
                  {addMemoryMutation.isPending ? "Adding..." : "Add Memory"}
                </Button>
              </CardContent>
            </Card>

            {/* Memories Gallery */}
            <Card className="mb-12">
              <CardHeader>
                <CardTitle className="font-handwritten text-3xl flex items-center gap-2" data-testid="text-gallery-title">
                  <BookOpen className="w-6 h-6" />
                  Our Memories
                </CardTitle>
                <CardDescription className="font-serif">
                  {memories.length} {memories.length === 1 ? "memory" : "memories"} in this space
                </CardDescription>
              </CardHeader>
              <CardContent>
                {memoriesLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-64" />
                    ))}
                  </div>
                ) : memories.length === 0 ? (
                  <p className="text-center text-muted-foreground font-serif py-12">
                    No memories yet. Be the first to add one!
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {memories.map((memory) => (
                      <Card key={memory.id} className="overflow-hidden hover-elevate" data-testid={`card-memory-${memory.id}`}>
                        <div className="aspect-square overflow-hidden">
                          <img
                            src={memory.photo_url}
                            alt={memory.note}
                            className="w-full h-full object-cover"
                            data-testid={`img-memory-photo-${memory.id}`}
                          />
                        </div>
                        <CardContent className="p-4">
                          <p className="font-serif text-sm text-muted-foreground mb-2" data-testid={`text-memory-user-${memory.id}`}>
                            {memory.user_name}
                          </p>
                          <p className="font-serif" data-testid={`text-memory-note-${memory.id}`}>
                            {memory.note}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {memories.length > 0 && (
                  <div className="mt-8 text-center">
                    <Button
                      onClick={() => generateStoryMutation.mutate()}
                      disabled={generateStoryMutation.isPending}
                      size="lg"
                      className="font-handwritten text-lg"
                      data-testid="button-generate-story"
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      {generateStoryMutation.isPending ? "Generating..." : "Generate Our Memory Book"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Generated Story Section */}
            {generatedStory && (
              <Card id="generated-story" className="scroll-mt-24 bg-card/50 backdrop-blur border-2">
                <CardHeader>
                  <CardTitle className="font-handwritten text-4xl text-center" data-testid="text-story-section-title">
                    Your Memory Book
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-lg max-w-none font-serif">
                  <div
                    className="leading-relaxed"
                    data-testid="text-generated-story"
                    dangerouslySetInnerHTML={{ 
                      __html: (() => {
                        const lines = generatedStory.story_text.split('\n');
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
                      })()
                    }}
                  />
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  );
}
