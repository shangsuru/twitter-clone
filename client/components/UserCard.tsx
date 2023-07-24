import { Avatar, Card } from "antd";
import Link from "next/link";

interface UserCardProps {
  username: string;
  handle: string;
  bio: string;
  image: string;
  key: React.Key;
}

export default function UserCard({
  username,
  handle,
  bio,
  image,
}: UserCardProps) {
  return (
    <Link href={`/profile/${handle}`} className="no-style-link">
      <Card className="card">
        <Card.Meta
          avatar={<Avatar src={image} alt="Avatar" />}
          title={
            <div>
              {username}
              <br />
              <span className="lighter-grey">@{handle}</span>
            </div>
          }
          description={<div className="black">{bio}</div>}
        />
      </Card>
    </Link>
  );
}
