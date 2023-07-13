import { Avatar, Card } from "antd";

interface UserCardProps {
  sender: string;
  handle: string;
  text: string;
  key: React.Key;
}

export default function TweetCard({ sender, handle, text }: UserCardProps) {
  return (
    <Card style={{ width: 400, margin: 10 }}>
      <Card.Meta
        avatar={
          <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />
        }
        title={
          <div>
            {sender}
            <br />
            <span style={{ fontWeight: "lighter" }}>{handle}</span>
          </div>
        }
        description={text}
      />
    </Card>
  );
}
