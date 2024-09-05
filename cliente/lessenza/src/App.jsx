import React from 'react';
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import { AuthProvider } from './AuthContext/AuthContext';
import { CartProvider } from './CartProvider/CartProvider';
import ItemListContainer from './components/ItemListContainer/ItemListContainer';
import Login from './components/Login/Login';
import { NavBar } from './components/NavBar/NavBar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ItemDetailContainer } from './components/ItemDetailContainer/ItemDetailContainer';
import Register from './components/Register/Register';
import RealTimeProducts from './components/RealTimeProducts/RealTimeProducts';
import { Checkout } from './components/Checkout/Checkout';
import ResetPassword from './components/ResetPassword/ResetPassword';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import GenerateNewResetLink from './components/GenerateNewResetLink/GenerateNewResetLink';
import Footer from './components/Footer/Footer';
import UploadDocuments from './components/UploadDocuments/UploadDocuments';
import AdminUserManagement from './components/AdminUserManagement/AdminUserManagement';


const App = () => {
  return (
    <>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <NavBar />
            <Routes>
              <Route path='/' element={<ItemListContainer />} />
              <Route path='/detail/:pid' element={<ItemDetailContainer />} />
              <Route path='/checkout' element={<Checkout />} />
              <Route path='/login' element={<Login />} />
              <Route path='/forgot-password' element={<ForgotPassword />} />
              <Route path='/reset-password/:token' element={<ResetPassword />} />
              <Route path="/generate-new-reset-link" element={<GenerateNewResetLink />} />
              <Route path='/register' element={<Register />} />
              <Route path='/realtimeproducts' element={<RealTimeProducts />} />
              <Route path='/profil' element={<UploadDocuments />} />
              <Route path="/admin/users/:uid" element={<AdminUserManagement />} />
            </Routes>
            <Footer />
            <ToastContainer />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </>
  );
};

export default App;
