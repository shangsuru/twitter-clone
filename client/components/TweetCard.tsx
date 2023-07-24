import { Avatar, Card } from "antd";
import Link from "next/link";

import { timeAgo } from "@/utils/utils";

interface TweetCardProps {
  sender: string;
  handle: string;
  text: string;
  createdAt: number;
  image: string;
  key: React.Key;
}

export default function TweetCard({
  sender,
  handle,
  text,
  createdAt,
  image,
}: TweetCardProps) {
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
          description={<div className="black">{text}</div>}
        />
      </Card>
    </Link>
  );
}
