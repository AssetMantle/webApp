FROM node:16 AS build-env
COPY . /app
WORKDIR /app
RUN --mount=type=cache,target=/root/.cache \
  --mount=type=cache,target=/root/.npm \
  npm i

FROM gcr.io/distroless/nodejs:16
COPY --from=build-env /app /app
WORKDIR /app
CMD ["main.js"]
