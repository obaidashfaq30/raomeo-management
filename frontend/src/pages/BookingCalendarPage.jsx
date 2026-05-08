import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarRange, ChevronLeft, ChevronRight, Hotel, Layers3 } from "lucide-react";
import clsx from "clsx";
import { endpoints } from "../api/client";
import GlassSelect from "../components/ui/GlassSelect.jsx";
import StatCard from "../components/ui/StatCard.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";

const DAY_WIDTH = 74;
const ROOM_COLUMN_WIDTH = 240;
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const rangeOptions = [14, 21, 30, 60];
const statusOptions = [
  { value: "", label: "All statuses" },
  { value: "draft", label: "Draft" },
  { value: "confirmed", label: "Confirmed" },
  { value: "checked_in", label: "Checked in" },
  { value: "checked_out", label: "Checked out" },
  { value: "cancelled", label: "Cancelled" },
  { value: "no_show", label: "No show" }
];

const bookingStyles = {
  draft: "border-saffron/30 bg-saffron/85 text-amber-950",
  confirmed: "border-harbor/25 bg-harbor text-white",
  checked_in: "border-ink/20 bg-ink text-white",
  checked_out: "border-slate-400/25 bg-slate-600 text-white",
  cancelled: "border-slate-300 bg-slate-300 text-slate-700",
  no_show: "border-coral/25 bg-coral text-white",
  default: "border-lagoon/25 bg-lagoon text-white"
};

function parseISODate(value) {
  const [year, month, day] = String(value).split("-").map(Number);
  return new Date(year, month - 1, day);
}

