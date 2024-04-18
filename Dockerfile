FROM node:18

RUN npm i -g pnpm@9.0.1

RUN apt-get update && \
  apt-get install -y python3 build-essential && \
  apt-get purge -y --auto-remove

WORKDIR /app

COPY package.json pnpm.lock ./
RUN pnpm install --frozen-lockfile

COPY . .

ENV ENABLE_HEALTHCHECK=true
RUN pnpm run build


ENTRYPOINT [ "pnpm", "run", "start" ]
