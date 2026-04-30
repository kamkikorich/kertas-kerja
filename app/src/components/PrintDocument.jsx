/**
 * PrintDocument.jsx
 * Komponen dokumen rasmi yang boleh dicetak sebagai PDF.
 * Digunakan oleh ProposalView (dari database) dan ProposalForm (live preview).
 *
 * Props:
 *   - data: object (camelCase untuk form, snake_case untuk DB — kedua-dua disokong)
 *   - objectives: array of strings atau array of {objective_text} objects
 */
export default function PrintDocument({ data, objectives = [] }) {
  if (!data) return null;

  // Support both camelCase (form) and snake_case (DB)
  const g = (camel, snake) => data[camel] ?? data[snake] ?? '';

  const tajuk           = g('tajuk', 'tajuk');
  const tarikhTempat    = g('tarikhTempat', 'tarikh_tempat');
  const masa            = g('masa', 'masa');
  const pengenalan      = g('pengenalan', 'pengenalan');
  const kehadiran       = g('kehadiran', 'kehadiran');
  const jenisAktiviti   = g('jenisAktiviti', 'jenis_aktiviti');
  const kumpulanSasaran = g('kumpulanSasaran', 'kumpulan_sasaran');
  const penceramah      = g('penceramah', 'penceramah');
  const tentatifProgram = g('tentatifProgram', 'tentatif_program');
  const kosPerbelanjaan = parseFloat(g('kosPerbelanjaan', 'kos_perbelanjaan') || 0);
  const lainLain        = parseFloat(g('lainLainPerbelanjaan', 'lain_lain_perbelanjaan') || 0);
  const implikasi       = g('implikasiAnggota', 'implikasi_anggota');
  const roi             = g('roiKuantitatif', 'roi_kuantitatif');
  const disediakanOleh  = g('disediakanOleh', 'disediakan_oleh');
  const tarikhDisediakan= g('tarikhDisediakan', 'tarikh_disediakan');
  const disemakOleh     = g('disemakOleh', 'disemak_oleh');
  const tarikhDisemak   = g('tarikhDisemak', 'tarikh_disemak');
  const bajetDisokong   = parseFloat(g('bajetDisokong', 'bajet_disokong') || 0);
  const kodBajet        = g('kodBajet', 'kod_bajet');
  const disahkanOleh    = g('disahkanOleh', 'disahkan_oleh');
  const tarikhDisahkan  = g('tarikhDisahkan', 'tarikh_disahkan');
  const diluluskanOleh  = g('diluluskanOleh', 'diluluskan_oleh');
  const tarikhLulus     = g('tarikhLulus', 'tarikh_lulus');
  const total           = kosPerbelanjaan + lainLain;

  // Normalise objectives — accept string[] or {objective_text}[]
  const objList = objectives.map(o => (typeof o === 'string' ? o : o.objective_text)).filter(Boolean);

  return (
    <div className="print-doc" id="print-area">

      {/* ── PAGE 1 ── */}
      <div className="print-page">

        {/* Document header */}
        <div className="print-header">
          <img src="https://i.postimg.cc/15xdZ3RK/perkeso-logo.jpg" alt="PERKESO Logo" className="print-logo" />
          <div className="print-org">PERTUBUHAN KESELAMATAN SOSIAL (PERKESO)</div>
          <h1 className="print-title">{tajuk || '—'}</h1>
          <div className="print-meta">
            <span><strong>Tarikh &amp; Tempat:</strong> {tarikhTempat || '—'}</span>
            <span className="print-meta-sep">|</span>
            <span><strong>Masa:</strong> {masa || '—'}</span>
          </div>
        </div>

        {/* ── BAHAGIAN A ── */}
        <div className="print-section">
          <div className="print-section-title">BAHAGIAN A: MAKLUMAT PROGRAM</div>

          <div className="print-item">
            <div className="print-item-head"><span className="print-num">1.</span> Pengenalan</div>
            <div className="print-item-body">{pengenalan || '—'}</div>
          </div>

          <div className="print-item">
            <div className="print-item-head"><span className="print-num">2.</span> Objektif</div>
            <div className="print-item-body">
              {objList.length > 0 ? (
                <ol className="print-ol">
                  {objList.map((o, i) => <li key={i}>{o}</li>)}
                </ol>
              ) : <span>—</span>}
            </div>
          </div>

          <div className="print-item">
            <div className="print-item-head"><span className="print-num">3.</span> Butiran Program</div>
            <div className="print-item-body">
              <table className="print-table">
                <tbody>
                  <tr><td className="print-td-label">Jumlah Kehadiran</td><td>{kehadiran || '—'}</td></tr>
                  <tr><td className="print-td-label">Jenis Aktiviti</td><td>{jenisAktiviti || '—'}</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="print-item">
            <div className="print-item-head"><span className="print-num">4.</span> Keterangan Jemputan</div>
            <div className="print-item-body">
              <table className="print-table">
                <tbody>
                  <tr><td className="print-td-label">Kumpulan Sasaran / Peserta</td><td>{kumpulanSasaran || '—'}</td></tr>
                  <tr><td className="print-td-label">Penceramah</td><td>{penceramah || '—'}</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="print-item">
            <div className="print-item-head"><span className="print-num">5.</span> Tentatif Program</div>
            <div className="print-item-body">{tentatifProgram || '—'}</div>
          </div>

          <div className="print-item">
            <div className="print-item-head"><span className="print-num">6.</span> Implikasi Kewangan</div>
            <div className="print-item-body">
              <table className="print-table">
                <tbody>
                  <tr>
                    <td className="print-td-label">Kos Perbelanjaan</td>
                    <td>RM {kosPerbelanjaan.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="print-td-label">Lain-lain Perbelanjaan (Hadiah, dll)</td>
                    <td>RM {lainLain.toFixed(2)}</td>
                  </tr>
                  <tr className="print-total-row">
                    <td><strong>Jumlah Keseluruhan Perbelanjaan</strong></td>
                    <td><strong>RM {total.toFixed(2)}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="print-item">
            <div className="print-item-head"><span className="print-num">7.</span> Implikasi Perbelanjaan Anggota</div>
            <div className="print-item-body">{implikasi || '—'}</div>
          </div>

          <div className="print-item">
            <div className="print-item-head"><span className="print-num">8.</span> Anggaran Pulangan Pelaburan (ROI / Kuantitatif)</div>
            <div className="print-item-body">{roi || '—'}</div>
          </div>
        </div>
      </div>

      {/* ── PAGE 2 ── */}
      <div className="print-page print-page-break">

        {/* ── BAHAGIAN B ── */}
        <div className="print-section">
          <div className="print-section-title">BAHAGIAN B: PENGESYORAN &amp; SOKONGAN</div>
          <div className="print-sig-grid">
            <div className="print-sig-block">
              <div className="print-sig-role">Disediakan Oleh:</div>
              <div className="print-sig-space"></div>
              <div className="print-sig-line"></div>
              <div className="print-sig-name">{disediakanOleh || '___________________________'}</div>
              <div className="print-sig-date">Tarikh: {tarikhDisediakan || '________________'}</div>
            </div>
            <div className="print-sig-block">
              <div className="print-sig-role">Disemak dan Disokong Oleh:</div>
              <div className="print-sig-space"></div>
              <div className="print-sig-line"></div>
              <div className="print-sig-name">{disemakOleh || '___________________________'}</div>
              <div className="print-sig-note">
                Menyokong untuk kelulusan dengan bajet<br />
                <strong>RM {bajetDisokong.toFixed(2)}</strong> (Kod Bajet: {kodBajet || '—'})
              </div>
              <div className="print-sig-date">Tarikh: {tarikhDisemak || '________________'}</div>
            </div>
          </div>
        </div>

        {/* ── BAHAGIAN C ── */}
        <div className="print-section" style={{ marginTop: '3rem' }}>
          <div className="print-section-title">BAHAGIAN C: KELULUSAN AKHIR</div>
          <div className="print-section-sub">(Kegunaan Bahagian Komunikasi &amp; Hal Ehwal Korporat)</div>

          <div className="print-budget-info">
            <strong>Kod Bajet Digunakan:</strong> {kodBajet || '—'}
          </div>

          <div className="print-sig-grid" style={{ marginTop: '2rem' }}>
            <div className="print-sig-block">
              <div className="print-sig-role">Disahkan Oleh:</div>
              <div className="print-sig-space"></div>
              <div className="print-sig-line"></div>
              <div className="print-sig-name">{disahkanOleh || '___________________________'}</div>
              <div className="print-sig-date">Tarikh: {tarikhDisahkan || '________________'}</div>
            </div>
            <div className="print-sig-block">
              <div className="print-sig-role">Kelulusan (Status: <strong>Diluluskan</strong>)</div>
              <div className="print-sig-space"></div>
              <div className="print-sig-line"></div>
              <div className="print-sig-name">{diluluskanOleh || '___________________________'}</div>
              <div className="print-sig-date">Tarikh: {tarikhLulus || '________________'}</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="print-footer">
          Dokumen ini dijana oleh Sistem Kertas Cadangan PERKESO Keningau &mdash; SULIT
        </div>
      </div>
    </div>
  );
}
