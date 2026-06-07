interface Props {
    title: string;
    description?: string;
    action?: { label: string; onClick: () => void };
    icon?: string;
}

export default function EmptyState({ title, description, action, icon = "📭" }: Props) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <span className="text-6xl mb-4">{icon}</span>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
            {description && <p className="text-gray-500 text-sm max-w-xs mb-6">{description}</p>}
            {action && (
                <button
                    onClick={action.onClick}
                    className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
}
