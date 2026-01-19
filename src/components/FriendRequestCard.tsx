"use client";

import { FriendRequest } from "@/components/NotificationModal";
import { Button } from "@/components/ui/button";
import { Check, Clock, UserPlus, Users, X } from "lucide-react";
import { useState } from "react";

interface FriendRequestCardProps {
  request: FriendRequest;
  onAccept: () => void;
  onDecline: () => void;
  isProcessing?: boolean;
}

const FriendRequestCard = ({
  request,
  onAccept,
  onDecline,
  isProcessing = false,
}: FriendRequestCardProps) => {
  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const [isHandled, setIsHandled] = useState(false);
  const [action, setAction] = useState<"accepted" | "declined" | null>(null);

  const handleAccept = async () => {
    setIsAccepting(true);
    try {
      await onAccept();
      setIsHandled(true);
      setAction("accepted");
    } catch (error) {
      console.error("Failed to accept:", error);
    } finally {
      setIsAccepting(false);
    }
  };

  const handleDecline = async () => {
    setIsDeclining(true);
    try {
      await onDecline();
      setIsHandled(true);
      setAction("declined");
    } catch (error) {
      console.error("Failed to decline:", error);
    } finally {
      setIsDeclining(false);
    }
  };

  // Show success state briefly before card disappears
  if (isHandled) {
    return (
      <div className="group relative overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-4 transition-all duration-300 animate-fade-out">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white font-semibold text-lg ${request.color} opacity-50`}
          >
            {request.initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {action === "accepted" ? (
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <Check className="h-4 w-4" />
                  You are now friends with {request.name}!
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-zinc-500">
                  <X className="h-4 w-4" />
                  Request from {request.name} declined
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isDisabled = isAccepting || isDeclining || isProcessing;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 transition-all duration-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-lg hover:shadow-zinc-200/50 dark:hover:shadow-zinc-900/50">
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-50/50 to-transparent dark:via-zinc-800/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Processing overlay */}
      {isProcessing && (
        <div className="absolute inset-0 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 dark:border-zinc-700 border-t-blue-500" />
        </div>
      )}

      <div className="relative flex items-start gap-4">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-full text-white font-bold text-xl ${request.color} shadow-lg ring-2 ring-white dark:ring-zinc-800 transition-transform duration-300 group-hover:scale-105`}
          >
            {request.initial}
          </div>
          {/* Online indicator dot */}
          <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" />
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
              {request.name}
            </h4>
            <UserPlus className="h-4 w-4 text-blue-500 shrink-0" />
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
            @{request.username}
          </p>

          {/* Meta info */}
          <div className="mt-2 flex items-center gap-3 text-xs text-zinc-400 dark:text-zinc-500">
            {request.mutualFriends && request.mutualFriends > 0 && (
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {request.mutualFriends} mutual{" "}
                {request.mutualFriends === 1 ? "friend" : "friends"}
              </span>
            )}
            {request.sentAt && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {request.sentAt}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            onClick={handleDecline}
            disabled={isDisabled}
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full border-zinc-300 dark:border-zinc-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:border-red-800 dark:hover:text-red-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeclining ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-red-500" />
            ) : (
              <X className="h-5 w-5" />
            )}
            <span className="sr-only">Decline</span>
          </Button>

          <Button
            onClick={handleAccept}
            disabled={isDisabled}
            className="h-10 px-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium shadow-md shadow-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-200 hover:scale-105 flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isAccepting ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <>
                <Check className="h-4 w-4" />
                <span>Accept</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FriendRequestCard;
