## Prerequisites
- Node.js (v18 or higher)
- npm (v8 or higher)
- Backend server running (see backend repository)
  
There are two repositories you must clone in order to run the project locally, this one, and the back end repository. As of the time of writing this, you can simply access the live site here for easier access and testing: https://crypto-app-frontend-ouiis.ondigitalocean.app/

Here is the backend link if you would like to purely test API calls: https://crypto-app-backend-izkoy.ondigitalocean.app/

if the server isnt up and you would like to clone it:

1. clone the repository into your local files/folder using https, ssh, or the CLI.
2. navigate to the \frontend-crypto-app\crypto-tracker\ folder
3. run npm install

4. create a .env file in the root directory and have the following variable
  
VITE_API_URL=http://localhost:5000/api

4. npm run dev in the \frontend-crypto-app\crypto-tracker\ directory
5. site should communicate with backend, have another shell terminal instance open for that
6. Site should work locally on your machine

BACKEND RUNS ON PORT 5000
FRONT END RUNS ON PORT 5173

AI was also used in the creation of this project, namely github's CLAUDE AI for the frontends folder structure. It as also used to troubleshoot any errors in communicating with the backend, 
fixing api calls, helping display the database of cryptos, and fixing any issues regarding page display as well as handling navigation.

some prompts that were used:
How do I create a modal component for creating cryptocurrency lists with proper state management and form handling?
How do I handle protected routes and authentication state in React Router for the crypto dashboard?
Getting 404 errors on page refresh in DigitalOcean static site. How do I configure routing?
How should I structure frontend environment variables for both development and production?

files/sources affected

/src/utils/api.js
/src/components
/src/context/AuthContext.js
/src/utils/api.js

staticwebapp.config.json
vite.config.js
