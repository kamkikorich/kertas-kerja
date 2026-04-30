import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, FilePlus, FolderOpen, TrendingUp, Clock, Trash2, Eye } from 'lucide-react';
import Layout from '../components/Layout';
import { getProposals, deleteProposal } from '../utils/api';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function Dashboard() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getProposals();
      setProposals(res.data);
    } catch (e) {
      setError('Gagal memuat data. Pastikan pelayan backend berjalan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async () => {
    try {
      await deleteProposal(deleteModal.id);
      setDeleteModal(null);
      fetchData();
    } catch {
      alert('Gagal memadam cadangan.');
    }
  };

  const totalBajet = proposals.reduce((sum, p) => sum + (parseFloat(p.bajet_disokong) || 0), 0);

  return (
    <Layout title="Dashboard" subtitle="Ringkasan Kertas Cadangan PERKESO Keningau">
      {/* Stats */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon blue"><FolderOpen size={22} /></div>
          <div>
            <div className="stat-value">{proposals.length}</div>
            <div className="stat-label">Jumlah Cadangan</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><TrendingUp size={22} /></div>
          <div>
            <div className="stat-value">RM {totalBajet.toFixed(0)}</div>
            <div className="stat-label">Jumlah Bajet</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber"><Clock size={22} /></div>
          <div>
            <div className="stat-value">{proposals.filter(p => {
              const d = new Date(p.created_at);
              const now = new Date();
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            }).length}</div>
            <div className="stat-label">Bulan Ini</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon cyan"><FilePlus size={22} /></div>
          <div>
            <div className="stat-value" style={{ fontSize: '1.1rem', marginTop: '0.25rem' }}>
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/new')}>
                + Baharu
              </button>
            </div>
            <div className="stat-label">Buat Cadangan</div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Senarai Kertas Cadangan</h2>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/new')}>
            <FilePlus size={15} /> Cadangan Baharu
          </button>
        </div>

        {error && <div className="alert alert-danger" style={{ margin: '1rem' }}>{error}</div>}

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div className="spinner" style={{ borderTopColor: 'var(--primary)', borderColor: 'var(--border)', margin: '0 auto 1rem' }} />
            Memuatkan data...
          </div>
        ) : proposals.length === 0 ? (
          <div className="empty-state">
            <FolderOpen size={48} />
            <h3>Tiada Cadangan Lagi</h3>
            <p style={{ fontSize: '0.875rem', marginBottom: '1.25rem' }}>Mulakan dengan membuat kertas cadangan pertama anda.</p>
            <button className="btn btn-primary" onClick={() => navigate('/new')}>
              <FilePlus size={16} /> Buat Cadangan Baharu
            </button>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tajuk Program</th>
                  <th>Disediakan Oleh</th>
                  <th>Bajet (RM)</th>
                  <th>Tarikh Simpan</th>
                  <th>Tindakan</th>
                </tr>
              </thead>
              <tbody>
                {proposals.map((p, i) => (
                  <tr key={p.id}>
                    <td><span className="badge badge-blue">{i + 1}</span></td>
                    <td style={{ maxWidth: 280 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.4 }}>{p.tajuk || '-'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{p.tarikh_tempat || ''}</div>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{p.disediakan_oleh || '-'}</td>
                    <td>
                      <span className="badge badge-green">
                        RM {parseFloat(p.bajet_disokong || 0).toFixed(2)}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {p.created_at ? format(new Date(p.created_at), 'dd MMM yyyy', { locale: id }) : '-'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-ghost btn-sm btn-icon" title="Lihat / Cetak"
                          onClick={() => navigate(`/view/${p.id}`)}>
                          <Eye size={15} />
                        </button>
                        <button className="btn btn-danger btn-sm btn-icon" title="Padam"
                          onClick={() => setDeleteModal(p)}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal-title">⚠️ Sahkan Pemadaman</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Adakah anda pasti mahu memadam cadangan:<br />
              <strong style={{ color: 'var(--text)' }}>"{deleteModal.tajuk}"</strong>?<br />
              Tindakan ini tidak boleh dibatalkan.
            </p>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setDeleteModal(null)}>Batal</button>
              <button className="btn btn-danger" onClick={handleDelete}>Ya, Padam</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
