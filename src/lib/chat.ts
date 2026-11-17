/**
 * KenLive TV - Live Chat Service Layer
 * =====================================
 * Encapsulates Firebase Realtime Database and interactive Mock fallback.
 * Keeps latest 50 messages, slow mode (5s), pinned messages, and moderation.
 */

import { isFirebaseConfigured, getFirebaseConfig, FIREBASE_DB_PATH } from './firebase';

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
  avatarColor: string;
  badge?: 'presenter' | 'moderator' | null;
  isPinned?: boolean;
}

export const SLOW_MODE_SECONDS = 5;
export const MAX_CHAT_LENGTH = 200;
export const MAX_STORED_MESSAGES = 50;

const AVATAR_COLORS = [
  '#C30D12', '#0B5CAB', '#10B981', '#8B5CF6', 
  '#F59E0B', '#EC4899', '#06B6D4', '#6366F1'
];

export function getRandomColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

// Initial realistic broadcast chat messages from Kenyan viewers
const INITIAL_MOCK_MESSAGES: ChatMessage[] = [
  {
    id: "pin-1",
    sender: "KenLive Moderator",
    text: "Karibu KenLive TV Live! Tuma maswali yako ya studio hapa au kwa WhatsApp +254 703 103677. Fuata sheria za maoni.",
    timestamp: Date.now() - 3600000,
    avatarColor: "#C30D12",
    badge: "moderator",
    isPinned: true,
  },
  {
    id: "m-1",
    sender: "Wanjiku_NBO",
    text: "Picha iko safi sana kutoka Kasarani! Hongera Ken Wakuraya kwa uandishi bora.",
    timestamp: Date.now() - 300000,
    avatarColor: "#0B5CAB",
  },
  {
    id: "m-2",
    sender: "OtienoJuma",
    text: "Watching live from Kisumu City. Hii mjadala wa serikali za kaunti ni muhimu sana leo.",
    timestamp: Date.now() - 240000,
    avatarColor: "#10B981",
  },
  {
    id: "m-3",
    sender: "Ken Wakuraya",
    text: "Habari za mchana watazamaji! Tunapokea maoni yenu live studioni. Endelea kutazama.",
    timestamp: Date.now() - 180000,
    avatarColor: "#C30D12",
    badge: "presenter",
  },
  {
    id: "m-4",
    sender: "Kipchumba_ELD",
    text: "Eldoret tuko ndani kabisa! Sauti safi na data saver inafanya kazi vizuri kwenye simu yangu.",
    timestamp: Date.now() - 120000,
    avatarColor: "#F59E0B",
  },
  {
    id: "m-5",
    sender: "AminaMombasa",
    text: "Mombasa tunafuatilia kwa makini. Tunataka kusikia kuhusu bei ya vyakula sokoni.",
    timestamp: Date.now() - 60000,
    avatarColor: "#8B5CF6",
  },
  {
    id: "m-6",
    sender: "David_Naks",
    text: "Nakuru tuko tuned in! KenLive ni sauti ya wananchi wa kweli.",
    timestamp: Date.now() - 25000,
    avatarColor: "#EC4899",
  }
];

// Simulated incoming chatter pool for lively broadcast demo
const SIMULATED_STREAM_POOL = [
  { sender: "Brian_Thika", text: "Swali kwa meza ya uchambuzi: serikali inapanga nini kuhusu bei ya mbolea msimu huu?" },
  { sender: "MamaNjeri", text: "Asante kwa taarifa ya uhakika. KenLive haipendelei upande wowote!" },
  { sender: "Mutua_Machakos", text: "Tazama Live! Machakos tuko locked in." },
  { sender: "Sarah_Westlands", text: "Broadcast quality is top-notch. Love the clean mobile interface." },
  { sender: "Hassan_Garissa", text: "Garissa tuko hewani. Asante kwa kuangazia masuala ya kaskazini mwa Kenya." },
  { sender: "Omondi_Siaya", text: "Good coverage on devolution accountability!" },
];

class ChatService {
  private messages: ChatMessage[] = [...INITIAL_MOCK_MESSAGES];
  private listeners: ((messages: ChatMessage[]) => void)[] = [];
  private simulationInterval: any = null;
  private isPaused: boolean = false;
  private reportedMessageIds: Set<string> = new Set();

