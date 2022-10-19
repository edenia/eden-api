<div align="center">
	<a href="https://eoscostarica.io">
		<img src="https://raw.githubusercontent.com/eoscostarica/.github/master/.github/workflows/images/eos-costa-rica-logo.png" width="300">
	</a>

![](https://img.shields.io/github/license/eoscostarica/backend-boilerplate) ![](https://img.shields.io/badge/code%20style-standard-brightgreen.svg) ![](https://img.shields.io/badge/%E2%9C%93-collaborative_etiquette-brightgreen.svg) [![](https://img.shields.io/twitter/follow/eoscostarica?style=social)](https://twitter.com/EOSCostaRica) ![](https://img.shields.io/github/forks/eoscostarica/backend-boilerplate?style=social)

</div>

# EOSIO Backend Boilerplate

**A highly scalable skeleton with best practices, ideal for backend projects quick start.**

## Features!

This boilerplate features all the latest tools and practices in the industry

- **[hasura](https://hasura.io)**
  Hasura GraphQL Engine is an opensource service that connects to your databases & microservices and auto-generates a production-ready GraphQL backend

- **[hapi](https://hapi.dev/)**
  A back end service for custom busines logic integrated with hasura using [actions](https://hasura.io/docs/1.0/graphql/manual/actions/index.html#actions)

- **[docker-compose](https://docs.docker.com/compose/)**
  Compose is a tool for defining and running multi-container Docker applications

## File Structure

Within the download you'll find the following directories and files:

```bash
eoscrbackendboilerplate/
├── hasura
│ ├── migrations
│ └── config.yaml
├── hapi
│ ├── src
│ | ├── config
│ | ├── api
│ | ├── routes
│ | └── config.yaml
│ ├── .dockerignore
│ ├── .eslintrc
│ ├── .prettierrc
│ ├── Dockerfile
│ ├── yarn-lock.json
│ └── package.json
├── .env.example
├── .gitignore
├── docker-compose.yaml
├── .LICENSE
├── .prettierrc
├── Dockerfile
├── LICENSE
└── README.md
```

There are some important folders like

- `hapi/src/api` should have all reusable code for example a code to generate tax invoice
- `hapi/src/routes` this folder should only have the endpoint mapping and params validations and use functions from api folder to handle the business logic

## Installation

Basic knowledge about Docker, Docker Compose and NodeJS is required.

### Getting started

Some things you need before getting started:

- [git](https://git-scm.com/)
- [node.js](https://nodejs.org/es/)
- [docker](https://www.docker.com/)
- [docker-compose](https://docs.docker.com/compose/)
- [Hasura CLI](https://hasura.io/docs/1.0/graphql/manual/hasura-cli/install-hasura-cli.html#install-hasura-cli)

### Running for the first time

1.  Clone this repo using `git clone --depth=1 https://github.com/eoscostarica/backend-boilerplate.git <YOUR_PROJECT_NAME>`
2.  Move to the appropriate directory: `cd <YOUR_PROJECT_NAME>`.
3.  Copy the `.env.example` then update the environment variables according to your needs

### Quick start

At this point you can execute `make run`, you can check the services runing on:

- hapi at http://localhost:9090
- hasura at http://localhost:9695


## Contributing

Please Read EOS Costa Rica's [Open Source Contributing Guidelines](https://developers.eoscostarica.io/docs/open-source-guidelines).

Please report bugs big and small by [opening an issue](https://github.com/eoscostarica/backend-boilerplate/issues)

## About EOS Costa Rica

<span align="center">

<a href="https://eoscostarica.io"><img width="300" alt="image" src="https://raw.githubusercontent.com/eoscostarica/.github/master/.github/workflows/images/eos-costa-rica-logo.png"></img></a>

[![Twitter](https://img.shields.io/twitter/follow/EOSCostaRica?style=for-the-badge)](https://twitter.com/EdeniaWeb3)
[![Discord](https://img.shields.io/discord/946500573677625344?color=black&label=Discord&logo=discord&logoColor=white&style=for-the-badge)](https://discord.gg/YeGcF6QwhP)

EOS Costa Rica is an independently-owned, self-funded, bare-metal Genesis block producer that provides stable and secure infrastructure for the EOS mainnet. We support open source software for our community while offering enterprise solutions and custom smart contract development for our clients.

</span>

