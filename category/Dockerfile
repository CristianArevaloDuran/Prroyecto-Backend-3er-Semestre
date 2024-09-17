FROM node:20

RUN mkdir -p /home/app
WORKDIR /home/app

COPY package.json /home/app
RUN npm install

COPY . /home/app

EXPOSE 4001

CMD ["npm", "start"]