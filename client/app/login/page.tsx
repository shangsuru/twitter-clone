"use client";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";

import { LoginButton, LogoutButton } from "@/components/Buttons";
import { redirect } from "next/navigation";
import { Image } from "antd";

export default function Login() {
  const { data: session } = useSession();
  const user = session?.user;

  if (user) {
    redirect("/");
  }

  useEffect(() => {
    console.log("session.user", session?.user);
  }, [session]);

  return (
    <div id="login">
      <div>
        <Image
          id="click-here"
          preview={false}
          src="/click_here.png"
          width={500}
        />
      </div>
      <div>
        <LoginButton />
      </div>
      <div>
        <Image preview={false} src="/elon.png" width={500} />
      </div>
    </div>
  );
}
