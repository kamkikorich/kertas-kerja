import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import PrintDocument from '../components/PrintDocument';
import { createProposal } from '../utils/api';
import { Save, RotateCcw, Plus, X, Upload, Eye, EyeOff, Printer } from 'lucide-react';

const defaultData = {
  tajuk: '',
  tarikhTempat: '',
  masa: '',
  pengenalan: '',
  objektif: [''],
  kehadiran: '',
  jenisAktiviti: '',
  kumpulanSasaran: '',
  penceramah: '',
  tentatifProgram: '',
  kosPerbelanjaan: '',
  lainLainPerbelanjaan: '',
  implikasiAnggota: 'Tiada',
  roiKuantitatif: '',
  disediakanOleh: '',
  tarikhDisediakan: '',
  disemakOleh: '',
  tarikhDisemak: '',
  bajetDisokong: '',
  kodBajet: '',
  disahkanOleh: '',
  tarikhDisahkan: '',
  diluluskanOleh: '',
  tarikhLulus: '',
};

function Field({ label, required, children }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}{required && <span> *</span>}</label>
      {children}
    </div>
  );
}

export default function ProposalForm() {
  const [formData, setFormData] = useState(defaultData);
  const [attachments, setAttachments] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();

  const set = (name, value) => setFormData(prev => ({ ...prev, [name]: value }));
  const input = (name) => ({
    value: formData[name],
    onChange: (e) => set(name, e.target.value),
    className: 'form-input',
  });
  const textarea = (name) => ({
    value: formData[name],
    onChange: (e) => set(name, e.target.value),
    className: 'form-textarea',
  });

  const addObj = () => set('objektif', [...formData.objektif, '']);
  const removeObj = (i) => set('objektif', formData.objektif.filter((_, j) => j !== i));
  const setObj = (i, v) => {
    const a = [...formData.objektif]; a[i] = v; set('objektif', a);
  };

  const onFile = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(prev => [...prev, ...files]);
    setPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  };
  const removeFile = (i) => {
    setAttachments(prev => prev.filter((_, j) => j !== i));
    setPreviews(prev => prev.filter((_, j) => j !== i));
  };

  const handleSave = async () => {
    if (!formData.tajuk.trim()) { setAlert({ type: 'danger', msg: 'Sila isi Tajuk Program.' }); return; }
    try {
      setSaving(true);
      setAlert(null);
      const fd = new FormData();
      fd.append('data', JSON.stringify(formData));
      attachments.forEach(f => fd.append('attachments', f));
      const res = await createProposal(fd);
      if (res.data.success) {
        setAlert({ type: 'success', msg: `Berjaya disimpan! ID: ${res.data.proposalId}` });
        setTimeout(() => navigate('/'), 1500);
      }
    } catch (e) {
      const msg = e.response?.data?.error || 'Gagal menyambung ke pelayan backend.';
      setAlert({ type: 'danger', msg });
    } finally {
      setSaving(false);
    }
  };

  const total = (parseFloat(formData.kosPerbelanjaan) || 0) + (parseFloat(formData.lainLainPerbelanjaan) || 0);

  return (
    <Layout title="Cadangan Baharu" subtitle="Isi maklumat kertas cadangan program">
      {alert && (
        <div className={`alert alert-${alert.type}`} style={{ marginBottom: '1.5rem' }}>
          {alert.msg}
        </div>
      )}

      {/* Action bar */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }} className="no-print">
        <button className="btn btn-success" onClick={handleSave} disabled={saving}>
          {saving ? <><div className="spinner" /> Menyimpan...</> : <><Save size={16} /> Simpan ke Database</>}
        </button>
        <button
          className={`btn ${showPreview ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setShowPreview(p => !p)}
        >
          {showPreview ? <><EyeOff size={16} /> Sembunyikan Pratonton</> : <><Eye size={16} /> Pratonton PDF</>}
        </button>
        {showPreview && (
          <button className="btn btn-ghost" onClick={() => window.print()}>
            <Printer size={16} /> Cetak
          </button>
        )}
        <button className="btn btn-ghost" onClick={() => setFormData(defaultData)}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      <div style={{ display: 'grid', gap: '1.25rem' }}>
        {/* A: Maklumat Asas */}
        <div className="card card-pad">
          <div className="section-title">📋 Maklumat Asas</div>
          <div className="form-grid">
            <Field label="Tajuk Program" required>
              <textarea {...textarea('tajuk')} rows={2} placeholder="Contoh: Program Sambutan Hari PERKESO..." />
            </Field>
            <div className="form-grid form-grid-2">
              <Field label="Tarikh & Tempat"><input type="text" {...input('tarikhTempat')} placeholder="8 Oktober 2025, Pejabat PERKESO Keningau" /></Field>
              <Field label="Masa"><input type="text" {...input('masa')} placeholder="9.30 Pagi - 2.00 Petang" /></Field>
            </div>
          </div>
        </div>

        {/* B: Bahagian A */}
        <div className="card card-pad">
          <div className="section-title">🅰️ Bahagian A: Maklumat Program</div>
          <div className="form-grid">
            <Field label="Pengenalan / Tujuan">
              <textarea {...textarea('pengenalan')} rows={3} placeholder="Tujuan kertas cadangan adalah untuk..." />
            </Field>

            <Field label="Objektif Program">
              {formData.objektif.map((obj, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input type="text" className="form-input" value={obj} onChange={e => setObj(i, e.target.value)} placeholder={`Objektif ${i + 1}`} />
                  {formData.objektif.length > 1 && (
                    <button className="btn btn-danger btn-sm btn-icon" onClick={() => removeObj(i)}><X size={14} /></button>
                  )}
                </div>
              ))}
              <button className="btn btn-ghost btn-sm" style={{ width: '100%', marginTop: '0.25rem' }} onClick={addObj}>
                <Plus size={14} /> Tambah Objektif
              </button>
            </Field>

            <div className="form-grid form-grid-2">
              <Field label="Jumlah Kehadiran"><input type="text" {...input('kehadiran')} placeholder="43 orang" /></Field>
              <Field label="Penceramah"><input type="text" {...input('penceramah')} placeholder="Nama penceramah" /></Field>
            </div>

            <Field label="Jenis Aktiviti">
              <textarea {...textarea('jenisAktiviti')} rows={2} placeholder="Taklimat, Kuiz, Ceramah..." />
            </Field>
            <Field label="Kumpulan Sasaran / Peserta">
              <textarea {...textarea('kumpulanSasaran')} rows={2} placeholder="Orang Berinsurans, Majikan..." />
            </Field>
            <Field label="Tentatif Program">
              <input type="text" {...input('tentatifProgram')} placeholder="Rujuk Lampiran / ringkasan" />
            </Field>

            <div className="form-grid form-grid-2">
              <Field label="Kos Perbelanjaan (RM)">
                <input type="number" step="0.01" {...input('kosPerbelanjaan')} placeholder="0.00" />
              </Field>
              <Field label="Lain-lain Perbelanjaan (RM)">
                <input type="number" step="0.01" {...input('lainLainPerbelanjaan')} placeholder="0.00" />
              </Field>
            </div>

            {(formData.kosPerbelanjaan || formData.lainLainPerbelanjaan) && (
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '0.75rem 1rem', fontSize: '0.9rem' }}>
                <strong>Jumlah Keseluruhan: RM {total.toFixed(2)}</strong>
              </div>
            )}

            <Field label="Implikasi Perbelanjaan Anggota">
              <input type="text" {...input('implikasiAnggota')} placeholder="Tiada / Ada" />
            </Field>
            <Field label="Anggaran Pulangan Pelaburan (ROI)">
              <textarea {...textarea('roiKuantitatif')} rows={2} placeholder="Sasaran pencarum baharu..." />
            </Field>
          </div>
        </div>

        {/* C: Bahagian B */}
        <div className="card card-pad">
          <div className="section-title">🅱️ Bahagian B: Pengesyoran & Sokongan</div>
          <div className="form-grid">
            <div className="form-grid form-grid-2">
              <Field label="Disediakan Oleh"><input type="text" {...input('disediakanOleh')} placeholder="Nama & Jawatan" /></Field>
              <Field label="Tarikh Disediakan"><input type="text" {...input('tarikhDisediakan')} placeholder="DD/MM/YYYY" /></Field>
              <Field label="Disemak & Disokong Oleh"><input type="text" {...input('disemakOleh')} placeholder="Nama & Jawatan" /></Field>
              <Field label="Tarikh Disemak"><input type="text" {...input('tarikhDisemak')} placeholder="DD/MM/YYYY" /></Field>
            </div>
            <div className="form-grid form-grid-2">
              <Field label="Bajet Disokong (RM)">
                <input type="number" step="0.01" {...input('bajetDisokong')} placeholder="0.00" />
              </Field>
              <Field label="Kod Bajet">
                <input type="text" {...input('kodBajet')} placeholder="B75145" />
              </Field>
            </div>
          </div>
        </div>

        {/* D: Bahagian C */}
        <div className="card card-pad">
          <div className="section-title">✅ Bahagian C: Kelulusan Akhir</div>
          <div className="form-grid form-grid-2">
            <Field label="Disahkan Oleh"><input type="text" {...input('disahkanOleh')} placeholder="Nama & Jawatan" /></Field>
            <Field label="Tarikh Disahkan"><input type="text" {...input('tarikhDisahkan')} placeholder="DD/MM/YYYY" /></Field>
            <Field label="Diluluskan Oleh"><input type="text" {...input('diluluskanOleh')} placeholder="Nama & Jawatan" /></Field>
            <Field label="Tarikh Lulus"><input type="text" {...input('tarikhLulus')} placeholder="DD/MM/YYYY" /></Field>
          </div>
        </div>

        {/* E: Lampiran */}
        <div className="card card-pad">
          <div className="section-title">📎 Lampiran (Gambar / Resit / Sebut Harga)</div>
          <label style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: '0.5rem', padding: '2rem', border: '2px dashed var(--border)', borderRadius: 8,
            cursor: 'pointer', color: 'var(--text-muted)', background: '#f8fafc', transition: 'all 0.2s'
          }}>
            <Upload size={28} />
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Klik untuk muat naik gambar</span>
            <span style={{ fontSize: '0.78rem' }}>PNG, JPG — Maks 10 fail</span>
            <input type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={onFile} />
          </label>

          {previews.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1rem' }}>
              {previews.map((url, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <img src={url} alt="" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' }} />
                  <button onClick={() => removeFile(i)} style={{
                    position: 'absolute', top: -6, right: -6, background: 'var(--danger)', color: '#fff',
                    border: 'none', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer', fontSize: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}><X size={10} /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom save */}
        <div style={{ display: 'flex', gap: '0.75rem', paddingBottom: '1rem' }} className="no-print">
          <button className="btn btn-success" onClick={handleSave} disabled={saving} style={{ flex: 1, justifyContent: 'center', padding: '0.85rem' }}>
            {saving ? <><div className="spinner" /> Menyimpan...</> : <><Save size={18} /> Simpan Kertas Cadangan</>}
          </button>
        </div>
      </div>

      {/* Live Preview Panel */}
      {showPreview && (
        <div style={{ marginTop: '2rem' }} id="print-wrapper">
          <div className="no-print" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '1rem', padding: '0.75rem 1rem',
            background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8
          }}>
            <span style={{ fontSize: '0.875rem', color: '#1e40af', fontWeight: 600 }}>
              👁️ Pratonton langsung — dokumen dikemas kini secara automatik
            </span>
            <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
              <Printer size={14} /> Cetak / PDF
            </button>
          </div>
          <PrintDocument
            data={formData}
            objectives={formData.objektif || []}
          />
        </div>
      )}
    </Layout>
  );
}
