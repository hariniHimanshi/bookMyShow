import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface CartState {
  itemsSelected: number
  incrementItems: () => void
  decrementItems: () => void
}

export const useCartStore = create(
  persist<CartState>(
    (set) => ({
      itemsSelected: 0,
      incrementItems: () => set((state) => ({ itemsSelected: state.itemsSelected + 1 })),
      decrementItems: () => set((state) => ({ itemsSelected: Math.max(0, state.itemsSelected - 1) })),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)