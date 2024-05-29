FROM registry.cidsfrcutn.tech/arqutils/node-oracle:20.9.0-bullseye-slim
ARG environment

RUN apt-get update || : && apt-get install python -y
RUN npm i -g pm2@5.2.0
WORKDIR /consultas-ms
COPY package.json ./package.json
RUN npm install
COPY . ./
RUN npm run build
RUN pm2 dump
EXPOSE 3102
CMD [ "pm2-runtime", "npm", "--", "start" ]
