import { Avatar, Card } from "antd";
import Link from "next/link";

interface UserCardProps {
  username: string;
  handle: string;
  bio: string;
  key: React.Key;
}

export default function UserCard({ username, handle, bio }: UserCardProps) {
  return (
    <Link href="/profile" className="no-style-link">
      <Card style={{ width: 400, margin: 10 }}>
        <Card.Meta
          avatar={
            <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />
          }
          title={
            <div>
              {username}
              <br />
              <span style={{ fontWeight: "lighter", color: "grey" }}>
                {handle}
              </span>
            </div>
          }
          description={<div style={{ color: "black" }}>{bio}</div>}
        />
      </Card>
    </Link>
  );
}
