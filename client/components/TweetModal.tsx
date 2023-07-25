"use client";
import { useState } from "react";
import { Button, Input, Modal } from "antd";
import { ProfileButton } from "./Buttons";
import { S3 } from "@aws-sdk/client-s3";

export default function TweetModal({ image, handle, JWT }: LoginDataProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [tweet, setTweet] = useState("");

  const s3 = new S3({
    endpoint: "http://localhost:9000",
    credentials: {
      accessKeyId: process.env.MINIO_ROOT_USER!,
      secretAccessKey: process.env.MINIO_ROOT_PASSWORD!,
    },
    region: "ap-northeast-1",
  });

  s3.listBuckets({}).then((res) => console.log(res));

  function showModal() {
    setOpen(true);
  }

  function handleModalOk() {
    setLoading(true);
    fetch(`${process.env.PUBLIC_API_URL}/tweets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JWT}`,
      },
      body: JSON.stringify({
        text: tweet,
      }),
    }).then((res) => {
      setLoading(false);
      if (res.ok) {
        setOpen(false);
        setTweet("");
      }
    });
  }

  function handleModalCancel() {
    setOpen(false);
  }

  function onTextAreaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setTweet(e.target.value);
  }

  return (
    <>
      <Button
        style={{ marginLeft: 5 }}
        type="primary"
        shape="round"
        onClick={showModal}
      >
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
          value={tweet}
        />
      </Modal>
    </>
  );
}
