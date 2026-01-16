"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import {
  Lock,
  UserPlus,
  Settings,
  MoreVertical,
  Phone,
  Video,
  Search,
  Pin,
  Bell,
  Moon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import MessageInput from "@/components/messageInput";
import Messages from "@/components/messges";
import { useTheme } from "next-themes";
import { Friends, Message } from "@/types/chats";
import SquadModal from "@/components/friendslist";

const STICKERS: Array<{ label: string; value: string }> = [
  { label: "Wave", value: "👋" },
  { label: "Smile", value: "😄" },
  { label: "Hearts", value: "🫶" },
  { label: "Fire", value: "🔥" },
  { label: "LOL", value: "😂" },
  { label: "Cool", value: "😎" },
  { label: "Star", value: "⭐" },
  { label: "Rocket", value: "🚀" },
];

function nowTime(): string {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function makeId(prefix: string): string {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

export default function DashboardPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [search, setSearch] = useState("");
  const [startChatWith, setStartChatWith] = useState("");

  const [friends, setFriends] = useState<Friends[]>(() => []);

  const [activeChatId, setActiveChatId] = useState<string>("c_1");
  const activeChat = useMemo(
    () => friends.find((c) => c.id === activeChatId) ?? friends[0],
    [activeChatId, friends]
  );

  const [draft, setDraft] = useState<string>("");
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [isSquadModalOpen, setIsSquadModalOpen] = useState(false);
  const [messages, setMessages] = useState<Record<string, Message[]>>(() => ({
    c_1: [
      {
        id: "m_1",
        from: "them",
        kind: "text",
        text: "Hey! This chat is end-to-end encrypted.",
        at: "09:14",
        senderName: "Aarav Sharma",
        senderAvatar: "AS",
      },
      {
        id: "m_2",
        from: "me",
        kind: "text",
        text: "Nice. I can also share images and stickers here.",
        at: "09:15",
        senderName: "You",
        senderAvatar: "YU",
      },
      {
        id: "m_3",
        from: "them",
        kind: "text",
        text: "That's awesome! The UI looks really clean.",
        at: "09:15",
        senderName: "Aarav Sharma",
        senderAvatar: "AS",
      },
      {
        id: "m_4",
        from: "me",
        kind: "text",
        text: "Thanks! Working on making it even better.",
        at: "09:16",
        senderName: "You",
        senderAvatar: "YU",
      },
    ],
    c_2: [
      {
        id: "m_5",
        from: "them",
        kind: "text",
        text: "Reminder: standup in 10 mins.",
        at: "08:58",
        senderName: "Dev Team",
        senderAvatar: "DT",
      },
    ],
    c_3: [
      {
        id: "m_6",
        from: "them",
        kind: "text",
        text: "How can we help you today?",
        at: "Yesterday",
        senderName: "Support",
        senderAvatar: "SU",
      },
    ],
  }));

  const activeMessages = messages[activeChatId] ?? [];

  const filteredChats = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return friends;
    return friends.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        (c.subtitle ?? "").toLowerCase().includes(q)
    );
  }, [friends, search]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChatId, activeMessages.length]);

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const onPickFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    const next: File[] = [];
    for (const file of Array.from(files)) {
      if (file.type.startsWith("image/")) next.push(file);
    }
    if (next.length === 0) return;
    setPendingFiles((prev) => [...prev, ...next]);
  }, []);

  const removePendingFile = useCallback((index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const sendSticker = useCallback(
    (sticker: string) => {
      if (!activeChatId) return;
      const msg: Message = {
        id: makeId("st"),
        from: "me",
        kind: "sticker",
        sticker,
        at: nowTime(),
        senderName: "You",
        senderAvatar: "YU",
      };
      setMessages((prev) => ({
        ...prev,
        [activeChatId]: [...(prev[activeChatId] ?? []), msg],
      }));
    },
    [activeChatId]
  );

  const send = useCallback(() => {
    if (!activeChatId) return;
    const text = draft.trim();
    const hasText = text.length > 0;
    const hasFiles = pendingFiles.length > 0;
    if (!hasText && !hasFiles) return;

    const nextMessages: Message[] = [];

    if (hasText) {
      nextMessages.push({
        id: makeId("tx"),
        from: "me",
        kind: "text",
        text,
        at: nowTime(),
        senderName: "You",
        senderAvatar: "YU",
      });
    }

    for (const file of pendingFiles) {
      const objectUrl = URL.createObjectURL(file);
      nextMessages.push({
        id: makeId("im"),
        from: "me",
        kind: "image",
        objectUrl,
        alt: file.name,
        at: nowTime(),
        senderName: "You",
        senderAvatar: "YU",
      });
    }

    setMessages((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] ?? []), ...nextMessages],
    }));
    setDraft("");
    setPendingFiles([]);
  }, [activeChatId, draft, pendingFiles]);

  // Cleanup object URLs when leaving page.
  useEffect(() => {
    return () => {
      for (const chatId of Object.keys(messages)) {
        for (const msg of messages[chatId] ?? []) {
          if (msg.kind === "image") URL.revokeObjectURL(msg.objectUrl);
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startChat = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const target = startChatWith.trim();
      if (!target) return;
      const id = makeId("c");
      const initials = target
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
      const chat: Friends = {
        id,
        title: target,
        subtitle: "New chat",
        lastActiveAt: "now",
        avatar: initials,
        isOnline: false,
      };
      setFriends((prev) => [chat, ...prev]);
      setMessages((prev) => ({ ...prev, [id]: [] }));
      setActiveChatId(id);
      setStartChatWith("");
    },
    [startChatWith]
  );

  const { setTheme } = useTheme();

  // useEffect(() => {
  //   const getFriends = async () => {
  //     const friendsList = await chatApi.getFriends();
  //     setChats(friendsList);
  //   };
  //   getFriends();
  // }, []);

  return (
    <div className="relative h-screen overflow-hidden bg-background">
      <div className="relative flex h-full w-full">
        <div className="hidden h-full w-20 border-r bg-card/50 backdrop-blur-sm lg:flex lg:flex-col lg:items-center lg:gap-4 lg:py-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg">
            W
          </div>
          <div className="flex-1" />
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl"
            onClick={() => setIsSquadModalOpen(true)}
          >
            <UserPlus className="size-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-xl">
            <Settings className="size-5" />
          </Button>
          <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold text-sm">
            YU
          </div>
        </div>

        {/* Chat List */}
        <div className="flex h-full w-full flex-col border-r bg-card/30 backdrop-blur-sm md:w-96">
          <div className="flex h-16 shrink-0 items-center justify-between border-b px-4">
            <h1 className="text-xl font-bold">WhaTube</h1>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="size-9">
                <Search className="size-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-9">
                    <MoreVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Settings className="mr-2 size-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell className="mr-2 size-4" />
                    Notifications
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <Moon className="mr-2 size-4" />
                      Theme
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => setTheme("light")}>
                        Light
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme("dark")}>
                        Dark
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme("system")}>
                        System
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="shrink-0 border-b p-3">
            <Input
              placeholder="Search chats..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9"
            />
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {filteredChats.map((c) => {
              const active = c.id === activeChatId;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveChatId(c.id)}
                  className={cn(
                    "flex w-full items-center gap-3 border-b px-4 py-3 text-left transition-colors hover:bg-accent/50",
                    active && "bg-accent"
                  )}
                >
                  <div className="relative">
                    <div
                      className={cn(
                        "flex size-12 items-center justify-center rounded-full font-semibold text-sm",
                        active
                          ? "bg-primary text-primary-foreground"
                          : "bg-gradient-to-br from-blue-500 to-purple-500 text-white"
                      )}
                    >
                      {c.avatar}
                    </div>
                    {c.isOnline && (
                      <div className="absolute bottom-0 right-0 size-3.5 rounded-full border-2 border-background bg-green-500" />
                    )}
                    {c.isPinned && (
                      <div className="absolute -right-1 -top-1">
                        <Pin className="size-3.5 fill-primary text-primary" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="truncate font-semibold text-sm">
                        {c.title}
                      </div>
                      <div className="shrink-0 text-xs text-muted-foreground">
                        {c.lastActiveAt}
                      </div>
                    </div>
                    <div className="mt-0.5 flex items-center justify-between gap-2">
                      <div className="truncate text-sm text-muted-foreground">
                        {c.lastMessage ?? c.subtitle ?? ""}
                      </div>
                      {c.unreadCount && c.unreadCount > 0 && (
                        <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                          {c.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex h-full flex-1 flex-col bg-background/50 backdrop-blur-sm">
          {/* Chat Header */}
          <div className="flex h-16 shrink-0 items-center justify-between border-b bg-card/50 px-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 font-semibold text-white text-sm">
                  {activeChat?.avatar}
                </div>
                {activeChat?.isOnline && (
                  <div className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-background bg-green-500" />
                )}
              </div>
              <div>
                <div className="font-semibold text-sm">
                  {activeChat?.title ?? "Select a chat"}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Lock className="size-3" />
                  <span>{activeChat?.subtitle ?? "Encrypted"}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="size-9">
                <Phone className="size-4" />
              </Button>
              <Button variant="ghost" size="icon" className="size-9">
                <Video className="size-4" />
              </Button>
              <Button variant="ghost" size="icon" className="size-9">
                <Search className="size-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-9">
                    <MoreVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Profile</DropdownMenuItem>
                  <DropdownMenuItem>Mute Notifications</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Clear History</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    Delete Chat
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Messages */}
          <Messages
            messagesEndRef={messagesEndRef}
            activeMessages={activeMessages}
          />

          {/* Message Input */}
          <MessageInput
            fileInputRef={fileInputRef}
            onPickFiles={onPickFiles}
            pendingFiles={pendingFiles}
            removePendingFile={removePendingFile}
            STICKERS={STICKERS}
            sendSticker={sendSticker}
            send={send}
            draft={draft}
            setDraft={setDraft}
            openFilePicker={openFilePicker}
          />
        </div>
      </div>

      <SquadModal
        isOpen={isSquadModalOpen}
        onOpenChange={setIsSquadModalOpen}
      />
    </div>
  );
}
