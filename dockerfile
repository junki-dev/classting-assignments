FROM node:alpine AS development

WORKDIR /usr/app

COPY package.json .
COPY yarn.lock .
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

COPY . .

RUN yarn install

RUN yarn build

FROM node:alpine as production

WORKDIR /usr/app

COPY package.json .
COPY yarn.lock .

RUN yarn install --prod

COPY --from=development /usr/app/dist ./dist

CMD ["node", "dist/main"]



