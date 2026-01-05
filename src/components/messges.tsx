import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";
import React from "react";
import NextImage from "next/image";

export type IMessage =
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

const Messages = ({
  messagesEndRef,
  activeMessages,
}: {
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  activeMessages: IMessage[];
}) => {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {activeMessages.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="mb-3 flex size-16 items-center justify-center rounded-full bg-primary/10 mx-auto">
              <Lock className="size-8 text-primary" />
            </div>
            <h3 className="mb-2 font-semibold text-lg">End-to-End Encrypted</h3>
            <p className="max-w-md text-muted-foreground text-sm">
              Messages are secured with end-to-end encryption. Start the
              conversation now.
            </p>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-4xl space-y-4">
          {activeMessages.map((m, idx) => {
            const mine = m.from === "me";
            const prevMsg = idx > 0 ? activeMessages[idx - 1] : null;
            const showAvatar = !mine && (!prevMsg || prevMsg.from !== m.from);

            return (
              <div
                key={m.id}
                className={cn(
                  "flex gap-2",
                  mine ? "flex-row-reverse" : "flex-row",
                  !showAvatar && !mine && "ml-10"
                )}
              >
                {!mine && showAvatar && (
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 font-semibold text-white text-xs">
                    {m.senderAvatar}
                  </div>
                )}
                {!mine && !showAvatar && <div className="w-8 shrink-0" />}

                <div
                  className={cn(
                    "group relative max-w-[65%]",
                    mine && "flex flex-col items-end"
                  )}
                >
                  {!mine && showAvatar && (
                    <div className="mb-1 ml-1 font-medium text-xs text-muted-foreground">
                      {m.senderName}
                    </div>
                  )}
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2 shadow-sm",
                      mine
                        ? "rounded-br-md bg-primary text-primary-foreground"
                        : "rounded-bl-md bg-card"
                    )}
                  >
                    {m.kind === "text" && (
                      <div className="whitespace-pre-wrap break-words text-[15px] leading-relaxed">
                        {m.text}
                      </div>
                    )}
                    {m.kind === "sticker" && (
                      <div className="text-5xl leading-none">{m.sticker}</div>
                    )}
                    {m.kind === "image" && (
                      <div className="flex flex-col gap-2">
                        <NextImage
                          src={m.objectUrl}
                          alt={m.alt}
                          width={640}
                          height={640}
                          unoptimized
                          className="max-h-80 w-auto rounded-xl"
                          sizes="(max-width: 768px) 80vw, 500px"
                        />
                        <div
                          className={cn(
                            "text-xs",
                            mine
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                          )}
                        >
                          {m.alt}
                        </div>
                      </div>
                    )}
                  </div>
                  <div
                    className={cn(
                      "mt-1 px-1 text-[11px] text-muted-foreground",
                      mine && "text-right"
                    )}
                  >
                    {m.at}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default Messages;
