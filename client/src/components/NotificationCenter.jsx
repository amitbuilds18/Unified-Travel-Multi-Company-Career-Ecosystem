import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { notificationsAPI } from "../services/api";
import {
  Bell,
  CheckCheck,
  Briefcase,
  Sparkles,
  Compass,
  AlertTriangle,
  X,
  ExternalLink,
  Clock,
  Trash2,
} from "lucide-react";

export default function NotificationCenter() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await notificationsAPI.getAll();
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (err) {
      // Quiet fail if network / unauthenticated
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Poll every 30 seconds for live notifications
    const interval = setInterval(fetchNotifications, 30000);

    // Listen for custom trigger events
    window.addEventListener("notificationChange", fetchNotifications);
    window.addEventListener("authChange", fetchNotifications);

    // Click outside to close
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      clearInterval(interval);
      window.removeEventListener("notificationChange", fetchNotifications);
      window.removeEventListener("authChange", fetchNotifications);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      fetchNotifications();
    }
  };

  const handleMarkAsRead = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await notificationsAPI.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {}
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {}
  };

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await notificationsAPI.delete(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {}
  };

  const handleNotificationClick = (item) => {
    if (!item.read) {
      handleMarkAsRead(item._id);
    }
    setIsOpen(false);
    if (item.link) {
      navigate(item.link);
    }
  };

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return "recently";
    const date = new Date(dateStr);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  };

  const getIcon = (type) => {
    switch (type) {
      case "APPLICATION_STATUS":
        return <Sparkles className="w-4 h-4 text-emerald-600" />;
      case "JOB_APPLY":
        return <Briefcase className="w-4 h-4 text-blue-600" />;
      case "BOOKING_CONFIRMED":
        return <Compass className="w-4 h-4 text-teal-600" />;
      case "BOOKING_CANCELLED":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getIconBg = (type) => {
    switch (type) {
      case "APPLICATION_STATUS":
        return "bg-emerald-50 border-emerald-200";
      case "JOB_APPLY":
        return "bg-blue-50 border-blue-200";
      case "BOOKING_CONFIRMED":
        return "bg-teal-50 border-teal-200";
      case "BOOKING_CANCELLED":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={handleToggle}
        className="relative p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition cursor-pointer"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-white font-bold text-[9px] items-center justify-center shadow-xs">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          </span>
        )}
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-4 px-5 bg-gradient-to-r from-gray-900 to-slate-800 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-teal-400" />
              <h3 className="font-bold text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-[10px] bg-red-500 text-white font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-[11px] text-gray-300 hover:text-white flex items-center gap-1 transition cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-gray-100">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400 space-y-2">
                <Bell className="w-8 h-8 mx-auto text-gray-300 stroke-1" />
                <p className="font-semibold text-gray-600">All Caught Up!</p>
                <p>No new notifications right now.</p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item._id}
                  onClick={() => handleNotificationClick(item)}
                  className={`p-4 transition flex items-start gap-3.5 cursor-pointer relative group ${
                    !item.read
                      ? "bg-blue-50/40 hover:bg-blue-50/80"
                      : "bg-white hover:bg-gray-50/80"
                  }`}
                >
                  {/* Type Icon */}
                  <div
                    className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 shadow-2xs mt-0.5 ${getIconBg(
                      item.type
                    )}`}
                  >
                    {getIcon(item.type)}
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2">
                      <h4
                        className={`text-xs font-bold truncate ${
                          !item.read ? "text-gray-900" : "text-gray-700"
                        }`}
                      >
                        {item.title}
                      </h4>
                      {!item.read && (
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full shrink-0"></span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-600 mt-0.5 leading-snug line-clamp-2">
                      {item.message}
                    </p>
                    <span className="text-[10px] text-gray-400 mt-1 block font-medium">
                      {formatTimeAgo(item.createdAt)}
                    </span>
                  </div>

                  {/* Action Buttons on Hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition flex items-center gap-1 absolute right-3 top-3">
                    <button
                      type="button"
                      onClick={(e) => handleDelete(item._id, e)}
                      className="p-1 text-gray-400 hover:text-red-500 rounded-md transition cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
              <span className="text-[11px] text-gray-500 font-medium">
                Showing latest {notifications.length} notifications
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
