FROM ubuntu:24.10 AS bare

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update
RUN apt-get install -y \
    nodejs \
    npm

WORKDIR /root/src
COPY package.json .
RUN npm install -g

FROM bare AS devenv

RUN apt-get install -y \
    git \
    vim

RUN git config --global core.editor vim

FROM bare AS run

WORKDIR /root/src
COPY . .

CMD [ "npm", "run", "start" ]
