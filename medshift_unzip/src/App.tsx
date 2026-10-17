import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import { AppShell } from './components/layout/AppShell';

// Pages
import { LandingPage } from './pages/LandingPage';
import { RoleSelectionPage } from './pages/RoleSelectionPage';
import { HospitalDashboardPage } from './pages/hospital/HospitalDashboardPage';
import { HospitalShiftsPage } from './pages/hospital/HospitalShiftsPage';
import { PostShiftWizardPage } from './pages/hospital/PostShiftWizardPage';
import { MatchingResultsPage } from './pages/hospital/MatchingResultsPage';
import { HospitalProfessionalsPage } from './pages/hospital/HospitalProfessionalsPage';
import { ProfessionalDashboardPage } from './pages/professional/ProfessionalDashboardPage';
import { ProfessionalShiftsPage } from './pages/professional/ProfessionalShiftsPage';
import { ProfessionalAvailabilityPage } from './pages/professional/ProfessionalAvailabilityPage';
import { ProfessionalDetailPage } from './pages/professionals/ProfessionalDetailPage';
import { ShiftDetailPage } from './pages/shifts/ShiftDetailPage';
import { ProfilePage } from './pages/ProfilePage';

export default function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Landing & Onboarding */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/role-selection" element={<RoleSelectionPage />} />

            {/* Hospital Routes */}
            <Route
              path="/hospital/dashboard"
              element={
                <AppShell>
                  <HospitalDashboardPage />
                </AppShell>
              }
            />
            <Route
              path="/hospital/post-shift"
              element={
                <AppShell>
                  <PostShiftWizardPage />
                </AppShell>
              }
            />
            <Route
              path="/hospital/matching-results"
              element={
                <AppShell>
                  <MatchingResultsPage />
                </AppShell>
              }
            />
            <Route
              path="/hospital/shifts"
              element={
                <AppShell>
                  <HospitalShiftsPage />
                </AppShell>
              }
            />
            <Route
              path="/hospital/professionals"
              element={
                <AppShell>
                  <HospitalProfessionalsPage />
                </AppShell>
              }
            />

            {/* Professional Routes */}
            <Route
              path="/professional/dashboard"
              element={
                <AppShell>
                  <ProfessionalDashboardPage />
                </AppShell>
              }
            />
            <Route
              path="/professional/shifts"
              element={
                <AppShell>
                  <ProfessionalShiftsPage />
                </AppShell>
              }
            />
            <Route
              path="/professional/availability"
              element={
                <AppShell>
                  <ProfessionalAvailabilityPage />
                </AppShell>
              }
            />

            {/* Shared Profile & Detail Routes */}
            <Route
              path="/professionals/:id"
              element={
                <AppShell>
                  <ProfessionalDetailPage />
                </AppShell>
              }
            />
            <Route
              path="/shifts/:id"
              element={
                <AppShell>
                  <ShiftDetailPage />
                </AppShell>
              }
            />
            <Route
              path="/profile"
              element={
                <AppShell>
                  <ProfilePage />
                </AppShell>
              }
            />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AppProvider>
  );
}
