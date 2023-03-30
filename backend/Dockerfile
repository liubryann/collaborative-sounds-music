FROM node:18-alpine

WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json", ".env", "./"]

COPY ./src ./src

RUN npm install

EXPOSE 3001

CMD ["npm", "run", "start"]