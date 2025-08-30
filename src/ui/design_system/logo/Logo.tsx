import logo  from "../../../../public/svg/logo.svg";

interface Props {
  size?: "very-small" | "small" | "medium" | "large";
}

function Logo({ size = "medium" }: Props) {
  let sizeLogo = 0;

  switch (size) {
    case "very-small":
      sizeLogo = 34;
      break;
    case "small":
      sizeLogo = 61;
      break;
    case "medium":
      sizeLogo = 88;
      break;
    case "large":
      sizeLogo = 300;
      break;
  }

  return (
    <img src={logo} alt="Logo" width={sizeLogo} height={sizeLogo} />
  );
}

export default Logo;
