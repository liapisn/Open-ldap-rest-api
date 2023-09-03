# Open LDAP REST API

This project was developed as part of my thesis in Harokopio University of Athens which aimed to develop a REST API for managing an LDAP server. By combining Node.js and Express technologies, it facilitates efficient and secure communication with the LDAP server, leveraging the `ldapjs` library.

## Abstract

This REST API offers a secure and efficient means to manage, communicate with, and search data within an LDAP server. The primary objective was to provide a tool that stands robust in terms of reliability and security.

Key features and technologies include:
- **Node.js and Express**: Foundation technologies for the REST API.
- **ldapjs library**: Enables LDAP functionality.
- **Authentication mechanism**: Users provide credentials to access the LDAP server and in return receive an encrypted cookie that heightens data security.
- **Clean Code Techniques**: Emphasis on code quality and system's architecture using domain handlers, error handlers, and structured communications through gateways and servers.
- **Testing**: Comprehensive test suites in the domain to ensure system quality.
- **Docker and Docker-compose**: Ensuring the system can operate in a containerized environment, streamlining installation and development processes.

## API Endpoints

This project offers a collection of endpoints to interact with the LDAP server. Here are some of the notable ones:

1. **Authentication**
    - **Login**: `POST {{baseurl}}/auth/login`

2. **General Operations**
    - **Get Entries**: `GET {{baseurl}}/{{organizational_units}}`
    - **Get Entry by CN**: `GET {{baseurl}}/{{organizational_units}}/cns/:cn`
    - **Create Entry**: `POST {{baseurl}}/{{organizational_units}}`
    - **Delete Entry**: `DELETE {{baseurl}}/{{organizational_units}}/cns/:cn`
    - **Update Entry**: `PUT {{baseurl}}/{{organizational_units}}/cns/:cn`

Refer to the [Postman collection](/Postman_collection.json) for detailed request structures and more endpoints.

## Getting Started

First you need to have access to an LDAP server. If you don't have you can create your own using [Apache Directory Studio](https://directory.apache.org/studio/) and creating an external connection using [ngrok](https://ngrok.com/)

After you create your LDAP you need to create a local .env files to specify the values that are displayed on the example.env file then run `npm install` and `npm run dev` to run the project
