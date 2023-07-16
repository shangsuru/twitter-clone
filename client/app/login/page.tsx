"use client";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";

import { LoginButton, LogoutButton } from "@/components/Buttons";

export default function Login() {
  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    console.log("session.user", session?.user);
  }, [session]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "70vh",
      }}
    >
      <div>
        <div>{`${JSON.stringify(user)}`}</div>
        {user ? <div>Logged in</div> : <div>Not logged in</div>}
        {user ? <LogoutButton /> : <LoginButton />}
      </div>
    </div>
  );
}
