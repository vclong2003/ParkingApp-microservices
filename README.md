## Services

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

## Auth

- Generate RSA key pair:

```bash
# gen private key
openssl genrsa -out private_key.pem 2048
# extract public key from private key
openssl rsa -in private_key.pem -pubout -out public_key.pem
# convert to PKCS#8 format for Java
openssl pkcs8 -topk8 -inform PEM -outform PEM -in private_key.pem -out private_key_pkcs8.pem -nocrypt
```

- Register:
  - User send register info -> Create account record with isVerified false -> Create OTP and save in Redis, send email

```bash
# create a new user
rabbitmqctl add_user parknexus your_secure_password

# grant full permissions
rabbitmqctl set_permissions -p "/" parknexus ".*" ".*" ".*"

# set this tag to access ui if needed
rabbitmqctl set_user_tags parknexus management

# check if delayed message exchange plugin is enabled
rabbitmq-plugins list | grep delayed

# enable delayed message exchange plugin
rabbitmq-plugins enable rabbitmq_delayed_message_exchange
```
