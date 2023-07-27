"use client";
import { useSession } from "next-auth/react";
import { LoginButton } from "@/components/Buttons";
import { redirect } from "next/navigation";
import { Image } from "antd";
import { AntdStyle } from "../AntdStyle";

export default function Login() {
  const { data: session } = useSession();

  if (session && session.user) {
    redirect("/");
  }

  return (
    <AntdStyle>
      <div id="login">
        <div>
          <Image
            id="click-here"
            preview={false}
            src="/click_here.png"
            width={500}
            alt="Click here"
          />
        </div>
        <div>
          <LoginButton />
        </div>
        <div>
          <Image preview={false} src="/elon.png" width={500} alt="Elon" />
        </div>
      </div>
    </AntdStyle>
  );
}
