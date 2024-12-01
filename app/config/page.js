"use client";
import Profile from "../components/profile";
import SideBar from "../components/SideBar";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();

  return (
    <div className="flex h-screen relative">
      <SideBar expanded={expanded} setExpanded={setExpanded} />
      
      <button
        onClick={() => router.push("/dashboard")}
        className="absolute top-4 left-4 
          sm:top-6 sm:left-6 
          md:top-4 md:left-2 
          lg:top-20 lg:left-[calc(24rem)] 
          w-10 h-10 
          sm:w-12 sm:h-12 
          md:w-14 md:h-14 
          lg:w-16 lg:h-16 
          bg-purple-600 text-white 
          rounded-full 
          hover:bg-purple-700 
          transition 
          z-10 
          flex 
          items-center 
          justify-center"
        aria-label="Voltar para o dashboard"
      >
        <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
      </button>
      
      <div className="flex-1 p-4">
        <Profile />
      </div>
    </div>
  );
}