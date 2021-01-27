module.exports = {
  apps: [
    {
      name: 'Nukang Server',
      script: 'cd services/nukang && npm install && npm start',
      env: {
        JWT: "nukang",
        PORT: 80
      }
    }
  ],
};