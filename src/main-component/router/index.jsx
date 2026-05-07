import { BrowserRouter, Routes, Route, } from "react-router-dom";
import Homepage from '../HomePage'
import AboutPage from '../AboutPage/AboutPage';
import RoomPage from '../RoomPage';
import SearchResults from '../SearchResults/SearchResults';
import ServicePage from '../ServicePage/ServicePage';
import CartPage from '../CartPage';
import CheckoutPage from '../CheckoutPage';
import DestinationPage from '../DestinationPage/DestinationPage';
import OrderRecived from '../OrderRecived';
import LoginPage from '../LoginPage'
import SignUpPage from '../SignUpPage'
import ForgotPassword from '../ForgotPassword'
import PricingPage from '../PricingPage/PricingPage';
import ContactPage from '../ContactPage/ContactPage';
import RoomSinglePage from '../RoomSinglePage';
import ServiceSinglePage from '../ServiceSinglePage';
import AdminDashboard from '../AdminDashboard';
import MyBookingsPage from '../MyBookingsPage';
import ProtectedRoute from '../../components/auth/ProtectedRoute';

const AllRoute = () => {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Homepage />} />
          <Route path='home' element={<Homepage />} />
          <Route path='about' element={<AboutPage />} />
          <Route path='search-result' element={<SearchResults />} />
          <Route path='room-single/:roomId' element={<RoomSinglePage />} />
          <Route path='service-single/:serviceId' element={<ServiceSinglePage />} />
          <Route path='room' element={<RoomPage />} />
          <Route path='cart' element={<CartPage />} />
          <Route path='checkout' element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path='order_received' element={<OrderRecived />} />
          <Route
            path="my-bookings"
            element={
              <ProtectedRoute>
                <MyBookingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path='service' element={<ServicePage />} />
          <Route path='destination' element={<DestinationPage />} />
          <Route path='pricing' element={<PricingPage />} />
          <Route path='contact' element={<ContactPage />} />
          <Route path='login' element={<LoginPage />} />
          <Route path='register' element={<SignUpPage />} />
          <Route path='forgot-password' element={<ForgotPassword />} />
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default AllRoute;
