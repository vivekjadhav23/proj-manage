const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("🚀 Connected to MongoDB"))
    .catch(err => console.log("❌ DB Error:", err));

app.get('/', (req, res) => res.send("API is running..."));

const PORT = process.env.PORT || 5000;

const User = require('./models/User');
const bcrypt = require('bcryptjs');

// Register Route
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "User already exists" });

        // 2. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create and save the user
        const newUser = new User({ name, email, password: hashedPassword });
        const savedUser = await newUser.save();

        // 4. Generate Token immediately (Auto-Login logic)
        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // 5. Send back token and user info
        res.status(201).json({
            message: "User created successfully!",
            token,
            user: { id: savedUser._id, name: savedUser.name, email: savedUser.email }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const jwt = require('jsonwebtoken');

// Login Route
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find the user
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "User does not exist" });

        // 2. Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        // 3. Create Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const Project = require('./models/Project');

// Create a Project
app.post('/api/projects', async (req, res) => {
    try {
        const { name, description, ownerId } = req.body;
        const newProject = new Project({ name, description, owner: ownerId, members: [ownerId] });
        await newProject.save();
        res.status(201).json(newProject);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get User's Projects
app.get('/api/projects/:userId', async (req, res) => {
    try {
        const projects = await Project.find({ members: req.params.userId });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const Task = require('./models/Task');

// 1. Get all tasks for a specific project
app.get('/api/tasks/:projectId', async (req, res) => {
    try {
        const tasks = await Task.find({ project: req.params.projectId });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Update task status (for dragging between columns)
app.patch('/api/tasks/:taskId', async (req, res) => {
    try {
        const { status } = req.body;
        const updatedTask = await Task.findByIdAndUpdate(req.params.taskId, { status }, { new: true });
        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Create a new task
app.post('/api/tasks', async (req, res) => {
    try {
        const newTask = new Task(req.body);
        await newTask.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a comment to a task
app.post('/api/tasks/:taskId/comment', async (req, res) => {
    try {
        const { user, text } = req.body;
        const task = await Task.findById(req.params.taskId);

        if (!task) return res.status(404).json({ error: "Task not found" });

        task.comments.push({ user, text });
        await task.save();

        res.json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all users for the assignment dropdown
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find({}, 'name email'); // Only return name and email
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update task assignee
app.patch('/api/tasks/:taskId/assign', async (req, res) => {
    try {
        const { userId } = req.body;
        const task = await Task.findByIdAndUpdate(req.params.taskId, { assignedTo: userId }, { new: true }).populate('assignedTo', 'name');
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a project
app.delete('/api/projects/:projectId', async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.projectId);
        // Optional: Also delete all tasks associated with this project
        await Task.deleteMany({ project: req.params.projectId });
        res.json({ message: "Project deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update User Profile
app.put('/api/users/:userId', async (req, res) => {
    try {
        const { name, email } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            { name, email },
            { new: true }
        ).select('-password'); // Don't return the password

        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Invite a member to a project by email
app.post('/api/projects/:projectId/invite', async (req, res) => {
    try {
        const { email } = req.body;

        // 1. Find the user by email
        const userToInvite = await User.findOne({ email });
        if (!userToInvite) return res.status(404).json({ error: "User not found. Tell them to register first!" });

        // 2. Find the project and add the user to members array
        const project = await Project.findById(req.params.projectId);

        // Check if user is already a member
        if (project.members.includes(userToInvite._id)) {
            return res.status(400).json({ error: "User is already a member of this project" });
        }

        project.members.push(userToInvite._id);
        await project.save();

        res.json({ message: "User added to project successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));