import { CartItem, Product } from "@/types/type";
import { createContext, PropsWithChildren, useContext, useState } from "react";
import { randomUUID } from "expo-crypto";

type CartType = {
  totalPrice: number;
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  updateQuantity: (itemId: CartItem, amount: number) => void;
};

export const CartContext = createContext<CartType>({
  totalPrice: 0,
  items: [],
  addItem: () => {},
  updateQuantity: () => {},
});

const CartProvider = ({ children }: PropsWithChildren) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const addItem = (product: Product, quantity: number) => {
    const existingItem = items.find((item) => item.product.id === product.id);
    if (existingItem) {
      updateQuantity(existingItem, quantity);
      setTotalPrice(() => totalPrice + product.price * quantity);
      return;
    }

    const newCartItem: CartItem = {
      id: product.id,
      product,
      quantity,
      price: product.price * quantity,
      name: product.name,
    };

    setItems([newCartItem, ...items]);
    setTotalPrice(() => totalPrice + newCartItem.price);
  };

  const updateQuantity = (cartItem: CartItem, amount: number) => {
    const updatedItem = items
      .map((item) =>
        item.id !== cartItem.id
          ? item
          : {
              ...item,
              price: item.price + item.product.price * amount,
              quantity: item.quantity + amount,
            }
      )
      .filter((item) => item.quantity > 0);
    setItems(updatedItem);
    setTotalPrice(() => totalPrice + cartItem.product.price * amount);
  };

  return (
    <CartContext.Provider
      value={{ totalPrice, items, addItem, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;

export const useCart = () => useContext(CartContext);
