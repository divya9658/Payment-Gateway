# Payment Gateway Integration Project

A full-stack **payment gateway simulation** designed to demonstrate merchant transaction management and customer checkout experiences.

---

## 🚀 Quick Start (Docker)

The easiest way to run the entire stack is using **Docker Compose**.

### 1️⃣ Clone and Navigate

```bash
git clone https://github.com/divya9658/Payment-Gateway.git
cd Payment-Gateway
```

### 2️⃣ Build and Start Services

```bash
docker-compose up --build -d
```

---

## 🔗 Access Points

| Service            | URL                                                                                                  | Purpose                            |
| ------------------ | ---------------------------------------------------------------------------------------------------- | ---------------------------------- |
| Merchant Dashboard | [http://localhost:3000](http://localhost:3000)                                                       | View stats and transaction history |
| Checkout Page      | [http://localhost:3001/?order_id=order_zihsyxd9d9](http://localhost:3001/?order_id=order_zihsyxd9d9) | Process test payments              |
| Backend API        | [http://localhost:8000/health](http://localhost:8000/health)                                         | API health & monitoring            |

---

## 🛠️ Features & Implementation

### 🧾 Merchant Dashboard

* Fetches transaction data using `GET /api/v1/payments`
* Uses secure API headers for authentication
* Displays real-time transaction history

### 💳 Checkout Logic

* Supports **UPI (VPA)** payments
* Supports **Card payments**
* Implements **Luhn Algorithm** for card number validation
* Simulates real payment flow with success confirmation

### ⚙️ Backend API

* Built using **Node.js + Express**
* Simulated asynchronous payment processing
* Mock database for storing transactions
* Health check endpoint available

### 🐳 Dockerization

* Fully containerized **three-tier architecture**

  * Frontend (Merchant Dashboard)
  * Checkout UI
  * Backend API
* Services are isolated and networked via Docker Compose

---

## 📝 Demo Credentials

Use the following credentials to authenticate API requests from the dashboard:

```text
API Key: key_test_abc123
API Secret: secret_test_xyz789
```

---

## 🧪 Testing the Flow

1. Open the **Merchant Dashboard** at `http://localhost:3000`

   * Verify the dashboard is initially empty
2. Open the **Checkout Page** at `http://localhost:3001/?order_id=order_zihsyxd9d9`
3. Enter one of the following:

   * VPA (example: `test@upi`)
   * Valid Card Number
4. Click **Pay Now** and wait for the success confirmation
5. Refresh the **Dashboard** to see the new transaction instantly appear

---

## ✅ Final Submission Checklist

* [x] Services running on ports **3000**, **3001**, and **8000**
* [x] `docker-compose.yml` present in root directory
* [x] Card validation logic implemented and active
* [x] Dashboard fetching live transaction data

---

✨ This project demonstrates a realistic end-to-end payment gateway workflow with modern full-stack and DevOps practices.
