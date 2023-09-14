FROM node:18

USER runner
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

ENV ENABLE_HEALTHCHECK=true
RUN yarn run build


ENTRYPOINT [ "yarn", "run", "start" ]
