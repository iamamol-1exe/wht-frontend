"use client";
import { chatApi } from "@/api/chat.api";
import DialogContent from "@/components/DialogContent";
import DialogDescription from "@/components/DialogDescription";
import DialogFooter from "@/components/DialogFooter";
import DialogHeader from "@/components/DialogHeader";
import DialogOverlay from "@/components/DialogOverlay";
import DialogTitle from "@/components/DialogTitle";
import { FetchStatus, User } from "@/types/user";
import {
  AlertCircle,
  Cake,
  Calendar,
  Check,
  Loader2,
  Mail,
  MessageCircle,
  Plus,
  RefreshCw,
  Send,
  ShieldAlert,
  Sparkles,
  UserPlus,
  UserX,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

const SquadModal = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [inviteStatus, setInviteStatus] = useState<"idle" | "sending" | "sent">(
    "idle"
  );
  const [inputValue, setInputValue] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const closeModal = () => {
    setIsAdding(false);
    setInviteStatus("idle");
    setInputValue("");
    onOpenChange(false);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setInviteStatus("sending");
    // Simulate network request
    setTimeout(() => {
      setInviteStatus("sent");
      setTimeout(() => {
        setInviteStatus("idle");
        setIsAdding(false);
        setInputValue("");
      }, 2000);
    }, 1200);
  };

  const fetchUsers = async () => {
    try {
      setFetchStatus("loading");
      setErrorMessage("");
      const response = (await chatApi.getUsers()) as {
        data: Array<{
          _id: string;
          username: string;
          name: string;
          email: string;
          createdAt: string;
          dob: string;
        }>;
      };

      const usersData = response?.data || [];

      const formattedUsers: User[] = usersData.map((user) => ({
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        dob: user.dob,
        icon: <ShieldAlert size={14} />,
        color:
          "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
      }));

      setUsers(formattedUsers);
      setFetchStatus("success");
    } catch (error: unknown) {
      console.error(error);
      setFetchStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to load users. Please try again."
      );
    }
  };

  useEffect(() => {
    if (isOpen) {
      const loadUsers = async () => {
        await fetchUsers();
      };
      loadUsers();
    }
  }, [isOpen]);

  // const friends = [
  //   {
  //     id: "69691ff1073b1f5994430667",
  //     name: "chalu pandey",
  //     username: "@pandeyji",
  //     email: "lokkichata@gmail.com",
  //     dob: "2017-06-20T00:00:00.000Z",
  //     createdAt: "2026-01-15T17:12:17.752Z",
  //     status: "policing 🚓",
  //     icon: <ShieldAlert size={14} />,
  //     color:
  //       "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  //     initial: "C",
  //   },
  //   {
  //     id: 1,
  //     name: "zoe",
  //     handle: "@zoe_fr",
  //     status: "doomscrolling 💀",
  //     icon: <Ghost size={14} />,
  //     color: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
  //     initial: "Z",
  //   },
  //   {
  //     id: 2,
  //     name: "liam",
  //     handle: "@liam_w",
  //     status: "locked in 🔒",
  //     icon: <Zap size={14} />,
  //     color:
  //       "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
  //     initial: "L",
  //   },
  //   {
  //     id: 3,
  //     name: "noah",
  //     handle: "@n_o_a_h",
  //     status: "touching grass 🌿",
  //     icon: <Sparkles size={14} />,
  //     color:
  //       "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  //     initial: "N",
  //   },
  // ];

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center font-sans text-zinc-900 dark:text-zinc-100">
      <DialogOverlay isOpen={isOpen} onClose={closeModal} />

      <DialogContent isOpen={isOpen}>
        <button
          onClick={closeModal}
          className="absolute right-5 top-5 rounded-full p-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 opacity-70 transition-all hover:opacity-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:rotate-90"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <DialogHeader>
          <DialogTitle>the squad ✨</DialogTitle>
          <DialogDescription>main characters only</DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <div className="flex flex-col gap-3">
            {/* Loading State */}
            {fetchStatus === "loading" && (
              <div className="flex flex-col items-center justify-center py-8 gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Loading the squad...
                </p>
              </div>
            )}

            {/* Error State */}
            {fetchStatus === "error" && (
              <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
                <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30">
                  <AlertCircle className="h-6 w-6 text-red-500 dark:text-red-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                    Oops! Something went wrong
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-[200px]">
                    {errorMessage}
                  </p>
                </div>
                <button
                  onClick={fetchUsers}
                  className="mt-2 flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  <RefreshCw size={14} />
                  Try again
                </button>
              </div>
            )}

            {/* Empty State */}
            {fetchStatus === "success" && users.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
                <div className="p-3 rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <UserX className="h-6 w-6 text-zinc-400 dark:text-zinc-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                    No squad members yet
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Add some homies to get started!
                  </p>
                </div>
              </div>
            )}

            {/* Success State - User List */}
            {fetchStatus === "success" &&
              users.map((user) => (
                <div
                  key={user.id}
                  className="group relative flex items-center justify-between p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer"
                >
                  {/* User Info Popup / Tooltip */}
                  {user.email && (
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-[240px] p-4 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none z-[60]">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between border-b border-zinc-700 dark:border-zinc-200 pb-2 mb-1">
                          <span className="font-bold text-sm">{user.name}</span>
                          <span className="opacity-70 font-mono">
                            {user.username}
                          </span>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 opacity-90">
                            <Mail size={12} className="shrink-0" />
                            <span className="truncate">{user.email}</span>
                          </div>
                          <div className="flex items-center gap-2 opacity-90">
                            <Cake size={12} className="shrink-0" />
                            <span>Born {formatDate(user.dob)}</span>
                          </div>
                          <div className="flex items-center gap-2 opacity-90">
                            <Calendar size={12} className="shrink-0" />
                            <span>Joined {formatDate(user.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      {/* Arrow */}
                      <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 rotate-45 bg-zinc-900 dark:bg-white"></div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <div
                      className={`h-10 w-10 rounded-full ${user.color} flex items-center justify-center font-bold text-lg`}
                    >
                      {user.initial || user.name[0]}
                    </div>
                    <div className="flex flex-col items-start">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-zinc-800 dark:text-zinc-100 text-sm">
                          {user.name}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
                        @{user.username}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    {user.status && (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700">
                        {user.icon}
                        <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">
                          {user.status}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="p-2 rounded-full bg-black dark:bg-white text-white dark:text-black shadow-lg hover:scale-110 transition-transform"
                      title="Send Request"
                    >
                      <UserPlus size={16} />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <DialogFooter>
          {inviteStatus === "sent" ? (
            <div className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-bold animate-in fade-in zoom-in duration-300">
              <Check size={18} />
              <span>Invite Sent! 🚀</span>
            </div>
          ) : isAdding ? (
            <form
              onSubmit={handleSendInvite}
              className="w-full flex gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <div className="relative flex-1">
                <span className="absolute left-3 top-3.5 text-zinc-400 text-sm font-medium">
                  @
                </span>
                <input
                  type="text"
                  autoFocus
                  placeholder="username"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full pl-7 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-sm font-bold text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20 transition-all placeholder:text-zinc-300"
                />
              </div>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-3 rounded-xl font-bold text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-600 transition-colors"
              >
                <X size={20} />
              </button>
              <button
                type="submit"
                disabled={!inputValue.trim() || inviteStatus === "sending"}
                className="px-4 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-zinc-200 dark:shadow-none"
              >
                {inviteStatus === "sending" ? (
                  <Sparkles className="animate-spin" size={20} />
                ) : (
                  <Send size={20} />
                )}
              </button>
            </form>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full group relative overflow-hidden rounded-2xl bg-black dark:bg-white px-4 py-3 text-sm font-bold text-white dark:text-black shadow-[0_4px_0_0_rgba(0,0,0,0.2)] dark:shadow-[0_4px_0_0_rgba(255,255,255,0.1)] hover:shadow-[0_2px_0_0_rgba(0,0,0,0.2)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all"
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                <Plus size={16} />
                <span>add the homies</span>
              </div>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-transform duration-300 opacity-50" />
            </button>
          )}
        </DialogFooter>
      </DialogContent>
    </div>
  );
};

export default SquadModal;
