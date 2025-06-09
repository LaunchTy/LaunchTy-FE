# Launchty

## Table of Contents 🏆

- [Launchty](#launchty)
  - [Table of Contents 🏆](#table-of-contents-)
  - [Introduction 📕](#introduction-)
  - [Features ☕](#features-)
  - [How It Works 🛠️](#how-it-works-️)
  - [Tech Stack 💻](#tech-stack-)
- [Installation 📦](#installation-)
  - [Additional CLI Commands](#additional-cli-commands)

## Introduction 📕

## Features ☕

## How It Works 🛠️

## Tech Stack 💻

- **Smart Contracts**: [Solidity](https://soliditylang.org/)
- **Development Framework**: [Foundry](https://github.com/foundry-rs/foundry)
- **Frontend**: [Next.js](https://nextjs.org/), [Redux](https://redux.js.org/),
  [Tailwind CSS](https://tailwindcss.com/)
- **Blockchain Integration**: [wagmi](https://1.x.wagmi.sh/),
  [ethers.js](https://ethers.org/)
- **Backend**: [Prisma](https://www.prisma.io/),
  [PostgreSQL](https://www.postgresql.org/)
- **Containerization**: [Docker](https://www.docker.com/)
- **Scripting**: [TypeScript](https://www.typescriptlang.org/)

# Installation 📦

Follow these steps to set up the project locally:

1. **Clone the Repository**

   ```sh
   git clone
   cd launchty
   ```

2. **Install Dependencies**

   ```sh
   npm install
   ```

3. **Set Up Environment Variables**
   - Create a `.env` file in the root directory.
   - Add the following environment variables:
     ```env
     MVP_DB_URL=your_database_url
     ```
   - Then go to defrost-indexer folder and create a `.env` file in the root
     directory.
   - Add the following environment variables:
     ```env
     DB_URL=your_database_url
     ```
4. **Run Local Anvil Node**
   ```sh
   anvil
   ```
5. **Schema Generation**
   ```sh
   npx prisma db push
   npx prisma generate
   ```
6. **Run local node**

   ```sh
   tsx src/utils/setupLocalNode.ts

   ```

7. **Run the Application** `sh     npm run dev     ` Access the Application Open
   http://localhost:3000 in your browser.

## Additional CLI Commands

- **Copy Contract Addresses to chainConfig**
  ```sh
  tsx src/scripts/copySepoliaAddress.ts
  ```
- **Copy ABI to abi folder**
  ```sh
  tsx src/scripts/copyABIs.ts
  ```
- **Deploy Contracts**
  ```sh
   source .env && forge script --chain sepolia script/LaunchpadFactory.s.sol --rpc-url $SEPOLIA_RPC_URL --private-key $PK --broadcast --verify -vvvv --via-ir
  ```
