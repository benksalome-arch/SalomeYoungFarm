import React, { useEffect, useMemo, useRef, useState } from "react";
import "./CalendarPicker.css";

const MONTHS_NL = [
  "januari",
  "februari",
  "maart",
  "april",
  "mei",
  "juni",
  "juli",
  "augustus",
  "september",
  "oktober",
  "november",
  "december",
];

const WEEKDAYS_NL = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];

function parseDate(value) {
  if (!value) return null;

  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;

  const date = new Date(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3])
  );

  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function sameDay(a, b) {
  return (
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getCalendarDays(monthDate) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();

  const firstDay = new Date(year, month, 1);

  // Monday = 0 ... Sunday = 6
  const mondayIndex = (firstDay.getDay() + 6) % 7;

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];

  for (let i = 0; i < mondayIndex; i += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(year, month, day));
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

export default function CalendarPicker({
  value = "",
  onChange,
  onCancel,
  minDate,
  maxDate,
  initialDate,
  calendarRef: externalCalendarRef,
}) {
  const selectedDate = parseDate(value);
  const today = new Date();

  const startingDate =
    selectedDate ||
    parseDate(initialDate) ||
    new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const [calendarMonth, setCalendarMonth] = useState(
    new Date(startingDate.getFullYear(), startingDate.getMonth(), 1)
  );

  const calendarRef = useRef(null);

  const min = parseDate(minDate);
  const max = parseDate(maxDate);

  useEffect(() => {
    if (selectedDate) {
      setCalendarMonth(
        new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          1
        )
      );
    }
  }, [value]);

  const days = useMemo(
    () => getCalendarDays(calendarMonth),
    [calendarMonth]
  );

  const years = useMemo(() => {
    const currentYear = today.getFullYear();
    const startYear = Math.min(
      currentYear - 10,
      min ? min.getFullYear() : currentYear - 10
    );
    const endYear = Math.max(
      currentYear + 10,
      max ? max.getFullYear() : currentYear + 10
    );

    const result = [];

    for (let year = startYear; year <= endYear; year += 1) {
      result.push(year);
    }

    return result;
  }, [minDate, maxDate]);

  const isDisabled = (date) => {
    if (!date) return false;
    if (min && date < min) return true;
    if (max && date > max) return true;
    return false;
  };

  const changeMonth = (amount) => {
    setCalendarMonth(
      new Date(
        calendarMonth.getFullYear(),
        calendarMonth.getMonth() + amount,
        1
      )
    );
  };

  const handleMonthChange = (event) => {
    setCalendarMonth(
      new Date(
        calendarMonth.getFullYear(),
        Number(event.target.value),
        1
      )
    );
  };

  const handleYearChange = (event) => {
    setCalendarMonth(
      new Date(
        Number(event.target.value),
        calendarMonth.getMonth(),
        1
      )
    );
  };

  const handleDateClick = (date) => {
    if (!date || isDisabled(date)) return;

    onChange?.(formatDate(date));
  };

  return (
    <div
      ref={externalCalendarRef || calendarRef}
      className="calendar-picker"
      role="dialog"
      aria-label="Datum kiezen"
    >
      <div className="calendar-pickers">
        <select
          value={calendarMonth.getMonth()}
          onChange={handleMonthChange}
          aria-label="Maand"
        >
          {MONTHS_NL.map((month, index) => (
            <option key={month} value={index}>
              {month.charAt(0).toUpperCase() + month.slice(1)}
            </option>
          ))}
        </select>

        <select
          value={calendarMonth.getFullYear()}
          onChange={handleYearChange}
          aria-label="Jaar"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="calendar-navigation">
        <button
          type="button"
          className="calendar-nav"
          onClick={() => changeMonth(-1)}
          aria-label="Vorige maand"
        >
          ‹
        </button>

        <div className="calendar-title">
          {MONTHS_NL[calendarMonth.getMonth()].charAt(0).toUpperCase() +
            MONTHS_NL[calendarMonth.getMonth()].slice(1)}{" "}
          {calendarMonth.getFullYear()}
        </div>

        <button
          type="button"
          className="calendar-nav"
          onClick={() => changeMonth(1)}
          aria-label="Volgende maand"
        >
          ›
        </button>
      </div>

      <div className="calendar-weekdays">
        {WEEKDAYS_NL.map((weekday) => (
          <div key={weekday} className="calendar-weekday">
            {weekday}
          </div>
        ))}
      </div>

      <div className="calendar-days">
        {days.map((date, index) => {
          if (!date) {
            return (
              <div
                key={`empty-${index}`}
                className="calendar-empty"
                aria-hidden="true"
              />
            );
          }

          const selected = sameDay(date, selectedDate);
          const isToday = sameDay(date, today);
          const disabled = isDisabled(date);

          return (
            <button
              type="button"
              key={formatDate(date)}
              className={[
                "calendar-day",
                isToday ? "today" : "",
                selected ? "selected" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              disabled={disabled}
              onClick={() => handleDateClick(date)}
              aria-pressed={selected}
              aria-label={formatDate(date)}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="calendar-cancel"
        onClick={() => onCancel?.()}
      >
        Annuleren
      </button>
    </div>
  );
}
