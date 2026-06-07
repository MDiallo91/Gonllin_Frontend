interface Props {
    value: number;
    onChange?: (v: number) => void;
    size?: "sm" | "md" | "lg";
    readonly?: boolean;
}

const sizes = { sm: "text-sm", md: "text-xl", lg: "text-3xl" };

export default function StarRating({ value, onChange, size = "md", readonly = false }: Props) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={readonly}
                    onClick={() => onChange?.(star)}
                    className={`${sizes[size]} transition-colors ${!readonly ? "cursor-pointer hover:scale-110" : "cursor-default"} ${star <= value ? "text-yellow-400" : "text-gray-300"}`}
                >
                    ★
                </button>
            ))}
        </div>
    );
}
