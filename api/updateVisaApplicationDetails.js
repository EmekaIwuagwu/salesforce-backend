import pool from '../db.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { id, status, reason } = req.body;

    try {
        const [result] = await pool.query(
            `UPDATE visa_applications SET status = ?, reason = ? WHERE id = ?`,
            [status, reason, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Application not found' });
        }

        res.status(200).json({ message: 'Application updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database update failed' });
    }
}
