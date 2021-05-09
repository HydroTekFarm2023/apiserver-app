FROM node:12
#USER root
#
## Create app directory
WORKDIR /usr/src/app
# Create app directory
# WORKDIR /usr/src/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
# COPY package*.json ./
# Bundle app source
COPY . .
# RUN npm install --save-dev @babel/core @babel/cli @babel/preset-env @babel/node
# RUN npm i @babel/plugin-proposal-class-properties
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production
# Copying and Cofiguring certificates
ENV NODE_ENV=production
EXPOSE 3000
RUN npm i nodemon -g
<<<<<<< HEAD
#CMD [ "npm" , "run" , "prod" ]
CMD ["/bin/sh"]
=======
CMD [ "npm" , "run" , "serverstart" ]
#CMD ["/bin/sh"]
>>>>>>> 77818d9d82617f81dc591f2430cac6cee0020a15
