const express = require('express');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(express.json());

// Create table if not exists (for demo)
async function createTable() {
    const sql = `
        CREATE TABLE IF NOT EXISTS visa_applications (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100),
            passportNumber VARCHAR(50),
            dob DATE,
            nationality VARCHAR(50),
            passportDoc VARCHAR(255),
            hotelReservation VARCHAR(255),
            yellowCard VARCHAR(255),
            status VARCHAR(20) DEFAULT 'Pending',
            reason TEXT
        )
    `;
    await pool.query(sql);
}
createTable();

// POST /saveVisaApplicationDetails
app.post('/saveVisaApplicationDetails', async (req, res) => {
    const { name, passportNumber, dob, nationality, passportDoc, hotelReservation, yellowCard } = req.body;
    try {
        const [result] = await pool.query(
            `INSERT INTO visa_applications (name, passportNumber, dob, nationality, passportDoc, hotelReservation, yellowCard) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [name, passportNumber, dob, nationality, passportDoc, hotelReservation, yellowCard]
        );
        res.json({ message: 'Application saved', id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database insert failed' });
    }
});

// GET /getVisaApplicationDetails
app.get('/getVisaApplicationDetails', async (req, res) => {
    try {
        const [rows] = await pool.query(`SELECT * FROM visa_applications`);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database fetch failed' });
    }
});

// POST /updateVisaApplicationDetails
app.post('/updateVisaApplicationDetails', async (req, res) => {
    const { id, status, reason } = req.body;
    try {
        const [result] = await pool.query(
            `UPDATE visa_applications SET status = ?, reason = ? WHERE id = ?`,
            [status, reason, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Application not found' });
        }
        res.json({ message: 'Application updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database update failed' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
