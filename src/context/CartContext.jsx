import { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext()

const MAX_QUANTITY = 99

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.find(i => i.id === action.product.id)
      if (existing) {
        const max = existing.stock > 0 ? Math.min(existing.stock, MAX_QUANTITY) : MAX_QUANTITY
        const newQty = Math.min(existing.quantity + 1, max)
        return state.map(i =>
          i.id === action.product.id ? { ...i, quantity: newQty } : i
        )
      }
      return [...state, { ...action.product, quantity: 1 }]
    }
    case 'REMOVE_ITEM':
      return state.filter(i => i.id !== action.id)
    case 'UPDATE_QUANTITY': {
      const item = state.find(i => i.id === action.id)
      const max = item?.stock > 0 ? Math.min(item.stock, MAX_QUANTITY) : MAX_QUANTITY
      const clampedQty = Math.min(action.quantity, max)
      return state.map(i =>
        i.id === action.id ? { ...i, quantity: clampedQty } : i
      ).filter(i => i.quantity > 0)
    }
    case 'CLEAR':
      return []
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(
    cartReducer,
    [],
    () => {
      try {
        return JSON.parse(localStorage.getItem('almendra-cart')) ?? []
      } catch {
        return []
      }
    }
  )

  useEffect(() => {
    localStorage.setItem('almendra-cart', JSON.stringify(cart))
  }, [cart])

  const addItem = (product) => dispatch({ type: 'ADD_ITEM', product })
  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', id })
  const updateQuantity = (id, quantity) => dispatch({ type: 'UPDATE_QUANTITY', id, quantity })
  const clearCart = () => dispatch({ type: 'CLEAR' })
  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const count = cart.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQuantity, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
