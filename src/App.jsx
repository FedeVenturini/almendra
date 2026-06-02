import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import Home from './pages/Home/Home'
import ProductDetail from './pages/ProductDetail/ProductDetail'
import CartPage from './pages/CartPage/CartPage'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/producto/:slug" element={<ProductDetail />} />
          <Route path="/carrito" element={<CartPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
