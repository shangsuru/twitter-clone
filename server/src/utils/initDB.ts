import User from "../models/User";

interface UserData {
  username: string;
  handle: string;
  bio?: string;
  website?: string;
  location?: string;
  image: string;
  createdAt: number;
}

const users: UserData[] = [
  {
    username: "Gynvael Coldwind",
    handle: "gynvael",
    bio: "security researcher/programmer. DragonSector CTF. youtube.com/@GynvaelEN",
    image: "https://avatars.githubusercontent.com/u/1008844?v=4",
    createdAt: 1689744411,
  },
  {
    username: "John Hammond",
    handle: "_JohnHammond",
    bio: "Hacker. Friend. Cybersecurity Researcher",
    image:
      "https://yt3.googleusercontent.com/6FqcWoHZvrZixaGi1S3Re3Z90SCS3iq2_36hQSnSHQPtQVVkywH8WKka53MiBYBSP6DmqM-g9w=s900-c-k-c0x00ffffff-no-rj",
    createdAt: 1689744411,
  },
  {
    username: "Yaron (Ron) Minsky",
    handle: "yminsky",
    bio: "Occasional OCaml programmer. Host of @signalsthreads",
    image:
      "https://pbs.twimg.com/profile_images/1005815547475488769/qprnh4KJ_400x400.jpg",
    createdAt: 1689744411,
  },
  {
    username: "DevSecCon",
    handle: "devseccon",
    bio: "Community for developers, operators & security people to share their views & practices on DevSecOps",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6abQ9sZKXbGOcHVa5jDVubxnqrNibAXYdh-iXMQlu5Wro2-U8biHtVOpSjHZtvnaPSFg&usqp=CAU",
    createdAt: 1689744411,
  },
  {
    username: "Clint Gibler",
    handle: "clintgibler",
    bio: "Head of Security Research @semgrep. Creator of tldrsec.com newsletter",
    image:
      "https://pbs.twimg.com/profile_images/860562378441740288/MgPA8UqM_400x400.jpg",
    createdAt: 1689744411,
  },
];

export default function addDummyData() {
  users.forEach((user) => {
    const newUser = new User(user);
    newUser.save().then((user) => {
      console.log(user);
    });
  });
}
