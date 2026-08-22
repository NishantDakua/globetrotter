import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function toYMD(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function startOfDay(dateStr) {
  return new Date(dateStr + 'T00:00:00');
}

/**
 * DateRangePicker
 * @param {string}   startDate  - "YYYY-MM-DD" or ""
 * @param {string}   endDate    - "YYYY-MM-DD" or ""
 * @param {Function} onChange   - ({ startDate, endDate }) => void
 * @param {string}   minDate    - "YYYY-MM-DD" optional
 */
const DateRangePicker = ({ startDate, endDate, onChange, minDate }) => {
  const today = new Date();
  const [viewDate, setViewDate] = useState(() => {
    const base = startDate ? startOfDay(startDate) : new Date();
    return { year: base.getFullYear(), month: base.getMonth() };
  });
  // picking: 'start' | 'end'
  const [picking, setPicking] = useState(startDate ? 'end' : 'start');
  const [hovered, setHovered] = useState(null);

  const prevMonth = () =>
    setViewDate(prev => {
      const d = new Date(prev.year, prev.month - 1, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });

  const nextMonth = () =>
    setViewDate(prev => {
      const d = new Date(prev.year, prev.month + 1, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });

  const daysInMonth = new Date(viewDate.year, viewDate.month + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewDate.year, viewDate.month, 1).getDay();

  const handleDayClick = (dayStr) => {
    if (minDate && dayStr < minDate) return;

    if (picking === 'start') {
      onChange({ startDate: dayStr, endDate: '' });
      setPicking('end');
    } else {
      if (startDate && dayStr < startDate) {
        // clicked before start → reset to new start
        onChange({ startDate: dayStr, endDate: '' });
        setPicking('end');
      } else {
        onChange({ startDate, endDate: dayStr });
        setPicking('start');
      }
    }
  };

  const isDisabled = (dayStr) => minDate && dayStr < minDate;

  const isStart = (dayStr) => dayStr === startDate;
  const isEnd = (dayStr) => dayStr === endDate;

  const isInRange = (dayStr) => {
    const effectiveEnd = endDate || hovered;
    if (!startDate || !effectiveEnd) return false;
    const lo = startDate < effectiveEnd ? startDate : effectiveEnd;
    const hi = startDate < effectiveEnd ? effectiveEnd : startDate;
    return dayStr > lo && dayStr < hi;
  };

  const cells = [];
  // Leading empty cells
  for (let i = 0; i < firstDayOfWeek; i++) {
    cells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const m = String(viewDate.month + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    cells.push(`${viewDate.year}-${m}-${dd}`);
  }

  const todayStr = toYMD(today);

  return (
    <div className="select-none bg-[#0c0e17] border border-white/10 rounded-2xl p-4 w-full space-y-3">
      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-semibold text-white">
          {MONTHS[viewDate.month]} {viewDate.year}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-0.5">
        {DAYS.map(day => (
          <div key={day} className="text-center text-[10px] font-bold text-slate-500 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Date Cells */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((dayStr, i) => {
          if (!dayStr) return <div key={`empty-${i}`} />;

          const disabled = isDisabled(dayStr);
          const start = isStart(dayStr);
          const end = isEnd(dayStr);
          const inRange = isInRange(dayStr);
          const isToday = dayStr === todayStr;

          let cellClass =
            'relative flex items-center justify-center h-8 w-full text-xs font-medium rounded-lg transition-all cursor-pointer ';

          if (disabled) {
            cellClass += 'text-slate-700 cursor-not-allowed ';
          } else if (start || end) {
            cellClass += 'bg-[#009b86] text-white shadow-lg shadow-teal-900/40 ';
          } else if (inRange) {
            cellClass += 'bg-teal-900/40 text-teal-200 rounded-none ';
          } else if (isToday) {
            cellClass += 'text-[#009b86] border border-[#009b86]/40 hover:bg-teal-900/20 ';
          } else {
            cellClass += 'text-slate-300 hover:bg-white/5 hover:text-white ';
          }

          // Round left end of range
          if (start && endDate) cellClass += 'rounded-r-none ';
          // Round right end of range
          if (end && startDate) cellClass += 'rounded-l-none ';

          return (
            <button
              key={dayStr}
              type="button"
              disabled={disabled}
              onClick={() => handleDayClick(dayStr)}
              onMouseEnter={() => setHovered(dayStr)}
              onMouseLeave={() => setHovered(null)}
              className={cellClass}
            >
              {parseInt(dayStr.slice(-2), 10)}
              {(start || end) && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white/60" />
              )}
            </button>
          );
        })}
      </div>

      {/* Selection Summary */}
      <div className="flex items-center justify-between text-[10px] font-medium pt-2 border-t border-white/5">
        <span className="text-slate-400">
          Depart:{' '}
          <span className={startDate ? 'text-teal-400' : 'text-slate-600'}>
            {startDate || '—'}
          </span>
        </span>
        <span className="text-slate-400">
          Return:{' '}
          <span className={endDate ? 'text-teal-400' : 'text-slate-600'}>
            {endDate || '—'}
          </span>
        </span>
        <span className="text-slate-500 italic">
          {picking === 'start' ? 'Pick departure' : 'Pick return'}
        </span>
      </div>
    </div>
  );
};

export default DateRangePicker;
