import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
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

const registrationSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .required("Name is required."),
  email: yup
    .string()
    .trim()
    .email("Enter a valid email address.")
    .required("Email is required."),
  password: yup
    .string()
    .required("Password is required.")
    .min(8, "Use at least 8 characters."),
  confirmPassword: yup
    .string()
    .required("Please confirm your password.")
    .oneOf([yup.ref("password")], "Passwords must match."),
});

type RegistrationValues = yup.InferType<typeof registrationSchema>;

export default function RegisterScreen() {
  const router = useRouter();
  const { isReady, signIn } = useShop();
  const [remember, setRemember] = useState(true);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<RegistrationValues>({
    resolver: yupResolver(registrationSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = handleSubmit(async ({ name, email }) => {
    try {
      await signIn({ name, email }, remember);
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
            <Link href="/" style={styles.backLink}>
              Sign in
            </Link>
          </View>
          <View style={styles.intro}>
            <Text style={styles.eyebrow}>YOUR NEXT FAVORITE THING</Text>
            <Text style={styles.title}>A good place to start.</Text>
            <Text style={styles.subtitle}>
              Create an account and find the everyday things that just feel right.
            </Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Create your account</Text>
            <StorageNotice />
            <View style={styles.fields}>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value }, fieldState }) => (
                  <TextField
                    label="Your name"
                    placeholder="Alex Morgan"
                    autoCapitalize="words"
                    autoComplete="name"
                    textContentType="name"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={fieldState.error?.message}
                  />
                )}
              />
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
                    autoComplete="new-password"
                    textContentType="newPassword"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value }, fieldState }) => (
                  <TextField
                    label="Confirm password"
                    placeholder="Enter your password again"
                    secureTextEntry
                    autoCapitalize="none"
                    autoComplete="new-password"
                    textContentType="newPassword"
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
                title={isSubmitting ? "Creating account..." : "Create account"}
                onPress={() => void onSubmit()}
                disabled={isSubmitting || !isReady}
              />
            </View>
            <Text style={styles.demoNote}>
              Demo only · Passwords are validated on this device and never saved.
            </Text>
          </View>
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
    marginBottom: 35,
  },
  backLink: {
    color: colors.green,
    fontSize: 14,
    fontWeight: "700",
  },
  intro: {
    marginBottom: 23,
  },
  eyebrow: {
    color: colors.green,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.3,
    marginBottom: 9,
  },
  title: {
    color: colors.ink,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "700",
    letterSpacing: -1.2,
  },
  subtitle: {
    maxWidth: 320,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 9,
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
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 18,
  },
  fields: {
    gap: 15,
  },
  demoNote: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center",
    marginTop: 15,
  },
});
