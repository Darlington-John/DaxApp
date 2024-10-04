"use client"
import { useRouter } from "next/navigation";
import Groups from "./sections/home/groups";
import Hero from "./sections/home/hero";
import People from "./sections/home/people";
import SpeakFreely from "./sections/home/speak-freely";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard'); 
    }
  }, [router]);
  return (
   <main>
<Hero/>
<People/>
<SpeakFreely/>
<Groups/>
   </main>
  );
}
