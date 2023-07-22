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
      <Card className="card">
        <Card.Meta
          avatar={
            <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />
          }
          title={
            <div>
              {username}
              <br />
              <span className="lighter-grey">{handle}</span>
            </div>
          }
          description={<div className="black">{bio}</div>}
        />
      </Card>
    </Link>
  );
}
