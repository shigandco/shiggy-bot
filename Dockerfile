FROM node:18

RUN apt-get update && \
  apt-get install -y python3 build-essential && \
  apt-get purge -y --auto-remove

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

ENV ENABLE_HEALTHCHECK=true
RUN yarn run build


ENTRYPOINT [ "yarn", "run", "start" ]
