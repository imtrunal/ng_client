import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom"
import { HeroUIProvider } from "@heroui/react";
import { MenuProvider } from './components/common/MenuProvider.jsx';

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <MenuProvider>
      <BrowserRouter>
        <HeroUIProvider>
          <App />
        </HeroUIProvider>
      </BrowserRouter>
    </MenuProvider>
  // </StrictMode>
)
