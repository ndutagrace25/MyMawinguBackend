pm2 delete "MyMawinguApp"
NODE_ENV=production PORT=5004 pm2 start server.js --name "MyMawinguApp"
