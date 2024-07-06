This application is a React-based web platform created using Express.js, MySQL, and JWT for authentication, with cookie parsing for enhanced security. It features fully functioning login and register functionalities that connect to a SQL database (the MySQL file is also included). For development purposes, you will need to adjust a few settings in the server.js file and add a .env.production file with your configuration. Otherwise, the application is fully ready for deployment.

To properly use the application, follow these steps:
Register or sign up. Please note that there may be a delay of around a minute. This delay is due to using render.com free tier when deploying the server-side application, which comes with inherent delays.
After registering or signing up, return to the main page.
Wait a few seconds for the process to complete. If necessary, sign up again.

Additionally, there is functionality for an admin user. In the MySQL database, there is an option to give users admin access with a binary flag (0 or 1). If a user is assigned a value of 1, they are authorized to delete, add, update cards, and also retrieve an SCV file with data summary. you can use the provided link to access the deployed website and use the following user credentials that already have access to admin functionalities:

Username: yumi@gmail.com
Password: 123123123

While the project is not 100% finished and incorporating some older methodologies and a few inactive and buggy methods, it remains fully functional. During development, I utilized XAMPP, but you can use any other method that includes a server and database setup.

It's important to note that the application is fully operational and connected to a Google Cloud Database. For hosting, I leverage Render.com's free tier, with server instances automatically deactivated during inactive periods. Therefore, while the provided link for the deployed site is functional, the server side may be inactive due to periods of inactivity.

Feel free to explore my repository to delve into the code and functionalities of the application.

