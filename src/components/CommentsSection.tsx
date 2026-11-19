import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { createComment, getComments } from "@/lib/firebase-utils";
import type { Comment } from "@/lib/types";
import { MessageSquare, Send } from "lucide-react";
import { format } from "date-fns";

const CommentsSection = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadComments();
    // Reload comments every 10 seconds to show new ones
    const interval = setInterval(loadComments, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadComments = async () => {
    try {
      const fetchedComments = await getComments();
      setComments(fetchedComments);
    } catch (error) {
      console.error("Error loading comments:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!author.trim() || !text.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your name and comment",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await createComment(text.trim(), author.trim());
      setText("");
      setAuthor("");
      await loadComments();
      toast({
        title: "Comment Posted!",
        description: "Your comment has been added successfully",
      });
    } catch (error) {
      console.error("Error posting comment:", error);
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12 bg-gradient-to-br from-background via-card to-muted">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-3">
            <MessageSquare className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">Comments</h2>
          </div>
          <p className="text-muted-foreground">Share your thoughts with the KenLive TV community</p>
        </div>

        {/* Comment Form */}
        <Card className="mb-8 border-2 border-primary/20">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Your Name</label>
                <Input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Enter your name"
                  maxLength={50}
                  disabled={loading}
                  className="bg-background"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Your Comment</label>
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Write your comment here..."
                  rows={4}
                  maxLength={500}
                  disabled={loading}
                  className="bg-background"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {text.length}/500 characters
                </p>
              </div>
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90"
              >
                <Send className="h-4 w-4 mr-2" />
                {loading ? "Posting..." : "Post Comment"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Comments List */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold mb-4">
            Recent Comments ({comments.length})
          </h3>
          {comments.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  No comments yet. Be the first to share your thoughts!
                </p>
              </CardContent>
            </Card>
          ) : (
            comments.map((comment) => (
              <Card key={comment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold text-foreground">{comment.author}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(comment.createdAt, "MMM dd, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                  <p className="text-muted-foreground">{comment.text}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default CommentsSection;
