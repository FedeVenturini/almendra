import { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext()

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.find(i => i.id === action.product.id)
      if (existing) {
        return state.map(i =>
          i.id === action.product.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...state, { ...action.product, quantity: 1 }]
    }
    case 'REMOVE_ITEM':
      return state.filter(i => i.id !== action.id)
    case 'UPDATE_QUANTITY':
      return state.map(i =>
        i.id === action.id ? { ...i, quantity: action.quantity } : i
      ).filter(i => i.quantity > 0)
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
