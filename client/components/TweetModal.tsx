"use client";
import React, { useState } from "react";
import { Avatar, Button, Input, Modal } from "antd";
import { ProfileButton } from "./Buttons";

export default function TweetModal({
  image,
  handle,
}: {
  image: string;
  handle: string;
}) {
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
    <>
      <Button type="primary" shape="round" onClick={showModal}>
        Tweet
      </Button>{" "}
      <Modal
        open={open}
        title={
          <div>
            <ProfileButton image={image} handle={handle} />

            <span>{"What's happening?"}</span>
          </div>
        }
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        footer={[
          <Button
            key="submit"
            style={{ marginTop: 20 }}
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
    </>
  );
}
