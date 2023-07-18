import { Avatar, Card } from "antd";
import Link from "next/link";

import { timeAgo } from "@/utils/utils";

interface TweetCardProps {
  sender: string;
  handle: string;
  text: string;
  createdAt: number;
  key: React.Key;
}

export default function TweetCard({
  sender,
  handle,
  text,
  createdAt,
}: TweetCardProps) {
  return (
    <Link href="/profile" className="no-style-link">
      <Card className="card">
        <Card.Meta
          avatar={
            <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />
          }
          title={
            <div>
              {sender}
              <span style={{ marginLeft: 5 }} className="handle lighter-grey">
                {handle}{" "}
              </span>
              <span style={{ float: "right" }} className="lighter-grey">
                {timeAgo(createdAt)}
              </span>
            </div>
          }
          description={<div className="black">{text}</div>}
        />
      </Card>
    </Link>
  );
}
