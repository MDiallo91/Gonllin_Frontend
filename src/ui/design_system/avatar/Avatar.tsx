import clsx from "clsx";

interface Props {
  size?:  "small" | "medium" | "large"|"very-small";
  src:string;
  alt:string;
}

function Avatar({ size = "medium" ,alt,src}: Props) {
  let sizeAvatar = "";

  switch (size) {
    case "very-small":
      sizeAvatar = " w-[40px] h-[40px]";
      break;
      case "small":
     sizeAvatar = "w-[35px] h-[35px]";
    break;
    case "medium":
      sizeAvatar = "w-[50px] h-[50px]";
      break;
    case "large":
      sizeAvatar = "w-[120px] h-[120px]";
      break;
  }

  return (
    <div className={clsx(sizeAvatar, "rounded-full flex items-center border border-primary")}>
      <img src={src} alt={alt} className=" rounded-full w-full h-full" />
    </div>
  );
}

export default Avatar;
