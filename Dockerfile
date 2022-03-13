FROM node:16-alpine

COPY . /home/app
WORKDIR "/home/app"
RUN npm install

EXPOSE 80
ENTRYPOINT ["node", "index.js"]