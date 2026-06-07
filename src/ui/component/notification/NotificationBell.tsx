import { useState, useEffect, useRef } from "react";
import NotificationService from "../../../service/NotificationService";
import type { NotificationTypeForm } from "../../../types/FormType";
import { useNavigate } from "react-router-dom";

export default function NotificationBell() {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState<NotificationTypeForm[]>([]);
    const [nonLues, setNonLues] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const fetchNotifs = async () => {
        try {
            const data = await NotificationService.getMesNotifications();
            setNotifications(data.notifications.slice(0, 5));
            setNonLues(data.nonLues);
        } catch { }
    };

    useEffect(() => { fetchNotifs(); }, []);

    useEffect(() => {
        const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleClick = async (notif: NotificationTypeForm) => {
        if (!notif.lu) {
            await NotificationService.marquerLue(notif._id);
            setNonLues(n => Math.max(0, n - 1));
            setNotifications(ns => ns.map(n => n._id === notif._id ? { ...n, lu: true } : n));
        }
        if (notif.lien) { navigate(notif.lien); setOpen(false); }
    };

    return (
        <div ref={ref} className="relative">
            <button onClick={() => setOpen(!open)} className="relative p-2 text-gray-600 hover:text-primary transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {nonLues > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                        {nonLues > 9 ? "9+" : nonLues}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                        <span className="font-semibold text-gray-800 text-sm">Notifications</span>
                        {nonLues > 0 && (
                            <button onClick={async () => { await NotificationService.marquerToutesLues(); setNonLues(0); setNotifications(ns => ns.map(n => ({ ...n, lu: true }))); }} className="text-xs text-primary hover:underline">
                                Tout marquer lu
                            </button>
                        )}
                    </div>
                    <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <p className="text-center text-sm text-gray-400 py-8">Aucune notification</p>
                        ) : notifications.map(n => (
                            <button key={n._id} onClick={() => handleClick(n)} className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition ${!n.lu ? "bg-blue-50/50" : ""}`}>
                                <p className={`text-sm font-medium text-gray-800 ${!n.lu ? "font-semibold" : ""}`}>{n.titre}</p>
                                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                            </button>
                        ))}
                    </div>
                    <button onClick={() => { navigate("/profil/notifications"); setOpen(false); }} className="w-full py-3 text-xs text-primary font-medium hover:bg-gray-50 transition border-t border-gray-100">
                        Voir toutes les notifications
                    </button>
                </div>
            )}
        </div>
    );
}
