import { useState } from "react";
import { Avatar, Button, Divider, Modal, Input } from "antd";

export default function EditProfileModal() {
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

  return (
    <>
      <Button style={{ marginTop: 10 }} shape="round" onClick={showModal}>
        Edit Profile
      </Button>
      <Modal
        open={open}
        title={
          <div>
            <Avatar
              src="https://yt3.googleusercontent.com/6FqcWoHZvrZixaGi1S3Re3Z90SCS3iq2_36hQSnSHQPtQVVkywH8WKka53MiBYBSP6DmqM-g9w=s900-c-k-c0x00ffffff-no-rj"
              className="avatar"
            />

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
          placeholder="John Hammond"
          bordered={false}
        />
        <Divider />
        <Input
          className="simple-label"
          addonBefore="Bio"
          placeholder="Add a bio to your profile"
          bordered={false}
        />
        <Divider />
        <Input
          className="simple-label"
          addonBefore="Location"
          placeholder="Add your location"
          bordered={false}
        />
        <Divider />
        <Input
          className="simple-label"
          addonBefore="Website"
          placeholder="Add your website"
          bordered={false}
        />
      </Modal>
    </>
  );
}
