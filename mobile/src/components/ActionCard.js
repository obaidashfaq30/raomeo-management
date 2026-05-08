import { Pressable, StyleSheet, Text, View } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { colors } from "../theme/colors";

export default function ActionCard({ icon: Icon, label, detail, onPress }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.iconWrap}>
        <Icon size={22} color={colors.primary} />
      </View>
      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.detail}>{detail}</Text>
      </View>
      <ChevronRight size={20} color={colors.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    padding: 14
  },
  iconWrap: {
    alignItems: "center",
    backgroundColor: "#e7f4f1",
    borderRadius: 8,
    height: 42,
    justifyContent: "center",
    width: 42
  },
  content: {
    flex: 1
  },
  label: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700"
  },
  detail: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 3
  }
});
