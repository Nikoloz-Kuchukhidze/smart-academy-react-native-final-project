import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";

import { products, type Product } from "@/data/products";

const CART_STORAGE_KEY = "@morrow/cart-v1";
const USER_STORAGE_KEY = "@morrow/remembered-user-v1";

export type ShopUser = {
  name: string;
  email: string;
};

export type CartItem = Product & {
  quantity: number;
};

type StoredCartItem = {
  productId: string;
  quantity: number;
};

type ShopContextValue = {
  cartItems: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  user: ShopUser | null;
  isReady: boolean;
  storageError: string | null;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  signIn: (user: ShopUser, remember: boolean) => Promise<void>;
  signOut: () => Promise<void>;
};

const ShopContext = createContext<ShopContextValue | null>(null);

function isStoredCartItem(value: unknown): value is StoredCartItem {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const item = value as Record<string, unknown>;
  return (
    typeof item.productId === "string" &&
    typeof item.quantity === "number" &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0
  );
}

function parseCart(value: string | null): CartItem[] {
  if (value === null) {
    return [];
  }
  const parsed: unknown = JSON.parse(value);
  if (!Array.isArray(parsed) || !parsed.every(isStoredCartItem)) {
    throw new Error("Saved cart data is invalid.");
  }
  return parsed.flatMap((item) => {
    const product = products.find((candidate) => candidate.id === item.productId);
    return product ? [{ ...product, quantity: item.quantity }] : [];
  });
}

function parseUser(value: string | null): ShopUser | null {
  if (value === null) {
    return null;
  }
  const parsed: unknown = JSON.parse(value);
  if (
    typeof parsed !== "object" ||
    parsed === null ||
    !("name" in parsed) ||
    !("email" in parsed) ||
    typeof parsed.name !== "string" ||
    typeof parsed.email !== "string"
  ) {
    throw new Error("Saved profile data is invalid.");
  }
  return { name: parsed.name, email: parsed.email };
}

export function ShopProvider({ children }: PropsWithChildren) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<ShopUser | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const cartRef = useRef<CartItem[]>([]);
  const writeQueue = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    let active = true;
    Promise.all([
      AsyncStorage.getItem(CART_STORAGE_KEY),
      AsyncStorage.getItem(USER_STORAGE_KEY),
    ])
      .then(([savedCart, savedUser]) => {
        const nextCart = parseCart(savedCart);
        const nextUser = parseUser(savedUser);
        if (active) {
          cartRef.current = nextCart;
          setCartItems(nextCart);
          setUser(nextUser);
        }
      })
      .catch((error: unknown) => {
        console.error("Could not load saved shop data.", error);
        if (active) {
          setStorageError("Saved data could not be loaded. Your changes may not persist.");
        }
      })
      .finally(() => {
        if (active) {
          setIsReady(true);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const writeStorage = useCallback((key: string, value: string | null) => {
    const write = writeQueue.current.then(async () => {
      if (value === null) {
        await AsyncStorage.removeItem(key);
      } else {
        await AsyncStorage.setItem(key, value);
      }
    });
    writeQueue.current = write.catch((error: unknown) => {
      console.error("Could not save shop data.", error);
      setStorageError("Your changes could not be saved on this device.");
    });
    return write;
  }, []);

  const saveCart = useCallback(
    async (nextItems: CartItem[]) => {
      cartRef.current = nextItems;
      setCartItems(nextItems);
      const storedItems: StoredCartItem[] = nextItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));
      await writeStorage(CART_STORAGE_KEY, JSON.stringify(storedItems));
    },
    [writeStorage],
  );

  const addToCart = useCallback(
    async (product: Product, quantity = 1) => {
      const existing = cartRef.current.find((item) => item.id === product.id);
      const nextItems = existing
        ? cartRef.current.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
          )
        : [...cartRef.current, { ...product, quantity }];
      await saveCart(nextItems);
    },
    [saveCart],
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      if (quantity <= 0) {
        await saveCart(cartRef.current.filter((item) => item.id !== productId));
        return;
      }
      await saveCart(
        cartRef.current.map((item) =>
          item.id === productId ? { ...item, quantity } : item,
        ),
      );
    },
    [saveCart],
  );

  const removeFromCart = useCallback(
    async (productId: string) => {
      await saveCart(cartRef.current.filter((item) => item.id !== productId));
    },
    [saveCart],
  );

  const clearCart = useCallback(async () => {
    await saveCart([]);
  }, [saveCart]);

  const signIn = useCallback(
    async (nextUser: ShopUser, remember: boolean) => {
      setUser(nextUser);
      await writeStorage(
        USER_STORAGE_KEY,
        remember ? JSON.stringify(nextUser) : null,
      );
    },
    [writeStorage],
  );

  const signOut = useCallback(async () => {
    setUser(null);
    await writeStorage(USER_STORAGE_KEY, null);
  }, [writeStorage]);

  const value = useMemo<ShopContextValue>(
    () => ({
      cartItems,
      cartCount: cartItems.reduce((total, item) => total + item.quantity, 0),
      cartSubtotal: cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      ),
      user,
      isReady,
      storageError,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      signIn,
      signOut,
    }),
    [
      addToCart,
      cartItems,
      clearCart,
      isReady,
      removeFromCart,
      signIn,
      signOut,
      storageError,
      updateQuantity,
      user,
    ],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (context === null) {
    throw new Error("useShop must be used within a ShopProvider.");
  }
  return context;
}
