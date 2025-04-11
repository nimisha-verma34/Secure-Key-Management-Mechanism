# 🔐 Secure Key Management Mechanism for Online Application

This project implements a secure and efficient encryption-based system that protects sensitive user data using a combination of **AES (Advanced Encryption Standard)** and **RSA (Rivest–Shamir–Adleman)** encryption techniques. It is designed to secure user registration and authentication processes in online applications.

## 📘 Overview

In the modern digital world, data breaches and cyberattacks pose significant risks. Traditional key management mechanisms suffer from single points of failure and inefficient key distribution. This project presents a dual-layer security solution using:

- **AES** for encrypting user details (symmetric encryption)
- **RSA** for encrypting/decrypting AES keys (asymmetric encryption)

---

## 🎯 Objectives

- Encrypt user data (email, etc.) during registration using AES
- Securely manage encryption keys using RSA
- Store hashed passwords using bcrypt
- Decrypt and authenticate user credentials during login
- Prevent unauthorized access to sensitive data

---

## 🛠️ Technologies Used

- **Node.js**, **Express.js**
- **MongoDB** with **Mongoose**
- **Crypto** module for AES and RSA
- **Bcrypt** for password hashing
- **HTML/CSS/JavaScript** for frontend

---

## 🔐 Security Features

- AES-encrypted email storage
- RSA-secured key management
- Bcrypt password hashing with salting
- Separate database collections for user data and keys
- Block unauthorized login attempts

---

## 🧪 How to Run

### 1. Clone the repository:
   ```bash
   git clone https://github.com/nimisha-verma34/Secure-Key-Management.git
   cd Secure-Key-Management
   ```

### 2. Install Dependencies
```sh
npm install
```

### 3. Generate RSA keys
```sh
node generateKeys.js
```

### 4. Start the server
```sh
node server.js
```
Visit: `http://localhost:3000` in your browser.
