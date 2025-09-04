

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Contenu admin */}
      <main >{children}</main>
    </>
  );
}
