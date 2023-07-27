"use client";
import { useState } from "react";
import { Avatar, Button, Divider, Modal, Input } from "antd";

interface EditProfileModalProps {
  image: string;
  username: string;
  bio: string | undefined;
  location: string | undefined;
  website: string | undefined;
  JWT: string;
  updateState: (
    newUsername: string,
    newBio: string,
    newLocation: string,
    newWebsite: string
  ) => void;
}

export default function EditProfileModal({
  image,
  username,
  bio,
  location,
  website,
  JWT,
  updateState,
}: EditProfileModalProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [inputName, setInputName] = useState(username);
  const [inputBio, setInputBio] = useState(bio);
  const [inputLocation, setInputLocation] = useState(location);
  const [inputWebsite, setInputWebsite] = useState(website);

  function showModal() {
    setOpen(true);
  }

  function handleModalOk() {
    setLoading(true);
    website = inputWebsite!.replace("https://", "");
    fetch(`${process.env.PUBLIC_API_URL}/backend/users/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JWT}`,
      },
      body: JSON.stringify({
        username: inputName,
        bio: inputBio,
        website: website,
        location: inputLocation,
      }),
    }).then((res) => {
      setLoading(false);
      if (res.ok) {
        updateState(inputName, inputBio!, inputLocation!, website!);
        setOpen(false);
      }
    });
  }

  function handleModalCancel() {
    setOpen(false);
  }

  return (
    <>
      <Button style={{ marginTop: 10 }} shape="round" onClick={showModal}>
        Edit Profile
      </Button>
      <Modal
        open={open}
        title={
          <div>
            <Avatar src={image} className="avatar" alt="Avatar" />

            <span>Edit Profile</span>
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
            Save
          </Button>,
        ]}
      >
        <Divider />
        <Input
          className="simple-label"
          addonBefore="Name"
          placeholder="Add your name"
          value={inputName}
          bordered={false}
          onChange={(e) => {
            setInputName(e.target.value);
          }}
        />
        <Divider />
        <Input
          className="simple-label"
          addonBefore="Bio"
          placeholder="Add a bio to your profile"
          value={inputBio}
          bordered={false}
          onChange={(e) => {
            setInputBio(e.target.value);
          }}
        />
        <Divider />
        <Input
          className="simple-label"
          addonBefore="Location"
          placeholder="Add your location"
          value={inputLocation}
          bordered={false}
          onChange={(e) => {
            setInputLocation(e.target.value);
          }}
        />
        <Divider />
        <Input
          className="simple-label"
          addonBefore="Website"
          placeholder="Add your website"
          value={inputWebsite}
          bordered={false}
          onChange={(e) => {
            setInputWebsite(e.target.value);
          }}
        />
      </Modal>
    </>
  );
}
