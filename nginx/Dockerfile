FROM node:18-alpine as node 
FROM nginx:alpine

ARG AWS_REGION
ARG FRONTEND_URL
ARG S3_BUCKET_NAME
ARG NODE_ENV
ARG NEXTAUTH_URL
ARG PUBLIC_API_URL

COPY --from=node /usr/lib /usr/lib
COPY --from=node /usr/local/lib /usr/local/lib
COPY --from=node /usr/local/include /usr/local/include
COPY --from=node /usr/local/bin /usr/local/bin

RUN node -v
RUN npm -v

WORKDIR /
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

ENV AWS_REGION=$AWS_REGION
ENV FRONTEND_URL=$FRONTEND_URL
ENV S3_BUCKET_NAME=$S3_BUCKET_NAME
ENV NODE_ENV=$NODE_ENV
ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV PUBLIC_API_URL=$PUBLIC_API_URL

WORKDIR /client
COPY ./client/package*.json ./
RUN npm i 
COPY ./client/ ./
RUN npm run build 


WORKDIR /server
COPY ./server/package*.json ./
RUN NODE_ENV=development npm i
COPY ./server/ ./
RUN npm run build

WORKDIR /
COPY ./start.sh ./start.sh
EXPOSE 80

CMD [ "sh", "start.sh" ]