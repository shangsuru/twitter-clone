import User from "../models/User";
import Tweet from "../models/Tweet";

interface UserData {
  username: string;
  handle: string;
  bio?: string;
  website?: string;
  location?: string;
  image: string;
  createdAt: number;
}

interface TweetData {
  id: string;
  handle: string;
  text: string;
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

const tweets: TweetData[] = [
  {
    id: "1",
    handle: "gynvael",
    text: "Friday was my last day at Google. I'm saddened to leave behind my team of last 12+ years, but I know Google Security is in great hands.  It's time for a short break and then I'm moving on with plans I've made long ago - my own sec research, consulting, and education company.",
    createdAt: 1689317981,
  },
  {
    id: "2",
    handle: "_JohnHammond",
    text: "For another fireworks show, Ignacio Dominguez and Carlos Polop from HALBORN showcase how dependency confusion attacks can occur with the AWS Code Artifact service -- potentially even having npm execute rogue code just upon install!",
    createdAt: 1689315000,
  },
  {
    id: "3",
    handle: "yminsky",
    text: "So...does anyone have advice for picking between the various and sundry Python type systems? mypy, pyright, pyre, pytype...how do you pick?",
    createdAt: 1689299980,
  },
  {
    id: "4",
    handle: "devseccon",
    text: "Missed the interactive workshop on OWASP TOP 10 Security API 2023 x GraphQL at DSC24? Watch now...",
    createdAt: 1681447919,
  },
  {
    id: "5",
    handle: "clintgibler",
    text: "findmytakeover scans aws, azure, and google cloud for dangling DNS records and potential subdomain takeovers #cloudsec",
    createdAt: 1586839919,
  },
];

export default function addDummyData() {
  users.forEach((user) => {
    const newUser = new User(user);
    newUser.save();
  });

  tweets.forEach((tweet) => {
    const newTweet = new Tweet(tweet);
    newTweet.save();
  });
}
