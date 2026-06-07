interface Props {
    page: number;
    pages: number;
    onPageChange: (p: number) => void;
}

export default function Pagination({ page, pages, onPageChange }: Props) {
    if (pages <= 1) return null;

    const items: (number | "...")[] = [];
    if (pages <= 7) {
        for (let i = 1; i <= pages; i++) items.push(i);
    } else {
        items.push(1);
        if (page > 3) items.push("...");
        for (let i = Math.max(2, page - 1); i <= Math.min(pages - 1, page + 1); i++) items.push(i);
        if (page < pages - 2) items.push("...");
        items.push(pages);
    }

    return (
        <div className="flex items-center justify-center gap-1 mt-6">
            <button disabled={page === 1} onClick={() => onPageChange(page - 1)} className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition">
                ← Préc
            </button>
            {items.map((item, i) =>
                item === "..." ? (
                    <span key={i} className="px-2 text-gray-400">…</span>
                ) : (
                    <button
                        key={i}
                        onClick={() => onPageChange(item)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition ${item === page ? "bg-primary text-white" : "border border-gray-200 hover:bg-gray-50 text-gray-700"}`}
                    >
                        {item}
                    </button>
                )
            )}
            <button disabled={page === pages} onClick={() => onPageChange(page + 1)} className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition">
                Suiv →
            </button>
        </div>
    );
}
