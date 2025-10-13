import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface HeaderSearchBarProps {
  placeholder?: string;
  className?: string;
}

export function HeaderSearchBar({ 
  placeholder = "Buscar acadêmicos, artigos...", 
  className = ""
}: HeaderSearchBarProps) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(query.trim())}`);
      setQuery(""); // Limpa o input após a busca
    }
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative group">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-altm-gold-600 transition-colors" />
        
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-20 py-3 w-full bg-white border-2 border-gray-200 rounded-xl shadow-sm focus:border-altm-gold-500 focus:ring-2 focus:ring-altm-gold-200 transition-all duration-200 placeholder:text-gray-400"
        />
        
        <Button
          type="submit"
          disabled={!query.trim()}
          size="sm"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-altm-gold-600 hover:bg-altm-gold-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Buscar
        </Button>
      </form>
    </div>
  );
}
