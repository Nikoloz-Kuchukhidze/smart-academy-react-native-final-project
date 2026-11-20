import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors } from "@/constants/theme";
import { useShop } from "@/context/shop-context";
import {
  ActionButton,
  Brand,
  RememberToggle,
  SafeScreen,
  StorageNotice,
} from "@/components/shop-ui";
import { TextField } from "@/components/text-field";

const loginSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email("Enter a valid email address.")
    .required("Email is required."),
  password: yup
    .string()
    .required("Password is required.")
    .min(8, "Use at least 8 characters."),
});

type LoginValues = yup.InferType<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const { isReady, user, signIn } = useShop();
  const [remember, setRemember] = useState(true);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (isReady && user) {
      router.replace("/products");
    }
  }, [isReady, router, user]);

  const onSubmit = handleSubmit(async ({ email }) => {
    const name = email.split("@")[0].replace(/[._-]/g, " ");
    try {
      await signIn({ name: name || "Friend", email }, remember);
      router.replace("/products");
    } catch {
      // The provider exposes storage failures in the notice above the form.
    }
  });

  return (
    <SafeScreen>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topBar}>
            <Brand />
            <Text style={styles.topNote}>GOOD THINGS, DAILY</Text>
          </View>

          <View style={styles.hero}>
            <View style={styles.heroPill}>
              <View style={styles.heroDot} />
              <Text style={styles.heroPillText}>A LITTLE MORE INTENTIONAL</Text>
            </View>
            <Text style={styles.title}>
              Make room for{"\n"}
              <Text style={styles.titleAccent}>the good stuff.</Text>
            </Text>
            <Text style={styles.subtitle}>
              Thoughtful finds for home, work, and everywhere in between.
            </Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Welcome back</Text>
            <Text style={styles.formSubtitle}>Sign in to pick up where you left off.</Text>
            <StorageNotice />

            <View style={styles.fields}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value }, fieldState }) => (
                  <TextField
                    label="Email address"
                    placeholder="you@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    textContentType="emailAddress"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value }, fieldState }) => (
                  <TextField
                    label="Password"
                    placeholder="At least 8 characters"
                    secureTextEntry
                    autoCapitalize="none"
                    autoComplete="password"
                    textContentType="password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={fieldState.error?.message}
                  />
                )}
              />
              <RememberToggle
                checked={remember}
                onPress={() => setRemember((current) => !current)}
              />
              <ActionButton
                title={isSubmitting ? "Signing in..." : "Sign in"}
                onPress={() => void onSubmit()}
                disabled={isSubmitting || !isReady}
              />
            </View>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>New around here? </Text>
              <Link href="/register" style={styles.link}>
                Create an account
              </Link>
            </View>
            <Text style={styles.demoNote}>
              Demo store · Sign-in details are not sent to a server.
            </Text>
          </View>
          <Text style={styles.guestText}>
            Want a look around?{" "}
            <Text
              accessibilityRole="link"
              onPress={() => router.push("/products")}
              style={styles.link}
            >
              Browse as a guest
            </Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 28,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 36,
  },
  topNote: {
    color: colors.muted,
    fontSize: 9,
    letterSpacing: 1.4,
    fontWeight: "700",
  },
  hero: {
    marginBottom: 26,
  },
  heroPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 8,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.pale,
    marginBottom: 15,
  },
  heroDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.green,
  },
  heroPillText: {
    color: colors.greenDark,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.9,
  },
  title: {
    color: colors.ink,
    fontSize: 39,
    lineHeight: 44,
    fontWeight: "700",
    letterSpacing: -1.7,
  },
  titleAccent: {
    color: colors.green,
    fontStyle: "italic",
  },
  subtitle: {
    maxWidth: 310,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 12,
  },
  formCard: {
    borderRadius: 25,
    padding: 21,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: colors.line,
  },
  formTitle: {
    color: colors.ink,
    fontSize: 21,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  formSubtitle: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 5,
    marginBottom: 18,
  },
  fields: {
    gap: 15,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  footerText: {
    color: colors.muted,
    fontSize: 13,
  },
  link: {
    color: colors.green,
    fontSize: 13,
    fontWeight: "700",
  },
  demoNote: {
    textAlign: "center",
    color: colors.muted,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 14,
  },
  guestText: {
    color: colors.muted,
    fontSize: 13,
    textAlign: "center",
    marginTop: 20,
  },
});
