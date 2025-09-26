# DailyDoodh Delivery App

This is a full-stack application for managing daily milk and dairy deliveries. It consists of a React frontend and a FastAPI backend.

## Functionality

The application supports two types of users: **residents** and **delivery persons**.

### For Residents:

*   **Signup and Login:** Residents can sign up with their name, email, house number, and address. Login is handled via email.
*   **Dashboard:** After logging in, residents are presented with a dashboard where they can:
    *   **Manage Subscriptions:** Create, update, or cancel their daily subscriptions for products like milk, curd, butter, and cheese.
    *   **Place Ad-hoc Orders:** Place one-time orders for specific dates.
    *   **Set Vacation Periods:** Mark periods when they are on vacation to pause deliveries.
    *   **View Order History:** See a history of their past orders.
    *   **View Cancellation History:** See a history of their cancellations.

### For Delivery Persons:

*   **Signup:** Delivery persons can sign up with their name, email, and vehicle/ID number.
*   **Dashboard:** The delivery person's dashboard shows:
    *   **Daily Inventory Summary:** A summary of the total quantity of each product to be delivered on the current day.
    *   **Delivery Route:** A list of all deliveries for the day, showing the resident's name, address, and the items to be delivered.

## How to Run the Application

### Prerequisites

*   Python 3.9+
*   Node.js and npm

### Backend (FastAPI)

1.  **Navigate to the `server` directory:**
    ```bash
    cd server
    ```

2.  **Create and activate a virtual environment:**
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Install the required Python packages:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Run the FastAPI server:**
    ```bash
    uvicorn main:app --reload
    ```
    The server will be running at `http://127.0.0.1:8000`.

### Frontend (React)

1.  **Navigate to the `client` directory:**
    ```bash
    cd client
    ```

2.  **Install the required npm packages:**
    ```bash
    npm install
    ```

3.  **Run the React application:**
    ```bash
    npm start
    ```
    The application will open in your browser at `http://localhost:3000`. The client is configured to proxy API requests to the backend server.

## API Endpoints

The FastAPI server exposes the following endpoints:

| Method | Path                                      | Description                                      |
| ------ | ----------------------------------------- | ------------------------------------------------ |
| GET    | `/`                                       | Welcome message                                  |
| POST   | `/login`                                  | User login                                       |
| POST   | `/signup`                                 | User signup                                      |
| POST   | `/signup-delivery`                        | Delivery person signup                           |
| GET    | `/products`                               | Get all products                                 |
| POST   | `/products`                               | Create a new product                             |
| GET    | `/users`                                  | Get all users                                    |
| GET    | `/users/{user_id}`                        | Get a specific user                              |
| GET    | `/users/{user_id}/subscription`           | Get a user's active subscription                 |
| POST   | `/users/{user_id}/subscription`           | Create or update a user's subscription           |
| GET    | `/users/{user_id}/vacations`              | Get a user's vacation periods                    |
| POST   | `/users/{user_id}/vacations`              | Add a vacation period for a user                 |
| GET    | `/users/{user_id}/orders`                 | Get a user's orders                              |
| POST   | `/users/{user_id}/orders`                 | Create an ad-hoc order for a user                |
| GET    | `/users/{user_id}/cancellations`          | Get a user's cancellations                       |
| POST   | `/users/{user_id}/cancellations`          | Create a cancellation for a user                 |
| GET    | `/deliveries/{delivery_date}`             | Get all deliveries for a specific date           |
