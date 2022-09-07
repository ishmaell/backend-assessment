#A simple backend application built with Node.js.

## Summary

- [Getting Started](#getting-started)
- [Dependencies](#dependencies)
- [Prerequisites](#prerequisites)
- [Challenges](#challenges)
- [Repo Structure](#repo-structure)
- [Authors](#authors-[dev])

## Getting Started

- clone the repo using `git clone https://github.com/ishmaell/backend-assessment.git`
- install the dependencies using `npm install`
- start the application using `npm run dev`
- Use the URL `http://localhost:8800` in any of your API tooling application e.g. Postman

### Dependencies

- node v16.13.0

### Prerequisites

The following are required to run the app

- [node v16.13.0](https://nodejs.org)

## Challenges

- Trying to understand the Mono documentation
- Web application not sending the cookies to the backend as expected

## Repo Structure

```
.
├── Procfile
├── README.md
├── config
│   ├── allowedOrigins.js
│   └── corsOptions.js
├── constants
│   └── index.js
├── index.js
├── middleware
│   ├── credentials.js
│   └── verifyJWT.js
├── model
│   └── users.json
├── package-lock.json
├── package.json
├── routes
│   ├── account
│   │   ├── controllers
│   │   │   └── account.controller.js
│   │   ├── model
│   │   │   └── Account.js
│   │   └── route.config.js
│   └── user
│       ├── controllers
│       │   └── user.controller.js
│       ├── middleware
│       │   └── validate.user.middleware.js
│       ├── model
│       │   └── User.js
│       └── routes.config.js
├── services
│   ├── db.config.js
│   └── mongoose.service.js
└── utils
    └── index.js

```

## Authors [Dev]

- **Isiaka Ismaila**
  ​​
