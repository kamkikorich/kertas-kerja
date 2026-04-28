const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const db = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Only accept images for now as discussed
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Hanya fail imej (JPG/PNG) dibenarkan untuk lampiran!'), false);
    }
  }
});

// Initialize DB tables
db.initDB();

// Routes
app.post('/api/proposals', upload.array('attachments', 10), async (req, res) => {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    
    // Parse form data (since it comes as multipart/form-data)
    const data = JSON.parse(req.body.data);
    
    // 1. Insert Proposal
    const proposalQuery = `
      INSERT INTO proposals (
        tajuk, tarikh_tempat, masa, pengenalan, kehadiran, jenis_aktiviti, 
        kumpulan_sasaran, penceramah, tentatif_program, kos_perbelanjaan, lain_lain_perbelanjaan, 
        implikasi_anggota, roi_kuantitatif, disediakan_oleh, tarikh_disediakan, 
        disemak_oleh, tarikh_disemak, bajet_disokong, kod_bajet, 
        disahkan_oleh, tarikh_disahkan, diluluskan_oleh, tarikh_lulus
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
      RETURNING id;
    `;
    const proposalValues = [
      data.tajuk, data.tarikhTempat, data.masa, data.pengenalan, data.kehadiran, data.jenisAktiviti,
      data.kumpulanSasaran, data.penceramah, data.tentatifProgram, data.kosPerbelanjaan || 0, data.lainLainPerbelanjaan || 0,
      data.implikasiAnggota, data.roiKuantitatif, data.disediakanOleh, data.tarikhDisediakan,
      data.disemakOleh, data.tarikhDisemak, data.bajetDisokong || 0, data.kodBajet,
      data.disahkanOleh, data.tarikhDisahkan, data.diluluskanOleh, data.tarikhLulus
    ];
    
    const proposalResult = await client.query(proposalQuery, proposalValues);
    const proposalId = proposalResult.rows[0].id;
    
    // 2. Insert Objectives
    if (data.objektif && data.objektif.length > 0) {
      for (const obj of data.objektif) {
        if (obj.trim() !== '') {
          await client.query(
            'INSERT INTO objectives (proposal_id, objective_text) VALUES ($1, $2)',
            [proposalId, obj]
          );
        }
      }
    }
    
    // 3. Insert Attachments
    const attachmentRecords = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const filePath = `/uploads/${file.filename}`;
        await client.query(
          'INSERT INTO attachments (proposal_id, file_name, file_path, file_type) VALUES ($1, $2, $3, $4)',
          [proposalId, file.originalname, filePath, file.mimetype]
        );
        attachmentRecords.push({
          file_name: file.originalname,
          file_path: filePath
        });
      }
    }
    
    await client.query('COMMIT');
    res.status(201).json({ 
      success: true, 
      message: 'Kertas Cadangan berjaya disimpan!',
      proposalId,
      attachments: attachmentRecords
    });
    
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error saving proposal:', err);
    res.status(500).json({ error: 'Gagal menyimpan data ke pangkalan data.' });
  } finally {
    client.release();
  }
});

// GET endpoint just for testing/verification
app.get('/api/proposals', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM proposals ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
