import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

type ImageItem = {
  id: number;
  file?: File;
  preview: string;
  caption: string;
  loading: boolean;
};

const Upload: React.FC = () => {
  const navigate = useNavigate();

  const [images, setImages] = useState<ImageItem[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // 清理临时URL，防止内存泄漏
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.file && img.preview.startsWith("blob:")) URL.revokeObjectURL(img.preview);
      });
    };
  }, [images]);

  // 文件上传
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newItems = Array.from(files).map((file, i) => ({
      id: Date.now() + i,
      file,
      preview: URL.createObjectURL(file),
      caption: "",
      loading: false,
    }));
    setImages((prev) => [...prev, ...newItems]);
  };

  // 拖拽上传
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files?.length) return;
    const newItems = Array.from(files).map((file, i) => ({
      id: Date.now() + i,
      file,
      preview: URL.createObjectURL(file),
      caption: "",
      loading: false,
    }));
    setImages((prev) => [...prev, ...newItems]);
  };
  const prevent = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // 删除图片
  const removeOne = (id: number) => {
    setImages((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target?.file && target.preview.startsWith("blob:")) {
        URL.revokeObjectURL(target.preview);
      }
      return prev.filter((p) => p.id !== id);
    });
  };

  // ✅ 修正版：自动将本地文件转为 Base64 再传给智谱
  const generateOne = async (id: number, imageUrl: string) => {
    setImages((prev) => prev.map((it) => (it.id === id ? { ...it, loading: true } : it)));

    try {
      let imageData = imageUrl;

      // 如果本地有文件对象，就转成 Base64（防止传 blob）
      const target = images.find((img) => img.id === id);
if (target && target.file) {
  const file = target.file; // ✅ 提前存下来，类型推断为 File

  imageData = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      const pureBase64 = result.split(",")[1] || "";
      resolve(pureBase64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file); // ✅ 这里 file 类型是 File，不会再报错
  });
}


      const res = await fetch("http://127.0.0.1:3001/api/caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData }), // ✅ 改为 Base64 数据
      });

      const data = await res.json();

      setImages((prev) =>
        prev.map((it) =>
          it.id === id ? { ...it, caption: data.caption ?? "", loading: false } : it
        )
      );
    } catch (err) {
      console.error("❌ 智谱生成失败:", err);
      setImages((prev) => prev.map((it) => (it.id === id ? { ...it, loading: false } : it)));
    }
  };

  // 批量生成
  const generateAll = async () => {
    for (const it of images) {
      if (!it.loading) await generateOne(it.id, it.preview);
    }
  };

  const handleCaptionChange = (id: number, value: string) => {
    setImages((prev) => prev.map((it) => (it.id === id ? { ...it, caption: value } : it)));
  };

  // ✅ 新增：跳转到“生成手帐”页面
