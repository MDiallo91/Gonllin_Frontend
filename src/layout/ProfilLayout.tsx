import ProfilNavbar from "../ui/component/navBar/ProfilNavbar";


export default function ProfilLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
     <ProfilNavbar />
      <main >{children}</main>
    </>
  );
}
