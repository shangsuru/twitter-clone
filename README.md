This is a Twitter clone implemented in Typescript!

# Architecture

## Functional Requirements

- Post a new tweet, which can include not only text but also images and URLs
- View one's own profile and the profile of other users
- Follow and unfollow users
- Get a personal feed to view every tweet from the authenticated user and the users that they follow
- View all tweets regardless if you follow that user or not
- Search for other users profiles or for tweets containing a specific term

## Non-functional requirements

- High scalability with minimum latency

## Implementation

- Language: Typescript
- React and Next.js in the frontend
- Express API in the backend
- SSO using OIDC
- Store image files in S3 using Pre-Signed URL
- Use ElasticSearch service for full text search

To simplify deployment, we serve the frontend from our backend.
During development, we use a proxy to run the frontend and backend on the same port.

![Architecture](architecture.jpg)
