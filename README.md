# 🚙 Uguee (Frontend - App Movil)
------------------

<p align="center">
    <img src="./assets/Uguee.png" alt="Uguee Logo" width="300">
</p>

📱 Shared Transport Mobile App

This is a mobile application developed with React Native and Expo for managing a shared transport system. The app is primarily designed for drivers and passengers, allowing them to register vehicles, view available routes, apply filters, and securely authenticate using JWT.

🚀 Main Features

✅ Authentication

- User registration and login with username and password.
- JWT token storage using AsyncStorage.

🚗 Vehicle Registration (Drivers)

- Registration form with:
- License plate, brand, color, category
- Expiration date of SOAT and mechanical inspection
- Vehicle image upload
- Sends plain JSON data to a token-protected backend.

🧭 Route Creation (Drivers)

- Real-time map and location using react maps and navigation.
- Route creation by marking points on the map and drawing trajectory using Polyline.
- Schedule trips with date and time.
- Page for created trips and registered vehicles.
- Sends plain JSON data to a token-protected backend.

🧭 Available Routes (Passengers)

- List of routes with status = "available" fetched from the backend.
- Route filtering by date range (date_after, date_before).
- Destination-based search.
- Navigation to a map screen of the selected route.

🧪 Technologies Used

- React Native
- Expo
- Axios

⚙️ Prerequisites

- Node.js 
- npm or yarn
- npm install -g expo-cli
- Android Studio or Xcode (for emulators) or a physical device with the Expo Go app installed.

## How to Run
1. Clone and enter the repository:
   ```bash
   git clone https://github.com/Uway-Univalle/Uway-Backend.git
   cd frontend
   ```
2. Copy the example environment file to create your own `.env` file (Make sure to fill in the required variables):
   ```bash
   cp .env.example .env   //API_URL=http://TU_IP_LOCAL:8000
   ```
3. Add your IP to the ALLOWED_HOSTS of the backend if you use Django in the settings file, for example:
   ```bash
   ALLOWED_HOSTS = ['192.168.X.X', 'localhost']
   ``` 
4. install and start npm:
   ```bash
   npm install
   npm start
   //Scan the QR code with the Expo Go app on your phone.
   // You can also open it in an Android or iOS emulator from the menu that appears.
   ```