function toISODate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(value, days) {
  const date = parseISODate(value);
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

function differenceInDays(from, to) {
  return Math.round((parseISODate(to) - parseISODate(from)) / MS_PER_DAY);
}

function buildDateRange(startDate, days) {
  return Array.from({ length: days }, (_, index) => {
    const iso = addDays(startDate, index);
    const date = parseISODate(iso);
    return {
      iso,
      day: date.toLocaleDateString(undefined, { day: "2-digit" }),
      month: date.toLocaleDateString(undefined, { month: "short" }),
      weekday: date.toLocaleDateString(undefined, { weekday: "short" }),
      isToday: iso === toISODate(new Date())
    };
  });
}

function guestName(reservation) {
  const guest = reservation.guests?.[0];
  return guest ? `${guest.first_name} ${guest.last_name}` : reservation.code;
}

function visibleSpan(reservation, startDate, days) {
  const visibleEnd = addDays(startDate, days);
  const startOffset = Math.max(0, differenceInDays(startDate, reservation.check_in_date));
  const endOffset = Math.min(days, differenceInDays(startDate, reservation.check_out_date));

  return {
    startOffset,
    span: Math.max(1, endOffset - startOffset),
    clippedStart: reservation.check_in_date < startDate,
    clippedEnd: reservation.check_out_date > visibleEnd
  };
}

function bookingsWithLevels(bookings, startDate, days) {
  const levels = [];

  return bookings
    .map((booking) => ({ ...booking, spanMeta: visibleSpan(booking, startDate, days) }))
    .sort((a, b) => a.spanMeta.startOffset - b.spanMeta.startOffset || a.check_out_date.localeCompare(b.check_out_date))
    .map((booking) => {
      const endOffset = booking.spanMeta.startOffset + booking.spanMeta.span;
      const level = levels.findIndex((levelEnd) => booking.spanMeta.startOffset >= levelEnd);
      const nextLevel = level === -1 ? levels.length : level;
      levels[nextLevel] = endOffset;
      return { ...booking, laneLevel: nextLevel, laneCount: levels.length };
    });
}

function maxLaneCount(bookings) {
  return bookings.reduce((max, booking) => Math.max(max, booking.laneCount || 1), 1);
}

export default function BookingCalendarPage() {
  const [startDate, setStartDate] = useState(toISODate(new Date()));
  const [days, setDays] = useState(21);
  const [status, setStatus] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [bookedOnly, setBookedOnly] = useState(true);
  const [rooms, setRooms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(false);

  const loadCalendar = useCallback(async () => {
    setLoading(true);
    try {
      const response = await endpoints.reservationCalendar({
        from: startDate,
        days,
        status: status || undefined,
        room_category_id: categoryId || undefined
      });
      setRooms(response.data.data.rooms || []);
      setReservations(response.data.data.reservations || []);
      setSummary(response.data.data.summary || {});
    } catch {
      setRooms([]);
      setReservations([]);
      setSummary({});
    } finally {
      setLoading(false);
    }
  }, [categoryId, days, startDate, status]);

  useEffect(() => {
    loadCalendar();
  }, [loadCalendar]);

  useEffect(() => {
    endpoints.roomCategories().then((response) => setCategories(response.data.data)).catch(() => setCategories([]));
  }, []);

  const dates = useMemo(() => buildDateRange(startDate, days), [days, startDate]);
  const gridTemplateColumns = `${ROOM_COLUMN_WIDTH}px repeat(${days}, ${DAY_WIDTH}px)`;
  const categoryOptions = useMemo(
    () => [
      { value: "", label: "All categories" },
      ...categories.map((category) => ({ value: String(category.id), label: category.name }))
    ],
    [categories]
  );

  const calendarRows = useMemo(() => {
    const reservationsByRoom = new Map();
    const unassigned = [];

    reservations.forEach((reservation) => {
      if (reservation.room?.id) {
        const key = String(reservation.room.id);
        reservationsByRoom.set(key, [...(reservationsByRoom.get(key) || []), reservation]);
      } else {
        unassigned.push(reservation);
      }
    });

    const rows = [];
    if (unassigned.length > 0) {
      const bookings = bookingsWithLevels(unassigned, startDate, days);
      rows.push({
        id: "unassigned",
        type: "unassigned",
        label: "Unassigned",
        detail: "Pending room allocation",
        status: "open",
        bookings,
        laneCount: maxLaneCount(bookings)
      });
    }

    rooms.forEach((room) => {
      const bookings = bookingsWithLevels(reservationsByRoom.get(String(room.id)) || [], startDate, days);
      if (bookedOnly && bookings.length === 0) return;

      rows.push({
        id: `room-${room.id}`,
        type: "room",
        label: `Room ${room.number}`,
        detail: `${room.room_category?.name || "Room"} • Floor ${room.floor}`,
        status: room.status,
        bookings,
        laneCount: maxLaneCount(bookings)
      });
    });

    return rows;
  }, [bookedOnly, days, reservations, rooms, startDate]);

  const visibleEndDate = addDays(startDate, days - 1);
  const calendarWidth = ROOM_COLUMN_WIDTH + days * DAY_WIDTH;

  return (
    <div className="space-y-6">
      <section className="glass-panel-strong rounded-2xl p-5 md:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <span className="eyebrow-pill">Unified calendar</span>
            <h1 className="mt-3 text-3xl font-bold text-ink md:text-4xl">Booking Timeline</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              {startDate} to {visibleEndDate}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[150px_150px_160px_150px_auto]">
            <input className="field-glass" type="date" value={startDate} onChange={(event) => event.target.value && setStartDate(event.target.value)} />
            <GlassSelect value={status} onChange={setStatus} options={statusOptions} />
            <GlassSelect value={categoryId} onChange={setCategoryId} options={categoryOptions} />
            <button className="field-glass font-bold text-harbor" type="button" onClick={() => setBookedOnly((value) => !value)}>
              {bookedOnly ? "Booked lanes" : "All rooms"}
            </button>
            <div className="flex overflow-hidden rounded-xl border border-white/60 bg-white/55">
              <button className="flex h-11 w-11 items-center justify-center text-slate-600 transition hover:bg-white" type="button" onClick={() => setStartDate(addDays(startDate, -days))} aria-label="Previous range">
                <ChevronLeft size={18} />
              </button>
              <button className="border-x border-white/60 px-3 text-sm font-bold text-harbor transition hover:bg-white" type="button" onClick={() => setStartDate(toISODate(new Date()))}>
                Today
              </button>
              <button className="flex h-11 w-11 items-center justify-center text-slate-600 transition hover:bg-white" type="button" onClick={() => setStartDate(addDays(startDate, days))} aria-label="Next range">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {rangeOptions.map((option) => (
            <button
              className={clsx(
                "rounded-full border px-3 py-1.5 text-xs font-bold transition",
                days === option ? "border-harbor bg-harbor text-white shadow-glow" : "border-white/60 bg-white/55 text-slate-600 hover:bg-white"
              )}
              key={option}
              type="button"
              onClick={() => setDays(option)}
            >
              {option} days
            </button>
          ))}
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={CalendarRange} label="Bookings" value={summary.total_bookings || 0} tone="harbor" />
        <StatCard icon={ChevronRight} label="Arrivals" value={summary.arrivals || 0} tone="saffron" />
        <StatCard icon={ChevronLeft} label="Departures" value={summary.departures || 0} tone="ink" />
        <StatCard icon={Layers3} label="Unassigned" value={summary.unassigned || 0} tone="coral" />
      </div>

      <section className="glass-panel overflow-hidden rounded-2xl">
        <div className="flex flex-col gap-3 border-b border-white/60 p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="icon-tile text-harbor">
              <Hotel size={19} />
            </span>
            <div>
              <h2 className="text-base font-bold text-ink">Room Lanes</h2>
              <p className="text-sm text-slate-500">{calendarRows.length} lanes visible</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {["confirmed", "checked_in", "draft", "cancelled"].map((value) => (
              <StatusBadge key={value} value={value} />
            ))}
          </div>
        </div>

        <div className="max-h-[68vh] overflow-auto scrollbar-thin">
          <div className="min-w-full" style={{ width: `${calendarWidth}px` }}>
            <div className="sticky top-0 z-30 grid border-b border-white/60 bg-white/75 backdrop-blur-xl" style={{ gridTemplateColumns }}>
              <div className="sticky left-0 z-40 border-r border-white/60 bg-white/90 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                Room
              </div>
              {dates.map((date) => (
                <div
                  key={date.iso}
                  className={clsx(
                    "border-r border-white/55 px-2 py-2 text-center",
                    date.isToday && "bg-harbor/10"
                  )}
                >
                  <p className="text-[11px] font-bold uppercase text-slate-500">{date.weekday}</p>
                  <p className={clsx("mt-1 text-sm font-bold", date.isToday ? "text-harbor" : "text-ink")}>{date.day}</p>
                  <p className="text-[11px] font-semibold text-slate-400">{date.month}</p>
                </div>
              ))}
            </div>

            {loading ? (
              <div className="p-10 text-center text-sm font-semibold text-slate-500">Loading calendar</div>
            ) : calendarRows.length === 0 ? (
              <div className="p-10 text-center text-sm font-semibold text-slate-500">No bookings in this range</div>
            ) : (
              calendarRows.map((row) => {
                const rowHeight = Math.max(82, row.laneCount * 42 + 38);

                return (
                  <div
                    key={row.id}
                    className="relative grid border-b border-white/50"
                    style={{ gridTemplateColumns, minHeight: `${rowHeight}px` }}
                  >
                    <div className="sticky left-0 z-20 flex items-center border-r border-white/60 bg-white/80 px-4 backdrop-blur-xl">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-ink">{row.label}</p>
                        <p className="mt-1 truncate text-xs font-medium text-slate-500">{row.detail}</p>
                        <div className="mt-2">
                          <StatusBadge value={row.status} />
                        </div>
                      </div>
                    </div>

                    {dates.map((date, index) => (
                      <div
                        aria-hidden="true"
                        className={clsx(
                          "border-r border-white/45",
                          date.isToday ? "bg-harbor/5" : index % 2 === 0 ? "bg-white/20" : "bg-white/5"
                        )}
                        key={`${row.id}-${date.iso}`}
                        style={{ gridColumn: index + 2, gridRow: 1 }}
                      />
                    ))}

                    {row.bookings.map((booking) => {
                      const { startOffset, span, clippedStart, clippedEnd } = booking.spanMeta;
                      const nights = Math.max(1, differenceInDays(booking.check_in_date, booking.check_out_date));

                      return (
                        <article
                          className={clsx(
                            "z-10 mx-1 overflow-hidden border px-3 py-2 shadow-lg shadow-slate-900/10",
                            clippedStart ? "rounded-l-md" : "rounded-l-xl",
                            clippedEnd ? "rounded-r-md" : "rounded-r-xl",
                            bookingStyles[booking.status] || bookingStyles.default
                          )}
                          key={booking.id}
                          style={{
                            gridColumn: `${startOffset + 2} / span ${span}`,
                            gridRow: 1,
                            alignSelf: "start",
                            marginTop: `${30 + booking.laneLevel * 42}px`
                          }}
                          title={`${booking.code} • ${guestName(booking)} • ${booking.check_in_date} to ${booking.check_out_date}`}
                        >
                          <div className="flex min-w-0 items-center justify-between gap-2">
                            <p className="truncate text-xs font-bold">{guestName(booking)}</p>
                            <span className="shrink-0 text-[10px] font-bold opacity-80">{nights}n</span>
                          </div>
                          <p className="mt-0.5 truncate text-[11px] font-semibold opacity-85">
                            {booking.code} • {booking.room_category?.name || "Booking"}
                          </p>
                        </article>
                      );
                    })}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
