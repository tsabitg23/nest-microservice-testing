# NestJS - GO GRPC Microservices

## Description
This project is used as assignment for hiring process. This will be the API gateway for microservice application. The services is written using NestJS monorepo
### Services
- API Gateway
- Product
- Order

## Dependencies
Have to be already installed
- Docker
- NodeJS
- Golang
- Postgresql

## Installation

```bash
# Install dependencies for Nest
$ yarn install
```

## Running the app
```bash
# Run NestJS Services
$ yarn start product # Run product service
$ yarn start order # Run order service
$ yarn start auth # Run auth service

# Run API Gateway
$ cd apps/api-gateway && make server
```

## Run using docker compose
1. Copy all .env.example in `infra/` folder to .env (e.g. auth.env.example to auth.env) and adjust the config accordingly
2. Run following command
```bash
docker compose up -d 
```

## Regenerate Proto
```bash
# For NestJS typescript
$ yarn run proto:generate

# For golang
$ cd apps/api-gateway && maker proto
```

## Documentation
Postman collection can be obtain in `postman/` folders and can be imported into postman app.

API documentation using Swagger can be accessed after running the application with the link below

```bash
http://localhost:{PORT}/docs
# Default port is 3000
```