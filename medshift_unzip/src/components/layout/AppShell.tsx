import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { QuickDemoBar } from './QuickDemoBar';
import { PostShiftModal } from '../shifts/PostShiftModal';
import { ResetDemoModal } from '../common/ResetDemoModal';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { resetToDefaults } = useApp();
  const { showToast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPostShiftOpen, setIsPostShiftOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const handleConfirmReset = () => {
    resetToDefaults();
    showToast(
      'Demo Data Reset',
      'All prototype shifts, invitations, and notifications have been restored to initial demo state.',
      'info'
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col antialiased transition-colors">
      {/* Technical Interview Walkthrough Bar */}
      <QuickDemoBar onOpenResetModal={() => setIsResetModalOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex shrink-0">
          <Sidebar onOpenPostShiftModal={() => setIsPostShiftOpen(true)} />
        </div>

        {/* Mobile Sidebar Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
            {/* Drawer */}
            <div className="relative z-10 flex w-72 max-w-[85vw] flex-col">
              <Sidebar
                onCloseMobile={() => setMobileMenuOpen(false)}
                onOpenPostShiftModal={() => {
                  setIsPostShiftOpen(true);
                  setMobileMenuOpen(false);
                }}
              />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <Topbar
            onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
            onOpenPostShiftModal={() => setIsPostShiftOpen(true)}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>

      {/* Global Post Shift Modal */}
      <PostShiftModal
        isOpen={isPostShiftOpen}
        onClose={() => setIsPostShiftOpen(false)}
      />

      {/* Quick Demo Reset Modal */}
      <ResetDemoModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleConfirmReset}
      />
    </div>
  );
};

