import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import Screen from "../components/Screen";
import StatusPill from "../components/StatusPill";
import { endpoints } from "../api/client";
import { colors } from "../theme/colors";

const moduleConfig = {
  rooms: {
    title: "Rooms",
    subtitle: "Live inventory and statuses",
    load: () => endpoints.rooms(),
    primary: (item) => `Room ${item.number}`,
    secondary: (item) => `${item.room_category?.name || "Category"} · Floor ${item.floor}`,
    status: (item) => item.status
  },
  reservations: {
    title: "Reservations",
    subtitle: "Bookings and guest allocation",
    load: () => endpoints.reservations(),
    primary: (item) => item.code,
    secondary: (item) => `${item.check_in_date} to ${item.check_out_date}`,
    status: (item) => item.status
  },
  guests: {
    title: "Guests",
    subtitle: "Profiles, preferences, and loyalty",
    load: () => endpoints.guests(),
    primary: (item) => `${item.first_name} ${item.last_name}`,
    secondary: (item) => item.email || item.phone || "No contact details",
    status: (item) => `${item.loyalty_points || 0} pts`
  },
  housekeeping: {
    title: "Housekeeping",
    subtitle: "Cleaning schedules and assignments",
    load: () => endpoints.housekeepingTasks(),
    primary: (item) => item.task_type,
    secondary: (item) => `Room ${item.room?.number || "-"} · ${item.scheduled_for}`,
    status: (item) => item.status
  },
  maintenance: {
    title: "Maintenance",
    subtitle: "Room issues and staff assignments",
    load: () => endpoints.maintenanceTickets(),
    primary: (item) => item.title,
    secondary: (item) => `Room ${item.room?.number || "-"} · ${item.priority}`,
    status: (item) => item.status
  },
  invoices: {
    title: "Billing",
    subtitle: "Invoices, balances, and payments",
    load: () => endpoints.invoices(),
    primary: (item) => item.number,
    secondary: (item) => `$${((item.total_cents || 0) / 100).toFixed(2)}`,
    status: (item) => item.status
  },
  foodBeverage: {
    title: "F&B Orders",
    subtitle: "Room service and restaurant charges",
    load: () => endpoints.foodBeverageOrders(),
    primary: (item) => item.source,
    secondary: (item) => `Room ${item.room?.number || "-"} · $${((item.total_cents || 0) / 100).toFixed(2)}`,
    status: (item) => item.status
  },
  frontDesk: {
    title: "Front Desk",
    subtitle: "Operational live status",
    load: async () => {
      const response = await endpoints.dashboard();
      return {
        data: {
          data: Object.entries(response.data.data.rooms_by_status || {}).map(([status, count]) => ({
            id: status,
            label: status,
            count,
            status
          }))
        }
      };
    },
    primary: (item) => item.label.replace(/_/g, " "),
    secondary: (item) => `${item.count} rooms`,
    status: (item) => item.status
  }
};

export default function ModuleListScreen({ route }) {
  const moduleKey = route.params?.moduleKey || "rooms";
  const config = useMemo(() => moduleConfig[moduleKey] || moduleConfig.rooms, [moduleKey]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    config
      .load()
      .then((response) => setItems(response.data.data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [config]);

  return (
    <Screen title={config.title} subtitle={config.subtitle} scroll={false}>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.list}
          data={items}
          keyExtractor={(item, index) => String(item.id || index)}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={styles.rowText}>
                <Text style={styles.primary}>{config.primary(item)}</Text>
                <Text style={styles.secondary}>{config.secondary(item)}</Text>
              </View>
              <StatusPill value={config.status(item)} />
            </View>
          )}
          ListEmptyComponent={<Text style={styles.empty}>No records found</Text>}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center"
  },
  list: {
    gap: 10,
    paddingBottom: 24
  },
  row: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    padding: 14
  },
  rowText: {
    flex: 1
  },
  primary: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
    textTransform: "capitalize"
  },
  secondary: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 4
  },
  empty: {
    color: colors.muted,
    padding: 24,
    textAlign: "center"
  }
});
