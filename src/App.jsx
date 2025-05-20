import { Route, Routes, useLocation } from 'react-router-dom';
import LandingPage from './components/pages/Landing';
import './index.css'
import { Toaster } from 'sonner'
import Home from './components/pages/Home';
import EKLGPage from './components/EKLGPage';
import Footer from './components/layouts/Footer';
import SplashScreen from './components/common/SplashScreen';
import Header from './components/common/Header';
import CatalogPage from './components/pages/CatalogPage';
import RatingPopup from './components/common/RatingPopup';
import PDFUploadPreview from './components/pages/PreviewPDFPage';

function App() {

  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  return (
    <>
      {/* <PDFUploadPreview /> */}
      <Toaster richColors duration={1500} position='top-right' />
      {!isLandingPage && <Header />}

      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/home" element={<Home />} />
        <Route path="/eklg-converter" element={<EKLGPage />} />
        <Route path="/catalog/*" element={<CatalogPage />} />
      </Routes>
      {!isLandingPage && <Footer />}
    </>
  )
}

export default App;
