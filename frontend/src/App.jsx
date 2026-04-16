import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import AddProduct from './pages/AddProduct';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />
      <div className='p-6'>
      <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path = "/Login" element = {<Login />}></Route>
      <Route path ='/dashboard' element = {<Dashboard/>}></Route>
      <Route path='/register' element = {<Register />}></Route>
      <Route path="/add-product" element={<AddProduct />} />
      </Routes>
      </div>
    </>
  )
}

export default App
