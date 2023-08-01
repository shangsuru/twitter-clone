cd server
NODE_ENV=production npm run start &
cd ../client
cd client
npm run start &
nginx -g daemon off