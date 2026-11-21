import type { PropsWithChildren, ReactNode } from "react";
import { SymbolView } from "expo-symbols";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  type PressableProps,
} from "react-native";
import { useRouter } from "expo-router";

import { useShop } from "@/context/shop-context";
import type { Product } from "@/data/products";
import { colors } from "@/constants/theme";

export function SafeScreen({
  children,
  backgroundColor = colors.background,
}: PropsWithChildren<{ backgroundColor?: string }>) {
  return (
    <SafeAreaView style={[styles.safeScreen, { backgroundColor }]}>
      {children}
    </SafeAreaView>
  );
}

export function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <View style={styles.brandRow}>
      <View style={[styles.brandMark, inverse && styles.brandMarkInverse]}>
        <Text style={styles.brandMarkText}>m</Text>
      </View>
      <Text style={[styles.brandName, inverse && styles.brandNameInverse]}>
        morrow
      </Text>
    </View>
  );
}

export function BarcodeScanIcon({
  size = 22,
  color = colors.greenDark,
}: {
  size?: number;
  color?: string;
}) {
  return (
    <SymbolView
      name={{
        ios: "barcode.viewfinder",
        android: "barcode_scanner",
        web: "barcode_scanner",
      }}
      size={size}
      tintColor={color}
    />
  );
}

type ButtonProps = PressableProps & {
  title: string;
  variant?: "primary" | "secondary" | "plain";
  compact?: boolean;
};

