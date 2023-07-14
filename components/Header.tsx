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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Image
          src="/twitter_logo.png"
          width={80}
          height={60}
          alt="Twitter Logo"
        />
      </div>
      <div style={{ position: "absolute", right: 0, top: 0 }}>
        <Link href="/profile">
          <Avatar style={{ backgroundColor: "#f56a00", marginRight: 5 }}>
            H
          </Avatar>
        </Link>
        <Button type="primary" shape="round" onClick={showModal}>
          Tweet
        </Button>
        <Modal
          open={open}
          title={
            <div>
              <Avatar style={{ backgroundColor: "#f56a00", marginRight: 5 }}>
                H
              </Avatar>
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
            showCount
            maxLength={200}
            style={{ height: 120, resize: "none", marginBottom: 20 }}
            onChange={onTextAreaChange}
            placeholder="..."
          />
        </Modal>
      </div>
    </div>
  );
}
