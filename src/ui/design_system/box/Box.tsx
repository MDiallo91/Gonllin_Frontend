import clsx from "clsx"

interface Props{
    children:React.ReactNode,
    className?:string
}
function Box({children,className}:Props) {
  return (
    <div className={clsx("w-full border border-gray-200 p-5 md:p-9 bg-white rounded",className)}>
      {children}
    </div>
  )
}

export default Box
