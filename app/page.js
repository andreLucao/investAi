"use client"
import Image from "next/image";
import { useState } from "react";
import { redirect } from 'next/navigation';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  if (isLoggedIn) {
    redirect('/fluxo-inicial/primeira-etapa');
  } else {
    redirect('/chat-perguntas');
  }

  return null;
}