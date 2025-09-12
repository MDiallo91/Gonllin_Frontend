import clsx from "clsx";

interface Props {
  size?: "small" | "medium" | "large";
  variant?: "primary" | "white";
}

function Spinner({ size = "medium", variant = "primary" }: Props) {
  // map taille "small | medium | large" vers des pixels pour ClipLoader
  const sizeMap = {
    small: 25,
    medium: 35,
    large: 60,
  };

  // map taille pour le <span> tailwind
  const tailwindSizeMap = {
    small: "h-6 w-6 border-2",
    medium: "h-12 w-12 border-4",
    large: "h-16 w-16 border-4",
  };


  // map variant pour le span tailwind
  const tailwindColorMap = {
    primary: "border-primary border-t-transparent",
    white: "border-white border-t-transparent",
  };

  return (
    <>
      {/* spinner avec tailwind */}
      <span
        className={clsx(
          "animate-spin rounded-full",
          tailwindSizeMap[size],
          tailwindColorMap[variant]
        )}
      ></span>
      {/* <ClipLoader
        size={sizeMap[size]}
        color={colorMap[variant]}
        loading={true}
        speedMultiplier={1}
      /> */}

     
  </>
  );
}

export default Spinner;
