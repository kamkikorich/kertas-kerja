import { useState } from 'react';
import './index.css';

const defaultData = {
  tajuk: "Kertas Cadangan Program Sambutan Hari PERKESO Ke-54 Tahun Peringkat Pejabat PERKESO Keningau",
  tarikhTempat: "8 Oktober 2025, Pejabat PERKESO Keningau",
  masa: "9.30 Pagi sehingga 02.00 Petang",
  pengenalan: "Tujuan kertas cadangan adalah untuk mendapatkan kelulusan serta peruntukan kewangan daripada Bahagian Komunikasi & Hal Ehwal Korporat bagi melaksanakan program ini.",
  objektif1: "Meraikan ulang tahun penubuhan PERKESO yang ke-54 sebagai tanda penghargaan.",
  objektif2: "Memperingati peranan dan jasa bakti PERKESO dalam memberikan perlindungan keselamatan sosial sejak tahun 1971.",
  objektif3: "Menunjukkan komitmen organisasi dalam memperkukuh kualiti penyampaian perkhidmatan dan meluaskan perlindungan.",
  kehadiran: "43 orang (1 Penceramah, 9 Urusetia, 33 Peserta)",
  jenisAktiviti: "Taklimat Skim PERKESO dan Kuiz, Ceramah Kesihatan (Asas CPR) dan Kuiz, Pelanggan bertuah, dan Penyampaian Faedah serta Kotak Prihatin PERKESO",
  kumpulanSasaran: "Orang Berinsurans Penerima Faedah, Surirumah & Pekerja Sendiri, serta Majikan",
  penceramah: "Walter Epor dari Pejabat Kesihatan Keningau",
  kosPerbelanjaan: "860.00",
  lainLainPerbelanjaan: "1000.00",
  implikasiAnggota: "Tiada (Tidak berkaitan)",
  roiKuantitatif: "Sasaran Pencarum Baharu: Akta 4 (5 orang), Akta 800 (5 orang), Akta 789 (10 orang), dan Akta 838 (10 orang)",
  disediakanOleh: "Nancy Goliong, Pengurus, Pejabat PERKESO Keningau",
  tarikhDisediakan: "10/9/2025",
  disemakOleh: "Azirruan Bin Arifin, Timbalan Ketua Eksekutif (Operasi)",
  tarikhDisemak: "25/9/2025",
  bajetDisokong: "1860.00",
  kodBajet: "B75145",
  disahkanOleh: "Roshaimi Bin Mat Rosely, Ketua Pegawai Bahagian Komunikasi & Hal Ehwal Korporat",
  tarikhDisahkan: "26/9/2025",
  diluluskanOleh: "Dato' Sri Dr. Mohammed Azman Bin Aziz Mohammed, Ketua Pegawai Eksekutif Kumpulan",
  tarikhLulus: "29/9/2025"
};

