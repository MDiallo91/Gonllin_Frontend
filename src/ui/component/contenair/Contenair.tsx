import clsx from "clsx";

interface Props{
    children:React.ReactNode;
    className?:string;
}


function Contenair({children,className}:Props) {
  return (
    <div
        className={clsx(className, "w-full   mx-auto  ")}
    >
      {children}
    </div>
  )
}

export default Contenair
