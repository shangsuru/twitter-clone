import { Avatar, Card } from "antd";
import Link from "next/link";

import { timeAgo } from "@/utils/utils";

interface TweetCardProps {
  sender: string;
  handle: string;
  text: string;
  created_at: number;
  key: React.Key;
}

export default function TweetCard({
  sender,
  handle,
  text,
  created_at,
}: TweetCardProps) {
  return (
    <Link href="/profile" className="no-style-link">
      <Card style={{ width: 400, margin: 10 }}>
        <Card.Meta
          avatar={
            <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />
          }
          title={
            <div>
              {sender}
              <span
                style={{ marginLeft: 5, fontWeight: "lighter", color: "grey" }}
              >
                {handle}{" "}
              </span>
              <span
                style={{ float: "right", fontWeight: "lighter", color: "grey" }}
              >
                {timeAgo(created_at)}
              </span>
            </div>
          }
          description={<div style={{ color: "black" }}>{text}</div>}
        />
      </Card>
    </Link>
  );
}
