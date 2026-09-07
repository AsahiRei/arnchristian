"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { db } from "@/utils/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  getDoc,
  Timestamp,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
} from "firebase/firestore";
import type { Profile } from "@/types";

interface ChatMessage {
  id: string;
  text: string;
  userId: string;
  userName: string;
  isAdmin: boolean;
  createdAt: Date;
  avatar?: string;
}

const AUTH_KEY = "arnchristian_admin_auth";
const MESSAGES_PER_PAGE = 30;
const SCROLL_THRESHOLD = 150;

function MessageSkeleton() {
  return (
    <div className="flex gap-3 animate-pulse">
      <div className="w-10 h-10 rounded-full bg-bg-secondary flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex items-baseline gap-2">
          <div className="h-3 w-16 bg-bg-secondary rounded" />
          <div className="h-2.5 w-10 bg-bg-secondary rounded" />
        </div>
        <div className="h-3.5 bg-bg-secondary rounded w-3/4" />
      </div>
    </div>
  );
}

export default function CommunityChatPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const adminAvatarRef = useRef("");
  const adminNameRef = useRef("Admin");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [guestName, setGuestName] = useState("");
  const [isNameSet, setIsNameSet] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const oldestMessageRef = useRef<Date | null>(null);
  const unsubRef = useRef<(() => void) | null>(null);
  const [userId] = useState(() => {
    if (typeof window !== "undefined") {
      let id = localStorage.getItem("chat_user_id");
      if (!id) {
        id = Math.random().toString(36).substring(2, 15);
        localStorage.setItem("chat_user_id", id);
      }
      return id;
    }
    return Math.random().toString(36).substring(2, 15);
  });

  useEffect(() => {
    try {
      setIsAuthenticated(sessionStorage.getItem(AUTH_KEY) === "true");
    } catch {}
    async function loadAvatar() {
      try {
        const snap = await getDoc(doc(db, "profile", "main"));
        if (snap.exists()) {
          const data = snap.data() as Profile;
          if (data.avatar) {
            adminAvatarRef.current = data.avatar;
          }
          if (data.name) {
            adminNameRef.current = data.name;
          }
        }
      } catch (err) {
        console.error("Failed to load avatar:", err);
      }
    }
    loadAvatar();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      setIsNameSet(true);
      return;
    }
    const storedName = localStorage.getItem("chat_guest_name");
    if (storedName) {
      setGuestName(storedName);
      setIsNameSet(true);
    }
  }, [isAuthenticated]);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  useEffect(() => {
    if (!isNameSet) return;

    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    const cutoff = new Date(now - twentyFourHours);

    const q = query(
      collection(db, "community_chat"),
      orderBy("createdAt", "desc"),
      limit(MESSAGES_PER_PAGE)
    );

    setLoading(true);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const oldDocIds: string[] = [];
      const msgs: ChatMessage[] = [];

      snapshot.docs.forEach((d) => {
        const data = d.data();
        const createdAt = data.createdAt?.toDate() || new Date();
        if (createdAt < cutoff) {
          oldDocIds.push(d.id);
          return;
        }
        msgs.push({
          id: d.id,
          text: data.text,
          userId: data.userId,
          userName: data.userName,
          isAdmin: data.isAdmin,
          createdAt,
          avatar: data.avatar,
        });
      });

      msgs.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

      if (msgs.length > 0) {
        oldestMessageRef.current = msgs[0].createdAt;
        setHasMore(msgs.length >= MESSAGES_PER_PAGE);
      }

      setMessages(msgs);
      setLoading(false);

      if (isNearBottom) {
        requestAnimationFrame(() => scrollToBottom("auto"));
      }

      oldDocIds.forEach((id) => deleteDoc(doc(db, "community_chat", id)));
    });

    unsubRef.current = unsubscribe;
    return () => {
      unsubscribe();
      unsubRef.current = null;
    };
  }, [isNameSet, isNearBottom, scrollToBottom]);

  const loadOlderMessages = useCallback(async () => {
    if (loadingMore || !hasMore || !oldestMessageRef.current) return;

    setLoadingMore(true);

    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const q = query(
      collection(db, "community_chat"),
      orderBy("createdAt", "desc"),
      startAfter(oldestMessageRef.current),
      limit(MESSAGES_PER_PAGE)
    );

    const snapshot = await getDocs(q);
    const older: ChatMessage[] = [];

    snapshot.docs.forEach((d) => {
      const data = d.data();
      const createdAt = data.createdAt?.toDate() || new Date();
      if (createdAt < cutoff) return;
      older.push({
        id: d.id,
        text: data.text,
        userId: data.userId,
        userName: data.userName,
        isAdmin: data.isAdmin,
        createdAt,
        avatar: data.avatar,
      });
    });

    if (older.length > 0) {
      older.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      oldestMessageRef.current = older[0].createdAt;
      setMessages((prev) => [...older, ...prev]);
      setHasMore(older.length >= MESSAGES_PER_PAGE);
    } else {
      setHasMore(false);
    }

    setLoadingMore(false);
  }, [loadingMore, hasMore]);

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    setIsNearBottom(distanceFromBottom < SCROLL_THRESHOLD);

    if (scrollTop < 100 && hasMore && !loadingMore) {
      loadOlderMessages();
    }
  }, [hasMore, loadingMore, loadOlderMessages]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (isNearBottom) {
      scrollToBottom("auto");
    }
  }, [messages, isNearBottom, scrollToBottom]);

  const handleSetName = () => {
    if (guestName.trim()) {
      localStorage.setItem("chat_guest_name", guestName.trim());
      setIsNameSet(true);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userName = isAuthenticated ? adminNameRef.current : guestName;
    const isAdmin = isAuthenticated;

    const msgData: Record<string, unknown> = {
      text: newMessage.trim(),
      userId: isAdmin ? "admin" : userId,
      userName,
      isAdmin,
      createdAt: Timestamp.now(),
    };
    if (isAdmin && adminAvatarRef.current) {
      msgData.avatar = adminAvatarRef.current;
    }

    await addDoc(collection(db, "community_chat"), msgData);

    setNewMessage("");
    setIsNearBottom(true);
    requestAnimationFrame(() => scrollToBottom("smooth"));
  };

  if (!isNameSet && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4">
        <div className="bg-bg-card border border-border rounded-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-fg-muted"
            >
              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-xl font-display text-fg mb-2">Welcome to Community Chat</h1>
          <p className="text-fg-muted text-sm mb-6">
            Enter your name to start chatting with others
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSetName()}
              placeholder="Your name"
              maxLength={20}
              className="flex-1 px-4 py-2 bg-bg border border-border rounded-lg text-fg focus:outline-none focus:border-fg-muted"
            />
            <button
              onClick={handleSetName}
              disabled={!guestName.trim()}
              className="px-4 py-2 bg-fg text-bg rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              Join
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderAvatar = (msg: ChatMessage) => {
    const avatarUrl = msg.isAdmin ? (msg.avatar || adminAvatarRef.current) : undefined;

    if (avatarUrl) {
      return (
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-bg-secondary">
          <img
            src={avatarUrl}
            alt={msg.userName}
            className="w-full h-full object-cover"
          />
        </div>
      );
    }

    return (
      <div className="w-10 h-10 rounded-full bg-bg-secondary flex items-center justify-center flex-shrink-0">
        <span className="text-fg-muted font-medium text-sm">
          {msg.userName.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <div className="border-b border-border bg-bg-card px-4 py-3">
        <div>
          <h1 className="text-fg font-medium text-lg leading-tight">Community Chat</h1>
          <p className="text-fg-muted text-xs">Messages reset every 24 hours</p>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {loading ? (
          <div className="space-y-4">
            <MessageSkeleton />
            <MessageSkeleton />
            <MessageSkeleton />
            <MessageSkeleton />
            <MessageSkeleton />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-fg-muted">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="mb-3 opacity-50"
            >
              <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-sm">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <>
            {loadingMore && (
              <div className="space-y-4">
                <MessageSkeleton />
                <MessageSkeleton />
                <MessageSkeleton />
              </div>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className="flex gap-3">
                {renderAvatar(msg)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="font-medium text-sm text-fg">
                      {msg.userName}
                    </span>
                    {msg.isAdmin && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/10 text-blue-500 rounded">
                        Admin
                      </span>
                    )}
                    <span className="text-fg-muted text-xs">
                      {msg.createdAt.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-fg text-sm mt-1 break-words">{msg.text}</p>
                </div>
              </div>
            ))}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {!isNearBottom && !loading && messages.length > 0 && (
        <button
          onClick={() => {
            setIsNearBottom(true);
            scrollToBottom("smooth");
          }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 px-4 py-2 bg-fg text-bg rounded-full text-sm font-medium shadow-lg hover:opacity-90 transition-opacity z-10 flex items-center gap-2"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M6 9l6 6 6-6" />
          </svg>
          New messages
        </button>
      )}

      <div className="border-t border-border bg-bg-card p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-bg border border-border rounded-lg text-fg focus:outline-none focus:border-fg-muted"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="px-4 py-2 bg-fg text-bg rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
