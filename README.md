# ParkNexus Microservices

This is my practicing microservices project: a parking management backend split into small Spring Boot services. It is intended for learning and experimenting with service discovery, centralized configuration, API routing, asynchronous messaging, authentication, and integrations with external platforms.

## Technology Stack

- **Java 25, Maven, and Spring Boot** for the service applications and shared Java code.
- **Spring Cloud Config** for centralized configuration stored in `Config/config-repo`.
- **Netflix Eureka** for service registration and discovery.
- **Spring Cloud Gateway (MVC)** as the single API entry point and load-balanced router.
- **Spring Data JPA and MySQL** for relational persistence. Each data-owning service has its own database container and schema.
- **Redis** for UserService data such as registration and password-reset OTPs.
- **RabbitMQ** for asynchronous communication, especially notification events. The custom Docker image enables the delayed-message-exchange plugin.
- **JWT and RSA keys** for authentication and token verification.
- **Google Cloud Storage** for uploaded files managed by StorageService.
- **OneSignal** for email notification delivery managed by NotificationService.
- **OpenFeign** for selected synchronous service-to-service calls.
- **Lombok** and the shared `Common` module for reusable Java types and utilities.

## Architecture

Requests normally enter through API Gateway on port `4020`. Gateway resolves service names through Eureka on port `4015` and forwards requests to the registered service instances. The services obtain their configuration from Config Server on port `4010`.

The application processes are not started by `compose.yml`; they are run individually with Maven. The compose file provides the local infrastructure required by those processes.

## Development Setup

### Prerequisites

- JDK 25
- Docker Desktop with Docker Compose
- Maven, or the Maven wrapper included in each service directory
- Google Cloud Storage credentials when using StorageService
- OneSignal credentials when using NotificationService

### Start local infrastructure

From the repository root:

```bash
docker compose up -d
```

To stop the containers:

```bash
docker compose down
```

### What `compose.yml` provides

`compose.yml` provisions development dependencies only:

| Compose service   | Purpose                                                           |              Host port |
| ----------------- | ----------------------------------------------------------------- | ---------------------: |
| `user-db`         | MySQL database for UserService                                    |                 `3305` |
| `user-redis`      | Password-protected Redis cache for UserService                    |                 `3306` |
| `vehicle-db`      | MySQL database for VehicleService                                 |                 `3301` |
| `parkinglot-db`   | MySQL database for ParkingLotService                              |                 `3302` |
| `reservation-db`  | MySQL database for ReservationService                             |                 `3303` |
| `payment-db`      | MySQL database for PaymentService                                 |                 `3304` |
| `notification-db` | MySQL database for NotificationService                            |                 `3310` |
| `rabbitmq`        | RabbitMQ broker with the management UI and delayed-message plugin | `3311` AMQP, `3312` UI |

The MySQL containers use `root` with the development password configured in the compose file. The Redis container uses the same development password and limits its cache to 512 MB. RabbitMQ data is persisted in the `rabbitmq_data` named volume. The root `Dockerfile` builds the RabbitMQ image from `rabbitmq:3.13-management` and enables `rabbitmq_delayed_message_exchange`.

The example configuration currently uses `100.64.0.1` as the database, Redis, and RabbitMQ host. When running the infrastructure locally with the published ports above, change that host to `localhost`.

### Configure and run the applications

1. Copy the files in `Config/config-repo/example` into the active config repository location, or use them as templates for the files in `Config/config-repo`.
2. Replace placeholder secrets and credentials. In particular, configure the JWT keys, Google Cloud service-account file, Google Cloud Storage bucket, OneSignal keys, and RabbitMQ credentials.
3. Build the shared `Common` module first. This installs the current Common build into the local Maven repository so other modules can use it:

   ```bash
   cd Common
   mvn clean install -U
   ```

4. Start the applications in this order:
   1. `Config`
   2. `Eureka`
   3. Domain services such as `VehicleService`, `ParkingLotService`, `ReservationService`, `UserService`, `NotificationService`, and `StorageService`
   4. `ApiGateway`

   Run each application from its own directory:

   ```bash
   mvn spring-boot:run
   ```

5. When `Common` changes and you want another service to use the new build, run `mvn clean install -U` in that service directory before starting it. This refreshes dependencies and rebuilds the service against the newly installed Common artifact:

   ```bash
   cd VehicleService
   mvn clean install -U
   mvn spring-boot:run
   ```

6. Use `http://localhost:4020` as the main API entry point once Gateway and the target services are registered with Eureka.

### Postman testing

The repository includes two Postman files for exercising the API through API Gateway:

