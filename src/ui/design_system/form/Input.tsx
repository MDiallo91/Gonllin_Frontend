import clsx from "clsx";
import Typography from "../typography/typography";


interface Props{
    isLoading:boolean;
    placeholder:string;
    type?:"text"|"email"|"password"|"radio"|"textarea";
    register:any;
    errors:any;
    errorMsg:string;
    id:string;
    required?:boolean;
    isAutocompleted?:boolean;
}


function Input({isLoading,placeholder,register,type="text",errors,errorMsg="Ce champ est aubligatoir",id,required=true,isAutocompleted=false}:Props) {
    return (
        <div>
            <input type={type}
                placeholder={placeholder}
                className={clsx(
                    errors[id] ? "placeholder-alert-danger text-alert-danger" : "placeholder-gray-600",
                    isLoading && "cursor-not-allowed",
                     "w-full p-3  font-light border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary")}
                disabled={isLoading}
                {...register(id, {
                    required: {
                        value: required,
                        message: errorMsg
                    }

                })}
                autoComplete={isAutocompleted ? "on" : "off"}
            />
            {errors[id] && (
                <Typography variant="body-base" component="div" theme="danger">
                    {errors[id]?.message}
                </Typography>
            )}
        </div>
    )
}

export default Input
