"use client";
import { useState } from "react";
import { Button, Input, Modal, Upload } from "antd";
import { ProfileButton } from "./Buttons";
import { PlusOutlined } from "@ant-design/icons";
import type { RcFile, UploadProps } from "antd/es/upload";
import type { UploadFile } from "antd/es/upload/interface";
import api from "@/utils/api";

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export default function TweetModal({ image, handle, JWT }: LoginDataProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [tweet, setTweet] = useState("");

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  function postTweet() {
    api(
      "tweets",
      "POST",
      {
        text: tweet,
        images: fileList.map((file) => {
          return {
            name: file.name,
            body: file.base64,
          };
        }),
      },
      JWT
    ).then((res) => {
      setLoading(false);
      if (res.ok) {
        setOpen(false);
        setTweet("");
        setFileList([]);
      }
    });
  }

  function showModal() {
    setOpen(true);
  }

  async function handleModalOk() {
    setLoading(true);

    function getBase64(file: RcFile) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
      });
    }

    for (let file of fileList) {
      file.base64 = (await getBase64(file.originFileObj!)) as string;
    }

    postTweet();
  }

  function handleModalCancel() {
    setOpen(false);
  }

  function onTextAreaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setTweet(e.target.value);
  }

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

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
          style={{ marginBottom: 30 }}
        />
        <Upload
          accept="image/png, image/jpeg"
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          customRequest={({ onSuccess }) => {
            setTimeout(() => {
              if (onSuccess) {
                onSuccess("ok");
              }
            }, 500);
          }}
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal
          open={previewOpen}
          title={previewTitle}
          footer={null}
          onCancel={handleCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </Modal>
    </>
  );
}
