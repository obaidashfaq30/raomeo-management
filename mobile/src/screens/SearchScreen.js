import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Screen from "../components/Screen";
import StatusPill from "../components/StatusPill";
import { endpoints } from "../api/client";
import { colors } from "../theme/colors";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const runSearch = async () => {
    const response = await endpoints.search({ q: query, limit: 25 });
    setResults(response.data.data || []);
  };

  return (
    <Screen title="ParetoSearch" subtitle="Guests, bookings, rooms, invoices">
      <View style={styles.searchBox}>
        <TextInput onChangeText={setQuery} placeholder="Search records" style={styles.input} value={query} />
        <Pressable onPress={runSearch} style={styles.button}>
          <Text style={styles.buttonText}>Search</Text>
        </Pressable>
      </View>
      <View style={styles.results}>
        {results.map((item) => (
          <View key={`${item.type}-${item.id}`} style={styles.result}>
            <StatusPill value={item.type} />
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.score}>Score {item.score}</Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchBox: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 10,
    padding: 12
  },
  input: {
    color: colors.text,
    fontSize: 16,
    height: 44
  },
  button: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 8,
    height: 44,
    justifyContent: "center"
  },
  buttonText: {
    color: "#fff",
    fontWeight: "800"
  },
  results: {
    gap: 10
  },
  result: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    padding: 14
  },
  label: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800"
  },
  score: {
    color: colors.muted,
    fontSize: 12
  }
});
