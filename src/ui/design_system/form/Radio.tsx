import clsx from "clsx";
import Typography from "../typography/typography";

interface Props {
    isLoading: boolean;
    label: string; // pour afficher à côté du radio
    value: string;
    register: any;
    errors: any;
    errorMsg?: string;
    id: string;
    required?: boolean;
}

function Radio({
    isLoading,
    label,
    value,
    register,
    errors,
    errorMsg = "Ce champ est obligatoire",
    id,
    required = true,
}: Props) {
    return (
        <label htmlFor={`${id}-${value}`} className="flex items-center justify-between gap-2 w-full p-3  font-light border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary">
            <label htmlFor={`${id}-${value}`} className="text-sm text-gray-700">
                {label}
            </label>
            <input
                type="radio"
                value={value}
                id={`${id}-${value}`} //  identifiant unique
                className={clsx(
                    "h-4 w-4 text-primary border-gray-300 focus:ring-primary",
                    isLoading && "cursor-not-allowed"
                )}
                disabled={isLoading}
                {...register(id, {
                    required: { value: required, message: errorMsg },
                })}
            />


            {errors[id] && (
                <Typography variant="body-base" component="div" theme="danger">
                    {errors[id]?.message}
                </Typography>
            )}
        </label>
    );
}

export default Radio;
