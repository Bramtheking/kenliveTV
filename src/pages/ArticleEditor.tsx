import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { createArticle, updateArticle, getArticle } from "@/lib/firebase-utils";
import { uploadImage } from "@/lib/cloudinary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import RichTextEditor from "@/components/RichTextEditor";
import InvitusSEO from "@/components/InvitusSEO";
import type { Article } from "@/lib/types";
import { ArrowLeft, ImagePlus } from "lucide-react";
import kenLiveLogo from "@/assets/kenlive-logo.jpg";

const ArticleEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<{
    title: string;
    excerpt: string;
    category: Article["category"];
    author: string;
    content: string;
    featured: boolean;
    imageUrl: string;
    seoTitle: string;
    seoDescription: string;
    focusKeyword: string;
  }>({
    title: "",
    excerpt: "",
    category: "POLITICS",
    author: "",
    content: "",
    featured: false,
    imageUrl: "",
    seoTitle: "",
    seoDescription: "",
    focusKeyword: "",
  });
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/admin");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (isEditing && id) {
      loadArticle(id);
    }
  }, [id, isEditing]);

  const loadArticle = async (articleId: string) => {
    try {
      const article = await getArticle(articleId);
      if (article) {
        setFormData({
          title: article.title,
          excerpt: article.excerpt,
          category: article.category,
          author: article.author,
          content: article.content,
          featured: article.featured,
          imageUrl: article.imageUrl || "",
          seoTitle: article.seoTitle || "",
          seoDescription: article.seoDescription || "",
          focusKeyword: article.focusKeyword || "",
        });
      }
    } catch (error) {
      console.error("Error loading article:", error);
      toast({
        title: "Error",
        description: "Failed to load article",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      setFormData(prev => ({ ...prev, imageUrl }));
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setImageUploading(false);
    }
  };

  // Memoized handlers to prevent unnecessary re-renders
  const handleContentChange = useCallback((content: string) => {
    setFormData(prev => ({ ...prev, content }));
  }, []);

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, title: e.target.value }));
  }, []);

  const handleAuthorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, author: e.target.value }));
  }, []);

  const handleExcerptChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, excerpt: e.target.value }));
  }, []);

  const handleCategoryChange = useCallback((value: Article["category"]) => {
    setFormData(prev => ({ ...prev, category: value }));
  }, []);

  const handleFeaturedChange = useCallback((checked: boolean) => {
    setFormData(prev => ({ ...prev, featured: checked }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.author) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (isEditing && id) {
        await updateArticle(id, formData);
        toast({
          title: "Success",
          description: "Article updated successfully",
        });
      } else {
        await createArticle(formData);
        toast({
          title: "Success",
          description: "Article created successfully",
        });
      }
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Error saving article:", error);
      toast({
        title: "Error",
        description: "Failed to save article",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-secondary border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/dashboard")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <img
              src={kenLiveLogo}
              alt="KenLive"
              className="h-8 w-auto object-contain"
            />
            <h1 className="text-2xl font-bold text-secondary-foreground">
              {isEditing ? "Edit Article" : "Create New Article"}
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Editor - 2 columns */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Article Editor</CardTitle>
              </CardHeader>
              <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="Enter article title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="POLITICS">Politics</SelectItem>
                      <SelectItem value="BUSINESS">Business</SelectItem>
                      <SelectItem value="SPORTS">Sports</SelectItem>
                      <SelectItem value="CULTURE">Culture</SelectItem>
                      <SelectItem value="WORLD">World</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={handleAuthorChange}
                  placeholder="Enter author name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={handleExcerptChange}
                  placeholder="Brief summary of the article"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Featured Image</Label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={imageUploading}
                    />
                  </div>
                  {imageUploading && (
                    <div className="text-sm text-muted-foreground">Uploading...</div>
                  )}
                </div>
                {formData.imageUrl && (
                  <div className="mt-2">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-32 h-24 object-cover rounded border"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={handleFeaturedChange}
                />
                <Label htmlFor="featured">Mark as featured article</Label>
              </div>

              <div className="space-y-2">
                <Label>Content *</Label>
                <div className="min-h-[450px]">
                  <RichTextEditor
                    value={formData.content}
                    onChange={handleContentChange}
                    placeholder="Start writing your article..."
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/dashboard")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : isEditing ? "Update Article" : "Create Article"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
          </div>

          {/* SEO Analyzer Sidebar - 1 column */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <InvitusSEO
                title={formData.title}
                content={formData.content}
                excerpt={formData.excerpt}
                initialSeoTitle={formData.seoTitle}
                initialSeoDescription={formData.seoDescription}
                initialFocusKeyword={formData.focusKeyword}
                onSeoChange={(seoData) => {
                  setFormData(prev => ({
                    ...prev,
                    seoTitle: seoData.seoTitle,
                    seoDescription: seoData.seoDescription,
                    focusKeyword: seoData.focusKeyword,
                  }));
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleEditor;
