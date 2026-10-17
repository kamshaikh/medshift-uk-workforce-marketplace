import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Check,
  CheckCheck,
  Clock,
  Sparkles,
  Send,
  Calendar,
  UserCheck,
  FileText,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppNotification } from '../../types';

export const NotificationCenter: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'unread') return !n.read;
    return true;
  });

  const getNotificationIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'shift_matched':
        return <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'invitation_received':
        return <Send className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'shift_accepted':
      case 'shift_filled':
        return <UserCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />;
      case 'shift_reminder':
        return <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'availability_update':
        return <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      case 'profile_update':
        return <FileText className="w-4 h-4 text-violet-600 dark:text-violet-400" />;
      case 'urgent_shift':
      case 'compliance_reminder':
      default:
        return <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
    }
  };

  const handleNotificationClick = (notif: AppNotification) => {
    markNotificationRead(notif.id);
    setIsOpen(false);

    // Route intelligently based on notification content
    if (notif.shiftId) {
      navigate(`/shifts/${notif.shiftId}`);
    } else if (notif.type === 'availability_update') {
      navigate('/availability');
    } else if (notif.type === 'profile_update') {
      navigate('/profile');
    } else if (notif.professionalId) {
      navigate(`/professionals/${notif.professionalId}`);
    } else {
      navigate('/shifts');
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
        aria-label="Notification center"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white leading-none shadow-sm animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden text-slate-800 dark:text-slate-100 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</h3>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                ({unreadCount} unread)
              </span>
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllNotificationsRead}
                className="text-xs font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 flex items-center gap-1 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {/* Tab Filter */}
          <div className="flex border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs px-2 pt-1">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`py-2 px-3 font-medium transition-colors border-b-2 ${
                activeTab === 'all'
                  ? 'border-teal-600 text-teal-700 dark:border-teal-400 dark:text-teal-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('unread')}
              className={`py-2 px-3 font-medium transition-colors border-b-2 ${
                activeTab === 'unread'
                  ? 'border-teal-600 text-teal-700 dark:border-teal-400 dark:text-teal-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {filteredNotifications.length === 0 ? (
              <div className="py-10 text-center px-4">
                <Bell className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {activeTab === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  Actions you take across shifts and invites will show up here.
                </p>
              </div>
            ) : (
              filteredNotifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors cursor-pointer group flex items-start gap-3 ${
                    !n.read ? 'bg-teal-50/40 dark:bg-teal-950/20' : ''
                  }`}
                >
                  <div className="mt-0.5 p-2 rounded-lg bg-slate-100 dark:bg-slate-800 flex-shrink-0 group-hover:scale-105 transition-transform">
                    {getNotificationIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <p className={`text-xs font-semibold truncate ${!n.read ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                        {n.title}
                      </p>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap">
                        {n.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {n.message}
                    </p>
                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="text-[10px] font-medium text-teal-600 dark:text-teal-400 flex items-center gap-0.5 group-hover:underline">
                        View details <ExternalLink className="w-2.5 h-2.5" />
                      </span>
                      {!n.read && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            markNotificationRead(n.id);
                          }}
                          className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-0.5"
                          title="Mark as read"
                        >
                          <Check className="w-3 h-3" /> Mark read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Prototype Disclosure Footer */}
          <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 text-center">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 tracking-wide font-medium">
              Demo Simulation · Local Storage Persistence
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
