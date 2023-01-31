## About the Project

_"Eden api is a service that collects and unifies the data of the members of the Eden community and allows them to be consulted through a simple query."_

**Table of Contents**

1. About The Project
2. Content Table
3. Project Purpose
4. Tech Stack
5. Development Environment
6. File Structure
7. Contributing
8. About Company

## Project Purpose

_"The objective of this product is to provide the developers of the Eden community with a tool with which they can consult and have at hand the necessary information about the members of Eden, and thus they can use this information to feed their apps._

_This api service constantly consults the tables in the blockchain of the Eden contracts related to the members, unifies this collected information and stores it in a database where it can be consulted more quickly, just by executing a query."_

## Tech Stack

- eslint
- eosjs
- graphql
- hapi
- nodejs
- atomicassets
- docker

## Development Environment

Specify where were the project developed, in case someone else wants to make a contribution to the project progress, for example:

[eden-api.edenia.cloud](https://eden-api.edenia.cloud) is running on the EOS MainNet and is built from the `master` branch, our production branch.

[eden-api-dev.edenia.cloud](https://eden-api-dev.edenia.cloud) is running on the Jungle 4 TestNet and is built from the `dev` branch used for development, integration, and testing new features.

### Quick Start

1. Clone this repo using `git clone https://github.com/edenia/eden-api.git`
2. Move to the appropriate directory: `cd eden-api`.
3. Excute `cp .env.example .env`
4. Excute `make run`
5. Go to http://localhost:8080.

### Getting Started

#### **Prerequisites**

- `yarn`
- `node`
- `docker`
- `docker compose`
- `hasura`
- `hasura cli`

#### **Installation**

1. Clone the repository `git clone https://github.com/your_username_/Project-Name.git`
2. Install packages and run the project
   `make run`

## File Structure

Within the download you'll find the following directories and files:

```bash
eden-api/
├── hasura
│ ├── migrations
│ └── config.yaml
├── hapi
│ ├── src
│ | ├── config
│ | ├── constants
│ | ├── gql
│ | ├── routes
│ | ├── services
│ | ├── utils
│ | └── config.yaml
│ ├── .dockerignore
│ ├── .eslintrc
│ ├── .prettierrc
│ ├── Dockerfile
│ ├── makefile
│ ├── yarn.lock
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

## Contributing

If you want to make a contribution, please follow the next steps:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m '<type>(<scope>): <subject>'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please Read EOS Costa Rica's [Open Source Contributing Guidelines](https://guide.eoscostarica.io/docs/open-source-guidelines/) for more information about programming conventions.

If you find a bug, please report big and small bugs by [**opening an issue**](https://github.com/edenia/eden-api/issues)

## About Edenia

<span align="center">

<a href="https://edenia.com"><img width="400" alt="image" src="https://edenia.com/_next/image?url=%2F_next%2Fstatic%2Fimage%2Fpublic%2Flogos%2Flogo-edenia-punto-verde.4c66f48b284b2705f9957048f549b1eb.png&w=384&q=75"></img></a>

[![Twitter](https://img.shields.io/twitter/follow/EdeniaWeb3?style=for-the-badge)](https://twitter.com/EdeniaWeb3)
[![Discord](https://img.shields.io/discord/946500573677625344?color=black&label=discord&logo=discord&logoColor=white&style=for-the-badge)](https://discord.gg/YeGcF6QwhP)

</span>
Edenia runs independent blockchain infrastructure and develops web3 solutions. Our team of technology-agnostic builders has been operating since 1987, leveraging the newest technologies to make the internet safer, more efficient, and more transparent.

<!-- ![Metrics](/profile/metrics.svg) -->
