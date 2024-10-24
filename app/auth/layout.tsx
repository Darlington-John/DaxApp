import Image from "next/image";
import Link from "next/link";
import me from '~/public/images/me.png'
import doodle from '~/public/images/doodle.jpg'
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main  className='relative flex items-center justify-center h-screen w-full  px-2 ' >
     <Link href="/" className="flex  items-center text-3xl font-[800] md:text-2xl  2xs:shrink-0  absolute top-3 left-4 z-40 bg-darkBlue p-2 rounded-md gap-1">

<Image src={me} alt="" className="w-5 xs:w-4 xs:w-3"/>

<h1 className="font-bold  font-[family-name:var(--font-mulish-bold)] text-blue text-2xl  xs:text-xl">
DaxApp
</h1>
</Link>
<Image    src={doodle}
fill
priority={true} alt='' className='object-cover'/>
      {children}

    </main>
  );
}


