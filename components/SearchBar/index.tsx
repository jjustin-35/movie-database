"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";

const SearchBar = ({
  query,
  placeholder,
  onSubmit,
}: {
  onSubmit: (query: string) => void;
  placeholder: string;
  query: string;
}) => {
  const [value, setValue] = useState(query);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(value);
  };

  const handleClear = () => {
    setValue("");
    if (query) onSubmit("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative mt-4">
      <div className="relative max-w-100 mx-auto">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors">
          <Search className="w-5 h-5" />
        </div>
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
