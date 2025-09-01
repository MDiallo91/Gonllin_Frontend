import clsx from "clsx"
import Spinner from "../spinner/Spinner"


interface Props {
    size?:"small"|"medium"|"large"
    variant?:"accent"|"secondary"|"outline"|"disabled"|"icon"
    icon?:{icon:React.ElementType}
    iconTheme?:"accent"|"secondary"|"gray"
    iconPosition?:"left"|"right"
    disabled?:boolean
    isLoading?:boolean
    children?:React.ReactNode
}

function Button({
  size = "medium",
  variant = "accent",
  icon,
  iconTheme = "accent",
  iconPosition = "right",
  disabled = false,
  isLoading = false,
  children,
}: Props) {
    let variantStyle:string="";
    let sizeStyle:string="";
    let icoSize:number=0;

    switch (variant) {
        case "accent": //default
            variantStyle="bg-primary hover:bg-primary-400 text-white rounded"
            break;
        case "secondary":
            variantStyle="bg-secondary-100 hover:bg-gray-300 text-secondary-600 rounded"
            break;
        case "outline":
            variantStyle="bg-white hover:bg-gray-500/50 border border-gray-500 text-gray-900 rounded"
            break;
        case "disabled":
            variantStyle="bg-gray-200 border border-gray-500 text-gray-600 rounded cursor-not-allowed"
            break;
        case "icon":
            if(iconTheme=="accent"){ //default
            variantStyle="bg-primary hover:bg-primary-400 text-white rounded-full"
            }
            if(iconTheme=="secondary"){
            variantStyle="bg-secondary-100 hover:bg-gray-300 text-secondary-700 rounded-full"
            }
            if(iconTheme=="gray"){
            variantStyle="bg-gray-700 hover:bg-gray-600 border border-gray-500 text-white rounded-full"
            }
            
            break;
    }

    //determiner la taille de l'icon du bouton
    switch (size) {
        case "small":
            sizeStyle=`text-[14px] ${variant=="icon"? "flex items-center justify-center  w-[40px] h-[40px] ":"px-[12px] py-[10px] font-medium"} `
            icoSize=18
            break;
        case "medium"://default
            sizeStyle=`text-[16px] font-medium ${variant=="icon"? "flex items-center  justify-center w-[50px] h-[50px] ":"px-[14px] py-[12px] "} `
            icoSize=20
            break;
        case "large":
            sizeStyle=`text-2xl font-medium ${variant=="icon"? "flex items-center justify-center  w-[55px] h-[55px] ":"px-[16px] py-[14px] "} `
            icoSize=24
            break;
    }


  return (
    <button
        type="button" 
        disabled={disabled}
        className={clsx(variantStyle,icoSize,sizeStyle, isLoading && "cursor-wait","relative")}
        onClick={()=>{
            console.log("Onclick")}}
       
      >
        {isLoading &&(
            <div className="absolute inset-0  flex items-center justify-center">
                {variant==='accent'|| variant ==="icon" ?(<Spinner variant="white" size="small"/>):(<Spinner size="small"/>)}
                
            </div>
        )}
        <div className={clsx(isLoading && "invisible")}>
            {icon && variant === "icon" ? (
                <icon.icon size={icoSize} />
            ) : (
                <div className={clsx("flex items-center gap-1")}>
                    {icon && iconPosition === "left" &&
                        <icon.icon size={icoSize} />
                    }
                    {children}
                    {icon && iconPosition === "right" &&
                        <icon.icon size={icoSize} />
                    }
                </div>
            )}

        </div>
 
    </button>
  )
}

export default Button
