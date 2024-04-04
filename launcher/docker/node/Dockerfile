# Build Command (from launcher)
# docker build . --no-cache -t runner-node -f docker/node/Dockerfile

FROM node:20

# Create app directory
RUN mkdir -p /app
RUN mkdir -p /app/src
RUN mkdir -p /app/src/tests
RUN mkdir -p /app/src/temp
RUN mkdir -p /app/src/temp/code

WORKDIR /app

# Copy code running files
COPY /src/services/testRunners/node/package.json /app
COPY /src/services/testRunners/node/package-lock.json /app
COPY /src/services/testRunners/node/testingLib.js /app/src/testingLib.js
COPY /src/services/testRunners/node/main.js /app/src/index.js

RUN npm install
