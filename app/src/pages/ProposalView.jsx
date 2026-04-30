import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { getProposal } from '../utils/api';
import { Printer, ArrowLeft } from 'lucide-react';

export default function ProposalView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [objectives, setObjectives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getProposal(id)
      .then(res => {
        setData(res.data.proposal);
        setObjectives(res.data.objectives || []);
      })
      .catch(() => setError('Gagal memuatkan data cadangan.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Layout title="Memuatkan..."><div style={{ padding: '3rem', textAlign: 'center' }}>Memuatkan...</div></Layout>;
  if (error) return <Layout title="Ralat"><div className="alert alert-danger">{error}</div></Layout>;

  const total = (parseFloat(data.kos_perbelanjaan) || 0) + (parseFloat(data.lain_lain_perbelanjaan) || 0);

  return (
    <Layout title="Pratonton Cadangan" subtitle={data.tajuk}>
      {/* Controls */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }} className="no-print">
        <button className="btn btn-ghost" onClick={() => navigate(-1)}><ArrowLeft size={15} /> Kembali</button>
        <button className="btn btn-primary" onClick={() => window.print()}><Printer size={15} /> Cetak / PDF</button>
      </div>

      {/* Document */}
      <div className="card" style={{ maxWidth: 900, margin: '0 auto' }}>
        <div className="doc-page" style={{ padding: '2.5rem' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem', borderBottom: '2px solid #333', paddingBottom: '1.5rem' }}>
            <img src="https://i.postimg.cc/15xdZ3RK/perkeso-logo.jpg" alt="PERKESO" style={{ width: 80, marginBottom: '0.75rem' }} />
            <h1 style={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.5, maxWidth: 600, margin: '0 auto' }}>{data.tajuk}</h1>
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
              <strong>Tarikh & Tempat:</strong> {data.tarikh_tempat} &nbsp;|&nbsp; <strong>Masa:</strong> {data.masa}
            </p>
          </div>

          {/* Bahagian A */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ background: '#f1f5f9', padding: '0.5rem 1rem', fontWeight: 700, borderLeft: '4px solid #2563eb', marginBottom: '1rem', fontSize: '0.9rem' }}>
              BAHAGIAN A: MAKLUMAT PROGRAM
            </div>

            <DocBox num="1" title="Pengenalan">{data.pengenalan}</DocBox>

            <DocBox num="2" title="Objektif">
              <ul style={{ paddingLeft: '1.5rem', lineHeight: 2 }}>
                {objectives.map((o, i) => <li key={i}>{o.objective_text}</li>)}
              </ul>
            </DocBox>

            <DocBox num="3" title="Butiran Program">
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '35%', padding: '5px 8px', border: '1px solid #cbd5e1', fontWeight: 600 }}>Jumlah Kehadiran</td>
                    <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1' }}>{data.kehadiran}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', fontWeight: 600 }}>Jenis Aktiviti</td>
                    <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1' }}>{data.jenis_aktiviti}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', fontWeight: 600 }}>Kumpulan Sasaran</td>
                    <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1' }}>{data.kumpulan_sasaran}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', fontWeight: 600 }}>Penceramah</td>
                    <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1' }}>{data.penceramah}</td>
                  </tr>
                </tbody>
              </table>
            </DocBox>

            <DocBox num="4" title="Tentatif Program">{data.tentatif_program}</DocBox>

            <DocBox num="5" title="Implikasi Kewangan">
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '55%', padding: '5px 8px', border: '1px solid #cbd5e1' }}>Kos Perbelanjaan</td>
                    <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1' }}>RM {parseFloat(data.kos_perbelanjaan || 0).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1' }}>Lain-lain Perbelanjaan</td>
                    <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1' }}>RM {parseFloat(data.lain_lain_perbelanjaan || 0).toFixed(2)}</td>
                  </tr>
                  <tr style={{ background: '#f8fafc' }}>
                    <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', fontWeight: 700 }}>Jumlah Keseluruhan</td>
                    <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', fontWeight: 700 }}>RM {total.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </DocBox>

            <DocBox num="6" title="Implikasi Perbelanjaan Anggota">{data.implikasi_anggota}</DocBox>
            <DocBox num="7" title="Anggaran Pulangan Pelaburan (ROI)">{data.roi_kuantitatif}</DocBox>
          </div>

          {/* Bahagian B */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ background: '#f1f5f9', padding: '0.5rem 1rem', fontWeight: 700, borderLeft: '4px solid #2563eb', marginBottom: '1rem', fontSize: '0.9rem' }}>
              BAHAGIAN B: PENGESYORAN & SOKONGAN
            </div>
            <div style={{ border: '1px solid #cbd5e1', borderRadius: 8, padding: '1.25rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <SigBlock label="Disediakan Oleh" name={data.disediakan_oleh} date={data.tarikh_disediakan}
                extra={`Menyokong perbelanjaan RM ${parseFloat(data.bajet_disokong || 0).toFixed(2)}`} />
              <SigBlock label="Disemak & Disokong Oleh" name={data.disemak_oleh} date={data.tarikh_disemak} />
            </div>
            <div style={{ marginTop: '0.75rem', padding: '0.6rem 1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: '0.875rem' }}>
              <strong>Kod Bajet:</strong> {data.kod_bajet} &nbsp;|&nbsp; <strong>Bajet Disokong:</strong> RM {parseFloat(data.bajet_disokong || 0).toFixed(2)}
            </div>
          </div>

          {/* Bahagian C */}
          <div>
            <div style={{ background: '#f1f5f9', padding: '0.5rem 1rem', fontWeight: 700, borderLeft: '4px solid #2563eb', marginBottom: '1rem', fontSize: '0.9rem' }}>
              BAHAGIAN C: KELULUSAN AKHIR
            </div>
            <div style={{ border: '1px solid #cbd5e1', borderRadius: 8, padding: '1.25rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <SigBlock label="Disahkan Oleh" name={data.disahkan_oleh} date={data.tarikh_disahkan} />
              <SigBlock label="Diluluskan Oleh (Status: Diluluskan)" name={data.diluluskan_oleh} date={data.tarikh_lulus} />
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}

function DocBox({ num, title, children }) {
  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, marginBottom: '0.75rem', overflow: 'hidden' }}>
      <div style={{ background: '#f8fafc', padding: '0.5rem 1rem', fontWeight: 600, fontSize: '0.85rem', display: 'flex', gap: '0.5rem', borderBottom: '1px solid #e2e8f0' }}>
        <span>{num}.</span> <span>{title}</span>
      </div>
      <div style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

function SigBlock({ label, name, date, extra }) {
  return (
    <div>
      <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.4rem' }}>{label}:</div>
      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{name || '-'}</div>
      {extra && <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.2rem' }}>{extra}</div>}
      <div style={{ marginTop: '0.5rem', borderTop: '1px solid #cbd5e1', paddingTop: '0.4rem', fontSize: '0.78rem', color: '#64748b' }}>
        Tarikh: {date || '-'}
      </div>
    </div>
  );
}
