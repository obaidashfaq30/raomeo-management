import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { BedDouble, Bell, CalendarCheck, LogOut, Wrench } from "lucide-react-native";
import Screen from "../components/Screen";
import StatTile from "../components/StatTile";
import ActionCard from "../components/ActionCard";
import { endpoints } from "../api/client";
import { useAuthStore } from "../store/authStore";
import { colors } from "../theme/colors";

export default function DashboardScreen({ navigation }) {
  const [status, setStatus] = useState({});
  const { user, logout } = useAuthStore();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      endpoints.dashboard().then((response) => setStatus(response.data.data)).catch(() => setStatus({}));
    });
    return unsubscribe;
  }, [navigation]);

  const roomsByStatus = status.rooms_by_status || {};

  return (
    <Screen title="Dashboard" subtitle={`Signed in as ${user?.name || "Raomeo User"}`}>
      <View style={styles.logoutRow}>
        <Pressable onPress={logout} style={styles.logoutButton}>
          <LogOut color={colors.primary} size={18} />
          <Text style={styles.logoutText}>Sign out</Text>
        </Pressable>
      </View>

      <View style={styles.grid}>
        <StatTile label="Occupied" value={roomsByStatus.occupied || 0} tone={colors.primary} />
        <StatTile label="Arrivals" value={status.arriving_today || 0} tone={colors.warning} />
        <StatTile label="Housekeeping" value={status.pending_housekeeping || 0} tone={colors.text} />
        <StatTile label="Maintenance" value={status.open_maintenance || 0} tone={colors.accent} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <ActionCard
          icon={BedDouble}
          label="Room Inventory"
          detail="Availability, categories, pricing"
          onPress={() => navigation.navigate("ModuleList", { moduleKey: "rooms" })}
        />
        <ActionCard
          icon={CalendarCheck}
          label="Reservations"
          detail="Bookings and allocation"
          onPress={() => navigation.navigate("ModuleList", { moduleKey: "reservations" })}
        />
        <ActionCard
          icon={Bell}
          label="Front Desk"
          detail="Arrivals, departures, assistance"
          onPress={() => navigation.navigate("ModuleList", { moduleKey: "frontDesk" })}
        />
        <ActionCard
          icon={Wrench}
          label="Maintenance"
          detail="Tickets and room issues"
          onPress={() => navigation.navigate("ModuleList", { moduleKey: "maintenance" })}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  logoutRow: {
    alignItems: "flex-start"
  },
  logoutButton: {
    alignItems: "center",
    backgroundColor: "#e7f4f1",
    borderRadius: 8,
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 9
  },
  logoutText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "800"
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  section: {
    gap: 10
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "800"
  }
});
