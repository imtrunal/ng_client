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
import PdfViewer from './components/PDFView';
import LetsTalk from './components/pages/LetsTalk';
import Invoice from './components/common/Invoice';

function App() {

  const location = useLocation();
  const isLandingPage = location.pathname === "/";
  const isPDFViewPage = location.pathname === "/view";

  return (
    <>
      {/* <PDFUploadPreview /> */}
      {/* <RatingPopup /> */}
      <Toaster richColors duration={1500} position='top-right' />
      {!isLandingPage && !isPDFViewPage && <Header />}

      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/home" element={<Home />} />
        <Route path="/eklg-converter" element={<EKLGPage />} />
        <Route path="/catalog/*" element={<CatalogPage />} />
        <Route path="/view" element={<PdfViewer />} />
        <Route path="/lets-talk" element={<LetsTalk />} />
        <Route path="/invoice" element={<Invoice />} />

      </Routes>
      {!isLandingPage && <Footer />}
    </>
  )
}

export default App;
