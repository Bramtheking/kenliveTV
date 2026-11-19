import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Mail, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { requestNotificationPermission, onMessageListener } from "@/lib/fcm-utils";
import { createSubscriber } from "@/lib/firebase-utils";

const SubscribeForm = () => {
  const [email, setEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();

  // Auto-expand when hash in URL matches
  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash;
      if (hash === '#subscribe-email' || hash === '#subscribe-notifications') {
        console.log('Auto-expanding subscribe form due to hash:', hash);
        setIsExpanded(true);
      }
    };
    
    // Check immediately on mount
    checkHash();
    
    // Listen for hash changes
    const handleHashChange = () => {
      checkHash();
    };
    
    window.addEventListener('hashchange', handleHashChange);
    
    // Also listen to custom event for immediate trigger
    window.addEventListener('subscribeFormExpand', () => {
      setIsExpanded(true);
    });
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleEmailSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setEmailLoading(true);

    try {
      await createSubscriber(email, undefined, 'email');
      toast({
        title: "Success!",
        description: "You're subscribed to email updates!",
      });
      setEmail("");
    } catch (error: any) {
      console.error("Error subscribing:", error);
      toast({
        title: "Error",
        description: error.message === "Already subscribed" 
          ? "This email is already subscribed!" 
          : "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setEmailLoading(false);
    }
  };

  const handleNotificationSubscribe = async () => {
    if (!("Notification" in window)) {
      toast({
        title: "Not Supported",
        description: "Your browser doesn't support notifications",
        variant: "destructive",
      });
      return;
    }

    setNotificationLoading(true);

    try {
      const token = await requestNotificationPermission();
      
      if (token) {
        await createSubscriber(undefined, token, 'notification');
        
        toast({
          title: "Success!",
          description: "You'll receive notifications when we go live!",
        });

        // Listen for foreground messages
        onMessageListener()
          .then((payload: any) => {
            toast({
              title: payload.notification?.title || "KenLive Update",
              description: payload.notification?.body || "New content available",
            });
          })
          .catch(err => console.error('Failed to listen for messages:', err));
      } else {
        toast({
          title: "Permission Denied",
          description: "Please allow notifications to subscribe",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error subscribing to notifications:", error);
      toast({
        title: "Error",
        description: error.message === "Already subscribed" 
          ? "You're already subscribed to notifications!" 
          : "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setNotificationLoading(false);
    }
  };

  return (
    <div id="subscribe-form" className="bg-[#FF0000] dark:to-slate-900/80 border border-[#FF0000]/30 shadow-2xl backdrop-blur-xl overflow-hidden">
      {/* Compact Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#CC0000] transition-colors duration-200"
      >
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Bell className="h-6 w-6 text-white animate-pulse" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping"></div>
          </div>
          <div className="text-left">
            <h3 className="text-xl font-bold text-white">Stay Connected</h3>
            <p className="text-sm text-white/80">Get notified when KenLive TV goes live</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-white/80 hidden sm:inline">
            {isExpanded ? "Hide" : "Show"}
          </span>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-white" />
          ) : (
            <ChevronDown className="h-5 w-5 text-white" />
          )}
        </div>
      </button>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="px-6 pb-6 pt-2 border-t border-white/20 bg-white">
          <p className="text-muted-foreground text-sm mb-4">
            Subscribe to receive updates whenever KenLive TV starts broadcasting.
          </p>
          
          {/* Email Subscription */}
          <form id="subscribe-email" onSubmit={handleEmailSubscribe} className="mb-4">
            <label className="text-sm font-medium mb-2 block flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              Email Updates
            </label>
            <div className="flex gap-3">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-background/50 backdrop-blur-sm border-[#FF0000]/30 focus:border-[#FF0000]"
                disabled={emailLoading}
              />
              <Button 
                type="submit" 
                disabled={emailLoading}
                className="bg-primary hover:bg-primary/90 text-white px-6"
              >
                {emailLoading ? "..." : "Subscribe"}
              </Button>
            </div>
          </form>

          {/* Notification Subscription */}
          <div id="subscribe-notifications">
            <label className="text-sm font-medium mb-2 block flex items-center">
              <Bell className="h-4 w-4 mr-2" />
              Push Notifications
            </label>
            <Button 
              onClick={handleNotificationSubscribe}
              disabled={notificationLoading}
              className="w-full bg-[#FF0000] hover:bg-[#FF0000]/90 text-white"
            >
              <Bell className="h-4 w-4 mr-2" />
              {notificationLoading ? "Setting up..." : "Enable Push Notifications"}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-4">
            We'll only notify you about live broadcasts. No spam, ever.
          </p>
        </div>
      )}
    </div>
  );
};

export default SubscribeForm;
