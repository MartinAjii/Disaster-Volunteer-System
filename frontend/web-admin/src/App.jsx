import { BrowserRouter, Routes, Route } from 'react-router-dom'

import DashboardAdmin from './pages/admin/DashboardAdmin'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={<DashboardAdmin />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App