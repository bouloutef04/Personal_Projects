const app = require('./app');

// const PORT = process.env.PORT || 5001;

// app.listen(PORT, () => {
//   console.log(`The server has started on port ${PORT}`);
// });

const PORT = 5001;

app.listen(PORT, () => {
  console.log('The server has started on port 5001');
});
