import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getComments, deleteComment } from "@/lib/firebase-utils";
import type { Comment } from "@/lib/types";
import { MessageSquare, Trash2 } from "lucide-react";
import { format } from "date-fns";

const CommentsManager = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    try {
      const fetchedComments = await getComments(100);
      setComments(fetchedComments);
    } catch (error) {
      console.error("Error loading comments:", error);
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (confirm("Are you sure you want to delete this comment?")) {
      try {
        await deleteComment(commentId);
        setComments(comments.filter(comment => comment.id !== commentId));
        toast({
          title: "Success",
          description: "Comment deleted successfully",
        });
      } catch (error) {
        console.error("Error deleting comment:", error);
        toast({
          title: "Error",
          description: "Failed to delete comment",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading comments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Comments Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-primary/10 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Total Comments</p>
              <p className="text-3xl font-bold text-primary">{comments.length}</p>
            </div>
            <div className="bg-destructive/10 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Last 7 Days</p>
              <p className="text-3xl font-bold text-destructive">
                {comments.filter(c => {
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return c.createdAt > weekAgo;
                }).length}
              </p>
            </div>
            <div className="bg-secondary/10 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Today</p>
              <p className="text-3xl font-bold text-secondary-foreground">
                {comments.filter(c => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return c.createdAt > today;
                }).length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments List */}
      <Card>
        <CardHeader>
          <CardTitle>All Comments ({comments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {comments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No comments yet.
            </p>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex justify-between items-start p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold">{comment.author}</p>
                      <span className="text-xs text-muted-foreground">
                        {format(comment.createdAt, "MMM dd, yyyy 'at' h:mm a")}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{comment.text}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(comment.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CommentsManager;
