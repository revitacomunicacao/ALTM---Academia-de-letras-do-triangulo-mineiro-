import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SearchSection() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Pesquise em nosso acervo
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Encontre informações sobre acadêmicos, artigos, textos e todo o conteúdo da Academia de Letras do Triângulo Mineiro
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-7 h-7 group-focus-within:text-altm-gold-600 transition-colors" />
            
            <Input
              type="text"
              placeholder="Digite aqui o que você procura..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-16 pr-40 py-6 text-xl border-2 border-gray-200 rounded-2xl shadow-xl focus:border-altm-gold-500 focus:ring-4 focus:ring-altm-gold-200 transition-all duration-200 placeholder:text-gray-400 font-medium"
            />
            
            <Button
              type="submit"
              disabled={!query.trim()}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              Buscar
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
