"use client";
import { chatApi } from "@/api/chat.api";
import DialogContent from "@/components/DialogContent";
import DialogHeader from "@/components/DialogHeader";
import DialogOverlay from "@/components/DialogOverlay";
import DialogTitle from "@/components/DialogTitle";
import FriendRequestCard from "@/components/FriendRequestCard";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/formatDate";
import {
  X,
  UserPlus,
  Check,
  X as Decline,
  Bell,
  Clock,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

export interface FriendRequest {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  initial: string;
  color: string;
  mutualFriends?: number;
  sentAt?: string;
}

interface NotificationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  friendRequests?: FriendRequest[];
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
}

const NotificationModal = ({
  isOpen,
  onOpenChange,
  onAccept,
  onDecline,
}: NotificationModalProps) => {
  const [friendReq, setFriendReq] = useState<FriendRequest[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState("");

  const closeModal = () => {
    onOpenChange(false);
  };

  const handleAccept = (id: string) => {
    onAccept?.(id);
  };

  const handleDecline = (id: string) => {
    onDecline?.(id);
  };

  const fetchFriendRequest = async () => {
    try {
      setLoading(true);
      setSuccess("");
      setError("");
      const response = (await chatApi.fetchFriendReq()) as {
        data: Array<{
          _id: string;
          username: string;
          name: string;
          email: string;
          createdAt: string;
          dob: string;
          sentAt: Date;
        }>;
      };

      const data = response.data || [];
      console.log(data);
      const friendReqs: FriendRequest[] = data.map((req) => {
        const initials =
          req.name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2) || "?";
        return {
          id: req._id,
          name: req.name,
          username: req.username,

          initial: initials,
          color:
            "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
          sentAt: formatDate(new Date(req.sentAt)),
        };
      });
      setFriendReq(friendReqs);
    } catch (error) {
      console.log(error);
      setError(
        error instanceof Error
          ? error.message
          : "Fetch failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriendRequest();
  }, []);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center font-sans text-zinc-900 dark:text-zinc-100">
        <DialogOverlay isOpen={isOpen} onClose={closeModal} />
        <DialogContent isOpen={isOpen} className="max-w-[520px]">
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute right-5 top-5 rounded-full p-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 opacity-70 transition-all hover:opacity-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:rotate-90 hover:scale-110"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>

          <DialogHeader>
            <DialogTitle>
              <span className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg from-amber-400 to-orange-500 shadow-lg shadow-orange-500/25">
                  <Bell className="h-4 w-4 text-white" />
                </span>
                Notifications
              </span>
            </DialogTitle>
          </DialogHeader>

          {/* Tabs/Filter */}
          <div className="mt-4 flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium transition-all">
              <UserPlus className="h-3.5 w-3.5" />
              Friend Requests
              {friendReq && friendReq.length > 0 && (
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {friendReq && friendReq.length}
                </span>
              )}
            </button>
          </div>

          {/* Friend Requests List */}
          <div className="mt-4 space-y-3  overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent">
            {friendReq && friendReq.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 mb-4">
                  <UserPlus className="h-8 w-8 text-zinc-400" />
                </div>
                <h3 className="text-lg font-medium text-zinc-700 dark:text-zinc-300">
                  No friend requests
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  When someone sends you a friend request, it will appear here.
                </p>
              </div>
            ) : (
              friendReq &&
              friendReq.map((request) => (
                <FriendRequestCard
                  key={request.id}
                  request={request}
                  onAccept={() => handleAccept(request.id)}
                  onDecline={() => handleDecline(request.id)}
                />
              ))
            )}
          </div>

          {/* Footer */}

          {friendReq && friendReq.length > 0 && (
            <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {friendReq.length} pending request
                {friendReq.length !== 1 ? "s" : ""}
              </p>
              <button className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">
                View all notifications
              </button>
            </div>
          )}
        </DialogContent>
      </div>
    </>
  );
};

export default NotificationModal;
