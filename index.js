const express = require('express');
const app = express();
const port = 5050;
const cors = require('cors');
// app.get('/', (req, res) => {
//     res.send('Hello, this is the IT Complaint Management backend!');
// });

app.use(express.json());  // To parse JSON request bodies
app.use(cors());

app.use(
    cors({
      origin: "http://localhost:3000", // Change this to your frontend's URL
      methods: "GET,POST,PUT,DELETE",
      credentials: true,
    })
  );


app.post('/complaints', (req, res) => {
    const complaint = req.body;
    // Here, you would normally save the complaint to the database
    console.log(complaint);
    res.send(`Complaint received from ${complaint.userName}`);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

