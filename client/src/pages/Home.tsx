import { useState, useEffect } from "react";
import { BookOpen, Upload, Sparkles, Image as ImageIcon } from "lucide-react";

// ✅ 如果没有安装 shadcn/ui，可用这些基础占位组件先跑通
const Card = (props: any) => <div className="border rounded-2xl p-4 mb-6" {...props} />;
const CardHeader = (props: any) => <div className="mb-2" {...props} />;
const CardTitle = (props: any) => <h2 className="text-xl font-bold mb-1" {...props} />;
const CardDescription = (props: any) => <p className="text-gray-500 mb-2" {...props} />;
const CardContent = (props: any) => <div {...props} />;
const Input = (props: any) => <input className="border rounded p-2 w-full" {...props} />;
const Textarea = (props: any) => (
  <textarea className="border rounded p-2 w-full resize-none" {...props} />
);
const Button = (props: any) => (
  <button
    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
    {...props}
  />
);
const Label = (props: any) => <label className="block text-sm font-medium mb-1" {...props} />;
const Skeleton = (props: any) => (
  <div className="bg-gray-200 rounded animate-pulse h-64" {...props} />
);

export default function Home() {
  const [spaceId, setSpaceId] = useState("");
  const [userName, setUserName] = useState("");
  const [note, setNote] = useState("");
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [memories, setMemories] = useState<any[]>([]);
  const [memoriesLoading, setMemoriesLoading] = useState(false);

  // ✅ 模拟“上传图片”
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setTimeout(() => {
      const fakeUrl = URL.createObjectURL(file);
      setUploadedPhoto(fakeUrl);
      setIsUploading(false);
      alert("✅ 模拟上传成功！");
    }, 1000);
  };

  // ✅ 模拟“添加记忆”
  const addMemory = () => {
    if (!uploadedPhoto || !userName || !note) {
      alert("请填写完整信息！");
      return;
    }
    const newMemory = {
      id: Date.now(),
      user_name: userName,
      note,
      photo_url: uploadedPhoto,
    };
    setMemories((prev) => [...prev, newMemory]);
    setUploadedPhoto(null);
    setNote("");
    alert("🎉 记忆已添加！");
  };

  // ✅ 模拟“生成手帐”
  const generateStory = () => {
    if (memories.length === 0) {
      alert("请先添加一些记忆！");
      return;
    }
    alert("🌸 模拟生成成功：Your Memory Book is ready!");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6 max-w-6xl text-center">
          <h1 className="text-4xl font-extrabold text-blue-600 mb-2">YouSpace</h1>
          <p className="text-lg italic text-gray-500">Your Shared Memory Book</p>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-10 max-w-6xl">
        {/* Space Section */}
        <Card>
          <CardHeader>
            <CardTitle>Enter Your Space</CardTitle>
            <CardDescription>
              Enter a Space ID to join or create a shared memory book.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Enter Space ID (e.g., family-vacation-2024)"
              value={spaceId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)}

            />
          </CardContent>
        </Card>

        {spaceId && (
          <>
            {/* Add Memory Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-6 h-6" /> Add a Memory
                </CardTitle>
                <CardDescription>Upload a photo and share your moment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Your Name</Label>
                  <Input
                    placeholder="Enter your name"
                    value={userName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)}

                  />
                </div>

                <div>
                  <Label>Upload Photo</Label>
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
                      onClick={() => document.getElementById("photo")?.click()}
                      disabled={isUploading}
                    >
                      <ImageIcon className="w-4 h-4 mr-2 inline" />
                      {isUploading
                        ? "Uploading..."
                        : uploadedPhoto
                        ? "Change Photo"
                        : "Choose Photo"}
                    </Button>
                    {uploadedPhoto && (
                      <img
                        src={uploadedPhoto}
                        alt="preview"
                        className="w-20 h-20 object-cover rounded border"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <Label>Your Note</Label>
                  <Textarea
                    placeholder="Share what makes this moment special..."
                    value={note}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)}

                    rows={3}
                  />
                </div>

                <Button onClick={addMemory} disabled={!uploadedPhoto || !note || !userName}>
                  Add Memory
                </Button>
              </CardContent>
            </Card>

            {/* Memories Gallery */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-6 h-6" /> Our Memories
                </CardTitle>
                <CardDescription>
                  {memories.length} {memories.length === 1 ? "memory" : "memories"} in this space
                </CardDescription>
              </CardHeader>
              <CardContent>
                {memoriesLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} />
                    ))}
                  </div>
                ) : memories.length === 0 ? (
                  <p className="text-center text-gray-400 py-12">No memories yet. Be the first!</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {memories.map((m) => (
                      <Card key={m.id} className="overflow-hidden shadow-sm">
                        <div className="aspect-square overflow-hidden">
                          <img
                            src={m.photo_url}
                            alt={m.note}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <p className="text-sm text-gray-500 mb-1">{m.user_name}</p>
                          <p>{m.note}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
                {memories.length > 0 && (
                  <div className="text-center mt-8">
                    <Button onClick={generateStory}>
                      <Sparkles className="w-5 h-5 mr-2 inline" /> Generate Our Memory Book
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}
