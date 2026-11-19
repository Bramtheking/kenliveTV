import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getArticles } from "@/lib/firebase-utils";
import type { Article } from "@/lib/types";
import { ArrowLeft } from "lucide-react";

const ArticleView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    const loadArticle = async () => {
      if (!id) {
        navigate("/");
        return;
      }

      try {
        setLoading(true);
        const articles = await getArticles(undefined, 100);
        const foundArticle = articles.find((a) => a.id === id);
        
        if (foundArticle) {
          setArticle(foundArticle);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error loading article:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="bg-muted h-96 rounded-lg mb-8"></div>
              <div className="bg-muted h-8 rounded w-3/4 mb-4"></div>
              <div className="bg-muted h-4 rounded w-1/2 mb-8"></div>
              <div className="space-y-4">
                <div className="bg-muted h-4 rounded"></div>
                <div className="bg-muted h-4 rounded"></div>
                <div className="bg-muted h-4 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{article.seoTitle || `${article.title} - KenLive TV`}</title>
        <meta name="description" content={article.seoDescription || article.excerpt || article.title} />
        <meta name="keywords" content={article.focusKeyword ? `${article.focusKeyword}, ${article.category}, Kenya news, KenLive TV` : `${article.category}, Kenya news, ${article.title}, KenLive TV`} />
        <meta name="author" content={article.author} />
        <link rel="canonical" href={`https://tv.kenlive.co.ke/article/${article.id}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={article.seoTitle || `${article.title} - KenLive TV`} />
        <meta property="og:description" content={article.seoDescription || article.excerpt || article.title} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://tv.kenlive.co.ke/article/${article.id}`} />
        {article.imageUrl && <meta property="og:image" content={article.imageUrl} />}
        <meta property="article:published_time" content={new Date(article.createdAt).toISOString()} />
        <meta property="article:author" content={article.author} />
        <meta property="article:section" content={article.category} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.seoTitle || `${article.title} - KenLive TV`} />
        <meta name="twitter:description" content={article.seoDescription || article.excerpt || article.title} />
        {article.imageUrl && <meta name="twitter:image" content={article.imageUrl} />}
        
        {/* Structured Data for Articles */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            "headline": article.title,
            "description": article.excerpt || article.title,
            "image": article.imageUrl || "https://tv.kenlive.co.ke/kenlive-logo.jpg",
            "datePublished": new Date(article.createdAt).toISOString(),
            "dateModified": article.updatedAt ? new Date(article.updatedAt).toISOString() : new Date(article.createdAt).toISOString(),
            "author": {
              "@type": "Person",
              "name": article.author
            },
            "publisher": {
              "@type": "Organization",
              "name": "KenLive TV",
              "logo": {
                "@type": "ImageObject",
                "url": "https://tv.kenlive.co.ke/kenlive-logo.jpg"
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://tv.kenlive.co.ke/article/${article.id}`
            },
            "articleSection": article.category
          })}
        </script>
      </Helmet>
      
      <Navbar />
      
      <article className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => {
              window.scrollTo(0, 0);
              navigate("/");
            }}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to News</span>
          </button>

          {/* Article Image */}
          {article.imageUrl && (
            <div className="aspect-video overflow-hidden rounded-2xl mb-8">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Meta */}
          <div className="flex items-center gap-4 mb-6">
            <span className="bg-primary text-primary-foreground px-3 py-1 rounded-lg text-sm font-semibold">
              {article.category}
            </span>
            <span className="text-muted-foreground text-sm">
              {format(article.createdAt, "MMMM dd, yyyy")}
            </span>
            <span className="text-muted-foreground text-sm">
              By {article.author}
            </span>
          </div>

          {/* Article Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {article.title}
          </h1>

          {/* Article Excerpt */}
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            {article.excerpt}
          </p>

          {/* Article Content */}
          <div 
            className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-a:text-primary prose-strong:text-foreground prose-ul:text-foreground prose-ol:text-foreground"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Share Section */}
          <div className="mt-12 pt-8 border-t border-border">
            <h3 className="text-lg font-semibold mb-4">Share this article</h3>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  const url = window.location.href;
                  const text = `Check out this article: ${article.title}`;
                  if (navigator.share) {
                    navigator.share({ title: article.title, text, url });
                  } else {
                    navigator.clipboard.writeText(url);
                    alert("Link copied to clipboard!");
                  }
                }}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Share
              </button>
            </div>
          </div>
        </div>
      </article>
      
      <Footer />
    </div>
  );
};

export default ArticleView;
