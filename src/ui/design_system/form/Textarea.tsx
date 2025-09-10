import clsx from "clsx";
import Typography from "../typography/typography";

interface Props {
  isLoading: boolean;
  placeholder: string;
  register: any;
  errors: any;
  errorMsg: string;
  id: string;
  required?: boolean;
  isAutocompleted?: boolean;
  rows?: number; // optionnel pour ajuster la hauteur
}

function Textarea({
  isLoading,
  placeholder,
  register,
  errors,
  errorMsg = "Ce champ est obligatoire",
  id,
  required = true,
  isAutocompleted = false,
  rows = 4,
}: Props) {
  const commonClasses = clsx(
    errors[id] ? "placeholder-alert-danger text-alert-danger" : "placeholder-gray-600",
    isLoading && "cursor-not-allowed",
    "w-full p-3 font-light border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary resize-none"
  );

  return (
    <div>
      <textarea
        placeholder={placeholder}
        className={commonClasses}
        disabled={isLoading}
        {...register(id, {
          required: { value: required, message: errorMsg },
        })}
        autoComplete={isAutocompleted ? "on" : "off"}
        rows={rows}
      />
      {errors[id] && (
        <Typography variant="body-base" component="div" theme="danger">
          {errors[id]?.message}
        </Typography>
      )}
    </div>
  );
}

export default Textarea;
