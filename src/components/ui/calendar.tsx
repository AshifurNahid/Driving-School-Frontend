import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  mode?: 'single' | 'multiple' | 'range';
  selected?: Date | Date[] | { from?: Date; to?: Date };
  onSelect?: (date: Date | undefined) => void;
  className?: string;
  modifiers?: Record<string, Date[]>;
  modifiersStyles?: Record<string, React.CSSProperties>;
  disabled?: (date: Date) => boolean;
  initialFocus?: boolean;
}

const Calendar: React.FC<CalendarProps> = ({
  mode = 'single',
  selected,
  onSelect,
  className = '',
  modifiers = {},
  modifiersStyles = {},
  disabled,
}) => {
  const [currentMonth, setCurrentMonth] = React.useState(() => {
    if (selected instanceof Date) {
      return new Date(selected.getFullYear(), selected.getMonth(), 1);
    }
    return new Date();
  });

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days: Array<{ date: Date; isCurrentMonth: boolean }> = [];

    // Previous month days
    const prevMonthDays = getDaysInMonth(new Date(year, month - 1));
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: new Date(year, month, day),
        isCurrentMonth: true,
      });
    }

    // Next month days to fill the grid
    const remainingDays = 42 - days.length; // 6 rows × 7 days
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: new Date(year, month + 1, day),
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const isSelected = (date: Date) => {
    if (!selected) return false;
    if (selected instanceof Date) {
      return (
        date.getDate() === selected.getDate() &&
        date.getMonth() === selected.getMonth() &&
        date.getFullYear() === selected.getFullYear()
      );
    }
    return false;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const hasModifier = (date: Date, modifierKey: string) => {
    const modifierDates = modifiers[modifierKey];
    if (!modifierDates) return false;
    return modifierDates.some(
      (modDate) =>
        modDate.getDate() === date.getDate() &&
        modDate.getMonth() === date.getMonth() &&
        modDate.getFullYear() === date.getFullYear()
    );
  };

  const getModifierStyle = (date: Date) => {
    for (const [key, style] of Object.entries(modifiersStyles)) {
      if (hasModifier(date, key)) {
        return style;
      }
    }
    return {};
  };

  const handleDateClick = (date: Date, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) {
      setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    }
    if (disabled && disabled(date)) return;
    if (onSelect) {
      onSelect(date);
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className={`p-3 ${className}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-center pt-1 relative items-center">
          <button
            onClick={handlePrevMonth}
            className="absolute left-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 inline-flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
            type="button"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <div className="text-sm font-medium">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </div>
          
          <button
            onClick={handleNextMonth}
            className="absolute right-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 inline-flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
            type="button"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Calendar Grid */}
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {daysOfWeek.map((day) => (
                <th
                  key={day}
                  className="text-gray-500 rounded-md w-9 font-normal text-[0.8rem] text-center p-0"
                >
                  <div className="py-2">{day}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, weekIndex) => (
              <tr key={weekIndex} className="mt-2">
                {calendarDays.slice(weekIndex * 7, weekIndex * 7 + 7).map((dayObj, dayIndex) => {
                  const isSelectedDay = isSelected(dayObj.date);
                  const isTodayDay = isToday(dayObj.date);
                  const modifierStyle = getModifierStyle(dayObj.date);
                  const isDisabled = disabled ? disabled(dayObj.date) : false;

                  return (
                    <td
                      key={dayIndex}
                      className="h-9 w-9 text-center text-sm p-0 relative first:rounded-l-md last:rounded-r-md"
                    >
                      <button
                        onClick={() => handleDateClick(dayObj.date, dayObj.isCurrentMonth)}
                        disabled={isDisabled}
                        className={`
                          h-9 w-9 p-0 font-normal inline-flex items-center justify-center rounded-md transition-colors
                          ${!dayObj.isCurrentMonth ? 'text-gray-400 opacity-50' : 'text-gray-900'}
                          ${isSelectedDay ? 'bg-blue-600 text-white hover:bg-blue-600 hover:text-white font-semibold' : ''}
                          ${isTodayDay && !isSelectedDay ? 'bg-gray-100 text-gray-900 font-semibold' : ''}
                          ${!isSelectedDay && !isTodayDay ? 'hover:bg-gray-100' : ''}
                          ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                        style={!isSelectedDay && !isTodayDay ? modifierStyle : {}}
                        type="button"
                      >
                        {dayObj.date.getDate()}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

Calendar.displayName = "Calendar";

export { Calendar };
export default Calendar;