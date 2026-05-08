import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { CalendarRange, ChevronLeft, ChevronRight, Layers3 } from "lucide-react-native";
import Screen from "../components/Screen";
import StatTile from "../components/StatTile";
import StatusPill from "../components/StatusPill";
import { endpoints } from "../api/client";
import { colors } from "../theme/colors";

const DAY_WIDTH = 58;
const ROOM_COLUMN_WIDTH = 132;
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const rangeOptions = [14, 21, 30, 60];
const statusOptions = [
  { value: "", label: "All" },
  { value: "confirmed", label: "Confirmed" },
  { value: "checked_in", label: "In house" },
  { value: "draft", label: "Draft" },
  { value: "cancelled", label: "Cancelled" }
];

const bookingTones = {
  draft: { backgroundColor: "#f4a261", color: "#431407" },
  confirmed: { backgroundColor: colors.primary, color: "#ffffff" },
  checked_in: { backgroundColor: colors.text, color: "#ffffff" },
  checked_out: { backgroundColor: "#64748b", color: "#ffffff" },
  cancelled: { backgroundColor: "#cbd5e1", color: "#334155" },
  no_show: { backgroundColor: colors.accent, color: "#ffffff" },
  default: { backgroundColor: "#2563eb", color: "#ffffff" }
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

function Chip({ label, active, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

export default function BookingCalendarScreen() {
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
    endpoints.roomCategories().then((response) => setCategories(response.data.data || [])).catch(() => setCategories([]));
  }, []);

  const dates = useMemo(() => buildDateRange(startDate, days), [days, startDate]);
  const categoryOptions = useMemo(
    () => [{ value: "", label: "All categories" }, ...categories.map((category) => ({ value: String(category.id), label: category.name }))],
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
        label: "Unassigned",
        detail: "Pending allocation",
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
        label: `Room ${room.number}`,
        detail: `${room.room_category?.name || "Room"} · Floor ${room.floor}`,
        status: room.status,
        bookings,
        laneCount: maxLaneCount(bookings)
      });
    });

    return rows;
  }, [bookedOnly, days, reservations, rooms, startDate]);

  const visibleEndDate = addDays(startDate, days - 1);
  const timelineWidth = DAY_WIDTH * days;

  return (
    <Screen title="Booking Calendar" subtitle={`${startDate} to ${visibleEndDate}`} scroll={false}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} style={styles.scroll}>
        <View style={styles.summaryGrid}>
          <StatTile label="Bookings" value={summary.total_bookings || 0} tone={colors.primary} />
          <StatTile label="Arrivals" value={summary.arrivals || 0} tone={colors.warning} />
          <StatTile label="Departures" value={summary.departures || 0} tone={colors.text} />
          <StatTile label="Unassigned" value={summary.unassigned || 0} tone={colors.accent} />
        </View>

        <View style={styles.controlPanel}>
          <View style={styles.rangeRow}>
            <Pressable style={styles.navButton} onPress={() => setStartDate(addDays(startDate, -days))}>
              <ChevronLeft color={colors.primary} size={18} />
            </Pressable>
            <Pressable style={styles.todayButton} onPress={() => setStartDate(toISODate(new Date()))}>
              <CalendarRange color={colors.primary} size={18} />
              <Text style={styles.todayText}>Today</Text>
            </Pressable>
            <Pressable style={styles.navButton} onPress={() => setStartDate(addDays(startDate, days))}>
              <ChevronRight color={colors.primary} size={18} />
            </Pressable>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            {rangeOptions.map((option) => (
              <Chip active={days === option} key={option} label={`${option} days`} onPress={() => setDays(option)} />
            ))}
          </ScrollView>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            {statusOptions.map((option) => (
              <Chip active={status === option.value} key={option.value || "all"} label={option.label} onPress={() => setStatus(option.value)} />
            ))}
          </ScrollView>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            {categoryOptions.map((option) => (
              <Chip active={categoryId === option.value} key={option.value || "all"} label={option.label} onPress={() => setCategoryId(option.value)} />
            ))}
          </ScrollView>
          <Chip active={bookedOnly} label={bookedOnly ? "Booked lanes only" : "Showing all rooms"} onPress={() => setBookedOnly((value) => !value)} />
        </View>

        <View style={styles.legendRow}>
          {["confirmed", "checked_in", "draft", "cancelled"].map((value) => (
            <StatusPill key={value} value={value} />
          ))}
        </View>

        <View style={styles.timelineCard}>
          <View style={styles.timelineHeader}>
            <Layers3 color={colors.primary} size={19} />
            <View>
              <Text style={styles.timelineTitle}>Room lanes</Text>
              <Text style={styles.timelineSubtitle}>{calendarRows.length} lanes visible</Text>
            </View>
          </View>

          {loading ? (
            <View style={styles.loading}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : calendarRows.length === 0 ? (
            <Text style={styles.empty}>No bookings in this range</Text>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View>
                <View style={styles.dateHeaderRow}>
                  <View style={styles.roomHeaderCell}>
                    <Text style={styles.headerLabel}>Room</Text>
                  </View>
                  {dates.map((date) => (
                    <View key={date.iso} style={[styles.dateCell, date.isToday && styles.todayCell]}>
                      <Text style={styles.weekday}>{date.weekday}</Text>
                      <Text style={[styles.day, date.isToday && styles.todayDay]}>{date.day}</Text>
                      <Text style={styles.month}>{date.month}</Text>
                    </View>
                  ))}
                </View>

                {calendarRows.map((row) => {
                  const rowHeight = Math.max(86, row.laneCount * 38 + 34);

                  return (
                    <View key={row.id} style={[styles.timelineRow, { height: rowHeight }]}>
                      <View style={styles.roomCell}>
                        <Text style={styles.roomLabel} numberOfLines={1}>{row.label}</Text>
                        <Text style={styles.roomDetail} numberOfLines={1}>{row.detail}</Text>
                        <StatusPill value={row.status} />
                      </View>
                      <View style={[styles.laneCanvas, { width: timelineWidth, height: rowHeight }]}>
                        {dates.map((date, index) => (
                          <View
                            key={`${row.id}-${date.iso}`}
                            style={[
                              styles.gridCell,
                              { left: index * DAY_WIDTH, width: DAY_WIDTH, height: rowHeight },
                              date.isToday && styles.todayColumn
                            ]}
                          />
                        ))}
                        {row.bookings.map((booking) => {
                          const tone = bookingTones[booking.status] || bookingTones.default;
                          const nights = Math.max(1, differenceInDays(booking.check_in_date, booking.check_out_date));

                          return (
                            <View
                              key={booking.id}
                              style={[
                                styles.bookingBlock,
                                tone,
                                {
                                  left: booking.spanMeta.startOffset * DAY_WIDTH + 4,
                                  top: 25 + booking.laneLevel * 38,
                                  width: booking.spanMeta.span * DAY_WIDTH - 8
                                }
                              ]}
                            >
                              <Text style={[styles.bookingGuest, { color: tone.color }]} numberOfLines={1}>{guestName(booking)}</Text>
                              <Text style={[styles.bookingMeta, { color: tone.color }]} numberOfLines={1}>{booking.code} · {nights}n</Text>
                            </View>
                          );
                        })}
                      </View>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
    paddingBottom: 28
  },
  scroll: {
    flex: 1
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  controlPanel: {
    backgroundColor: "rgba(255,255,255,0.84)",
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
    padding: 12
  },
  rangeRow: {
    flexDirection: "row",
    gap: 10
  },
  navButton: {
    alignItems: "center",
    backgroundColor: "#e7f4f1",
    borderRadius: 12,
    height: 42,
    justifyContent: "center",
    width: 46
  },
  todayButton: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center"
  },
  todayText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "900"
  },
  chipRow: {
    gap: 8,
    paddingRight: 4
  },
  chip: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.86)",
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    minHeight: 34,
    paddingHorizontal: 13,
    paddingVertical: 8
  },
  chipActive: {
    backgroundColor: colors.text,
    borderColor: colors.text
  },
  chipText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "900"
  },
  chipTextActive: {
    color: "#ffffff"
  },
  legendRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  timelineCard: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden"
  },
  timelineHeader: {
    alignItems: "center",
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: 10,
    padding: 14
  },
  timelineTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "900"
  },
  timelineSubtitle: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2
  },
  loading: {
    alignItems: "center",
    minHeight: 180,
    justifyContent: "center"
  },
  empty: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700",
    padding: 28,
    textAlign: "center"
  },
  dateHeaderRow: {
    flexDirection: "row"
  },
  roomHeaderCell: {
    backgroundColor: "#ffffff",
    borderRightColor: colors.border,
    borderRightWidth: 1,
    justifyContent: "center",
    paddingHorizontal: 12,
    width: ROOM_COLUMN_WIDTH
  },
  headerLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  dateCell: {
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRightColor: colors.border,
    borderRightWidth: 1,
    gap: 2,
    paddingVertical: 8,
    width: DAY_WIDTH
  },
  todayCell: {
    backgroundColor: "#e7f4f1"
  },
  weekday: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  day: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "900"
  },
  todayDay: {
    color: colors.primary
  },
  month: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: "700"
  },
  timelineRow: {
    flexDirection: "row"
  },
  roomCell: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRightColor: colors.border,
    borderRightWidth: 1,
    gap: 5,
    justifyContent: "center",
    paddingHorizontal: 12,
    width: ROOM_COLUMN_WIDTH
  },
  roomLabel: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "900"
  },
  roomDetail: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "600"
  },
  laneCanvas: {
    position: "relative"
  },
  gridCell: {
    borderRightColor: colors.border,
    borderRightWidth: 1,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    position: "absolute",
    top: 0
  },
  todayColumn: {
    backgroundColor: "rgba(15,118,110,0.08)"
  },
  bookingBlock: {
    borderRadius: 12,
    minHeight: 32,
    paddingHorizontal: 8,
    paddingVertical: 5,
    position: "absolute"
  },
  bookingGuest: {
    fontSize: 11,
    fontWeight: "900"
  },
  bookingMeta: {
    fontSize: 9,
    fontWeight: "800",
    marginTop: 1,
    opacity: 0.84
  }
});
