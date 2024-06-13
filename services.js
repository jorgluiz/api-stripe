const app = require('./src/app')
const open = require('open');
require('dotenv').config()

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`The server is now running on port ${PORT}`);
  open(`http://localhost:${PORT}`);
})
