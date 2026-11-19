import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getArticles, deleteArticle } from "@/lib/firebase-utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import type { Article } from "@/lib/types";
import { format } from "date-fns";
import { Pencil, Trash2, Plus, LogOut, Bell, MessageSquare, Calendar } from "lucide-react";
import kenLiveLogo from "@/assets/kenlive-logo.jpg";
import SubscribersManager from "@/components/SubscribersManager";
import CommentsManager from "@/components/CommentsManager";
import ScheduleManager from "@/components/ScheduleManager";

const AdminDashboard = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("articles");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is authenticated (any authenticated user can access)
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/admin");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const fetchedArticles = await getArticles(undefined, 50);
      setArticles(fetchedArticles);
    } catch (error) {
      console.error("Error loading articles:", error);
      toast({
        title: "Error",
        description: "Failed to load articles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/admin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleDelete = async (articleId: string) => {
    if (confirm("Are you sure you want to delete this article?")) {
      try {
        await deleteArticle(articleId);
        setArticles(articles.filter(article => article.id !== articleId));
        toast({
          title: "Success",
          description: "Article deleted successfully",
        });
      } catch (error) {
        console.error("Error deleting article:", error);
        toast({
          title: "Error",
          description: "Failed to delete article",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-secondary border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <img
                src={kenLiveLogo}
                alt="KenLive"
                className="h-10 w-auto object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold text-secondary-foreground">Admin Panel</h1>
                <p className="text-muted-foreground">Manage KenLive TV articles and content</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => navigate("/")} variant="outline">
                Back to Site
              </Button>
              <Button onClick={handleLogout} variant="outline">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-3xl grid-cols-4">
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="schedules">
              <Calendar className="h-4 w-4 mr-2" />
              Schedules
            </TabsTrigger>
            <TabsTrigger value="subscribers">
              <Bell className="h-4 w-4 mr-2" />
              Subscribers
            </TabsTrigger>
            <TabsTrigger value="comments">
              <MessageSquare className="h-4 w-4 mr-2" />
              Comments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="articles" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">Articles Management</h2>
              <Button onClick={() => navigate("/admin/articles/new")}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Article
              </Button>
            </div>

            <div className="grid gap-6">
              {articles.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-muted-foreground text-lg">No articles found.</p>
                    <Button
                      onClick={() => navigate("/admin/articles/new")}
                      className="mt-4"
                    >
                      Create Your First Article
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                articles.map((article) => (
                  <Card key={article.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex gap-4 flex-1">
                          {article.imageUrl && (
                            <img
                              src={article.imageUrl}
                              alt={article.title}
                              className="w-24 h-24 object-cover rounded"
                            />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-sm">
                                {article.category}
                              </span>
                              <span className="text-muted-foreground text-sm">
                                {format(article.createdAt, "MMM dd, yyyy")}
                              </span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                            <p className="text-muted-foreground mb-2 line-clamp-2">
                              {article.excerpt}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              By {article.author}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/admin/articles/edit/${article.id}`)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(article.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="schedules">
            <ScheduleManager />
          </TabsContent>

          <TabsContent value="subscribers">
            <SubscribersManager />
          </TabsContent>

          <TabsContent value="comments">
            <CommentsManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
