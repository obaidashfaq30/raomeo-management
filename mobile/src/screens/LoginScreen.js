import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Hotel, Lock, Mail } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../store/authStore";
import { colors } from "../theme/colors";

export default function LoginScreen() {
  const [email, setEmail] = useState("admin@raomeo.test");
  const [password, setPassword] = useState("password123");
  const { login, loading, error } = useAuthStore();

  const submit = async () => {
    if (!email.includes("@") || password.length < 8) {
      Alert.alert("Check your details", "Use a valid email and at least 8 password characters.");
      return;
    }
    await login(email, password);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
        <View style={styles.brand}>
          <View style={styles.logo}>
            <Hotel color="#fff" size={28} />
          </View>
          <Text style={styles.title}>Raomeo Management</Text>
          <Text style={styles.subtitle}>Hotel operations in your pocket</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.field}>
            <Mail color={colors.muted} size={18} />
            <TextInput
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="Email"
              style={styles.input}
              value={email}
            />
          </View>
          <View style={styles.field}>
            <Lock color={colors.muted} size={18} />
            <TextInput onChangeText={setPassword} placeholder="Password" secureTextEntry style={styles.input} value={password} />
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Pressable disabled={loading} onPress={submit} style={styles.button}>
            <Text style={styles.buttonText}>{loading ? "Signing in" : "Sign in"}</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    flex: 1
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 22
  },
  brand: {
    marginBottom: 30
  },
  logo: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 8,
    height: 56,
    justifyContent: "center",
    marginBottom: 18,
    width: 56
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "800"
  },
  subtitle: {
    color: colors.muted,
    fontSize: 15,
    marginTop: 6
  },
  form: {
    gap: 14
  },
  field: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 14
  },
  input: {
    color: colors.text,
    flex: 1,
    fontSize: 16,
    height: 52
  },
  error: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: "600"
  },
  button: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 8,
    height: 52,
    justifyContent: "center"
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800"
  }
});
