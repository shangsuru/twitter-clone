"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import TweetModal from "./TweetModal";
import { LogoutButton, ProfileButton } from "./Buttons";

export default function Header({ image }: { image: string }) {
  return (
    <div style={{ position: "relative" }}>
      <div id="twitter-logo-container">
        <Link href="/">
          <Image
            id="twitter-logo"
            src="/twitter_logo.png"
            width={80}
            height={60}
            alt="Twitter Logo"
          />
        </Link>
      </div>
      <div id="profile-icon-tweet-button">
        {usePathname() == "/profile" ? (
          <LogoutButton />
        ) : (
          <>
            <ProfileButton image={image} />
            <TweetModal image={image} />
          </>
        )}
      </div>
    </div>
  );
}
