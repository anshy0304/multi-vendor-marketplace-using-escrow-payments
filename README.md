# Escrow Marketplace

I built this full-stack marketplace to figure out how real-world trust engines and payment gateways actually work behind the scenes. 

Instead of a standard e-commerce cart, this project features a custom Escrow system. When a buyer pays, the money is locked. The seller only actually receives the funds in their dashboard after the buyer explicitly confirms the item was delivered. 

Live Demo: https://escrow-frontend-ckdgaua0ayhgc4hp.centralindia-01.azurewebsites.net/

## What I Built

* **The Escrow Engine:** Wrote custom backend logic to hold Razorpay funds in a "Pending" state and automatically release them to the seller's account upon delivery confirmation.
* **Role-Based Dashboards:** Implemented separate React views and API routing for Buyers (to manage orders) and Sellers (to track active listings and fulfillment).
* **Secure Auth:** Handled login and session management using JWTs.
* **Cloud Deployment:** Pushed the entire full-stack architecture to Microsoft Azure App Services, deploying directly from GitHub.

## Tech Stack

* **Frontend:** React (Vite), Tailwind CSS, React Router
* **Backend:** C#, ASP.NET Core Web API, Entity Framework Core
* **Payments:** Razorpay API
* **Infrastructure:** Azure App Service (Frontend & Backend)

## How to Run It Locally

If you want to clone this and run it on your own machine:

### 1. The .NET Backend
1. `cd backend`
2. You'll need your own Razorpay test keys. Add them to `launchSettings.json` under environment variables (`Razorpay__KeyId` and `Razorpay__KeySecret`).
3. Run `dotnet ef database update` to set up the local database.
4. Run `dotnet run`. It will start on `https://localhost:7093`.

### 2. The React Frontend
1. `cd frontend`
2. Run `npm install`
3. Create a `.env` file in the root folder and add: `VITE_API_BASE_URL=https://localhost:7093/api`
4. Run `npm run dev` to start the UI.