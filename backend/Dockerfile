FROM node:18.17.0 AS build

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

FROM node:15.13.0

WORKDIR /app

COPY --from=build /app .

COPY db/aplikasi.db ./db/aplikasi.db

EXPOSE 3000

CMD ["node", "server.js"]

