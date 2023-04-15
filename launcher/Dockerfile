# Build command
# docker build . --no-cache -t nodev1

FROM node:18

# Create app directory
RUN mkdir -p /app
RUN mkdir -p /app/src
RUN mkdir -p /app/src/tests
RUN mkdir -p /app/src/temp
RUN mkdir -p /app/src/temp/code

WORKDIR /app

# Install app dependenices
COPY ./package.json /app
COPY ./package-lock.json /app
# COPY ./src/services/testingLibrary.js /app/src/testingLibrary.js
RUN npm install 

# Copy code runner file
COPY /src/services/runner.js /app/src/index.js

