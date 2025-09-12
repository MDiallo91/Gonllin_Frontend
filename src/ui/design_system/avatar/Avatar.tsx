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
    sizeAvatar = "w-35 h-35";
    break;
    case "medium":
      sizeAvatar ="w-50 h-50";
      break;
    case "large":
      sizeAvatar = "w-120 h-120";
      break;
  }

  return (
    <div className={clsx(sizeAvatar, "rounded-full flex items-center ")}>
      <img src={src} alt={alt} className="object-cover object-center rounded-full" />
    </div>
  );
}

export default Avatar;
