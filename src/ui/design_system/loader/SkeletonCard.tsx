export default function SkeletonCard({ lines = 3 }: { lines?: number }) {
    return (
        <div className="bg-white rounded-xl p-5 shadow-sm animate-pulse">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
            </div>
            <div className="space-y-2">
                {Array.from({ length: lines }).map((_, i) => (
                    <div key={i} className={`h-3 bg-gray-200 rounded ${i === lines - 1 ? "w-2/3" : "w-full"}`} />
                ))}
            </div>
        </div>
    );
}