export function ActionButton({
  title,
  variant = "primary",
  compact = false,
  style,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      {...props}
      style={(state) => [
        styles.button,
        variant === "primary" && styles.buttonPrimary,
        variant === "secondary" && styles.buttonSecondary,
        variant === "plain" && styles.buttonPlain,
        compact && styles.buttonCompact,
        state.pressed && styles.pressed,
        typeof style === "function" ? style(state) : style,
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          variant === "secondary" && styles.buttonTextSecondary,
          variant === "plain" && styles.buttonTextPlain,
          compact && styles.buttonTextCompact,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

export function CartButton() {
  const router = useRouter();
  const { cartCount } = useShop();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Shopping bag, ${cartCount} items`}
      onPress={() => router.push("/cart")}
      style={styles.cartButton}
    >
      <Text style={styles.cartIcon}>▢</Text>
      {cartCount > 0 && (
        <View style={styles.cartBadge}>
          <Text style={styles.cartBadgeText}>
            {cartCount > 99 ? "99+" : cartCount}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

export function PageHeader({
  title,
  left,
  right,
}: {
  title?: string;
  left?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <View style={styles.pageHeader}>
      <View style={styles.headerSide}>
        {left ?? <Brand />}
      </View>
      {title ? <Text style={styles.headerTitle}>{title}</Text> : <View />}
      <View style={[styles.headerSide, styles.headerRight]}>
        {right ?? <CartButton />}
      </View>
    </View>
  );
}

export function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Go back"
      onPress={onPress}
      hitSlop={10}
      style={styles.backButton}
    >
      <Text style={styles.backButtonText}>‹</Text>
    </Pressable>
  );
}

export function RememberToggle({
  checked,
  onPress,
}: {
  checked: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={onPress}
      style={styles.rememberRow}
    >
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked ? <Text style={styles.checkmark}>✓</Text> : null}
      </View>
      <Text style={styles.rememberText}>Remember me</Text>
    </Pressable>
  );
}

export function ProductArtwork({
  product,
  large = false,
}: {
  product: Product;
  large?: boolean;
}) {
  return (
    <View
      style={[
        styles.artwork,
        { backgroundColor: product.color },
        large && styles.artworkLarge,
      ]}
    >
      <Text style={[styles.artworkEmoji, large && styles.artworkEmojiLarge]}>
        {product.emoji}
      </Text>
      <View style={styles.artworkDecor} />
    </View>
  );
}

export function ProductCard({
  product,
  onPress,
}: {
  product: Product;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${product.name}, $${product.price}`}
      onPress={onPress}
      style={({ pressed }) => [styles.productCard, pressed && styles.pressed]}
    >
      <View style={styles.productImageWrap}>
        <ProductArtwork product={product} />
        {product.label ? (
          <View style={styles.productLabel}>
            <Text style={styles.productLabelText}>{product.label}</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productCategory}>{product.category}</Text>
        <Text numberOfLines={1} style={styles.productName}>
          {product.name}
        </Text>
        <View style={styles.productPriceRow}>
          <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
          <Text style={styles.productRating}>★ {product.rating}</Text>
        </View>
      </View>
    </Pressable>
  );
}

export function StorageNotice() {
  const { storageError } = useShop();
  if (!storageError) {
    return null;
  }
  return (
    <View accessibilityRole="alert" style={styles.storageNotice}>
      <Text style={styles.storageNoticeText}>{storageError}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeScreen: {
    flex: 1,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  brandMark: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.green,
  },
  brandMarkInverse: {
    backgroundColor: "#FFFFFF",
  },
  brandMarkText: {
    color: "#FFFFFF",
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "700",
  },
  brandName: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.7,
  },
  brandNameInverse: {
    color: "#FFFFFF",
  },
  button: {
    minHeight: 54,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  buttonPrimary: {
    backgroundColor: colors.green,
  },
  buttonSecondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  buttonPlain: {
    backgroundColor: "transparent",
  },
  buttonCompact: {
    minHeight: 42,
    borderRadius: 13,
    paddingHorizontal: 15,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.1,
  },
  buttonTextSecondary: {
    color: colors.ink,
  },
  buttonTextPlain: {
    color: colors.green,
  },
  buttonTextCompact: {
    fontSize: 13,
  },
  pressed: {
    opacity: 0.78,
  },
  cartButton: {
    width: 42,
    height: 42,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  cartIcon: {
    color: colors.ink,
    fontSize: 24,
    lineHeight: 28,
    fontWeight: "400",
  },
  cartBadge: {
    position: "absolute",
    right: -5,
    top: -5,
    minWidth: 19,
    height: 19,
    borderRadius: 10,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.green,
  },
  cartBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  pageHeader: {
    minHeight: 58,
    paddingHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerSide: {
    width: 100,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  headerTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: "700",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  backButtonText: {
    color: colors.ink,
    fontSize: 30,
    lineHeight: 32,
    marginTop: -4,
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minHeight: 34,
    alignSelf: "flex-start",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
  },
  checkboxChecked: {
    backgroundColor: colors.green,
    borderColor: colors.green,
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  rememberText: {
    color: colors.ink,
    fontSize: 13,
  },
  artwork: {
    height: 148,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  artworkLarge: {
    height: 330,
    borderRadius: 28,
  },
  artworkEmoji: {
    fontSize: 62,
    zIndex: 1,
  },
  artworkEmojiLarge: {
    fontSize: 126,
  },
  artworkDecor: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 60,
    right: -24,
    bottom: -34,
    backgroundColor: "rgba(255,255,255,0.28)",
  },
  productCard: {
    flex: 1,
    maxWidth: "48%",
    marginBottom: 20,
  },
  productImageWrap: {
    position: "relative",
  },
  productLabel: {
    position: "absolute",
    top: 10,
    left: 10,
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 5,
    backgroundColor: "#FFFFFF",
  },
  productLabelText: {
    color: colors.greenDark,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  productInfo: {
    paddingHorizontal: 3,
    paddingTop: 10,
  },
  productCategory: {
    color: colors.muted,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  productName: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: "700",
    marginTop: 4,
  },
  productPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  productPrice: {
    color: colors.greenDark,
    fontSize: 14,
    fontWeight: "700",
  },
  productRating: {
    color: colors.muted,
    fontSize: 11,
  },
  storageNotice: {
    marginHorizontal: 22,
    marginTop: 8,
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#F9E8E5",
  },
  storageNoticeText: {
    color: colors.danger,
    fontSize: 12,
    lineHeight: 17,
  },
});
