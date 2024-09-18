const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
require('dotenv').config();
const fs = require('fs');
const { check, validationResult } = require('express-validator');
const authRoutes = require('./routes/auth');


// Initialize express app
const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the routes
app.use('/api', authRoutes);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Serve uploaded images
app.use('/uploads', express.static(uploadsDir));

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Employee Model
const employeeSchema = new mongoose.Schema({
    name: String,
    email: String,
    mobile: String,
    designation: String,
    gender: String,
    course: [String],
    image: String,
    createDate: {
        type: Date,
        default: Date.now, // Automatically set the current date
    },
});

const Employee = mongoose.model('Employee', employeeSchema);

// Multer setup for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// Create Employee
app.post('/api/employees', 
    upload.single('image'),
    [
        check('name').notEmpty().withMessage('Name is required'),
        check('email').isEmail().withMessage('Valid email is required'),
        check('mobile').isNumeric().withMessage('Mobile number must be numeric'),
        check('designation').notEmpty().withMessage('Designation is required'),
        check('gender').notEmpty().withMessage('Gender is required'),
        check('course').notEmpty().withMessage('Course is required')
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            console.log('Request Body:', req.body);
            console.log('File:', req.file); // Log this to verify file details

            const { name, email, mobile, designation, gender, course } = req.body;
            const image = req.file ? `/uploads/${req.file.filename}` : '';

            const newEmployee = new Employee({
                name, email, mobile, designation, gender, course: course.split(','), image
            });

            await newEmployee.save();
            res.json({ message: 'Employee created successfully', employee: newEmployee });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to create employee' });
        }
    }
);

// Get all Employees
app.get('/api/employees', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch employees' });
    }
});

// Update an existing employee
app.put('/api/employees/:id', 
    upload.single('image'),
    [
        check('name').notEmpty().withMessage('Name is required'),
        check('email').isEmail().withMessage('Valid email is required'),
        check('mobile').isNumeric().withMessage('Mobile number must be numeric'),
        check('designation').notEmpty().withMessage('Designation is required'),
        check('gender').notEmpty().withMessage('Gender is required'),
        check('course').notEmpty().withMessage('Course is required')
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const employee = await Employee.findById(req.params.id);
            if (!employee) {
                return res.status(404).json({ message: 'Employee not found' });
            }

            employee.name = req.body.name;
            employee.email = req.body.email;
            employee.mobile = req.body.mobile;
            employee.designation = req.body.designation;
            employee.gender = req.body.gender;
            employee.course = req.body.course.split(','); // Assuming courses are sent as a comma-separated string
            
            // Keep the existing image if no new file is uploaded
            if (req.file) {
                employee.image = `/uploads/${req.file.filename}`;
            }

            const updatedEmployee = await employee.save();
            res.json(updatedEmployee);
        } catch (error) {
            res.status(500).json({ error: 'Error updating employee' });
        }
    }
);

// Delete an employee
app.delete('/api/employees/:id', async (req, res) => {
    try {
        const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
        if (!deletedEmployee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete employee' });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

