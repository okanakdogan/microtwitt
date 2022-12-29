# MicroTwitt

A simple twitter like application for learning [NestJS Microservice](https://docs.nestjs.com/microservices/basics#installation)

## Tech Stack

<a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="32" alt="Nest Logo" align="middle" /></a>
<a href="https://nats.io/" target="blank"><img src="https://nats.io/img/logos/nats-horizontal-color.png" width="128" alt="Nats Logo" align="middle" /></a>
<a href="https://redis.io/" target="blank"><img src="https://upload.wikimedia.org/wikipedia/commons/6/64/Logo-redis.svg" width="64" alt="Redis Logo" align="middle" /></a>
<a href="https://www.postgresql.org/" target="blank"><img src="https://www.postgresql.org/media/img/about/press/elephant.png" width="32" alt="Postgres Logo" align="middle" /></a>
<a href="https://neo4j.com/" target="blank"><img src="https://dist.neo4j.com/wp-content/uploads/20210423072428/neo4j-logo-2020-1.svg" width="64" alt="Postgres Logo" align="middle" /></a>
<a href="https://www.docker.com/" target="blank"><img src="https://www.docker.com/wp-content/uploads/2022/03/Moby-logo.png.webp" width="32" alt="Postgres Logo" align="middle" /></a>

## Architecture

<img src="assets/microtwitt-arch.png" width="480" alt="Postgres Logo"/>

Application has basic functionality of an web application backend for user authentication, Tweet CRUD operations, timeline creation, search and social networking.

Functionalities are separated as a microservice. In microservice architecture, generally each service has own team to manage & develop its features.

Each microservice:

- is containerized with Docker
- has own scope, development lifecycle
- has own package management

## Services

### Api Gateway

API gateway is single entry point for all services. External clients access data & functions via REST API. Api Gateway delegates the request to other services

### User

Responsible for User management. Using JWT Authentication

### Social

Serves and updates user relations (follow mechanism) and provides searching in graph data. Uses neo4j graph database.
We can manage this service for creating follow suggestions and improving search of users

### Timeline

Creates and serves timeline data for each user and caches to be able to respond fast. This service can be modified for injecting ads and suggestions for income and better user experience

### Tweet

CRUD and search operations of Tweets are handled in Tweet microservice. It uses Postgres database which is also used by User microservice, to reduce data layer services. But if we would like to separate concerns of development and create a domain driven architecture, we can create another database for this service

## How to Run

Use docker compose to build and run.
> docker compose build  
> docker compose up

You can use swagger page to access and send request to API.
enter address to yor browser
>http://localhost:3000

## Conclusion

I've omitted the unit tests, integration tests, data seed, monitoring tools, detailed logs, SSL
(maybe I will add data seed and monitoring tool later)

Creating and developing all micro services in one repo has overheads:

- Services have shared packages but we must handle them isolated, that's why each image build common packages over again
- Difficult to create reusable components
- Increasing internal network traffic
- Challenging to match logs of each services' logs to review of an user session

## TODO

- Add a monitoring tool: e.g [zipkin](https://zipkin.io/)
- Add data seeding script
- Test with 2x of each service to inspect routing/load balancing of NATS