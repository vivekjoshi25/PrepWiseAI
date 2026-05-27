import { Routes, Route } from 'react-router-dom'
import { MainLayout } from './components/layout/MainLayout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { GuestRoute } from './components/GuestRoute'
import { Landing } from './pages/Landing'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Dashboard } from './pages/Dashboard'
import { StartInterview } from './pages/StartInterview'
import { Interview } from './pages/Interview'
import { Result } from './pages/Result'
import { InterviewHistory } from './pages/InterviewHistory'
import { Profile } from './pages/Profile'

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Landing />} />

        <Route element={<GuestRoute />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="interview/start" element={<StartInterview />} />
          <Route path="interview/:id" element={<Interview />} />
          <Route path="interview/history" element={<InterviewHistory />} />
          <Route path="results/:id" element={<Result />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>
    </Routes>
  )
}
