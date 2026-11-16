/** MISI PANTUN - Google Apps Script backend
 * 1) Set Script Properties: SPREADSHEET_ID, TEACHER_EMAIL
 * 2) Deploy student endpoint as Execute as: Me; Who has access: Anyone.
 * 3) Deploy teacher dashboard separately as Execute as: User accessing the web app;
 *    Who has access: Anyone with Google account. Authorise with the teacher account.
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || '{}');
    if (!data.name || !data.className || !Array.isArray(data.answers)) throw new Error('Maklumat murid tidak lengkap.');
    const ss = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID'));
    let sh = ss.getSheetByName('Rekod Misi Pantun');
    if (!sh) sh = ss.insertSheet('Rekod Misi Pantun');
    if (sh.getLastRow() === 0) sh.appendRow(['Tarikh & Masa','Nama Murid','Kelas','Markah','Jumlah Markah','Peratus','Jawapan 1','Jawapan 2','Jawapan 3','Jawapan 4','Jawapan 5','Jawapan 6','Jawapan 7','Jawapan 8','Jawapan 9','Jawapan 10']);
    sh.appendRow([new Date(), data.name, data.className, data.score, data.total, (data.score/data.total)*100, ...data.answers]);
    return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ok:false,error:String(err)})).setMimeType(ContentService.MimeType.JSON);
  }
}
function doGet() {
  const email = Session.getActiveUser().getEmail();
  const allowed = PropertiesService.getScriptProperties().getProperty('TEACHER_EMAIL');
  if (!email || !allowed || email.toLowerCase() !== allowed.toLowerCase()) {
    return HtmlService.createHtmlOutput('<h2>Akses tidak dibenarkan</h2><p>Sila log masuk menggunakan akaun Google guru yang didaftarkan.</p>');
  }
  const ss = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID'));
  const sh = ss.getSheetByName('Rekod Misi Pantun');
  const values = sh && sh.getLastRow() > 1 ? sh.getDataRange().getDisplayValues().slice(1) : [];
  const rows = values.reverse().map(r => '<tr>' + r.slice(0,6).map(v => '<td>'+esc_(v)+'</td>').join('') + '<td>'+r.slice(6).map(esc_).join(' | ')+'</td></tr>').join('');
  const avg = values.length ? (values.reduce((s,r)=>s+(Number(r[3])||0),0)/values.length).toFixed(1) : '0';
  const html = `<!doctype html><html lang="ms"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Dashboard Guru - Misi Pantun</title><style>body{font:14px Arial;background:#08172b;color:#f5e6c6;margin:0;padding:24px}main{max-width:1200px;margin:auto}h1{color:#e9c16c}.cards{display:flex;gap:12px;flex-wrap:wrap}.card{background:#142b47;border:1px solid #b88b48;border-radius:10px;padding:18px;min-width:150px}.card b{display:block;font-size:28px;color:#f0c96f;margin-top:8px}.tablewrap{overflow:auto;margin-top:22px}table{border-collapse:collapse;width:100%;min-width:800px;background:#10243e}th,td{padding:10px;border:1px solid #3b526c;text-align:left}th{background:#284765;color:#f2d48b}tr:nth-child(even){background:#172f4c}.small{color:#bdc9d8}</style><main><h1>✦ Dashboard Guru · Misi Pantun</h1><p class="small">Akaun: ${esc_(email)} · Data daripada Google Sheets</p><div class="cards"><div class="card">Jumlah penyertaan<b>${values.length}</b></div><div class="card">Purata markah<b>${avg} / 10</b></div><div class="card">Markah tertinggi<b>${values.length?Math.max(...values.map(r=>Number(r[3])||0)):'0'} / 10</b></div></div><div class="tablewrap"><table><thead><tr><th>Tarikh</th><th>Nama</th><th>Kelas</th><th>Markah</th><th>Jumlah</th><th>Peratus</th><th>Jawapan murid (1–10)</th></tr></thead><tbody>${rows||'<tr><td colspan="7">Belum ada rekod murid.</td></tr>'}</tbody></table></div></main></html>`;
  return HtmlService.createHtmlOutput(html).setTitle('Dashboard Guru - Misi Pantun');
}
function esc_(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
