import { useEffect, useState } from "react";
import { getArticles } from "@/lib/firebase-utils";
import ArticleCard from "./ArticleCard";
import { Button } from "@/components/ui/button";
import type { Article } from "@/lib/types";

const NewsSection = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  const categories = [
    { value: undefined, label: "All News" },
    { value: "POLITICS", label: "Politics" },
    { value: "BUSINESS", label: "Business" },
    { value: "SPORTS", label: "Sports" },
    { value: "CULTURE", label: "Culture" },
    { value: "WORLD", label: "World" },
  ];

  useEffect(() => {
    loadArticles();
  }, [selectedCategory]);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const fetchedArticles = await getArticles(selectedCategory, 12);
      setArticles(fetchedArticles);
    } catch (error) {
      console.error("Error loading articles:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="news" className="py-6 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Latest News</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-lg p-6 animate-pulse">
                <div className="bg-muted h-48 rounded mb-4"></div>
                <div className="bg-muted h-4 rounded mb-2"></div>
                <div className="bg-muted h-4 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="news" className="py-6 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">Latest News</h2>
          <p className="text-muted-foreground mb-6">
            Stay updated with the latest news and developments from Kenya and around the world
          </p>
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <Button
                key={category.label}
                variant={selectedCategory === category.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
                className="transition-all duration-200"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
        
        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {selectedCategory 
                ? `No articles found in ${categories.find(c => c.value === selectedCategory)?.label} category.`
                : "No articles available at the moment."
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsSection;