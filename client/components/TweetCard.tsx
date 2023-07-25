import { useState } from "react";
import { Avatar, Button, Card, Input } from "antd";
import Link from "next/link";

import { timeAgo } from "@/utils/utils";
import { DeleteOutlined, EditOutlined, SaveOutlined } from "@ant-design/icons";

interface TweetCardProps {
  sender: string;
  handle: string;
  text: string;
  createdAt: number;
  image: string;
  editable: boolean;
  deleteTweet?: () => void;
  JWT: string | undefined;
  tweetId: string;
  images: string[];
  key: React.Key;
}

export default function TweetCard({
  sender,
  handle,
  text,
  createdAt,
  image,
  editable,
  deleteTweet,
  JWT,
  tweetId,
  images,
}: TweetCardProps) {
  const [edit, setEdit] = useState(false);
  const [savedText, setSavedText] = useState(text);
  const [newText, setNewText] = useState(text);

  return (
    <Link href={`/profile/${handle}`} className="no-style-link">
      <Card className="card" style={{ margin: 10 }}>
        <Card.Meta
          avatar={<Avatar src={image} alt="Avatar" />}
          title={
            <div>
              {sender}
              <span style={{ marginLeft: 5 }} className="handle lighter-grey">
                @{handle}{" "}
              </span>
              <span style={{ float: "right" }} className="lighter-grey">
                {timeAgo(createdAt)}
              </span>
            </div>
          }
          description={
            <div className="black">
              {editable && edit ? (
                <Input.TextArea
                  onChange={(e) => setNewText(e.target.value)}
                  value={newText}
                />
              ) : (
                savedText
              )}
            </div>
          }
        />
        {editable && (
          // Edit Icon Button and Delete Icon Button
          <div id="edit-tweets">
            <Button
              size="small"
              shape="round"
              onClick={() => {
                if (edit) {
                  setSavedText(newText);
                  fetch(`${process.env.PUBLIC_API_URL}/tweets/${tweetId}`, {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${JWT}`,
                    },
                    body: JSON.stringify({
                      text: newText,
                    }),
                  });
                }
                setEdit(!edit);
              }}
            >
              {edit ? <SaveOutlined /> : <EditOutlined />}
            </Button>
            <Button
              size="small"
              type="primary"
              shape="round"
              danger
              onClick={deleteTweet}
            >
              <DeleteOutlined />
            </Button>
          </div>
        )}

        {images && (
          <div style={{ marginTop: 10 }}>
            {images.map((image) => (
              <img
                key={image}
                src={image}
                alt="Tweet Image"
                style={{ width: "100%", height: "auto" }}
              />
            ))}
          </div>
        )}
      </Card>
    </Link>
  );
}
