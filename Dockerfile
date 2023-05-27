FROM node:lts-alpine3.17

COPY . /app
WORKDIR /app

RUN npm install
RUN npx tsc

CMD ["/bin/sh", "-c", "node dist/index.js"]