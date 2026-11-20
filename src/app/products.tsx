import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { colors } from "@/constants/theme";
import { useShop } from "@/context/shop-context";
import { products, type Product } from "@/data/products";
import {
  Brand,
  CartButton,
  ProductCard,
  SafeScreen,
  StorageNotice,
} from "@/components/shop-ui";

const categories = ["All", "Home", "Tech", "Style"] as const;
type Category = (typeof categories)[number];

export default function ProductsScreen() {
  const router = useRouter();
  const { isReady, user, signOut } = useShop();
  const [category, setCategory] = useState<Category>("All");
  const [search, setSearch] = useState("");

  const visibleProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesCategory =
          category === "All" || product.category === category;
        const matchesSearch = product.name
          .toLowerCase()
          .includes(search.trim().toLowerCase());
        return matchesCategory && matchesSearch;
      }),
    [category, search],
  );

  const openProduct = (product: Product) => {
    router.push({ pathname: "/product/[id]", params: { id: product.id } });
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

  const listHeader = (
    <View>
      <View style={styles.welcomeRow}>
        <View>
          <Text style={styles.eyebrow}>A MORE MINDFUL MARKET</Text>
          <Text style={styles.greeting}>
            Good things, {user?.name.split(" ")[0] || "friend"}.
          </Text>
        </View>
        <View style={styles.sunMark}>
          <Text style={styles.sunEmoji}>☀</Text>
        </View>
      </View>
      <View style={styles.promo}>
        <View style={styles.promoCopy}>
          <Text style={styles.promoEyebrow}>THE EVERYDAY EDIT</Text>
          <Text style={styles.promoTitle}>Keep what{"\n"}feels good.</Text>
          <Text style={styles.promoSubtitle}>Small-batch finds, made to last.</Text>
        </View>
        <Text style={styles.promoArt}>✳</Text>
      </View>
      <View style={styles.sectionHeading}>
        <Text style={styles.sectionTitle}>Shop the collection</Text>
        <Text style={styles.itemCount}>{visibleProducts.length} finds</Text>
      </View>
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          accessibilityLabel="Search products"
          value={search}
          onChangeText={setSearch}
          placeholder="Search something lovely..."
          placeholderTextColor={colors.muted}
          returnKeyType="search"
          style={styles.searchInput}
        />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryRow}
      >
        {categories.map((item) => {
          const selected = category === item;
          return (
            <Pressable
              key={item}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => setCategory(item)}
              style={[styles.categoryChip, selected && styles.categoryChipActive]}
            >
              <Text
                style={[
                  styles.categoryText,
                  selected && styles.categoryTextActive,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );

  return (
    <SafeScreen>
      <View style={styles.flex}>
        <View style={styles.topBar}>
          <Brand />
          <View style={styles.topActions}>
            <CartButton />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Sign out"
              onPress={async () => {
                try {
                  await signOut();
                  router.replace("/");
                } catch {
                  router.replace("/");
                }
              }}
              style={styles.signOut}
            >
              <Text style={styles.signOutText}>EXIT</Text>
            </Pressable>
          </View>
        </View>
        <StorageNotice />
        <FlatList
          data={visibleProducts}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.productRow}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={
            <Text style={styles.emptySearch}>No finds match that search.</Text>
          }
          renderItem={({ item }) => (
            <ProductCard product={item} onPress={() => openProduct(item)} />
          )}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      </View>
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
  topBar: {
    minHeight: 58,
    paddingHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  signOut: {
    paddingVertical: 9,
    paddingHorizontal: 4,
  },
  signOutText: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.9,
  },
  listContent: {
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 30,
  },
  welcomeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  eyebrow: {
    color: colors.green,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  greeting: {
    color: colors.ink,
    fontSize: 25,
    fontWeight: "700",
    letterSpacing: -0.8,
  },
  sunMark: {
    width: 43,
    height: 43,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: colors.lime,
  },
  sunEmoji: {
    color: colors.greenDark,
    fontSize: 23,
  },
  promo: {
    minHeight: 168,
    overflow: "hidden",
    borderRadius: 24,
    padding: 21,
    backgroundColor: colors.greenDark,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 26,
  },
  promoCopy: {
    zIndex: 1,
  },
  promoEyebrow: {
    color: colors.lime,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 9,
  },
  promoTitle: {
    color: "#FFFFFF",
    fontSize: 29,
    lineHeight: 31,
    fontWeight: "700",
    letterSpacing: -0.9,
  },
  promoSubtitle: {
    color: "#E3E9DF",
    fontSize: 11,
    marginTop: 9,
  },
  promoArt: {
    position: "absolute",
    right: -9,
    top: 0,
    color: "rgba(220,233,185,0.2)",
    fontSize: 174,
    lineHeight: 180,
  },
  sectionHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.4,
  },
  itemCount: {
    color: colors.muted,
    fontSize: 12,
  },
  searchBox: {
    height: 48,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: colors.line,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  searchIcon: {
    color: colors.green,
    fontSize: 25,
    lineHeight: 28,
    marginRight: 9,
  },
  searchInput: {
    flex: 1,
    padding: 0,
    color: colors.ink,
    fontSize: 13,
  },
  categoryRow: {
    gap: 8,
    paddingBottom: 18,
  },
  categoryChip: {
    minWidth: 62,
    height: 34,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  categoryChipActive: {
    backgroundColor: colors.green,
    borderColor: colors.green,
  },
  categoryText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "600",
  },
  categoryTextActive: {
    color: "#FFFFFF",
  },
  productRow: {
    justifyContent: "space-between",
  },
  emptySearch: {
    color: colors.muted,
    textAlign: "center",
    paddingVertical: 30,
    fontSize: 14,
  },
});
