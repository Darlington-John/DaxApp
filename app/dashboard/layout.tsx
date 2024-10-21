import MobileHeader from "./components/header";
import Overlay from "./components/overlay";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="h-screen overflow-hidden"
    >
<MobileHeader/>
<Overlay/>
      {children}

    </main>
  );
}


