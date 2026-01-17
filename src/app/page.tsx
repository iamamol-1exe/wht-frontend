"use client";

import Link from "next/link";
import React from "react";
import { Image as ImageIcon, Lock, SmilePlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EncryptedText } from "@/components/ui/encrypted-text";
import { BackgroundBeams } from "@/components/ui/background-beams";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <BackgroundBeams className="opacity-40" />
    
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 p-4">
        <header className="flex items-center justify-between gap-3 py-4">
          <div className="text-lg font-semibold">WhaTube</div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/register">Register</Link>
            </Button>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-2 md:items-center">
          <div className="flex flex-col gap-4">
            <div className="text-4xl font-semibold tracking-tight md:text-5xl">
              Freedom to chat.
              <br />
              Built for privacy.
            </div>
            <div className="text-base text-muted-foreground">
              <p>
                Send messages, images, and stickers — protected by end-to-end
                encryption.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button asChild>
                <Link href="/register">Get started</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/login">I already have an account</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard">Open dashboard</Link>
              </Button>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="size-4" />
              <span>Private by default.</span>
            </div>
          </div>

          <Card className="py-4">
            <CardHeader className="border-b">
              <CardTitle className="text-base">Demo dashboard</CardTitle>
              <CardDescription>
                A quick look at the chat experience.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 px-6">
              <div className="rounded-xl border bg-background p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Lock className="size-4" />
                    <EncryptedText
                      text="End-to-end encrypted"
                      revealDelayMs={16}
                      flipDelayMs={14}
                      className="text-muted-foreground"
                    />
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/dashboard">Open</Link>
                  </Button>
                </div>

                <div className="mt-3 grid grid-cols-12 gap-3">
                  {/* Mini sidebar */}
                  <div className="col-span-5 rounded-lg border bg-background p-2">
                    <div className="text-xs font-medium text-muted-foreground">
                      Chats
                    </div>
                    <div className="mt-2 grid gap-2">
                      <div className="rounded-md border bg-accent px-2 py-2">
                        <div className="text-sm font-medium leading-none">
                          Aarav
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          Online
                        </div>
                      </div>
                      <div className="rounded-md border bg-background px-2 py-2">
                        <div className="text-sm font-medium leading-none">
                          Team
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          3 members
                        </div>
                      </div>
                      <div className="rounded-md border bg-background px-2 py-2">
                        <div className="text-sm font-medium leading-none">
                          Support
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          Ticket #1842
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mini conversation */}
                  <div className="col-span-7 rounded-lg border bg-background p-2">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-medium text-muted-foreground">
                        Conversation
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <ImageIcon className="size-3.5" />
                        <SmilePlus className="size-3.5" />
                      </div>
                    </div>

                    <div className="mt-2 grid gap-2">
                      <div className="mr-8 rounded-lg border bg-background px-2 py-2 text-sm">
                        Hey! This chat is end-to-end encrypted.
                        <div className="mt-1 text-[11px] text-muted-foreground">
                          09:14
                        </div>
                      </div>
                      <div className="ml-8 rounded-lg border bg-primary px-2 py-2 text-sm text-primary-foreground">
                        Nice — images and stickers work too.
                        <div className="mt-1 text-[11px] text-primary-foreground/70">
                          09:15
                        </div>
                      </div>
                      <div className="ml-8 rounded-lg border bg-primary px-2 py-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-sm text-primary-foreground">
                            📷 photo.png
                          </div>
                          <div className="text-sm text-primary-foreground">
                            😄
                          </div>
                        </div>
                        <div className="mt-1 text-[11px] text-primary-foreground/70">
                          09:16
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 rounded-md border bg-background px-2 py-2 text-xs text-muted-foreground">
                      Type a message…
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-3">
                <div className="flex items-start gap-3 rounded-lg border bg-background px-3 py-2">
                  <Lock className="mt-0.5 size-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">End-to-end encryption</div>
                    <div className="text-sm text-muted-foreground">
                      Only you and your recipient can read messages.
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg border bg-background px-3 py-2">
                  <ImageIcon className="mt-0.5 size-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Share images</div>
                    <div className="text-sm text-muted-foreground">
                      Send photos in chat with a single click.
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg border bg-background px-3 py-2">
                  <SmilePlus className="mt-0.5 size-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Stickers & reactions</div>
                    <div className="text-sm text-muted-foreground">
                      Express more with quick stickers.
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <footer className="pb-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} WhaTube • Secure messaging UI
        </footer>
      </div>
    </div>
  );
}
