/**
 * KenLive TV – Live Chat Service
 * Stores messages in Firebase Realtime Database (REST).
 * Falls back to in-memory mock simulation when not configured.
 */

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
  avatarColor: string;
  badge?: "presenter" | "moderator" | null;
  isPinned?: boolean;
}

export const SLOW_MODE_SECONDS = 5;
export const MAX_CHAT_LENGTH = 200;
export const MAX_STORED_MESSAGES = 50;

const AVATAR_COLORS = [
  "#C30D12", "#0B5CAB", "#10B981", "#8B5CF6",
  "#F59E0B", "#EC4899", "#06B6D4", "#6366F1",
];

export function getRandomColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

/** Firebase Realtime Database path for chat messages */
export const FIREBASE_RTDB_PATH = "/chat/main/messages";

/** Read RTDB URL from env (optional – falls back to Firestore project default) */
function getRtdbUrl(): string | null {
  return import.meta.env.VITE_FIREBASE_DATABASE_URL || null;
}

const INITIAL_MOCK: ChatMessage[] = [
  {
    id: "pin-1",
    sender: "KenLive Moderator",
    text: "Karibu KenLive TV Live! Tuma maswali yako kwa WhatsApp +254 703 103677. Fuata sheria za maoni.",
    timestamp: Date.now() - 3600000,
    avatarColor: "#C30D12",
    badge: "moderator",
    isPinned: true,
  },
  {
    id: "m-1",
    sender: "Wanjiku_NBO",
    text: "Picha iko safi sana! Hongera Ken Wakuraya kwa uandishi bora.",
    timestamp: Date.now() - 300000,
    avatarColor: "#0B5CAB",
  },
  {
    id: "m-2",
    sender: "OtienoJuma",
    text: "Watching live from Kisumu City. Hii mjadala wa serikali ni muhimu sana.",
    timestamp: Date.now() - 240000,
    avatarColor: "#10B981",
  },
  {
    id: "m-3",
    sender: "Ken Wakuraya",
    text: "Habari za mchana watazamaji! Tunapokea maoni yenu live studioni.",
    timestamp: Date.now() - 180000,
    avatarColor: "#C30D12",
    badge: "presenter",
  },
  {
    id: "m-4",
    sender: "Kipchumba_ELD",
    text: "Eldoret tuko ndani kabisa! Sauti safi na picha nzuri.",
    timestamp: Date.now() - 120000,
    avatarColor: "#F59E0B",
  },
  {
    id: "m-5",
    sender: "AminaMombasa",
    text: "Mombasa tunafuatilia kwa makini. Hongera KenLive TV!",
    timestamp: Date.now() - 60000,
    avatarColor: "#8B5CF6",
  },
];

const SIM_POOL = [
  { sender: "Brian_Thika", text: "Swali kwa meza ya uchambuzi: serikali inapanga nini?" },
  { sender: "MamaNjeri", text: "Asante kwa taarifa ya uhakika. KenLive haipendelei upande wowote!" },
  { sender: "Mutua_Machakos", text: "Tazama Live! Machakos tuko locked in." },
  { sender: "Sarah_Westlands", text: "Broadcast quality is top-notch. Love KenLive TV!" },
  { sender: "Hassan_Garissa", text: "Garissa tuko hewani. Asante KenLive!" },
  { sender: "Omondi_Siaya", text: "Great coverage on devolution accountability!" },
];

class ChatService {
  private messages: ChatMessage[] = [...INITIAL_MOCK];
  private listeners: ((messages: ChatMessage[]) => void)[] = [];
  private simulationTimer: any = null;
  private isPaused = false;
  private reportedIds = new Set<string>();

  constructor() {
    this.startSimulation();
  }

  subscribe(callback: (messages: ChatMessage[]) => void): () => void {
    this.listeners.push(callback);
    callback(this.getMessages());
    const rtdb = getRtdbUrl();
    if (rtdb) this.connectRtdb(rtdb, callback);
    return () => { this.listeners = this.listeners.filter(cb => cb !== callback); };
  }

  private notify() {
    const list = this.getMessages();
    this.listeners.forEach(cb => cb(list));
  }

  getMessages(): ChatMessage[] {
    return this.messages.filter(m => !this.reportedIds.has(m.id));
  }

  async sendMessage(text: string, sender: string): Promise<boolean> {
    const trimmed = text.trim();
    if (!trimmed || trimmed.length > MAX_CHAT_LENGTH) return false;

    const msg: ChatMessage = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      sender: sender.trim() || "Viewer",
      text: trimmed,
      timestamp: Date.now(),
      avatarColor: getRandomColor(sender),
      badge: sender.toLowerCase().includes("ken wakuraya") ? "presenter" : null,
    };

    const rtdb = getRtdbUrl();
    if (rtdb) {
      try {
        await fetch(`${rtdb}${FIREBASE_RTDB_PATH}.json`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(msg),
        });
      } catch (err) {
        console.warn("RTDB sync failed, saving locally:", err);
      }
    }

    this.messages.push(msg);
    if (this.messages.length > MAX_STORED_MESSAGES) {
      const pinned = this.messages.find(m => m.isPinned);
      this.messages = this.messages.slice(-MAX_STORED_MESSAGES);
      if (pinned && !this.messages.some(m => m.id === pinned.id)) {
        this.messages.unshift(pinned);
      }
    }
    this.notify();
    return true;
  }

  reportMessage(id: string): void {
    this.reportedIds.add(id);
    this.notify();
  }

  togglePause(paused?: boolean): boolean {
    this.isPaused = paused !== undefined ? paused : !this.isPaused;
    return this.isPaused;
  }

  getIsPaused(): boolean { return this.isPaused; }

  private startSimulation() {
    if (typeof window === "undefined") return;
    let idx = 0;
    const next = () => {
      const delay = Math.floor(Math.random() * 15000) + 15000;
      this.simulationTimer = setTimeout(() => {
        if (!this.isPaused && !getRtdbUrl()) {
          const item = SIM_POOL[idx++ % SIM_POOL.length];
          this.messages.push({
            id: `sim-${Date.now()}`,
            sender: item.sender,
            text: item.text,
            timestamp: Date.now(),
            avatarColor: getRandomColor(item.sender),
          });
          if (this.messages.length > MAX_STORED_MESSAGES) this.messages.splice(1, 1);
          this.notify();
        }
        next();
      }, delay);
    };
    next();
  }

  private connectRtdb(databaseURL: string, callback: (msgs: ChatMessage[]) => void) {
    fetch(`${databaseURL}${FIREBASE_RTDB_PATH}.json?orderBy="$key"&limitToLast=50`)
      .then(r => r.json())
      .then(data => {
        if (data && typeof data === "object") {
          const loaded: ChatMessage[] = Object.keys(data).map(key => ({ ...data[key], id: key }));
          if (loaded.length > 0) {
            this.messages = loaded;
            callback(this.getMessages());
          }
        }
      })
      .catch(err => console.warn("RTDB load failed, using local mock:", err));
  }

  destroy() { if (this.simulationTimer) clearTimeout(this.simulationTimer); }
}

export const chatService = new ChatService();
