import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { ImageIcon, Send, SmilePlus } from "lucide-react";
import React from "react";

const MessageInput = ({
  pendingFiles,
  removePendingFile,
  fileInputRef,
  onPickFiles,
  openFilePicker,
  STICKERS,
  sendSticker,
  draft,
  setDraft,
  send,
}: {
  pendingFiles: File[];
  removePendingFile: (idx: number) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onPickFiles: (files: FileList | null) => void;
  openFilePicker: () => void;
  STICKERS: Array<{ label: string; value: string }>;
  sendSticker: (sticker: string) => void;
  draft: string;
  setDraft: React.Dispatch<React.SetStateAction<string>>;
  send: () => void;
}) => {
  return (
    <div className="shrink-0 border-t bg-card/50 p-4 backdrop-blur-sm">
      {pendingFiles.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {pendingFiles.map((f, idx) => (
            <div
              key={`${f.name}_${idx}`}
              className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2"
            >
              <ImageIcon className="size-4 text-muted-foreground" />
              <span className="max-w-40 truncate text-sm">{f.name}</span>
              <button
                type="button"
                onClick={() => removePendingFile(idx)}
                className="ml-1 text-muted-foreground hover:text-foreground"
                aria-label="Remove image"
              >
                x
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
          variant="ghost"
          size="icon"
          onClick={openFilePicker}
          className="size-10 shrink-0"
          aria-label="Attach image"
        >
          <ImageIcon className="size-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-10 shrink-0"
              aria-label="Stickers"
            >
              <SmilePlus className="size-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Send Sticker</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="grid grid-cols-4 gap-1 p-2">
              {STICKERS.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => {
                    if (draft.trim().length > 0) {
                      setDraft(
                        (prev) =>
                          `${prev}${
                            prev.endsWith(" ") || prev.length === 0 ? "" : " "
                          }${s.value} `
                      );
                      return;
                    }
                    sendSticker(s.value);
                  }}
                  className="flex size-12 items-center justify-center rounded-lg text-2xl transition-colors hover:bg-accent"
                  title={s.label}
                >
                  {s.value}
                </button>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex-1">
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type a message..."
            className="min-h-[44px] max-h-32 resize-none rounded-2xl"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
          />
        </div>

        <Button
          type="button"
          onClick={send}
          size="icon"
          className="size-10 shrink-0 rounded-full"
          aria-label="Send"
        >
          <Send className="size-5" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
