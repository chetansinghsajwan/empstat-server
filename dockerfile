FROM ubuntu:24.10

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update
RUN apt-get install -y \
    nodejs \
    npm

WORKDIR /root/src
COPY . .
RUN npm i

CMD [ "npm", "run", "start" ]
