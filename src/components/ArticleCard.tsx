import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import type { Article } from "@/lib/types";

interface ArticleCardProps {
  article: Article;
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    window.scrollTo(0, 0);
    navigate(`/article/${article.id}`);
  };

  return (
    <div 
      onClick={handleNavigate}
      className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
    >
      {article.imageUrl && (
        <div className="aspect-video overflow-hidden">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-sm font-medium">
            {article.category}
          </span>
          <span className="text-muted-foreground text-sm">
            {format(article.createdAt, "MMM dd, yyyy")}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-card-foreground mb-3 line-clamp-2">
          {article.title}
        </h3>
        
        <p className="text-muted-foreground mb-4 line-clamp-3">
          {article.excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            By {article.author}
          </span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleNavigate();
            }}
            className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            Read More
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;