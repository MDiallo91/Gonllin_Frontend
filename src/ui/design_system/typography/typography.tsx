import clsx from "clsx";

interface Props {
  variant?: 
    | "display"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "lead"
    | "body-lg"
    | "body-base"
    | "body-sm"
    | "caption1"
    | "caption2"
    | "caption3"
    | "caption4";
    component?:"h1"|"h2"|"h3"|"h4"|"h5"|"div"|"p"|"span";
    theme?:'black'|"white"|"primary"|"secondary";
    weight?:"regular"|"medium";
    className?:string;
    children: React.ReactNode;
}

const Typography = ({ variant="h3",className,theme="black",weight="regular",component:Component="div" ,children}: Props) => {
  
  let variantStyle:string="",colorStyle:string="";
   
  switch (theme) {
    case "black": //default
        colorStyle="text-primary-900"
      break;
    case "white":
        colorStyle="text-primary-600"
      break;
    case "primary":
        colorStyle="gry-300"
      break;
    case "secondary":
      colorStyle=""
    break;
  
    default:
      break;
  }

  switch (variant) {
    case "display":
      variantStyle="text-8xl"
      break;
    case "h1":
      variantStyle="text-7xl"
      break;
    case "h2":
    variantStyle="text-xl"
    break;
    case "h3": //Defaut
      variantStyle="text-5xl"
      break;
    case "h4":
      variantStyle="text-4xl"
      break;
    case "h5":
      variantStyle="text-3xl"
      break;
    case "lead":
      variantStyle="text-2xl"
      break;
    case "body-lg":
      variantStyle="text-lg"
      break;
    case "body-base":
      variantStyle="text-sm"
      break;
  
  }
  return (        
      <Component className={clsx(variantStyle,colorStyle, weight==="medium"&&"font-medium",className,colorStyle, )}> {children} </Component>
  );
};

export default Typography;
