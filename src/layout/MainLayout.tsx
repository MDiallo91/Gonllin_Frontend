import Navigation from "../ui/component/navigation/navigation";
import Footer from "../ui/component/footer/Footer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
     <Navigation />
      <main >{children}</main>
      <Footer/>

    </>
  );
}