  constructor() {
    this.startMockSimulation();
  }

  public subscribe(callback: (messages: ChatMessage[]) => void): () => void {
    this.listeners.push(callback);
    callback(this.getMessages());

    // Connect to real Firebase if configured
    if (isFirebaseConfigured()) {
      this.connectFirebase(callback);
    }

    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  private notify() {
    const list = this.getMessages();
    this.listeners.forEach(cb => cb(list));
  }

  public getMessages(): ChatMessage[] {
    return this.messages.filter(m => !this.reportedMessageIds.has(m.id));
  }

  public getPinnedMessage(): ChatMessage | undefined {
    return this.messages.find(m => m.isPinned);
  }

  public async sendMessage(text: string, sender: string): Promise<boolean> {
    const trimmed = text.trim();
    if (!trimmed || trimmed.length > MAX_CHAT_LENGTH) return false;

    const newMessage: ChatMessage = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      sender: sender.trim() || 'Kenyan Viewer',
      text: trimmed,
      timestamp: Date.now(),
      avatarColor: getRandomColor(sender),
      badge: sender.toLowerCase().includes('ken wakuraya') ? 'presenter' : null,
    };

    // If Firebase is configured, push to Realtime Database
    if (isFirebaseConfigured()) {
      try {
        const { databaseURL } = getFirebaseConfig();
        await fetch(`${databaseURL}${FIREBASE_DB_PATH}.json`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newMessage)
        });
      } catch (err) {
        console.warn("Firebase sync error, saving locally:", err);
      }
    }

    this.messages.push(newMessage);
    if (this.messages.length > MAX_STORED_MESSAGES) {
      // Keep pinned message if any
      const pinned = this.messages.find(m => m.isPinned);
      this.messages = this.messages.slice(-MAX_STORED_MESSAGES);
      if (pinned && !this.messages.some(m => m.id === pinned.id)) {
        this.messages.unshift(pinned);
      }
    }

    this.notify();
    return true;
  }

  public reportMessage(messageId: string): void {
    this.reportedMessageIds.add(messageId);
    this.notify();
  }

  public togglePause(paused?: boolean): boolean {
    this.isPaused = paused !== undefined ? paused : !this.isPaused;
    return this.isPaused;
  }

  public getIsPaused(): boolean {
    return this.isPaused;
  }

  // Simulates realistic viewer comments every 18-35 seconds
  private startMockSimulation() {
    if (typeof window === 'undefined') return;

    let poolIndex = 0;
    const scheduleNext = () => {
      const delay = Math.floor(Math.random() * 15000) + 15000; // 15-30s
      this.simulationInterval = setTimeout(() => {
        if (!this.isPaused && !isFirebaseConfigured()) {
          const item = SIMULATED_STREAM_POOL[poolIndex % SIMULATED_STREAM_POOL.length];
          poolIndex++;
          this.messages.push({
            id: `sim-${Date.now()}`,
            sender: item.sender,
            text: item.text,
            timestamp: Date.now(),
            avatarColor: getRandomColor(item.sender),
          });
          if (this.messages.length > MAX_STORED_MESSAGES) {
            this.messages.splice(1, 1);
          }
          this.notify();
        }
        scheduleNext();
      }, delay);
    };

    scheduleNext();
  }

  private connectFirebase(callback: (messages: ChatMessage[]) => void) {
    const { databaseURL } = getFirebaseConfig();
    if (!databaseURL) return;

    // Fetch initial 50 messages from Firebase REST endpoint
    fetch(`${databaseURL}${FIREBASE_DB_PATH}.json?orderBy="$key"&limitToLast=50`)
      .then(res => res.json())
      .then(data => {
        if (data && typeof data === 'object') {
          const loaded: ChatMessage[] = Object.keys(data).map(key => ({
            ...data[key],
            id: key,
          }));
          if (loaded.length > 0) {
            this.messages = loaded;
            callback(this.getMessages());
          }
        }
      })
      .catch(err => {
        console.warn("Could not connect to Firebase database, using local chat store:", err);
      });
  }

  public destroy() {
    if (this.simulationInterval) {
      clearTimeout(this.simulationInterval);
    }
  }
}

export const chatService = new ChatService();

