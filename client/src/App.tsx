import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.js';
import { SoundProvider } from './contexts/SoundContext.js';
import { AppLayout } from './layouts/AppLayout.js';
import { ProtectedRoute } from './components/auth/ProtectedRoute.js';

// Pages
import { LandingPage } from './pages/LandingPage.js';
import { AboutPage } from './pages/AboutPage.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { MissionsPage } from './pages/MissionsPage.js';
import { GoalsPage } from './pages/GoalsPage.js';
import { HabitsPage } from './pages/HabitsPage.js';
import { AchievementsPage } from './pages/AchievementsPage.js';
import { AnalyticsPage } from './pages/AnalyticsPage.js';
import { JournalPage } from './pages/JournalPage.js';
import { VisionBoardPage } from './pages/VisionBoardPage.js';
import { FocusPage } from './pages/FocusPage.js';
import { AiAssistantPage } from './pages/AiAssistantPage.js';
import { ReportsPage } from './pages/ReportsPage.js';
import { CalendarPage } from './pages/CalendarPage.js';
import { SettingsPage } from './pages/SettingsPage.js';
import { LoginPage } from './pages/auth/LoginPage.js';
import { SignupPage } from './pages/auth/SignupPage.js';
import { AuthCallbackPage } from './pages/auth/AuthCallbackPage.js';

export function App() {
  return (
    <AuthProvider>
      <SoundProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />

            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />

            {/* Protected Core Application Shell */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/missions" element={<MissionsPage />} />
              <Route path="/goals" element={<GoalsPage />} />
              <Route path="/habits" element={<HabitsPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/achievements" element={<AchievementsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/journal" element={<JournalPage />} />
              <Route path="/vision-board" element={<VisionBoardPage />} />
              <Route path="/focus" element={<FocusPage />} />
              <Route path="/ai-assistant" element={<AiAssistantPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </SoundProvider>
    </AuthProvider>
  );
}

export default App;
