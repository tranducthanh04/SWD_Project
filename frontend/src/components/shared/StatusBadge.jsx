import { statusTone, displayStatus } from '../../formatters';

const toneClassMap = {
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  neutral: 'bg-slate-100 text-slate-700',
};

function StatusBadge({ status }) {
  const tone = statusTone(status);
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${toneClassMap[tone]}`}>{displayStatus(status)}</span>;
}

export default StatusBadge;
