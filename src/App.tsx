import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HubPage } from "./pages/HubPage";
import { MaterialMapPage } from "./pages/MaterialMapPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HubPage />} />
        <Route path="/mappa" element={<MaterialMapPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
