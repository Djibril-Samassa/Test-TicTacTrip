import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Accueil from "./Pages/Accueil";

// Toutes les éventuelles routes sont entourées par le div "App" pour qu'on puisse leur appliqué sont CSS et qu'ils aient tous la même hiérarchi de départ
// La route de base "/" va retourner la page d'accueil

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Accueil />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
