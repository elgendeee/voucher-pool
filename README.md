# Voucher Management System

A Node.js TypeScript application for managing customers, special offers, and vouchers with a complete RESTful API.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Components](#components)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation and Setup](#installation-and-setup)
  - [Running the Application](#running-the-application)
  - [Testing](#testing)
- [API Endpoints](#api-endpoints)
- [Security Features](#security-features)
- [Database](#database)
- [Additional Implementation Details](#additional-implementation-details)
- [Docker Deployment](#docker-deployment)

## Overview

This Voucher Management System enables businesses to create and manage promotional vouchers for their customers. The system allows for bulk voucher generation, redemption validation, and tracking usage.

## Features

- **Customer Management**: Create, read, update, and delete customer records
- **Special Offer Management**: Define promotional offers with discount percentages
- **Voucher Operations**:
  - Create single vouchers for specific customers
  - Generate bulk vouchers for multiple customers
  - Validate and redeem vouchers
  - Track voucher usage and expiration
  - Retrieve valid vouchers by customer email

## Architecture

The application follows a layered architecture pattern:

1. **Routes Layer**: Defines API endpoints and connects them to controllers
2. **Controller Layer**: Handles HTTP requests and responses
3. **Service Layer**: Contains business logic and orchestrates operations
4. **Repository Layer**: Manages data access and persistence
5. **Model Layer**: Defines data structures and relationships

## Technology Stack

- **Node.js**: JavaScript runtime environment
- **TypeScript**: Strongly typed programming language
- **Express**: Web application framework
- **Sequelize**: ORM for PostgreSQL
- **PostgreSQL**: Relational database
- **Docker**: Containerization
- **Jest**: Testing framework
- **Babel**: JavaScript/TypeScript transpiler
- **Swagger**: API documentation

## Components

### Customer Module

Handles all customer-related operations including:
- Creating new customers
- Retrieving customer information
- Updating customer details
- Deleting customers
- Email uniqueness validation

### Special Offer Module

Manages promotional offers with features like:
- Creating discount offers
- Setting discount percentages (with validation)
- Retrieving offer details
- Updating offer information
- Deleting offers

### Voucher Module

Core module for voucher operations:
- Generating unique voucher codes
- Creating vouchers for specific customers
- Bulk voucher generation
- Retrieving voucher information
- Validating voucher redemption
- Tracking voucher usage and expiration

### Middleware

- **Error Handling**: Centralized error handling with appropriate HTTP status codes
- **Rate Limiting**: Request throttling to prevent abuse
- **Validation**: Request data validation using schemas

## Getting Started

### Prerequisites

- Node.js 16+
- Docker and Docker Compose (optional, for containerized deployment)
- npm or yarn

### Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/elgendeee/voucher-pool.git
   cd voucher-pool
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Env variable set in docker-compose.yml for now.

### Running the Application

#### Development Mode

Run the application in development mode with hot-reloading:
```bash
npm run dev
```

#### Production Mode

Build and run the application in production mode:
```bash
npm run build
npm start
```

#### Using Docker Compose

The easiest way to run the entire application stack:
```bash
docker-compose up
```

***data will be seeded to database***

The application will be available at:
- API: http://localhost:3000/api
- API Documentation: http://localhost:3000/api-docs
- Health Check: http://localhost:3000/health

### Testing

Run all tests:
```bash
npm test
```

Run unit tests only:
```bash
npm run test:unit
```

Generate test coverage report:
```bash
npm run test:coverage
```

## API Endpoints

### Customer Endpoints

- `GET /api/customers`: Get all customers
- `GET /api/customers/:id`: Get customer by ID
- **`Get /api/customers/:email/vouchers`: valid vouchers for a customer by email**
- `POST /api/customers`: Create a new customer
- `PUT /api/customers/:id`: Update a customer
- `DELETE /api/customers/:id`: Delete a customer

### Special Offer Endpoints

- `GET /api/special-offers`: Get all special offers
- `GET /api/special-offers/:id`: Get special offer by ID
- `POST /api/special-offers`: Create a new special offer
- `PUT /api/special-offers/:id`: Update a special offer
- `DELETE /api/special-offers/:id`: Delete a special offer

### Voucher Endpoints

- **`GET /api/vouchers`: Get all vouchers**
![Alt text](https://i.ibb.co/Xfb7FmGj/Voucher-Pool.png)
- `GET /api/vouchers/:id`: Get voucher by ID
- `GET /api/vouchers/code/:code`: Get voucher by code
- `POST /api/vouchers`: Create a new voucher
- **`POST /api/vouchers/generate`: Generate multiple vouchers**
- **`POST /api/vouchers/redeem`: Redeem a voucher**

## Security Features

### Rate Limiting

The application includes a custom in-memory rate limiter that:
- Limits requests to 100 per minute per IP address (configurable)
- Returns appropriate 429 status codes when limits are exceeded
- Provides rate limit information in response headers
- Uses a sliding window approach for accurate limiting

Implementation details:
- Tracks requests in an in-memory Map by IP address
- Maintains count and reset time for each client
- Automatically resets counters after the time window expires
- Provides remaining request information

### Validation

All incoming requests are validated using schemas, ensuring:
- Required fields are present
- Data types are correct
- Values are within expected ranges
- Custom validation rules are applied (e.g., email format)

## Database

The application uses PostgreSQL with Sequelize ORM:
- Automatic schema synchronization in development
- Defined relationships between models
- Transaction support for critical operations
- Connection pooling for efficient database usage

Models and relationships:
- Customer -> Voucher (One-to-Many)
- SpecialOffer -> Voucher (One-to-Many)
- Voucher (with relationships to both Customer and SpecialOffer)

## Additional Implementation Details

### Voucher Code Generation

Vouchers use a secure random code generation mechanism:
- 12-character alphanumeric codes
- Uses Node.js crypto for randomness
- Characters limited to uppercase letters and numbers for readability

### Transactions

Critical operations like voucher redemption use database transactions:
- Ensures data consistency
- Automatic rollback if operations fail

### Error Handling

The application includes a centralized error handling mechanism:
- Custom error types with status codes
- Consistent error response format
- Stack traces in development mode only
- Specific error handling for common scenarios

### Health Check Endpoint

The application provides a health check endpoint at `/health`:
- Returns system status
- Useful for monitoring and container orchestration

## Docker Deployment

The application includes Docker and Docker Compose configurations for easy deployment:

### Docker Components

- **Node.js Application Container**: Runs the Express application
- **PostgreSQL Container**: Provides the database service

### Docker Configuration

- Volume mapping for code changes during development
- Persistent database storage
- Health checks for service dependencies
- Exposed ports for API access

### Environment Variables

Configurable environment variables (to used instead of setting in docker-compose.yml):
- `PORT`: Application port (default: 3000)
- `POSTGRES_HOST`: Database host
- `POSTGRES_DB`: Database name
- `POSTGRES_USER`: Database username
- `POSTGRES_PASSWORD`: Database password
- `NODE_ENV`: Environment mode