// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "nextjs-app",
      script: "yarn",
      args: "start",
      env: {
        PORT: 80,
      },
    },
  ],
};
