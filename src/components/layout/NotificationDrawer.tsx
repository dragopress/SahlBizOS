import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  X,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Info,
  Clock,
  ExternalLink,
  CheckCheck,
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, clearAllNotifications, setCurrentView, language } = useApp();

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'danger':
        return <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-zinc-400 shrink-0" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10 rtl:right-auto rtl:left-0 rtl:pl-0 rtl:pr-10">
        <div className="w-screen max-w-md bg-[#0C0C0C] shadow-2xl border-l border-white/10 flex flex-col">
          {/* Header */}
          <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-[#080808]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded bg-white/5 border border-white/10 text-white">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
                  Notifications
                </span>
                <h3 className="font-serif italic text-white text-base leading-tight">
                  {language === 'ar' ? 'الإشعارات والتنبيهات' : 'Flux d’activités & Alertes'}
                </h3>
                <p className="text-[10px] font-mono text-zinc-500">
                  {unreadCount > 0
                    ? `${unreadCount} ${language === 'ar' ? 'إشعار غير مقروء' : 'non lues'}`
                    : language === 'ar'
                    ? 'جميع الإشعارات مقروءة'
                    : 'Toutes les notifications sont lues'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={clearAllNotifications}
                  title="Marquer tout comme lu"
                  className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <CheckCheck className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
            {notifications.length === 0 ? (
              <div className="py-16 text-center text-zinc-500">
                <Bell className="w-8 h-8 mx-auto mb-3 opacity-30 text-white" />
                <p className="font-medium text-xs">
                  {language === 'ar' ? 'لا توجد إشعارات حالياً' : 'Aucune notification pour le moment.'}
                </p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    markNotificationRead(notif.id);
                    if (notif.link) {
                      setCurrentView(notif.link as any);
                      onClose();
                    }
                  }}
                  className={`p-3.5 rounded border transition-all cursor-pointer ${
                    notif.read
                      ? 'bg-[#080808] border-white/5 opacity-60'
                      : 'bg-[#0C0C0C] border-white/10 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {getIcon(notif.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <h4 className="font-sans font-medium text-white text-xs truncate">
                          {notif.title}
                        </h4>
                        <span className="text-[10px] text-zinc-500 shrink-0 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" />
                          {formatDate(notif.date, language)}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                        {notif.message}
                      </p>
                      {notif.link && (
                        <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-mono uppercase tracking-wider text-zinc-300 hover:text-white">
                          {language === 'ar' ? 'عرض التفاصيل' : 'Consulter'} <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3.5 border-t border-white/10 bg-[#080808] text-center">
            <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
              {language === 'ar'
                ? 'نظام التنبيهات الذكي لـ SahlBiz OS'
                : 'SahlBiz OS • Système de notification en direct'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
