import Link from "next/link";
import { Heart, Film } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-99 bg-black/20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2">
              <Film className="w-7 md:w-8 h-7 md:h-8 text-blue-400" />
              <h1 className="text-xl md:text-2xl font-bold text-white">
                電影資料庫
              </h1>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center">
            <Link
              href="/watch-list"
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors relative text-gray-300 hover:text-white hover:bg-white/10"
            >
              <Heart className="w-5 h-5" />
              <span className="hidden sm:block">待看電影</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
