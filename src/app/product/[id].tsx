import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors } from "@/constants/theme";
import { useShop } from "@/context/shop-context";
import { products } from "@/data/products";
import {
  ActionButton,
  BackButton,
  CartButton,
  PageHeader,
  ProductArtwork,
  SafeScreen,
  StorageNotice,
} from "@/components/shop-ui";

export default function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addToCart, isReady } = useShop();
  const [isAdding, setIsAdding] = useState(false);
  const product = products.find((item) => item.id === id);

  if (!isReady) {
    return (
      <SafeScreen>
        <View style={styles.loading}>
          <ActivityIndicator color={colors.green} />
        </View>
      </SafeScreen>
    );
  }

  if (!product) {
    return (
      <SafeScreen>
        <PageHeader left={<BackButton onPress={() => router.back()} />} />
        <View style={styles.notFound}>
          <Text style={styles.title}>We couldn’t find that one.</Text>
          <ActionButton title="Back to the collection" onPress={() => router.replace("/products")} />
        </View>
      </SafeScreen>
    );
  }

  const onAddToCart = async () => {
    setIsAdding(true);
    try {
      await addToCart(product);
      router.push("/cart");
    } catch {
      Alert.alert("Could not save your bag", "Please try adding this item again.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <SafeScreen>
      <PageHeader
        left={<BackButton onPress={() => router.back()} />}
        right={<CartButton />}
      />
      <StorageNotice />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ProductArtwork product={product} large />
        <View style={styles.categoryRow}>
          <Text style={styles.category}>{product.category.toUpperCase()}</Text>
          <Text style={styles.rating}>★ {product.rating} · Loved by customers</Text>
        </View>
        {product.label ? (
          <Text style={styles.label}>{product.label}</Text>
        ) : null}
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        <View style={styles.divider} />
        <Text style={styles.description}>{product.description}</Text>
        <View style={styles.detailNote}>
          <Text style={styles.detailNoteIcon}>✳</Text>
          <Text style={styles.detailNoteText}>
            Thoughtfully selected. Made for everyday living.
          </Text>
        </View>
        <ActionButton
          title={isAdding ? "Adding to bag..." : "Add to bag"}
          onPress={onAddToCart}
          disabled={isAdding}
        />
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 30,
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 12,
  },
  category: {
    color: colors.green,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.2,
  },
  rating: {
    color: colors.muted,
    fontSize: 11,
  },
  label: {
    color: colors.greenDark,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 7,
  },
  title: {
    color: colors.ink,
    fontSize: 29,
    lineHeight: 35,
    fontWeight: "700",
    letterSpacing: -0.9,
  },
  price: {
    color: colors.green,
    fontSize: 19,
    fontWeight: "700",
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: colors.line,
    marginVertical: 19,
  },
  description: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 22,
  },
  detailNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    borderRadius: 14,
    padding: 13,
    backgroundColor: colors.pale,
    marginTop: 20,
    marginBottom: 23,
  },
  detailNoteIcon: {
    color: colors.green,
    fontSize: 18,
  },
  detailNoteText: {
    flex: 1,
    color: colors.greenDark,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "600",
  },
  notFound: {
    flex: 1,
    justifyContent: "center",
    gap: 20,
    paddingHorizontal: 24,
  },
});
