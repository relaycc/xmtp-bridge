FROM node:18.15.0 AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run static:tsc

FROM node:18.15.0 AS run

WORKDIR /app
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./node_modules
RUN mkdir -p /app/shell

EXPOSE 3000