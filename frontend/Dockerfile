FROM node:14-slim

WORKDIR /user/src/app

COPY ./package.json ./

COPY ./package-lock.json ./

RUN npm install

ENV WATCHPACK_POLLING true

COPY . .

EXPOSE 3000

CMD ["npm", "start"]