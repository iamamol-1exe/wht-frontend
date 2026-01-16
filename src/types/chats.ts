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
      from: "me" | "them";
      kind: "text";
      text: string;
      at: string;
      senderName?: string;
      senderAvatar?: string;
    }
  | {
      id: string;
      from: "me" | "them";
      kind: "image";
      alt: string;
      objectUrl: string;
      at: string;
      senderName?: string;
      senderAvatar?: string;
    }
  | {
      id: string;
      from: "me" | "them";
      kind: "sticker";
      sticker: string;
      at: string;
      senderName?: string;
      senderAvatar?: string;
    };
