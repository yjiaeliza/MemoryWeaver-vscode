import React, { useEffect, useState } from "react";

interface JournalEntry {
  id: string;
  preview: string;
  caption?: string;
}

export default function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("youSpaceImages");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as JournalEntry[];
        setEntries(parsed);
      } catch (error) {
        console.error("❌ Failed to parse localStorage data:", error);
      }
    }
  }, []);

  if (!entries.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#faf8f6] text-[#7a5839]">
        <h1 className="text-3xl font-serif mb-3">📖 暂无手帐内容</h1>
        <p className="text-sm text-[#a48d77] mb-6">
          请先在 <span className="font-semibold">上传页</span> 生成图片文案。
        </p>
        <button
          onClick={() => (window.location.href = "/upload")}
          className="px-4 py-2 bg-[#8b5e3c] text-white rounded-lg shadow hover:bg-[#7a5235]"
        >
          返回上传页
        </button>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pb-20"
      style={{
        backgroundImage:
          "linear-gradient(rgba(253,250,247,0.97), rgba(253,250,247,0.97)), url('https://i.ibb.co/F4mZXV8/paper-texture.jpg')",
        backgroundRepeat: "repeat",
        backgroundSize: "cover",
      }}
    >
      {/* 顶部封面 */}
      <div className="relative max-w-[1000px] mx-auto mt-10 mb-16">
        <img
          src={entries[0].preview}
          alt="cover"
          className="rounded-3xl shadow-md w-full h-[350px] object-cover"
        />
        <div className="absolute bottom-6 left-10 bg-white/80 px-4 py-2 rounded-xl shadow-sm">
          <h1 className="text-3xl font-serif text-[#7a5839]">My Memory Journal</h1>
          <p className="text-sm italic text-[#a88b6c]">
            一段段旅途的温柔痕迹
          </p>
        </div>
      </div>

      {/* 主体错落手帐布局 */}
      <main className="max-w-[900px] mx-auto px-6 space-y-24">
        {entries.map((item, index) => {
          const isLeft = index % 2 === 0;
          return (
            <div
              key={item.id}
              className={`relative flex flex-col md:flex-row items-center gap-10 ${
                isLeft ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* 胶带装饰 */}
              <div
                className={`absolute -top-3 ${
                  isLeft ? "left-12 rotate-[-6deg]" : "right-12 rotate-[6deg]"
                } bg-[#f9e8d2] w-16 h-3 opacity-60 rounded-sm`}
              />
              <div
                className={`absolute -top-3 ${
                  isLeft ? "right-10 rotate-[5deg]" : "left-10 rotate-[-5deg]"
                } bg-[#e8dff5] w-14 h-3 opacity-60 rounded-sm`}
              />

              {/* 图片 */}
              <div
                className={`relative bg-[#fffefb]/95 border border-[#efe7dc] rounded-3xl shadow-md overflow-hidden w-full md:w-[46%] transform transition hover:scale-[1.01] ${
                  isLeft ? "rotate-[-1.5deg]" : "rotate-[1.5deg]"
                }`}
              >
                <img
                  src={item.preview}
                  alt="journal-img"
                  className="w-full h-[260px] object-cover rounded-3xl"
                />
              </div>

              {/* 文案 */}
              <div
                className={`w-full md:w-[48%] text-[#5a4634] leading-relaxed ${
                  isLeft ? "text-left" : "text-right"
                }`}
              >
                <p
                  className={`text-sm md:text-base italic whitespace-pre-line ${
                    isLeft ? "ml-2" : "mr-2"
                  }`}
                >
                  {item.caption || "（此处记录你的一段记忆...）"}
                </p>
              </div>
            </div>
          );
        })}
      </main>

      {/* Footer */}
      <div className="text-center mt-20">
        <button
          onClick={() => (window.location.href = "/upload")}
          className="px-6 py-3 rounded-xl bg-[#8b5e3c] text-white shadow-md hover:bg-[#7a5235]"
        >
          ← 返回继续编辑
        </button>
      </div>
    </div>
  );
}
