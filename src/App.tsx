import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { DebriefPage } from './pages/DebriefPage'
import { InstrumentDemoPage } from './pages/InstrumentDemoPage'
import { SetupPage } from './pages/SetupPage'
import { SimPage } from './pages/SimPage'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/setup" replace />} />
        <Route path="/setup" element={<SetupPage />} />
        <Route path="/sim" element={<SimPage />} />
        <Route path="/debrief" element={<DebriefPage />} />
        <Route path="/dev/instruments" element={<InstrumentDemoPage />} />
      </Route>
    </Routes>
  )
}

export default App
