Multi-Method Payment Gateway
A production-ready, containerized payment gateway system featuring a Merchant Dashboard, a Customer Checkout Page, and a robust Backend API.

Architecture Overview
The system follows a microservices-inspired architecture, decoupled through Docker containers for scalability and reliability.

API Service (Port 8000): Built with a high-performance framework, handling order creation, payment processing, and merchant authentication.

Merchant Dashboard (Port 3000): A React-based interface for merchants to view API credentials, track real-time transactions, and manage orders.

Checkout Page (Port 3001): A standalone React application that handles the customer-facing payment flow, including UPI and Card validation.

Database (PostgreSQL): Stores persistent data for merchants, orders, and payment transactions.

Redis and Worker: Implements a producer-consumer pattern where the API pushes tasks to Redis and a Worker handles asynchronous payment simulation.

Getting Started
Prerequisites
Docker and Docker Compose installed.

One-Command Setup
To start the entire ecosystem, run the following command from the root directory:

docker-compose up -d --build

Note: This command automatically builds all services, establishes network connections, and seeds the database with the required test merchant credentials.

Evaluation Credentials
The system is automatically seeded with the following merchant for testing:

Email: test@example.com

API Key: key_test_abc123

API Secret: secret_test_xyz789

Merchant ID: 550e8400-e29b-41d4-a716-446655440000

API Documentation
1. Create Order
Endpoint: POST /api/v1/orders

Auth: API Key and Secret required in headers.

Request Body:

JSON

{
  "amount": 50000,
  "currency": "INR",
  "receipt": "order_rcptid_11"
}
2. Process Payment
Endpoint: POST /api/v1/payments

Body: Supports "method": "upi" or "method": "card".

Example Response:

JSON

{
  "id": "pay_nneVgnji35VH8kAa",
  "status": "processing",
  "method": "upi"
}
3. Health Check
Endpoint: GET /health

Response: Returns status of API, Database, Redis, and Worker (All must be "connected" or "running").

Database Schema Documentation
Merchants Table: Stores merchant profiles, unique IDs, and API credentials.

Orders Table: Links to Merchants (1-to-N); stores order amounts and status.

Payments Table: Links to Orders (1-to-N); stores transaction status (processing/success/failed) and payment method.

Payment Validation Features
VPA Validation: Checks for standard user@bank formats.

Luhn Algorithm: Validates card numbers for checksum accuracy.

Expiry Validation: Ensures cards are not expired and follow MM/YY format.

Visual Artifacts
The following screenshots are available in the repository /screenshots folder:

Dashboard: Login page, API credentials home, and lowercase transactions list.

Checkout: Method selection, UPI form, Card form, and Success state.