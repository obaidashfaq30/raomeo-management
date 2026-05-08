import { StyleSheet, Text } from "react-native";
import { colors } from "../theme/colors";

const tones = {
  available: { backgroundColor: "#dcfce7", color: "#166534" },
  confirmed: { backgroundColor: "#dbeafe", color: "#1d4ed8" },
  occupied: { backgroundColor: "#fee2e2", color: "#b91c1c" },
  checked_in: { backgroundColor: "#ccfbf1", color: colors.primaryDark },
  cleaning: { backgroundColor: "#ffedd5", color: "#c2410c" },
  pending: { backgroundColor: "#ffedd5", color: "#c2410c" },
  paid: { backgroundColor: "#dcfce7", color: "#166534" },
  open: { backgroundColor: "#fee2e2", color: "#b91c1c" },
  default: { backgroundColor: "#e2e8f0", color: "#334155" }
};

export default function StatusPill({ value }) {
  const tone = tones[value] || tones.default;
  return <Text style={[styles.pill, tone]}>{String(value || "unknown").replace(/_/g, " ")}</Text>;
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: "flex-start",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: "800",
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 4,
    textTransform: "capitalize"
  }
});
