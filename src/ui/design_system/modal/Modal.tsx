import { useEffect } from "react";
import type { ReactNode } from "react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    size?: "sm" | "md" | "lg";
}

const sizes = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl" };

export default function Modal({ isOpen, onClose, title, children, size = "md" }: Props) {
    useEffect(() => {
        if (isOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className={`relative bg-white rounded-2xl shadow-xl w-full ${sizes[size]} max-h-[90vh] overflow-y-auto`}>
                {title && (
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
                    </div>
                )}
                <div className="px-6 py-5">{children}</div>
            </div>
        </div>
    );
}
