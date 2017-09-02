import express from 'express';

const app = express();
app.use(express.static('views'));
app.use(express.static('public'));

const server = app.listen(8000, () => {
  console.log('Server is running on port 8000');
})
