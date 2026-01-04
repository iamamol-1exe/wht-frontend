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
  Image as ImageIcon,
  Lock,
  Send,
  SmilePlus,
  UserPlus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EncryptedText } from "@/components/ui/encrypted-text";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { cn } from "@/lib/utils";

type Chat = {
  id: string;
  title: string;
  subtitle?: string;
  lastActiveAt: string;
};

type Message =
  | {
      id: string;
      from: "me" | "them";
      kind: "text";
      text: string;
      at: string;
    }
  | {
      id: string;
      from: "me" | "them";
      kind: "image";
      alt: string;
      objectUrl: string;
      at: string;
    }
  | {
      id: string;
      from: "me" | "them";
      kind: "sticker";
      sticker: string;
      at: string;
    };

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

  const [chats, setChats] = useState<Chat[]>(() => [
    { id: "c_1", title: "Aarav", subtitle: "Online", lastActiveAt: "now" },
    { id: "c_2", title: "Team", subtitle: "3 members", lastActiveAt: "2m" },
    {
      id: "c_3",
      title: "Support",
      subtitle: "Ticket #1842",
      lastActiveAt: "1h",
    },
  ]);
  const [activeChatId, setActiveChatId] = useState<string>("c_1");
  const activeChat = useMemo(
    () => chats.find((c) => c.id === activeChatId) ?? chats[0],
    [activeChatId, chats]
  );

  const [draft, setDraft] = useState<string>("");
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>(() => ({
    c_1: [
      {
        id: "m_1",
        from: "them",
        kind: "text",
        text: "Hey! This chat is end-to-end encrypted.",
        at: "09:14",
      },
      {
        id: "m_2",
        from: "me",
        kind: "text",
        text: "Nice. I can also share images and stickers here.",
        at: "09:15",
      },
    ],
    c_2: [
      {
        id: "m_3",
        from: "them",
        kind: "text",
        text: "Reminder: standup in 10 mins.",
        at: "08:58",
      },
    ],
    c_3: [
      {
        id: "m_4",
        from: "them",
        kind: "text",
        text: "How can we help you today?",
        at: "Yesterday",
      },
    ],
  }));

  const activeMessages = messages[activeChatId] ?? [];

  const filteredChats = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return chats;
    return chats.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        (c.subtitle ?? "").toLowerCase().includes(q)
    );
  }, [chats, search]);

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
      const chat: Chat = {
        id,
        title: target,
        subtitle: "New chat",
        lastActiveAt: "now",
      };
      setChats((prev) => [chat, ...prev]);
      setMessages((prev) => ({ ...prev, [id]: [] }));
      setActiveChatId(id);
      setStartChatWith("");
    },
    [startChatWith]
  );

  return (
    <div className="relative min-h-screen">
      <BackgroundBeams className="opacity-40" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-4 p-4">
        <Card className="py-4">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="text-lg font-semibold">WhaTube</div>
                <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
                  <Lock className="size-4" />
                  <EncryptedText
                    text="End-to-end encrypted"
                    revealDelayMs={18}
                    flipDelayMs={14}
                    className="text-muted-foreground"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" type="button">
                  Privacy
                </Button>
                <Button size="sm" type="button">
                  New chat
                </Button>
              </div>
            </CardTitle>
            <CardDescription>
              Chat with anyone, share images and stickers—your messages stay
              private.
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid flex-1 grid-cols-12 gap-4">
          <Card className="col-span-12 h-[72vh] py-4 md:col-span-4">
            <CardHeader className="border-b">
              <CardTitle className="text-base">Chats</CardTitle>
              <CardDescription>Search or start a new chat.</CardDescription>
              <CardAction className="w-full">
                <div className="flex w-full flex-col gap-2">
                  <Input
                    placeholder="Search chats…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <form onSubmit={startChat} className="flex gap-2">
                    <Input
                      placeholder="Chat with @username"
                      value={startChatWith}
                      onChange={(e) => setStartChatWith(e.target.value)}
                    />
                    <Button
                      type="submit"
                      variant="outline"
                      size="icon"
                      aria-label="Start chat"
                    >
                      <UserPlus className="size-4" />
                    </Button>
                  </form>
                </div>
              </CardAction>
            </CardHeader>

            <CardContent className="px-3">
              <div className="flex flex-col gap-2">
                {filteredChats.map((c) => {
                  const active = c.id === activeChatId;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setActiveChatId(c.id)}
                      className={cn(
                        "w-full rounded-lg border px-3 py-2 text-left transition-colors",
                        active
                          ? "bg-accent text-accent-foreground"
                          : "bg-background hover:bg-accent/50"
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-medium leading-none">
                          {c.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {c.lastActiveAt}
                        </div>
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {c.subtitle ?? ""}
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>

            <CardFooter className="border-t">
              <div className="w-full text-xs text-muted-foreground">
                Tip: avoid sharing sensitive info in screenshots.
              </div>
            </CardFooter>
          </Card>

          <Card className="col-span-12 h-[72vh] py-4 md:col-span-8">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center justify-between gap-3 text-base">
                <div className="flex min-w-0 flex-col">
                  <div className="truncate">
                    {activeChat?.title ?? "Conversation"}
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <Lock className="size-3.5" />
                    Messages are end-to-end encrypted
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" type="button">
                        Safety
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Security</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        Verify contact (coming soon)
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        Report abuse (coming soon)
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent className="flex h-[calc(72vh-12.5rem)] flex-col gap-3 overflow-y-auto px-6">
              {activeMessages.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <div className="max-w-md text-center text-sm text-muted-foreground">
                    Start the conversation. You can send text, images, or
                    stickers.
                  </div>
                </div>
              ) : (
                activeMessages.map((m) => {
                  const mine = m.from === "me";
                  return (
                    <div
                      key={m.id}
                      className={cn(
                        "flex w-full",
                        mine ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[85%] rounded-xl border px-3 py-2",
                          mine
                            ? "bg-primary text-primary-foreground"
                            : "bg-background"
                        )}
                      >
                        {m.kind === "text" && (
                          <div className="whitespace-pre-wrap">{m.text}</div>
                        )}
                        {m.kind === "sticker" && (
                          <div className="text-3xl leading-none">
                            {m.sticker}
                          </div>
                        )}
                        {m.kind === "image" && (
                          <div className="flex flex-col gap-2">
                            <Image
                              src={m.objectUrl}
                              alt={m.alt}
                              width={640}
                              height={640}
                              unoptimized
                              className="max-h-64 w-auto rounded-lg border"
                              sizes="(max-width: 768px) 80vw, 420px"
                            />
                            <div
                              className={cn(
                                "text-xs",
                                mine
                                  ? "text-primary-foreground/80"
                                  : "text-muted-foreground"
                              )}
                            >
                              {m.alt}
                            </div>
                          </div>
                        )}
                        <div
                          className={cn(
                            "mt-1 text-[11px]",
                            mine
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                          )}
                        >
                          {m.at}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </CardContent>

            <CardFooter className="border-t">
              <div className="flex w-full flex-col gap-2">
                {pendingFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {pendingFiles.map((f, idx) => (
                      <div
                        key={`${f.name}_${idx}`}
                        className="flex items-center gap-2 rounded-md border bg-background px-2 py-1 text-xs"
                      >
                        <ImageIcon className="size-3.5 text-muted-foreground" />
                        <span className="max-w-55 truncate">{f.name}</span>
                        <button
                          type="button"
                          onClick={() => removePendingFile(idx)}
                          className="text-muted-foreground hover:text-foreground"
                          aria-label="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-end gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => onPickFiles(e.target.files)}
                  />

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={openFilePicker}
                    aria-label="Attach image"
                  >
                    <ImageIcon className="size-4" />
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        aria-label="Stickers"
                      >
                        <SmilePlus className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="min-w-48">
                      <DropdownMenuLabel>Stickers</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {STICKERS.map((s) => (
                        <DropdownMenuItem
                          key={s.value}
                          onSelect={(e) => {
                            e.preventDefault();
                            if (draft.trim().length > 0) {
                              setDraft(
                                (prev) =>
                                  `${prev}${
                                    prev.endsWith(" ") || prev.length === 0
                                      ? ""
                                      : " "
                                  }${s.value} `
                              );
                              return;
                            }
                            sendSticker(s.value);
                          }}
                        >
                          <span className="text-lg">{s.value}</span>
                          <span className="text-sm">{s.label}</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <div className="flex-1">
                    <Textarea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder="Write a message…"
                      className="min-h-10"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          send();
                        }
                      }}
                    />
                    <div className="mt-1 text-xs text-muted-foreground">
                      Press Enter to send • Shift+Enter for new line
                    </div>
                  </div>

                  <Button type="button" onClick={send} aria-label="Send">
                    <Send className="size-4" />
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
