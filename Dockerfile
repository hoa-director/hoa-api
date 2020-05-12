# ## STAGE 1: Build the applicaiton dist folder in an instance
# FROM node:12 AS build

# # Create a directory where our app will be placed
# # RUN mkdir -p /app

# # Change directory so that our commands run inside this new directory
# WORKDIR /usr/src/app

# # Copy dependency definitions
# COPY package.json ./

# # Install dependecies
# RUN npm install

# # Get all the code needed to run the app
# COPY . .

# RUN npm run build


# ## Stage 1: Install production dependincies in a seperate instance
# FROM node:12 AS build-prod-deps

# # Create a directory where our app will be placed
# RUN mkdir -p /usr/src/app

# # Change directory so that our commands run inside this new directory
# WORKDIR /usr/src/app

# # Copy dependency definitions
# COPY package.json /usr/src/app

# # Install only production dependencies
# RUN npm install --only=production


# ## Stage 2: Build App Server
# # This is the final instance that will be used to run the App server
# FROM node:12-alpine AS release

# # Create a directory where our app will be placed
# RUN mkdir -p /usr/src/app

# # Change directory so that our commands run inside this new directory
# WORKDIR /usr/src/app

# RUN ls

# COPY package.json ./

# COPY --from=build /usr/src/app/dist ./dist

# RUN ls

# COPY --from=build-prod-deps /usr/src/app/node_modules ./node_modules

# RUN ls

# EXPOSE 3000

# CMD [ "npm", "start" ]

# Build out the application
FROM node:12 as build-client

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]
