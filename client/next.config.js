/** @type {import('next').NextConfig} */

const throwIfNot = function (obj, prop, msg) {
  if (obj[prop] === undefined || obj[prop] === null) {
    throw new Error(msg || `Environment is missing variable ${prop}`);
  } else {
    return obj[prop];
  }
};

[
  "GOOGLE_ID",
  "GOOGLE_SECRET",
  "NEXTAUTH_SECRET",
  "NEXT_PUBLIC_JWT_SECRET_KEY",
  "NEXTAUTH_URL",
  "PUBLIC_API_URL",
].forEach((v) => {
  throwIfNot(process.env, v);
});

const nextConfig = {
  reactStrictMode: true,
  env: {
    GOOGLE_ID: process.env.GOOGLE_ID,
    GOOGLE_SECRET: process.env.GOOGLE_SECRET,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXT_PUBLIC_JWT_SECRET_KEY: process.env.NEXT_PUBLIC_JWT_SECRET_KEY,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION,
    PUBLIC_API_URL: process.env.PUBLIC_API_URL,
  },
};

module.exports = nextConfig;
