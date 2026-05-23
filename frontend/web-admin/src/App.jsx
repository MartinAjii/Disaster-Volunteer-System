import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import DashboardUser from "./pages/user/DashboardUser";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* LANDING PAGE */}
        <Route
          path="/"
          element={<LandingPage />}
        />

        {/* USER DASHBOARD */}
        <Route
          path="/user/dashboard"
          element={<DashboardUser />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;