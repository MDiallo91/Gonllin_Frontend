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
      sizeAvatar = "w-20 h-20";
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
    <div className={clsx(sizeAvatar, "rounded-full")}>
      <img src={src} alt={alt} className="object-cover object-center rounded-full" />
    </div>
  );
}

export default Avatar;
