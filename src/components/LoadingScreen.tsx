import { useEffect, useState } from "react";
import kenLiveLogo from "@/assets/kenlive-logo.jpg";

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onLoadingComplete, 300);
    }, 2000);
    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.3s ease" }}
    >
      <div className="text-center">
        {/* Logo */}
        <div className="relative inline-block mb-6">
          <div className="bg-white rounded-full p-4 shadow-2xl border-4 border-primary/40">
            <img
              src={kenLiveLogo}
              alt="KenLive TV"
              className="w-24 h-24 object-contain animate-pulse"
            />
          </div>
          {/* Live dot */}
          <span className="absolute -bottom-1 -right-1 flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-5 w-5 bg-primary items-center justify-center">
              <span className="w-2 h-2 bg-white rounded-full" />
            </span>
          </span>
        </div>

        <div className="text-2xl font-extrabold italic tracking-tight text-foreground">
          KENLIVE <span className="text-primary">TV</span>
        </div>
        <div className="text-sm text-muted-foreground mt-1 tracking-widest uppercase">
          Tazama Live • Kenya
        </div>

        {/* Simple animated dots */}
        <div className="flex items-center justify-center gap-1.5 mt-6">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
