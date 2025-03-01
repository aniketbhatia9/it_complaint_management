const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./db'); // Make sure this points to your db.js file
const User = require('./user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Complaint = require('./complaint');
const cors = require('cors'); // Import cors

const app = express();
const PORT = 5050; // You can change the port if needed

const { Op } = require('sequelize');


// Middleware
app.use(cors({
    origin: '*', // Allow all origins (for testing purposes)
}));
app.use(bodyParser.json());

// Test database connection
sequelize.authenticate()
    .then(() => console.log('Database connected'))
    .catch(err => console.error('Unable to connect to the database:', err));

// Sync all defined models to the DB
sequelize.sync()
    .then(() => console.log('Database synchronized'))
    .catch(err => console.error('Error synchronizing database:', err));


// Registration route
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = await User.create({ username, password: hashedPassword });
        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '1h' });

        res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
});

app.post('/complaints', async (req, res) => {
    const { UserName, UserDepartment, UserLocation, ProblemDescription, ResolvedOn, Remark } = req.body;
    const token = req.headers['authorization'].split(' ')[1]; // Assuming you're sending the token in the header
    const decodedToken = jwt.verify(token, 'your_secret_key'); // Use your secret key
    let assistant_name;
    if(decodedToken.id == 1)
        {
            console.log("Mr. Yunus")
            assistant_name = "Mr. Yunus";
        }else if(decodedToken.id == 3){
            assistant_name = "Mr. Deepak";
            console.log("Mr. Deepak")
        }else{
            assistant_name = "Mr. Narendra";
        }
    
    
    

    try {
        // Create a new complaint
        const complaint = await Complaint.create({ 
            UserName, 
            UserDepartment, 
            UserLocation, 
            ProblemDescription, 
            ResolvedOn, 
            Remark,
            userId: decodedToken.id, // Assuming decodedToken contains user id
            TaskAssignedTo : assistant_name
            
        });
        res.status(201).json({ message: 'Complaint created successfully', complaint });
    } catch (error) {
        res.status(500).json({ message: 'Error creating complaint', error });
    }
});


app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign({ id: user.id }, 'your_secret_key', { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // Allow all origins
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === 'OPTIONS') {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
    }
    next();
  });
  

// Sample route
app.get('/', (req, res) => {
    res.send('Hello from Node.js server!');
});

app.get('/complaints', async (req, res) => {
    console.log('Fetching all complaints...'); // Debugging log
    try {
        const complaints = await Complaint.findAll(); // Correct method for Sequelize
        console.log('Complaints fetched:', complaints); // Debugging log
        res.status(200).json(complaints);
    } catch (error) {
        console.error('Error fetching complaints:', error); // Log error
        res.status(500).json({ error: 'Error fetching complaints' });
    }
});



app.get('/complaints/:id', async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);
        if (complaint) {
            res.status(200).json(complaint);
        } else {
            res.status(404).json({ error: 'Complaint not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching complaint data' });
    }
});

// app.put('/complaints/:id', async (req, res) => {
//     try {
//         const complaint = await Complaint.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         if (complaint) {
//             res.status(200).json(complaint);
//         } else {
//             res.status(404).json({ error: 'Complaint not found' });
//         }
//     } catch (error) {
//         res.status(500).json({ error: 'Error updating complaint' });
//     }
// });

app.put('/complaints/:id', async (req, res) => {
    const complaintId = req.params.id; // Get the complaint ID from the URL
    const updatedData = req.body; // Get the updated data from the request body

    console.log('Updating complaint with ID:', complaintId);
    console.log('Request body:', req.body); // Log the incoming body

    try {
        const [updated] = await Complaint.update(updatedData, {
            where: { id: complaintId }
        });

        if (updated) {
            const updatedComplaint = await Complaint.findByPk(complaintId);
            return res.status(200).json({ message: 'Complaint updated successfully', complaint: updatedComplaint });
        }

        return res.status(404).json({ error: 'Complaint not found' });
    } catch (error) {
        console.error('Error updating complaint:', error); // Log the error details
        res.status(500).json({ error: 'Error updating complaints', details: error.message }); // Include error details in response
    }
});




app.get('/complaints/by-name/:userId/:date', async (req, res) => {
    const userId = req.params.userId; // Get the userId from the URL
    const date = req.params.date; // Get the date from the URL
    console.log(userId, date);

    try {
        // Parse the date string to a JavaScript Date object
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999); // Set the end of the day

        // Fetch all complaints where the userId matches and createdAt is within the specified date
        const complaints = await Complaint.findAll({
            where: {
                userId: userId, // Filtering by userId
                createdAt: {
                    [Op.gte]: startDate, // Greater than or equal to the start of the date
                    [Op.lte]: endDate // Less than or equal to the end of the date
                }
            }
        });

        if (complaints.length === 0) {
            return res.status(404).json({ error: 'No complaints found for this user on this date.' });
        }

        res.status(200).json(complaints); // Send the complaints back as JSON
    } catch (error) {
        console.error('Error fetching complaints:', error);
        res.status(500).json({ error: 'Error fetching complaints' });
    }
});


// Start the server
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
