import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getSubscribers, deleteSubscriber } from "@/lib/firebase-utils";
import type { Subscriber } from "@/lib/types";
import { Copy, Send, Users, Mail, Bell, Trash2 } from "lucide-react";
import { format } from "date-fns";

const SubscribersManager = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [notificationTitle, setNotificationTitle] = useState("KenLive TV is LIVE! 🔴");
  const [notificationMessage, setNotificationMessage] = useState("Tune in now! We're broadcasting live.");
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSubscribers();
  }, []);

  const loadSubscribers = async () => {
    try {
      const fetchedSubscribers = await getSubscribers();
      setSubscribers(fetchedSubscribers);
    } catch (error) {
      console.error("Error loading subscribers:", error);
      toast({
        title: "Error",
        description: "Failed to load subscribers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const emailSubscribers = subscribers.filter(s => s.type === 'email');
  const notificationSubscribers = subscribers.filter(s => s.type === 'notification');

  const copyAllEmails = () => {
    const emails = emailSubscribers.map(s => s.email).filter(Boolean).join(", ");
    navigator.clipboard.writeText(emails);
    toast({
      title: "Copied!",
      description: `${emailSubscribers.length} email addresses copied to clipboard`,
    });
  };

  const handleDelete = async (subscriberId: string) => {
    if (confirm("Are you sure you want to delete this subscriber?")) {
      try {
        await deleteSubscriber(subscriberId);
        setSubscribers(subscribers.filter(sub => sub.id !== subscriberId));
        toast({
          title: "Success",
          description: "Subscriber deleted successfully",
        });
      } catch (error) {
        console.error("Error deleting subscriber:", error);
        toast({
          title: "Error",
          description: "Failed to delete subscriber",
          variant: "destructive",
        });
      }
    }
  };

  const sendNotifications = async () => {
    if (!notificationTitle || !notificationMessage) {
      toast({
        title: "Error",
        description: "Please fill in both title and message",
        variant: "destructive",
      });
      return;
    }

    const fcmTokens = notificationSubscribers
      .filter(sub => sub.fcmToken)
      .map(sub => sub.fcmToken);

    if (fcmTokens.length === 0) {
      toast({
        title: "Error",
        description: "No valid FCM tokens found",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    try {
      console.log("Sending notifications to", fcmTokens.length, "devices");

      const response = await fetch('/.netlify/functions/send-push-notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tokens: fcmTokens,
          title: notificationTitle,
          message: notificationMessage,
        }),
      });

      let result;
      try {
        result = await response.json();
      } catch (jsonError) {
        console.error('Failed to parse response:', jsonError);
        throw new Error('Server returned invalid response. Check if Netlify function is running correctly.');
      }

      if (!response.ok) {
        throw new Error(result.error || result.details || 'Failed to send notifications');
      }

      toast({
        title: "Success!",
        description: `Notifications sent! Success: ${result.successCount}, Failed: ${result.failureCount}`,
      });
      
      setNotificationTitle("KenLive TV is LIVE! 🔴");
      setNotificationMessage("Tune in now! We're broadcasting live.");
    } catch (error) {
      console.error("Error sending notifications:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send notifications",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading subscribers...</p>
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
            <Users className="h-5 w-5 mr-2" />
            Subscriber Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-primary/10 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Mail className="h-5 w-5 text-primary mr-2" />
                <p className="text-sm text-muted-foreground">Email Subscribers</p>
              </div>
              <p className="text-3xl font-bold text-primary">{emailSubscribers.length}</p>
            </div>
            <div className="bg-destructive/10 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Bell className="h-5 w-5 text-destructive mr-2" />
                <p className="text-sm text-muted-foreground">Notification Subscribers</p>
              </div>
              <p className="text-3xl font-bold text-destructive">{notificationSubscribers.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Send Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Send className="h-5 w-5 mr-2" />
            Send Push Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Notification Title</label>
            <Input
              value={notificationTitle}
              onChange={(e) => setNotificationTitle(e.target.value)}
              placeholder="Enter notification title"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Notification Message</label>
            <Textarea
              value={notificationMessage}
              onChange={(e) => setNotificationMessage(e.target.value)}
              placeholder="Enter notification message"
              rows={3}
            />
          </div>
          <div className="flex gap-3">
            <Button
              onClick={sendNotifications}
              disabled={sending || notificationSubscribers.length === 0}
              className="flex-1"
            >
              <Send className="h-4 w-4 mr-2" />
              {sending ? "Sending..." : `Send to ${notificationSubscribers.length} Notification Subscribers`}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setNotificationTitle("KenLive TV is LIVE! 🔴");
                setNotificationMessage("Tune in now! We're broadcasting live.");
              }}
            >
              Quick: "I'm Live"
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Note: FCM integration requires backend setup with service account credentials.
          </p>
        </CardContent>
      </Card>

      {/* Email Subscribers List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              Email Subscribers ({emailSubscribers.length})
            </CardTitle>
            <Button onClick={copyAllEmails} variant="outline" size="sm">
              <Copy className="h-4 w-4 mr-2" />
              Copy All Emails
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {emailSubscribers.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No email subscribers yet.
            </p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {emailSubscribers.map((subscriber) => (
                <div
                  key={subscriber.id}
                  className="flex justify-between items-center p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div>
                    <p className="font-medium">{subscriber.email}</p>
                    <p className="text-xs text-muted-foreground">
                      Subscribed: {format(subscriber.subscribedAt, "MMM dd, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(subscriber.email || '');
                        toast({
                          title: "Copied!",
                          description: "Email copied to clipboard",
                        });
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(subscriber.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Subscribers List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Notification Subscribers ({notificationSubscribers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {notificationSubscribers.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No notification subscribers yet.
            </p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {notificationSubscribers.map((subscriber) => (
                <div
                  key={subscriber.id}
                  className="flex justify-between items-center p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div>
                    <p className="font-medium">Browser Notification</p>
                    <p className="text-xs text-muted-foreground">
                      Subscribed: {format(subscriber.subscribedAt, "MMM dd, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(subscriber.id)}
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

export default SubscribersManager;
