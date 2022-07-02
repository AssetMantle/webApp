# assetDApp

A decentralised web app for assetMantle.

## Run faucet in container

> Make sure [docker]((https://docs.docker.com/desktop/mac/install/)) and [docker-compose](https://docs.docker.com/compose/install/) is installed in your system
>
> Building container image with docker in macos will be slower as there is no native docker support

Edit `services.faucet.environment` in `docker-compose.yaml` as per your need

```shell
docker-compose up
```
