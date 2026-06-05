import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import Home from './pages/Home/Home'
import ProductDetail from './pages/ProductDetail/ProductDetail'
import CartPage from './pages/CartPage/CartPage'
import Admin from './pages/Admin/Admin'
import ComingSoon from './pages/ComingSoon/ComingSoon'

const COMING_SOON = false

function App() {
  return (
    <>
      {!COMING_SOON && <Navbar />}
      <main>
        <Routes>
          <Route path="/admin" element={<Admin />} />
          {COMING_SOON ? (
            <Route path="*" element={<ComingSoon />} />
          ) : (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/producto/:slug" element={<ProductDetail />} />
              <Route path="/carrito" element={<CartPage />} />
            </>
          )}
        </Routes>
      </main>
      {!COMING_SOON && <Footer />}
    </>
  )
}

export default App
