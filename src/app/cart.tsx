import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors } from "@/constants/theme";
import { useShop, type CartItem } from "@/context/shop-context";
import {
  ActionButton,
  BackButton,
  PageHeader,
  ProductArtwork,
  SafeScreen,
  StorageNotice,
} from "@/components/shop-ui";

function CartRow({
  item,
  onChangeQuantity,
  onRemove,
}: {
  item: CartItem;
  onChangeQuantity: (quantity: number) => void;
  onRemove: () => void;
}) {
  return (
    <View style={styles.cartRow}>
      <View style={styles.thumb}>
        <ProductArtwork product={item} />
      </View>
      <View style={styles.itemDetails}>
        <Text style={styles.itemCategory}>{item.category.toUpperCase()}</Text>
        <Text numberOfLines={1} style={styles.itemName}>
          {item.name}
        </Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
        <View style={styles.quantityRow}>
          <View style={styles.quantityControl}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Decrease ${item.name} quantity`}
              onPress={() => onChangeQuantity(item.quantity - 1)}
              style={styles.quantityButton}
            >
              <Text style={styles.quantityButtonText}>−</Text>
            </Pressable>
            <Text style={styles.quantity}>{item.quantity}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Increase ${item.name} quantity`}
              onPress={() => onChangeQuantity(item.quantity + 1)}
              style={styles.quantityButton}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </Pressable>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Remove ${item.name}`}
            onPress={onRemove}
          >
            <Text style={styles.removeText}>Remove</Text>
          </Pressable>
        </View>
      </View>
      <Text style={styles.lineTotal}>${(item.price * item.quantity).toFixed(2)}</Text>
    </View>
  );
}

export default function CartScreen() {
  const router = useRouter();
  const {
    cartItems,
    cartSubtotal,
    isReady,
    updateQuantity,
    removeFromCart,
  } = useShop();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleUpdate = async (operation: () => Promise<void>) => {
    try {
      await operation();
    } catch {
      Alert.alert("Could not update your bag", "Please try again.");
    }
  };

  const checkout = () => {
    setIsCheckingOut(true);
    Alert.alert(
      "Your bag is ready",
      "Checkout is a demo flow. No payment will be collected.",
      [{ text: "Sounds good", onPress: () => setIsCheckingOut(false) }],
    );
  };

  if (!isReady) {
    return (
      <SafeScreen>
        <View style={styles.loading}>
          <ActivityIndicator color={colors.green} />
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen>
      <PageHeader
        title="Your bag"
        left={<BackButton onPress={() => router.back()} />}
        right={<View style={styles.headerSpacer} />}
      />
      <StorageNotice />
      {cartItems.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Text style={styles.emptyEmoji}>🛍</Text>
          </View>
          <Text style={styles.emptyTitle}>Your bag is taking a breather.</Text>
          <Text style={styles.emptyText}>
            The good stuff is still out there. Find something you love.
          </Text>
          <ActionButton
            title="Explore the collection"
            onPress={() => router.replace("/products")}
          />
        </View>
      ) : (
        <View style={styles.flex}>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CartRow
                item={item}
                onChangeQuantity={(quantity) =>
                  handleUpdate(() => updateQuantity(item.id, quantity))
                }
                onRemove={() =>
                  handleUpdate(() => removeFromCart(item.id))
                }
              />
            )}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            showsVerticalScrollIndicator={false}
          />
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${cartSubtotal.toFixed(2)}</Text>
            </View>
            <Text style={styles.shippingNote}>
              Shipping and taxes calculated at checkout.
            </Text>
            <ActionButton
              title={isCheckingOut ? "Almost there..." : "Continue to checkout"}
              onPress={checkout}
              disabled={isCheckingOut}
            />
          </View>
        </View>
      )}
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerSpacer: {
    height: 40,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.pale,
    marginBottom: 20,
  },
  emptyEmoji: {
    fontSize: 36,
  },
  emptyTitle: {
    color: colors.ink,
    textAlign: "center",
    fontSize: 21,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  emptyText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 9,
    marginBottom: 23,
  },
  listContent: {
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 20,
  },
  cartRow: {
    minHeight: 116,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  thumb: {
    width: 82,
    height: 88,
    borderRadius: 16,
    overflow: "hidden",
  },
  itemDetails: {
    flex: 1,
    alignSelf: "stretch",
    justifyContent: "center",
  },
  itemCategory: {
    color: colors.muted,
    fontSize: 9,
    fontWeight: "600",
    letterSpacing: 0.8,
  },
  itemName: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: "700",
    marginTop: 4,
  },
  itemPrice: {
    color: colors.green,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 4,
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 9,
  },
  quantityControl: {
    height: 29,
    borderRadius: 9,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: colors.line,
  },
  quantityButton: {
    width: 29,
    height: 27,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButtonText: {
    color: colors.greenDark,
    fontSize: 17,
    lineHeight: 20,
    fontWeight: "600",
  },
  quantity: {
    minWidth: 20,
    color: colors.ink,
    fontSize: 12,
    textAlign: "center",
    fontWeight: "600",
  },
  removeText: {
    color: colors.muted,
    fontSize: 11,
    textDecorationLine: "underline",
  },
  lineTotal: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: "700",
    alignSelf: "flex-start",
    marginTop: 19,
  },
  separator: {
    height: 1,
    backgroundColor: colors.line,
    marginVertical: 8,
  },
  summary: {
    paddingHorizontal: 22,
    paddingTop: 17,
    paddingBottom: 18,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.background,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  summaryLabel: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "600",
  },
  summaryValue: {
    color: colors.ink,
    fontSize: 19,
    fontWeight: "700",
  },
  shippingNote: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 5,
    marginBottom: 15,
  },
});
