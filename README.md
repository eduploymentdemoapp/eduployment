# Eduployment Test Project

This repository contains a test project for **Eduployment**. It includes the core functionality for managing users, as well as email-related functionality for sending password reset links.

email: eduploymentdemoapp@gmail.com
password: \9H?r-tjT]h#D

## Setup Instructions

### 1. Clone the Repository

To get started, clone the repository to your local machine using the following command:

```bash
git clone https://github.com/eduploymentdemoapp/eduployment.git
```

### 2. Install Dependencies
Navigate to the project folder and install the required dependencies:

```bash
cd eduployment
npm install
```

### 3. Run the Development Server
Start the development server with the following command:

```bash
npm run dev
```

The application should now be running locally. Open your browser and navigate to http://localhost:5173 to view the project.

### Email Configuration

## Modifying the Password Reset Link
This project contains functionality for sending custom emails, specifically for setting a user’s password.

The email logic can be found in the file /src/lib/server/email.ts. In this file, there's a template for sending the password reset link:

```html
<p><a href="http://localhost:5173/set-password?email=${encodeURIComponent(email)}&token=${passwordResetToken}">Set Password</a></p>
```
Make sure to modify the URL to match your local or production environment. Replace http://localhost:5173 with your actual localhost or domain URL, depending on where you’re running the application.

### Notes
This project is designed to run locally, but it can be modified for production use.
The sendCustomEmail function is used to send the email for the password reset. Ensure your local environment is set up correctly to send emails if you're testing this functionality.
If you run into any issues or have questions, feel free to open an issue or contact the project maintainers.