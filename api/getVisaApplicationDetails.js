import pool from '../db.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const [rows] = await pool.query(`SELECT * FROM visa_applications`);
        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database fetch failed' });
    }
}