// ✅ 正确版：使用 navigate 而不是 window.location.href
const handleGenerateJournal = async () => {
  const base64Images = await Promise.all(
    images.map(
      (img) =>
        new Promise((resolve) => {
          if (!img.file) return resolve(img);
          const reader = new FileReader();
          reader.onload = () =>
            resolve({
              ...img,
              preview: reader.result,
            });
          reader.readAsDataURL(img.file);
        })
    )
  );

  localStorage.setItem("youSpaceImages", JSON.stringify(base64Images));
  navigate("/journal"); // ✅ 用 navigate 而不是 window.location.href
};



  return (
    <div className="min-h-screen bg-[#fdfbf7]">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b bg-[#fdfbf7]/90 backdrop-blur">
        <div className="max-w-[1000px] mx-auto px-4 py-5 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-[#8b5e3c] mb-1">YouSpace</h1>
          <p className="text-sm md:text-base italic text-[#bfa085]">Your Shared Memory Book</p>
        </div>
      </header>

      <main className="py-10 px-4">
        {/* 上传区 */}
        <div className="max-w-[900px] mx-auto mb-8 flex flex-wrap gap-4 justify-center">
          <label
            onDrop={handleDrop}
            onDragOver={prevent}
            onDragEnter={prevent}
            onDragLeave={prevent}
            className="cursor-pointer bg-[#faf6f0] border-2 border-dashed border-[#d9cfc2] rounded-2xl px-10 py-6 text-[#8b5e3c] hover:bg-[#f3ede4] transition shadow-sm hover:shadow-md"
          >
            + 上传图片（可拖拽）
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="px-5 py-3 rounded-xl bg-white border border-[#eadfce] text-[#7a5839] shadow-sm hover:shadow-md"
          >
            选择文件…
          </button>

          <button
            type="button"
            onClick={generateAll}
            disabled={!images.length || images.some((it) => it.loading)}
            className="px-5 py-3 rounded-xl bg-[#f3ede4] text-[#7a5839] shadow-sm hover:bg-[#ede6db] disabled:opacity-50"
          >
            ✨ 批量生成文案
          </button>
        </div>

        {/* 提示文字 */}
        <div className="max-w-[850px] mx-auto mb-6 text-center text-xs text-[#9c8a76]">
          小提示：每张照片都可独立生成/修改文案；完成后点击下一步即可生成你的手帐。
        </div>

        {/* 图片卡片网格 */}
        <div
          className="
            max-w-[850px]
            mx-auto
            grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4
            gap-5 justify-items-center
          "
        >
          {images.map((img) => (
            <div
              key={img.id}
              className="
                bg-white/95 rounded-xl border border-[#f1e9df]
                w-[220px]
                p-3 shadow-sm hover:shadow-md transition
              "
            >
              {/* 图片 */}
              <div className="relative w-full rounded-xl overflow-hidden mb-3">
                <div className="absolute top-2 left-3 rotate-[-6deg] bg-[#f9e8d2] w-12 h-2 opacity-70 rounded-sm" />
                <div className="absolute top-2 right-3 rotate-[5deg] bg-[#e8dff5] w-10 h-2 opacity-60 rounded-sm" />
                <img
                  src={img.preview}
                  alt="preview"
                  className="
                    w-full h-auto max-h-[150px]
                    object-cover rounded-xl
                    transition-transform duration-300 hover:scale-[1.02]
                  "
                />
              </div>

              {/* 操作 */}
              <div className="flex items-center justify-between mb-3">
                <button
                  type="button"
                  disabled={img.loading}
                  onClick={() => generateOne(img.id, img.preview)}
                  className={`px-3 py-1.5 rounded-full text-sm ${
                    img.loading
                      ? "bg-[#e4ddd4] text-gray-400"
                      : "bg-[#f3ede4] text-[#7a5839] hover:bg-[#ebe4da]"
                  }`}
                >
                  {img.loading ? "生成中…" : "✨ 生成文案"}
                </button>
                <button
                  type="button"
                  onClick={() => removeOne(img.id)}
                  className="text-xs text-[#a66b6b] hover:underline"
                >
                  删除
                </button>
              </div>

              {/* 文案编辑区 */}
              <textarea
                value={img.caption}
                onChange={(e) => handleCaptionChange(img.id, e.target.value)}
                placeholder="写下地名、时间、心情… 或点击上方按钮让 AI 补全。"
                className="
                  w-full h-20
                  bg-[#fcfbf9]
                  border border-[#e7dfd3]
                  rounded-xl p-2 text-sm text-[#5a4634]
                  focus:outline-none focus:ring-1 focus:ring-[#c8b69b]
                  font-sans shadow-inner resize-none
                "
              />
            </div>
          ))}
        </div>

        {/* ✅ 新增：下一步按钮 */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={handleGenerateJournal}
            disabled={!images.length || images.some((it) => !it.caption)}
            className="px-6 py-3 rounded-xl bg-[#8b5e3c] text-white shadow-md hover:bg-[#7a5235] disabled:opacity-50"
          >
            🪶 生成我的手帐
          </button>
          <p className="mt-2 text-xs text-[#9c8a76]">
            请确保每张图片都已生成文案后再点击～
          </p>
        </div>

        <div className="h-12" />
      </main>
    </div>
  );
};

export default Upload;
