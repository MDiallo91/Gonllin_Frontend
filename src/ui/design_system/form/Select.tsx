import clsx from "clsx";
import Typography from "../typography/typography";

interface Props {
  isLoading: boolean;
  register: any;
  errors: any;
  errorMsg?: string;
  id: string;
  required?: boolean;
  options: { label: string; value: string }[];
}

function Select({
  isLoading,
  register,
  errors,
  errorMsg = "Ce champ est obligatoire",
  id,
  required = true,
  options,
}: Props) {
    return (
        <div>

            <select
                disabled={isLoading}
                className={clsx(
                      isLoading && "cursor-not-allowed",
                    errors[id] ? "placeholder-alert-danger text-alert-danger" : "placeholder-gray-600",
                    "w-full p-3  font-light border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                )}
                {...register(id, {
                    required: {
                        value: required,
                        message: errorMsg,
                    },
                })}
            >
                <option value="">Qui etes-vous?</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {errors[id] && (
                <Typography variant="body-base" component="div" theme="danger">
                    {errors[id]?.message}
                </Typography>

            )}

        </div>
    );
}

export default Select;
