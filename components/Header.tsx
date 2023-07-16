"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, Button, Input, Modal } from "antd";

export default function Header() {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  function showModal() {
    setOpen(true);
  }

  function handleModalOk() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
  }

  function handleModalCancel() {
    setOpen(false);
  }

  function onTextAreaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    console.log("Change:", e.target.value);
  }

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
        <Link href="/profile">
          <Avatar
            src="https://yt3.googleusercontent.com/6FqcWoHZvrZixaGi1S3Re3Z90SCS3iq2_36hQSnSHQPtQVVkywH8WKka53MiBYBSP6DmqM-g9w=s900-c-k-c0x00ffffff-no-rj"
            className="avatar"
          />
        </Link>
        <Button type="primary" shape="round" onClick={showModal}>
          Tweet
        </Button>{" "}
        <Modal
          open={open}
          title={
            <div>
              <Avatar
                src="https://yt3.googleusercontent.com/6FqcWoHZvrZixaGi1S3Re3Z90SCS3iq2_36hQSnSHQPtQVVkywH8WKka53MiBYBSP6DmqM-g9w=s900-c-k-c0x00ffffff-no-rj"
                className="avatar"
              />

              <span>What's happening?</span>
            </div>
          }
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          footer={[
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={handleModalOk}
            >
              Tweet
            </Button>,
          ]}
        >
          <Input.TextArea
            id="tweet-text-area"
            showCount
            maxLength={200}
            onChange={onTextAreaChange}
            placeholder="..."
          />
        </Modal>
      </div>
    </div>
  );
}