- [`ParkingApp.postman_collection.json`](ParkingApp.postman_collection.json) contains the ParkingApp requests, including the Gateway URLs such as `http://localhost:4020/api/v1/...`.
- [`ParkingApp env.postman_environment.json`](ParkingApp%20env.postman_environment.json) contains the `ParkingApp env` environment with `accessToken` and `refreshToken` variables for authenticated requests.

## Services

### Platform services

- **Config** - Spring Cloud Config Server that serves shared and service-specific settings from `Config/config-repo`. Port: `4010`.
- **Eureka** - Netflix Eureka Server used for service registration and discovery. Port: `4015`.
- **API Gateway** - Spring Cloud Gateway that applies gateway security and routes `/api/v1/...` requests to services using Eureka service names. Port: `4020`.

### Domain services

- **VehicleService** - Manages vehicles associated with user accounts. Application port: `4000`; MySQL host port: `3301`.
- **ParkingLotService** - Manages parking lots and their parking spots. Application port: `4001`; MySQL host port: `3302`.
- **ReservationService** - Manages reservations, tickets, check-in, check-out, and reservation events. Application port: `4002`; MySQL host port: `3303`.
- **UserService** - Manages users, accounts, authentication, and account-related data. Application port: `4004`; MySQL host port: `3305`; Redis host port: `3306`.
- **NotificationService** - Consumes notification events through RabbitMQ and handles email or push-related notifications through OneSignal. Application port: `4005`; MySQL host port: `3310`; RabbitMQ AMQP host port: `3311`; management UI host port: `3312`.
- **StorageService** - Uploads files to Google Cloud Storage and generates signed URLs for file access. Application port: `4006`.

PaymentService is retained in the infrastructure and port inventory below, but is intentionally not included in the service descriptions above.

## Existing Port Inventory

### Config

    - Port: 4010

### Eureka

    - Port: 4015

### API Gateway

    - Port: 4020

#### VehicleService: Manage vehicles.

    - Port:4000
    - DB port: 3301

#### ParkingLotService: Manage parking lot, parking spot.

    - Port: 4001
    - DB port: 3302

#### ReservationService: Manage reservation, ticket and check-in/check-out.

    - Port: 4002
    - DB port: 3303

#### PaymentService: Manage payment for reservation, and payout.

    - Port: 4003
    - DB port: 3304

#### UserService: Manage users, accounts.

    - Port: 4004
    - DB port: 3305
    - Redis port: 3306

#### NotificationService: Handle notifications, emails,...

    - Port: 4005
    - DB port: 3310
    - RabbitMQ AMQP port: 3311
    - RabbitMQ UI port: 3312

#### StorageService: Handle file storage, upload/download.

    - Port: 4006

## Development Guides

### Authentication key pair

UserService signs JWTs with an RSA private key, while API Gateway verifies tokens with the matching public key. Generate the keys from a secure local directory and keep the private key out of source control. The PKCS#8 private key is the format expected by Java configuration.

```bash
# gen private key
openssl genrsa -out private_key.pem 2048
# extract public key from private key
openssl rsa -in private_key.pem -pubout -out public_key.pem
# convert to PKCS#8 format for Java
openssl pkcs8 -topk8 -inform PEM -outform PEM -in private_key.pem -out private_key_pkcs8.pem -nocrypt
```

Configure the resulting key values in the service configuration as required by the project. The example files contain shortened placeholders such as `security.jwt.privateKey` and `security.jwt.publicKey`; do not commit real keys or credentials.

During registration, UserService creates an account with `isVerified=false`, generates an OTP, stores it in Redis, and publishes the notification needed to send the email.

### RabbitMQ user and delayed-message plugin

The root `Dockerfile` builds the RabbitMQ management image and enables the `rabbitmq_delayed_message_exchange` third-party plugin automatically. It is used by `compose.yml` for the local RabbitMQ container, so the normal setup is:

```bash
docker compose up -d rabbitmq
```

For an existing RabbitMQ installation, create the application user and grant it permissions:

```bash
# create a new user
rabbitmqctl add_user parknexus your_secure_password

# grant full permissions
rabbitmqctl set_permissions -p "/" parknexus ".*" ".*" ".*"

# set this tag to access ui if needed
rabbitmqctl set_user_tags parknexus management
```

Check whether the delayed-message plugin is available and enabled:

```bash

# check if delayed message exchange plugin is enabled
rabbitmq-plugins list | grep delayed
```

If it is installed but disabled, enable it with:

```bash

# enable delayed message exchange plugin
rabbitmq-plugins enable rabbitmq_delayed_message_exchange
```
