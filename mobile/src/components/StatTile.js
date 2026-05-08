import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

export default function StatTile({ label, value, tone = colors.primary }) {
  return (
    <View style={styles.tile}>
      <View style={[styles.marker, { backgroundColor: tone }]} />
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    minWidth: "46%",
    padding: 14
  },
  marker: {
    borderRadius: 999,
    height: 8,
    marginBottom: 12,
    width: 32
  },
  label: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "600"
  },
  value: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "800",
    marginTop: 5
  }
});
