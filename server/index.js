const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Hanya fail imej dibenarkan!'), false);
  }
});

// Init DB
db.initDB();

// ── POST /api/proposals ────────────────────────────────────────
app.post('/api/proposals', upload.array('attachments', 10), async (req, res) => {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    const data = JSON.parse(req.body.data);

    const proposalResult = await client.query(`
      INSERT INTO proposals (
        tajuk, tarikh_tempat, masa, pengenalan, kehadiran, jenis_aktiviti,
        kumpulan_sasaran, penceramah, tentatif_program, kos_perbelanjaan,
        lain_lain_perbelanjaan, implikasi_anggota, roi_kuantitatif,
        disediakan_oleh, tarikh_disediakan, disemak_oleh, tarikh_disemak,
        bajet_disokong, kod_bajet, disahkan_oleh, tarikh_disahkan,
        diluluskan_oleh, tarikh_lulus
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23)
      RETURNING id
    `, [
      data.tajuk, data.tarikhTempat, data.masa, data.pengenalan, data.kehadiran,
      data.jenisAktiviti, data.kumpulanSasaran, data.penceramah, data.tentatifProgram,
      parseFloat(data.kosPerbelanjaan) || 0, parseFloat(data.lainLainPerbelanjaan) || 0,
      data.implikasiAnggota, data.roiKuantitatif,
      data.disediakanOleh, data.tarikhDisediakan,
      data.disemakOleh, data.tarikhDisemak,
      parseFloat(data.bajetDisokong) || 0, data.kodBajet,
      data.disahkanOleh, data.tarikhDisahkan,
      data.diluluskanOleh, data.tarikhLulus
    ]);

    const proposalId = proposalResult.rows[0].id;

    if (data.objektif?.length > 0) {
      for (const obj of data.objektif) {
        if (obj?.trim()) {
          await client.query(
            'INSERT INTO objectives (proposal_id, objective_text) VALUES ($1, $2)',
            [proposalId, obj.trim()]
          );
        }
      }
    }

    const attachmentRecords = [];
    if (req.files?.length > 0) {
      for (const file of req.files) {
        const filePath = `/uploads/${file.filename}`;
        await client.query(
          'INSERT INTO attachments (proposal_id, file_name, file_path, file_type) VALUES ($1,$2,$3,$4)',
          [proposalId, file.originalname, filePath, file.mimetype]
        );
        attachmentRecords.push({ file_name: file.originalname, file_path: filePath });
      }
    }

    await client.query('COMMIT');
    res.status(201).json({ success: true, message: 'Kertas Cadangan berjaya disimpan!', proposalId, attachments: attachmentRecords });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error saving proposal:', err);
    res.status(500).json({ error: 'Gagal menyimpan data: ' + err.message });
  } finally {
    client.release();
  }
});

// ── GET /api/proposals ─────────────────────────────────────────
app.get('/api/proposals', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM proposals ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/proposals/:id ─────────────────────────────────────
app.get('/api/proposals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const proposal = await db.query('SELECT * FROM proposals WHERE id = $1', [id]);
    if (proposal.rows.length === 0) return res.status(404).json({ error: 'Cadangan tidak dijumpai.' });

    const objectives = await db.query('SELECT * FROM objectives WHERE proposal_id = $1 ORDER BY id', [id]);
    const attachments = await db.query('SELECT * FROM attachments WHERE proposal_id = $1 ORDER BY id', [id]);

    res.json({
      proposal: proposal.rows[0],
      objectives: objectives.rows,
      attachments: attachments.rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE /api/proposals/:id ──────────────────────────────────
app.delete('/api/proposals/:id', async (req, res) => {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    const { id } = req.params;

    // Delete file attachments from disk
    const attachments = await client.query('SELECT file_path FROM attachments WHERE proposal_id = $1', [id]);
    for (const att of attachments.rows) {
      const filePath = path.join(__dirname, att.file_path);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await client.query('DELETE FROM proposals WHERE id = $1', [id]);
    await client.query('COMMIT');
    res.json({ success: true, message: 'Cadangan berjaya dipadam.' });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