function App() {
  const [formData, setFormData] = useState(defaultData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePrint = () => {
    window.print();
  };

  const calculateTotal = () => {
    const kos = parseFloat(formData.kosPerbelanjaan) || 0;
    const lain = parseFloat(formData.lainLainPerbelanjaan) || 0;
    return (kos + lain).toFixed(2);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header-bar">
        <h1>
          <div className="logo-placeholder">P</div>
          Penjana Kertas Cadangan PERKESO
        </h1>
        <div>
          <button className="btn btn-secondary" onClick={() => setFormData(defaultData)}>Tetapkan Semula (Reset)</button>
        </div>
      </header>

      {/* Main Content */}
      <div className="split-pane">
        
        {/* Form Panel */}
        <div className="form-panel">
          <div className="form-header">
            <h2>Borang Kertas Cadangan</h2>
            <p>Isi maklumat di bawah untuk menjana kertas cadangan program anda.</p>
          </div>
          
          <div className="form-content">
            <div className="form-section">
              <h3>Maklumat Asas</h3>
              <div className="form-group">
                <label>Tajuk Program</label>
                <textarea 
                  className="form-input" 
                  name="tajuk" 
                  value={formData.tajuk} 
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Tarikh & Tempat Program</label>
                <input 
                  type="text" 
                  className="form-input" 
                  name="tarikhTempat" 
                  value={formData.tarikhTempat} 
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Masa Program</label>
                <input 
                  type="text" 
                  className="form-input" 
                  name="masa" 
                  value={formData.masa} 
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Bahagian A: Maklumat Program</h3>
              <div className="form-group">
                <label>Pengenalan / Tujuan</label>
                <textarea 
                  className="form-input" 
                  name="pengenalan" 
                  value={formData.pengenalan} 
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Objektif 1</label>
                <input type="text" className="form-input" name="objektif1" value={formData.objektif1} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Objektif 2</label>
                <input type="text" className="form-input" name="objektif2" value={formData.objektif2} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Objektif 3</label>
                <input type="text" className="form-input" name="objektif3" value={formData.objektif3} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Jumlah Kehadiran</label>
                <input type="text" className="form-input" name="kehadiran" value={formData.kehadiran} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Jenis Aktiviti</label>
                <textarea className="form-input" name="jenisAktiviti" value={formData.jenisAktiviti} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Kumpulan Sasaran / Peserta</label>
                <textarea className="form-input" name="kumpulanSasaran" value={formData.kumpulanSasaran} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Penceramah</label>
                <input type="text" className="form-input" name="penceramah" value={formData.penceramah} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Kos Perbelanjaan (RM)</label>
                <input type="number" step="0.01" className="form-input" name="kosPerbelanjaan" value={formData.kosPerbelanjaan} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Lain-lain Perbelanjaan (RM)</label>
                <input type="number" step="0.01" className="form-input" name="lainLainPerbelanjaan" value={formData.lainLainPerbelanjaan} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Implikasi Perbelanjaan Anggota</label>
                <input type="text" className="form-input" name="implikasiAnggota" value={formData.implikasiAnggota} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Anggaran Pulangan Pelaburan (Kuantitatif)</label>
                <textarea className="form-input" name="roiKuantitatif" value={formData.roiKuantitatif} onChange={handleChange} />
              </div>
            </div>

            <div className="form-section">
              <h3>Bahagian B: Pengesyoran & Sokongan</h3>
              <div className="form-group">
                <label>Disediakan Oleh</label>
                <input type="text" className="form-input" name="disediakanOleh" value={formData.disediakanOleh} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Tarikh Disediakan</label>
                <input type="text" className="form-input" name="tarikhDisediakan" value={formData.tarikhDisediakan} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Disemak dan Disokong Oleh</label>
                <input type="text" className="form-input" name="disemakOleh" value={formData.disemakOleh} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Tarikh Disemak</label>
                <input type="text" className="form-input" name="tarikhDisemak" value={formData.tarikhDisemak} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Bajet Disokong (RM)</label>
                <input type="number" step="0.01" className="form-input" name="bajetDisokong" value={formData.bajetDisokong} onChange={handleChange} />
              </div>
            </div>

            <div className="form-section">
              <h3>Bahagian C: Kelulusan Akhir</h3>
              <div className="form-group">
                <label>Kod Bajet Digunakan</label>
                <input type="text" className="form-input" name="kodBajet" value={formData.kodBajet} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Disahkan Oleh</label>
                <input type="text" className="form-input" name="disahkanOleh" value={formData.disahkanOleh} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Tarikh Disahkan</label>
                <input type="text" className="form-input" name="tarikhDisahkan" value={formData.tarikhDisahkan} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Diluluskan Oleh</label>
                <input type="text" className="form-input" name="diluluskanOleh" value={formData.diluluskanOleh} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Tarikh Lulus</label>
                <input type="text" className="form-input" name="tarikhLulus" value={formData.tarikhLulus} onChange={handleChange} />
              </div>
            </div>

          </div>
        </div>

        {/* Preview Panel */}
        <div className="preview-panel">
          <div className="preview-header">
            <h2>Pratonton Langsung</h2>
            <button className="btn btn-primary" onClick={handlePrint}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                <rect x="6" y="14" width="12" height="8"></rect>
              </svg>
              Cetak / PDF
            </button>
          </div>
          
          <div className="preview-content">
            <div className="document-page">
              <div className="doc-header">
                <h1>{formData.tajuk}</h1>
                <p><strong>Tarikh & Tempat:</strong> {formData.tarikhTempat}</p>
                <p><strong>Masa:</strong> {formData.masa}</p>
              </div>

              <div className="doc-section">
                <div className="doc-section-title">BAHAGIAN A: MAKLUMAT PROGRAM</div>
                
                <div className="doc-item">
                  <div className="doc-item-num">1.</div>
                  <div className="doc-item-body">
                    <div className="doc-item-title">Pengenalan</div>
                    <div className="doc-item-content">{formData.pengenalan}</div>
                  </div>
                </div>

                <div className="doc-item">
                  <div className="doc-item-num">2.</div>
                  <div className="doc-item-body">
                    <div className="doc-item-title">Objektif</div>
                    <ul className="doc-list">
                      {formData.objektif1 && <li>{formData.objektif1}</li>}
                      {formData.objektif2 && <li>{formData.objektif2}</li>}
                      {formData.objektif3 && <li>{formData.objektif3}</li>}
                    </ul>
                  </div>
                </div>

                <div className="doc-item">
                  <div className="doc-item-num">3.</div>
                  <div className="doc-item-body">
                    <div className="doc-item-title">Butiran Program</div>
                    <table className="doc-table">
                      <tbody>
                        <tr>
                          <td width="30%"><strong>Jumlah Kehadiran</strong></td>
                          <td>{formData.kehadiran}</td>
                        </tr>
                        <tr>
                          <td><strong>Jenis Aktiviti</strong></td>
                          <td>{formData.jenisAktiviti}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="doc-item">
                  <div className="doc-item-num">4.</div>
                  <div className="doc-item-body">
                    <div className="doc-item-title">Keterangan Jemputan</div>
                    <table className="doc-table">
                      <tbody>
                        <tr>
                          <td width="30%"><strong>Kumpulan Sasaran</strong></td>
                          <td>{formData.kumpulanSasaran}</td>
                        </tr>
                        <tr>
                          <td><strong>Penceramah</strong></td>
                          <td>{formData.penceramah}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="doc-item">
                  <div className="doc-item-num">5.</div>
                  <div className="doc-item-body">
                    <div className="doc-item-title">Implikasi Kewangan</div>
                    <table className="doc-table">
                      <tbody>
                        <tr>
                          <td width="50%">Kos Perbelanjaan</td>
                          <td>RM {parseFloat(formData.kosPerbelanjaan || 0).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>Lain-lain Perbelanjaan (Hadiah, dll)</td>
                          <td>RM {parseFloat(formData.lainLainPerbelanjaan || 0).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td><strong>Jumlah Keseluruhan Perbelanjaan</strong></td>
                          <td><strong>RM {calculateTotal()}</strong></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="doc-item">
                  <div className="doc-item-num">6.</div>
                  <div className="doc-item-body">
                    <div className="doc-item-title">Implikasi Perbelanjaan Anggota</div>
                    <div className="doc-item-content">{formData.implikasiAnggota}</div>
                  </div>
                </div>

                <div className="doc-item">
                  <div className="doc-item-num">7.</div>
                  <div className="doc-item-body">
                    <div className="doc-item-title">Anggaran Pulangan Pelaburan (ROI)</div>
                    <div className="doc-item-content">{formData.roiKuantitatif}</div>
                  </div>
                </div>

              </div>

              <div className="doc-section" style={{ pageBreakBefore: 'always' }}>
                <div className="doc-section-title">BAHAGIAN B: PENGESYORAN & SOKONGAN</div>
                
                <div className="doc-signatures">
                  <div className="doc-signature-block">
                    <p>Disediakan Oleh:</p>
                    <div className="doc-signature-line">
                      <div className="doc-signature-name">{formData.disediakanOleh}</div>
                      <div>Tarikh: {formData.tarikhDisediakan}</div>
                    </div>
                  </div>
                  
                  <div className="doc-signature-block">
                    <p>Disemak dan Disokong Oleh:</p>
                    <div className="doc-signature-line">
                      <div className="doc-signature-name">{formData.disemakOleh}</div>
                      <div>Menyokong untuk kelulusan dengan bajet RM {parseFloat(formData.bajetDisokong || 0).toFixed(2)}</div>
                      <div>Tarikh: {formData.tarikhDisemak}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="doc-section" style={{ marginTop: '3rem' }}>
                <div className="doc-section-title">BAHAGIAN C: KELULUSAN AKHIR</div>
                <p><em>(Kegunaan Bahagian Komunikasi & Hal Ehwal Korporat)</em></p>
                
                <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                  <strong>Kod Bajet Digunakan:</strong> {formData.kodBajet}
                </div>

                <div className="doc-signatures">
                  <div className="doc-signature-block">
                    <p>Disahkan Oleh:</p>
                    <div className="doc-signature-line">
                      <div className="doc-signature-name">{formData.disahkanOleh}</div>
                      <div>Tarikh: {formData.tarikhDisahkan}</div>
                    </div>
                  </div>
                  
                  <div className="doc-signature-block">
                    <p>Kelulusan (Status: Diluluskan)</p>
                    <div className="doc-signature-line">
                      <div className="doc-signature-name">{formData.diluluskanOleh}</div>
                      <div>Tarikh: {formData.tarikhLulus}</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
