import { useState } from 'react';
import api, { errorMessage } from '../api/axios';
import ConfirmModal from '../modals/ConfirmModal';

type ExportType = 'publishers' | 'offers';
type Range = 'monthly' | 'custom';

export default function ReportsPage() {
  const [exportType, setExportType] = useState<ExportType>('publishers');
  const [range, setRange] = useState<Range>('monthly');
  const [dates, setDates] = useState({ startDate: '', endDate: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [confirmExport, setConfirmExport] = useState(false);

  const download = async () => {
    setBusy(true);
    setError('');
    try {
      const response = await api.get(`/export/${exportType}/${range}`, {
        params: range === 'custom' ? dates : undefined,
        responseType: 'blob'
      });
      const href = URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = href;
      link.download = `${exportType}-${range}.xlsx`;
      link.click();
      URL.revokeObjectURL(href);
      setConfirmExport(false);
    } catch (exception) {
      setError(errorMessage(exception));
    } finally {
      setBusy(false);
    }
  };

  const customInvalid = range === 'custom' && (!dates.startDate || !dates.endDate || dates.startDate > dates.endDate);

  return <div className="max-w-2xl">
    <div className="mb-6"><h2 className="page-title">Excel Reports</h2><p className="page-subtitle">Export Publisher-only or complete Offer reports.</p></div>
    <div className="card space-y-5">
      <label><span className="label">Export Type</span><select className="input" value={exportType} onChange={(event) => setExportType(event.target.value as ExportType)}>
        <option value="publishers">Publishers</option>
        <option value="offers">Offers</option>
      </select></label>
      <label><span className="label">Report Period</span><select className="input" value={range} onChange={(event) => setRange(event.target.value as Range)}>
        <option value="monthly">Monthly</option>
        <option value="custom">Custom Date Range</option>
      </select></label>

      {range === 'custom' && <div className="grid gap-4 sm:grid-cols-2">
        <label><span className="label">Start Date</span><input className="input" type="date" value={dates.startDate} onChange={(event) => setDates({ ...dates, startDate: event.target.value })} /></label>
        <label><span className="label">End Date</span><input className="input" type="date" value={dates.endDate} onChange={(event) => setDates({ ...dates, endDate: event.target.value })} /></label>
      </div>}

      <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
        {exportType === 'publishers'
          ? 'Publisher report includes Publisher fields and audit dates.'
          : 'Offer report includes Offer information, embedded Payment Details, creator, and audit dates.'}
      </div>
      {error && <div className="error-box">{error}</div>}
      <button className="btn-primary" disabled={busy || customInvalid} onClick={() => setConfirmExport(true)}>{busy ? 'Preparing…' : 'Download Excel'}</button>
    </div>

    <ConfirmModal open={confirmExport} title="Download Excel Report?" message={`Export the ${range} ${exportType} report?`} confirmLabel="Download Excel" pending={busy} onCancel={() => setConfirmExport(false)} onConfirm={download} />
  </div>;
}

