# Fetching the minified node image on apline linux
FROM node:18-alpine

# Setting up the work directory
WORKDIR /app

# Copying all the files in our project
COPY . .

# Installing dependencies
RUN yarn

# Build frontend
RUN yarn build

# Starting our application
CMD [ "yarn", "start" ]

# Exposing server port
EXPOSE 3300
