import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MusicProvider } from "./MusicContext";
import MusicToggle from "./components/MusicToggle";
import Home from "./pages/Home";
import ElegirPersonaje from "./pages/ElegirPersonaje";
import Despedida from "./pages/Despedida";

function App() {
  return (
    <BrowserRouter>
      <MusicProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/elige-personaje" element={<ElegirPersonaje />} />
          <Route path="/despedida" element={<Despedida />} />
        </Routes>
        <MusicToggle />
      </MusicProvider>
    </BrowserRouter>
  );
}

export default App;
