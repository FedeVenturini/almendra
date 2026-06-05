import { Routes, Route } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import Home from './pages/Home/Home'
import ProductDetail from './pages/ProductDetail/ProductDetail'
import CartPage from './pages/CartPage/CartPage'
import Admin from './pages/Admin/Admin'
import ComingSoon from './pages/ComingSoon/ComingSoon'

const COMING_SOON = true

function App() {
  const location = useLocation()
  const isAdmin = location.pathname === '/admin'

  if (COMING_SOON && !isAdmin) return <ComingSoon />

  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/producto/:slug" element={<ProductDetail />} />
          <Route path="/carrito" element={<CartPage />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
