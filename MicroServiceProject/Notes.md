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

#### UserService: Manage users, accounts and notifications.

    - Port: 4004
    - DB Port: 3305
    - Redis port: 3306

## Auth flow

- Register:
  - User send register info -> Create account record with isVerified false -> Create OTP and save in Redis, send email
