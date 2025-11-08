import { Routes, Route, Link } from "react-router-dom";
import Home from "@/pages/Home";
import Upload from "@/pages/Upload";
import Journal from "@/pages/Journal";

export default function App() {
  return (
    <div className="min-h-screen bg-[#f9f8f5] text-[#5c4a3a] font-serif">
      {/* 顶部导航栏 */}
      <header className="p-6 border-b border-[#e6dfd5] flex justify-center gap-8">
        <Link
          to="/"
          className="hover:text-[#a87450] font-medium transition-colors"
        >
          Home
        </Link>
        <Link
          to="/upload"
          className="hover:text-[#a87450] font-medium transition-colors"
        >
          Upload
        </Link>
        <Link
          to="/journal"
          className="hover:text-[#a87450] font-medium transition-colors"
        >
          Journal
        </Link>
      </header>

      {/* 主体内容区域 */}
      <main className="p-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/journal" element={<Journal />} />
          <Route
            path="*"
            element={
              <div className="text-center text-lg text-gray-500 py-20">
                <p>404 Not Found</p>
                <p className="text-sm mt-2">
                  Try checking your route or go back home.
                </p>
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
