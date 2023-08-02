FROM node:18-alpine as node 
FROM nginx:alpine

COPY --from=node /usr/lib /usr/lib
COPY --from=node /usr/local/lib /usr/local/lib
COPY --from=node /usr/local/include /usr/local/include
COPY --from=node /usr/local/bin /usr/local/bin

RUN node -v
RUN npm -v

WORKDIR /
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

ENV AWS_REGION=ap-northeast-1
ENV FRONTEND_URL=https://henryhelm.intern.aws.prd.demodesu.com
ENV S3_BUCKET_NAME=intern-henryhelm
ENV NODE_ENV=production
ENV NEXTAUTH_URL=https://henryhelm.intern.aws.prd.demodesu.com
ENV PUBLIC_API_URL=https://henryhelm.intern.aws.prd.demodesu.com

WORKDIR /client
COPY ./client/package*.json ./
RUN npm i 
COPY ./client/ ./
RUN npm run build 


WORKDIR /server
COPY ./server/package*.json ./
RUN npm i
COPY ./server/ ./
RUN npm run build

WORKDIR /
COPY ./start.sh ./start.sh
EXPOSE 80

CMD [ "sh", "start.sh" ]