// src/Routes.jsx
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register'
import Coupons from './pages/Coupons';
import Bin from './pages/Bin'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/coupons" element={<Coupons />} />
      <Route path="/bin" element={<Bin />} />


    </Routes>
  );
};

export default AppRoutes;
