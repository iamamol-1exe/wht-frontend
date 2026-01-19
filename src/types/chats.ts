export type Friends = {
  id: string;
  title: string;
  subtitle?: string;
  lastActiveAt: string;
  avatar: string;
  isOnline: boolean;
  unreadCount?: number;
  isPinned?: boolean;
  lastMessage?: string;
};

export type Message =
  | {
      id: string;
      from: string;
      kind: "text";
      text: string;
      at: string;
      senderName?: string;
      senderAvatar?: string;
    }
  | {
      id: string;
      from: string;
      kind: "image";
      alt: string;
      objectUrl: string;
      at: string;
      senderName?: string;
      senderAvatar?: string;
    }
  | {
      id: string;
      from: string;
      kind: "sticker";
      sticker: string;
      at: string;
      senderName?: string;
      senderAvatar?: string;
    };
