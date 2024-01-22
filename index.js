const express = require('express');

const bodyParser = require('body-parser');
const apiRoutes = require('./api');

const app = express();
const port = 3000;

app.use(bodyParser.json());
apiRoutes(app);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
