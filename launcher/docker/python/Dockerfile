# Build Command (from launcher)
# docker build . --no-cache -t runner-python -f docker/python/Dockerfile

FROM python:3

# Copy over test and code
RUN mkdir -p /app
RUN mkdir -p /app/tests
RUN mkdir -p /app/temp
RUN mkdir -p /app/temp/code

WORKDIR /app

COPY /src/services/testRunners/python/testingLib.py /app/testingLib.py
COPY /src/services/testRunners/python/main.py /app/main.py
