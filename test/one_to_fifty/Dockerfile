FROM ubuntu:22.04

ENV CHOKIDAR_USEPOLLING="true"

WORKDIR /app

EXPOSE 8080

RUN apt-get update
RUN apt-get upgrade
RUN apt-get install -y curl
RUN apt-get install -y vim

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash

SHELL ["/bin/bash", "-c"]

RUN source ~/.nvm/nvm.sh

RUN source ~/.nvm/nvm.sh && nvm install v22.15.0

RUN source ~/.nvm/nvm.sh && npm -v