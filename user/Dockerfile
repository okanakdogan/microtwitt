FROM node:16-alpine

# Set necessary environment variables.
ENV NODE_ENV=development \
    NPM_CONFIG_PREFIX=/home/node/.npm-global \
    PATH=$PATH:/home/node/.npm-global/bin:/home/node/node_modules/.bin

RUN mkdir -p /usr/src/app/node_modules

RUN chown -R node:node /usr/src/app

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm install

COPY --chown=node:node . ./

RUN npm run build

CMD [ "npm","run","start:debug" ]