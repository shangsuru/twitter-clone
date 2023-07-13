import { Avatar, Card } from "antd";

interface UserCardProps {
  username: string;
  handle: string;
  bio: string;
  key: React.Key;
}

export default function UserCard({ username, handle, bio }: UserCardProps) {
  return (
    <Card style={{ width: 400, margin: 10 }}>
      <Card.Meta
        avatar={
          <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />
        }
        title={
          <div>
            {username}
            <br />
            <span style={{ fontWeight: "lighter" }}>{handle}</span>
          </div>
        }
        description={bio}
      />
    </Card>
  );
}
