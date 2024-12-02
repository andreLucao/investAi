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
      

      <div className="absolute top-6 right-4 z-10 sm:right-8 md:right-12 lg:right-16">
        <button
          onClick={() => router.push("/dashboard")}
          className="
            w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16
            bg-purple-600 text-white
            rounded-full
            hover:bg-purple-700
            transition
            flex
            items-center
            justify-center
            shadow-md
            active:scale-95
          "
          aria-label="Voltar para o dashboard"
        >
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <Profile />
      </div>
    </div>
  );
}