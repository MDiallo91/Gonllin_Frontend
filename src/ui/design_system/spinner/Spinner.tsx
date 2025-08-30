import { ClipLoader, DotLoader, HashLoader, MoonLoader, PropagateLoader, PuffLoader } from "react-spinners";

interface Props {
  size?: "small" | "medium" | "large";
  variant?: "primary" | "white";
}

function Spinner({ size = "medium", variant = "primary" }: Props) {
  // map taille "small | medium | large" vers des pixels
  const sizeMap = {
    small: 25,
    medium: 35,
    large: 60
  };

  // map variant vers couleurs
  const colorMap = {
    primary: "#C7196D", // correspond à ta couleur primaire
    white: "#ffffff"
  };

  return (
    <ClipLoader
      size={sizeMap[size]}     // taille en pixels
      color={colorMap[variant]} // couleur
      loading={true}
      speedMultiplier={1}
    />
  );
}

export default Spinner;
