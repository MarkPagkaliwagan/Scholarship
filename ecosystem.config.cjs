module.exports = {
  apps: [
    {
      name: "scholarship-portal",
      script: "bun",
      args: "run start",
      cwd: "/var/www/scholarship-prototype",
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 5001,
      },
    },
  ],
};
