import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import PrintDocument from '../components/PrintDocument';
import { getProposal } from '../utils/api';
import { Printer, ArrowLeft } from 'lucide-react';

export default function ProposalView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState(null);
  const [objectives, setObjectives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getProposal(id)
      .then(res => {
        setProposal(res.data.proposal);
        setObjectives(res.data.objectives || []);
      })
      .catch(() => setError('Gagal memuatkan data cadangan. Pastikan backend berjalan.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Layout title="Memuatkan...">
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div className="spinner" style={{ borderTopColor: 'var(--primary)', borderColor: 'var(--border)', margin: '0 auto 1rem', width: 32, height: 32 }} />
          Memuatkan dokumen...
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Ralat">
        <div className="alert alert-danger">{error}</div>
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>
          <ArrowLeft size={15} /> Kembali
        </button>
      </Layout>
    );
  }

  return (
    <Layout title="Pratonton & Cetak" subtitle={proposal?.tajuk}>
      {/* Action bar — hidden during print */}
      <div className="no-print" style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>
          <ArrowLeft size={15} /> Kembali ke Dashboard
        </button>
        <button className="btn btn-primary" onClick={() => window.print()}>
          <Printer size={15} /> Cetak / Simpan PDF
        </button>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.25rem' }}>
          💡 Tip: Dalam dialog cetak, pilih "Save as PDF" untuk simpan sebagai PDF
        </span>
      </div>

      {/* Wrapper for print targeting */}
      <div id="print-wrapper">
        <PrintDocument data={proposal} objectives={objectives} />
      </div>
    </Layout>
  );
}
