"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Mail,
  ShieldAlert,
  ArrowLeft,
  Users,
  Heart,
  MessageCircle,
  Sparkles,
  Gamepad2,
  Trophy,
  Loader2,
  AlertCircle,
  RefreshCw,
  Search,
  Zap,
  Ghost,
  Edit2,
  X,
  Check,
  LogOut,
} from "lucide-react";
import { chatApi } from "@/api/chat.api";
import { FetchStatus, Friend, UserData } from "@/types/user";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { AuthApi } from "@/api/auth.api";

const STATUS_OPTIONS = [
  {
    status: "doomscrolling 💀",
    icon: <Ghost size={14} />,
    color: "bg-pink-100 text-pink-600 dark:bg-pink-900/40 dark:text-pink-400",
  },
  {
    status: "locked in 🔒",
    icon: <Zap size={14} />,
    color:
      "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-400",
  },
  {
    status: "touching grass 🌿",
    icon: <Sparkles size={14} />,
    color:
      "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400",
  },
  {
    status: "ranking up 🎮",
    icon: <Gamepad2 size={14} />,
    color:
      "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400",
  },
  {
    status: "gym rat 💪",
    icon: <Trophy size={14} />,
    color:
      "bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400",
  },
];

const Badge = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span
    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${className}`}
  >
    {children}
  </span>
);

const StatCard = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
}) => (
  <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm hover:scale-105 transition-transform duration-200 cursor-default">
    <div className="text-zinc-400 dark:text-zinc-500 mb-1">
      <Icon size={18} />
    </div>
    <span className="text-xl font-black text-zinc-900 dark:text-white">
      {value}
    </span>
    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
      {label}
    </span>
  </div>
);

export default function UserProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("friends");

  // User data state
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userStatus, setUserStatus] = useState<FetchStatus>("idle");
  const [userError, setUserError] = useState("");

  // Friends data state
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendsStatus, setFriendsStatus] = useState<FetchStatus>("idle");
  const [friendsError, setFriendsError] = useState("");
  const [friendsSearch, setFriendsSearch] = useState("");

  // Edit profile state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editBio, setEditBio] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const fetchCurrentUser = async () => {
    try {
      setUserStatus("loading");
      setUserError("");
      const response = (await chatApi.getCurrentUser()) as { data: UserData };
      setUserData(response.data);
      setUserStatus("success");
    } catch (error) {
      console.error(error);
      setUserStatus("error");
      setUserError(
        error instanceof Error ? error.message : "Failed to load profile"
      );
    }
  };

  const fetchFriends = async () => {
    try {
      setFriendsStatus("loading");
      setFriendsError("");
      const response = (await chatApi.getAllFriends()) as {
        data: Array<{
          _id: string;
          name: string;
          username: string;
          email: string;
        }>;
      };
      console.log(response);

      const usersData = response?.data || [];
      const formattedFriends: Friend[] = usersData.map((user, index) => {
        const statusOption = STATUS_OPTIONS[index % STATUS_OPTIONS.length];
        return {
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          status: statusOption.status,
          icon: statusOption.icon,
          color: statusOption.color,
          initial: user.name?.[0]?.toUpperCase() || "?",
          mutuals: Math.floor(Math.random() * 25),
        };
      });

      setFriends(formattedFriends);
      setFriendsStatus("success");
    } catch (error) {
      console.error(error);
      setFriendsStatus("error");
      setFriendsError(
        error instanceof Error ? error.message : "Failed to load friends"
      );
    }
  };

  const startEditingProfile = () => {
    setEditBio(userData?.bio || "");
    setSaveError("");
    setIsEditingProfile(true);
  };

  const cancelEditingProfile = () => {
    setIsEditingProfile(false);
    setSaveError("");
  };

  const saveProfile = async () => {
    try {
      setIsSaving(true);
      setSaveError("");
      await chatApi.updateProfile({
        bio: editBio,
      });
      // Update local state
      setUserData((prev) =>
        prev
          ? {
              ...prev,
              bio: editBio,
            }
          : null
      );
      setIsEditingProfile(false);
    } catch (error) {
      console.error(error);
      setSaveError(
        error instanceof Error ? error.message : "Failed to save profile"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AuthApi.logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Still redirect to login even if logout API fails
      router.push("/login");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchCurrentUser();
      await fetchFriends();
    };
    loadData();
  }, []);

  const filteredFriends = friends.filter(
    (friend) =>
      friend.name.toLowerCase().includes(friendsSearch.toLowerCase()) ||
      friend.username.toLowerCase().includes(friendsSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FDFCF8] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-300 pb-20">
      {/* 1. COVER PHOTO AREA */}
      <div className="relative h-48 sm:h-64 w-full overflow-hidden bg-zinc-900">
        {/* Background Beams - visible in both themes */}
        <BackgroundBeams className="z-0" />

        {/* Bottom gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#FDFCF8]/30 dark:to-zinc-950/50 z-[1]" />

        {/* Navbar Overlay */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
          <button
            onClick={() => router.push("/dashboard")}
            className="p-2 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/30 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Loading State */}
        {userStatus === "loading" && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Loading profile...
            </p>
          </div>
        )}

        {/* Error State */}
        {userStatus === "error" && (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="p-4 rounded-full bg-red-100 dark:bg-red-900/30">
              <AlertCircle className="h-8 w-8 text-red-500 dark:text-red-400" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
                Failed to load profile
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs">
                {userError}
              </p>
            </div>
            <button
              onClick={fetchCurrentUser}
              className="mt-2 flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-bold hover:opacity-90 transition-opacity"
            >
              <RefreshCw size={16} />
              Try again
            </button>
          </div>
        )}

        {/* Success State */}
        {userStatus === "success" && userData && (
          <>
            {/* 2. PROFILE HEADER */}
            <div className="relative z-10 -mt-16 sm:-mt-20 mb-6 flex flex-col sm:flex-row items-center sm:items-end gap-4">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-[2.5rem] border-4 border-white dark:border-zinc-950 bg-orange-100 dark:bg-zinc-900 flex items-center justify-center text-6xl shadow-xl overflow-hidden">
                  <span className="group-hover:scale-110 transition-transform duration-300">
                    {userData.name?.[0]?.toUpperCase() || "👤"}
                  </span>
                </div>
                <div
                  className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 border-4 border-white dark:border-zinc-950 rounded-full z-10"
                  title="Online"
                />
              </div>

              {/* Name & Actions */}
              <div className="flex-1 text-center sm:text-left space-y-1">
                <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-2">
                  <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-zinc-900 dark:text-white">
                    {userData.name}
                  </h1>
                  <Badge className="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
                    <ShieldAlert size={12} />
                    USER
                  </Badge>
                </div>
                <p className="text-zinc-500 dark:text-zinc-400 font-medium">
                  @{userData.username}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-4 sm:mt-0">
                <button className="h-10 w-10 flex items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                  <Mail size={18} />
                </button>
                <button
                  onClick={handleLogout}
                  className="h-10 w-10 flex items-center justify-center rounded-full border border-red-200 dark:border-red-700 bg-white dark:bg-zinc-900 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>

            {/* 3. BIO & DETAILS */}
            <div className="space-y-6">
              {/* Edit Profile Section */}
              {isEditingProfile ? (
                <div className="bg-white dark:bg-zinc-900/50 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-white flex items-center gap-2">
                      <Edit2 size={18} className="text-purple-500" />
                      Edit Profile
                    </h3>
                    <button
                      onClick={cancelEditingProfile}
                      className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <X size={18} className="text-zinc-500" />
                    </button>
                  </div>

                  {/* Bio Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                      Bio
                    </label>
                    <textarea
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      placeholder="Tell everyone about yourself..."
                      maxLength={160}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 dark:focus:border-purple-500 outline-none resize-none transition-all text-sm"
                    />
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 text-right">
                      {editBio.length}/160
                    </p>
                  </div>

                  {/* Error Message */}
                  {saveError && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                      <AlertCircle size={14} className="text-red-500" />
                      <span className="text-sm text-red-600 dark:text-red-400">
                        {saveError}
                      </span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={cancelEditingProfile}
                      disabled={isSaving}
                      className="px-5 py-2.5 rounded-xl text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveProfile}
                      disabled={isSaving}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-purple-500/25"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Check size={16} />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                /* Display Mode */
                <div className="relative group">
                  <p className="text-center sm:text-left text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-xl">
                    {userData.bio || "No bio yet 🤷"}
                  </p>
                  <button
                    onClick={startEditingProfile}
                    className="absolute -top-1 -right-1 sm:relative sm:top-auto sm:right-auto sm:mt-3 p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400 transition-all opacity-0 group-hover:opacity-100 sm:opacity-100"
                    title="Edit profile"
                  >
                    <Edit2 size={16} />
                  </button>
                </div>
              )}

              <div className="flex flex-wrap justify-center sm:justify-start gap-x-6 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  Joined {formatDate(userData.createdAt)}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <StatCard label="Friends" value={friends.length} icon={Users} />
                <StatCard label="Likes" value="0" icon={Heart} />
                <StatCard label="Vibe Score" value={100} icon={Zap} />
              </div>
            </div>

            {/* 4. TABS & CONTENT */}
            <div className="mt-10">
              {/* Tab Navigation */}
              <div className="flex items-center border-b border-zinc-200 dark:border-zinc-800 mb-6 overflow-x-auto no-scrollbar">
                {["friends", "about"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative px-6 py-3 text-sm font-bold tracking-wide uppercase transition-colors ${
                      activeTab === tab
                        ? "text-zinc-900 dark:text-white"
                        : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900 dark:bg-white rounded-t-full" />
                    )}
                  </button>
                ))}
              </div>

              {/* TAB CONTENT: FRIENDS LIST */}
              {activeTab === "friends" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg dark:text-white">
                      All Friends{" "}
                      <span className="text-zinc-400 font-medium text-sm ml-1">
                        ({filteredFriends.length})
                      </span>
                    </h3>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search friends..."
                        value={friendsSearch}
                        onChange={(e) => setFriendsSearch(e.target.value)}
                        className="pl-9 pr-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border-none text-sm font-medium focus:ring-2 focus:ring-zinc-200 dark:focus:ring-zinc-700 outline-none w-48 transition-all focus:w-60"
                      />
                      <Search
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                      />
                    </div>
                  </div>

                  {/* Friends Loading */}
                  {friendsStatus === "loading" && (
                    <div className="flex items-center justify-center py-10">
                      <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
                    </div>
                  )}

                  {/* Friends Error */}
                  {friendsStatus === "error" && (
                    <div className="flex flex-col items-center justify-center py-10 gap-3">
                      <AlertCircle className="h-6 w-6 text-red-500" />
                      <p className="text-sm text-zinc-500">{friendsError}</p>
                      <button
                        onClick={fetchFriends}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-sm font-semibold"
                      >
                        <RefreshCw size={14} />
                        Retry
                      </button>
                    </div>
                  )}

                  {/* Friends List */}
                  {friendsStatus === "success" && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {filteredFriends.map((friend, index) => (
                          <div
                            key={friend.id}
                            className="group relative flex items-center p-3 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 shadow-sm hover:shadow-md transition-all duration-200"
                          >
                            {/* Friend Avatar */}
                            <div
                              className={`relative h-12 w-12 rounded-full ${friend.color} flex items-center justify-center font-black text-xl shrink-0 mr-3`}
                            >
                              {friend.initial}
                              {index % 2 === 0 && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-zinc-900 rounded-full" />
                              )}
                            </div>

                            {/* Friend Info */}
                            <div className="flex-1 min-w-0 mr-2">
                              <div className="flex items-center gap-1">
                                <h4 className="font-bold text-zinc-900 dark:text-zinc-100 truncate">
                                  {friend.name}
                                </h4>
                                {index === 0 && (
                                  <Sparkles
                                    size={12}
                                    className="text-yellow-500 fill-yellow-500"
                                  />
                                )}
                              </div>
                              <p className="text-xs font-medium text-zinc-500 truncate mb-1">
                                @{friend.username}
                              </p>
                              {friend.status && (
                                <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 max-w-full">
                                  {friend.icon}
                                  <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 truncate">
                                    {friend.status}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Action Button */}
                            <button
                              onClick={() => router.push("/dashboard")}
                              className="h-9 w-9 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 shadow-sm"
                            >
                              <MessageCircle size={16} />
                            </button>
                          </div>
                        ))}
                      </div>

                      {filteredFriends.length === 0 && (
                        <div className="text-center py-10 text-zinc-500">
                          No friends found matching &quot;{friendsSearch}&quot;
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {activeTab === "about" && (
                <div className="bg-white dark:bg-zinc-900/50 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <h3 className="font-bold text-lg mb-4 dark:text-white">
                    Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                      <span className="text-zinc-500 font-medium">Email</span>
                      <span className="text-zinc-900 dark:text-zinc-100 font-bold">
                        {userData.email}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                      <span className="text-zinc-500 font-medium">
                        Birthday
                      </span>
                      <span className="text-zinc-900 dark:text-zinc-100 font-bold">
                        {new Date(userData.dob).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-zinc-500 font-medium">
                        Username
                      </span>
                      <span className="text-zinc-900 dark:text-zinc-100 font-bold">
                        @{userData.username}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes gradient-xy {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-xy {
          background-size: 200% 200%;
          animation: gradient-xy 15s ease infinite;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `,
        }}
      />
    </div>
  );
}
