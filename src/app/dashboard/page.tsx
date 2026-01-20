"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
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
import Messages from "@/components/messages";
import { useTheme } from "next-themes";
import { Friends, Message } from "@/types/chats";
import SquadModal from "@/components/friendslist";
import { chatApi } from "@/api/chat.api";
import { UserData } from "@/types/user";
import NotificationModal from "@/components/NotificationModal";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getSocket } from "@/utils/socket";
import { Socket } from "socket.io-client";

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
  const socket: Socket | null = getSocket();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [search, setSearch] = useState("");
  // const [startChatWith, setStartChatWith] = useState("");
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [isNotification, setIsNotification] = useState<boolean>(false);

  const [friends, setFriends] = useState<Friends[]>(() => []);

  const [activeChatId, setActiveChatId] = useState<string>("");
  const activeChat = useMemo(
    () => friends.find((c) => c.id === activeChatId),
    [activeChatId, friends],
  );

  const [draft, setDraft] = useState<string>("");
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [isSquadModalOpen, setIsSquadModalOpen] = useState(false);
  const [messages, setMessages] = useState<Record<string, Message[]>>(
    () => ({}),
  );

  useEffect(() => {
    console.log(messages);
    console.log(activeChatId);
  }, [messages, activeChatId]);

  const activeMessages = messages[activeChatId] ?? [];
  useEffect(() => {}, [messages]);
  const filteredChats = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return friends;
    return friends.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        (c.subtitle ?? "").toLowerCase().includes(q),
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
    [activeChatId],
  );

  const send = useCallback(async () => {
    if (!activeChatId) return;
    const text = draft.trim();
    const hasText = text.length > 0;
    const hasFiles = pendingFiles.length > 0;
    if (!hasText && !hasFiles) return;

    const nextMessages: Message[] = [];

    const message: Message = {
      id: makeId("msg"),
      from: currentUser?._id || "me",
      kind: "text",
      text,
      at: nowTime(),
      senderName: currentUser?.username || "You",
      senderAvatar: currentUser?.name?.[0]?.toUpperCase() || "U",
    };
    if (hasText) {
      nextMessages.push(message);
    }

    // Add image messages
    for (const file of pendingFiles) {
      const objectUrl = URL.createObjectURL(file);
      nextMessages.push({
        id: makeId("im"),
        from: currentUser?._id || "me",
        kind: "image",
        objectUrl,
        alt: file.name,
        at: nowTime(),
        senderName: currentUser?.username || "You",
        senderAvatar: currentUser?.name?.[0]?.toUpperCase() || "U",
      });
    }

    // Update local state immediately for instant UI feedback
    setMessages((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] ?? []), ...nextMessages],
    }));

    // Update the friend's last message in the chat list
    setFriends((prevFriends) =>
      prevFriends.map((friend) => {
        if (friend.id === activeChatId) {
          return {
            ...friend,
            lastMessage: hasText
              ? text.length > 50
                ? text.substring(0, 50) + "..."
                : text
              : "📷 Image",
            lastActiveAt: nowTime(),
          };
        }
        return friend;
      }),
    );

    // Clear inputs immediately
    setDraft("");
    setPendingFiles([]);

    if (!socket) {
      console.error("Socket is not initialized");
      return;
    }

    socket.emit("personalMessage", {
      to: activeChatId,
      messages: hasText ? text : "",
      senderName: currentUser?.name,
      senderAvatar: currentUser?.name?.[0]?.toUpperCase() || "U",
    });
  }, [activeChatId, draft, pendingFiles, currentUser, socket]);

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

  const { setTheme } = useTheme();

  const getCurrentUser = async () => {
    try {
      const response = (await chatApi.getCurrentUser()) as { data: UserData };
      setCurrentUser(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getFriends = async () => {
    try {
      const { data } = (await chatApi.getAllFriends()) as { data: any };
      const Friend: Friends[] = data.map((friend: UserData) => {
        const initials =
          friend.name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2) || "?";
        return {
          id: friend._id,
          title: friend.name,
          subtitle: friend.username,
          avatar: initials,
          isOnline: false,
          unreadCount: 0,
        };
      });
      setFriends(Friend);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getCurrentUser();
    getFriends();
  }, []);

  //initail connect to server for socket
  useEffect(() => {
    if (!socket) return;
    if (currentUser) {
      socket.emit("join", { userId: currentUser._id });
    }

    socket.on("notification", (data) => {
      console.log("notification", data);
    });

    socket.on("receiveMessage", (data) => {
      console.log("message received", data);

      const message: Message = {
        id: makeId("msg"),
        from: data?.from || "unknown",
        kind: "text",
        text: data.messages,
        at: nowTime(),
        senderName: data.senderName || "Unknown",
        senderAvatar: data.senderAvatar || "U",
      };

      // Update messages state with the sender's ID as the key
      setMessages((prev) => ({
        ...prev,
        [data?.from]: [...(prev[data?.from] ?? []), message],
      }));

      // Update friends list to show last message and increment unread count
      // Only increment if the message is not from the currently active chat
      setFriends((prevFriends) =>
        prevFriends.map((friend) => {
          if (friend.id === data?.from) {
            return {
              ...friend,
              lastMessage:
                data.messages.length > 50
                  ? data.messages.substring(0, 50) + "..."
                  : data.messages,
              lastActiveAt: nowTime(),
              unreadCount:
                friend.id !== activeChatId
                  ? (friend.unreadCount || 0) + 1
                  : friend.unreadCount || 0,
            };
          }
          return friend;
        }),
      );
    });

    return () => {
      socket.off("notification");
      socket.off("receiveMessage");
    };
  }, [currentUser, socket, activeChatId]);

  useEffect(() => {
    if (activeChatId) {
      setFriends((prevFriends) =>
        prevFriends.map((friend) => {
          if (friend.id === activeChatId) {
            return {
              ...friend,
              unreadCount: 0,
            };
          }
          return friend;
        }),
      );
    }
  }, [activeChatId]);

  return (
    <ProtectedRoute>
      {" "}
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
            <Link href="/profile">
              <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold text-sm cursor-pointer hover:scale-110 transition-transform">
                {currentUser?.name?.[0]?.toUpperCase() || "U"}
              </div>
            </Link>
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
                    <DropdownMenuItem
                      onClick={(e: React.FormEvent) => {
                        e.stopPropagation();
                        setIsNotification(true);
                      }}
                    >
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
                      active && "bg-accent",
                    )}
                  >
                    <div className="relative">
                      <div
                        className={cn(
                          "flex size-12 items-center justify-center rounded-full font-semibold text-sm",
                          active
                            ? "bg-primary text-primary-foreground"
                            : "bg-gradient-to-br from-blue-500 to-purple-500 text-white",
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
          {activeChat ? (
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
                currentUser={currentUser}
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
          ) : (
            <div className="flex h-full flex-1 flex-col bg-background/50 backdrop-blur-sm">
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <div className="mb-3 flex size-16 items-center justify-center rounded-full bg-primary/10 mx-auto">
                    <Lock className="size-8 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold text-lg">
                    End-to-End Encrypted
                  </h3>
                  <p className="max-w-md text-muted-foreground text-sm">
                    Messages are secured with end-to-end encryption. Start the
                    conversation now.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <SquadModal
          isOpen={isSquadModalOpen}
          onOpenChange={setIsSquadModalOpen}
        />
        <NotificationModal
          isOpen={isNotification}
          onOpenChange={setIsNotification}
        />
      </div>
    </ProtectedRoute>
  );
}
