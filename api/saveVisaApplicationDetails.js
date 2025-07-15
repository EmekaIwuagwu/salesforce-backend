import pool from '../db.js';

export default async function handler(req, res) {
    // ✅ Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // ✅ Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { name, passportNumber, dob, nationality, passportDoc, hotelReservation, yellowCard } = req.body;

    try {
        const [result] = await pool.query(
            `INSERT INTO visa_applications (name, passportNumber, dob, nationality, passportDoc, hotelReservation, yellowCard) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [name, passportNumber, dob, nationality, passportDoc, hotelReservation, yellowCard]
        );
        res.status(200).json({ message: 'Application saved', id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database insert failed' });
    }
}
