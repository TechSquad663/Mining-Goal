import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { DashboardPage } from './pages/DashboardPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { DocumentDetailPage } from './pages/DocumentDetailPage';
import { AiIntelligencePage } from './pages/AiIntelligencePage';
import { ReportsPage } from './pages/ReportsPage';
import { ReportCreatePage } from './pages/ReportCreatePage';
import { ReportDetailPage } from './pages/ReportDetailPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { TopicsPage } from './pages/TopicsPage';
import { ValidationPage } from './pages/ValidationPage';
import { KnowledgePage } from './pages/KnowledgePage';
import { AuditPage } from './pages/AuditPage';
import { AdministrationPage } from './pages/AdministrationPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Protected App Layout */}
        <Route path="/" element={<AppShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="documents" element={<DocumentsPage />} />
          <Route path="documents/:id" element={<DocumentDetailPage />} />
          <Route path="ai" element={<AiIntelligencePage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="reports/create" element={<ReportCreatePage />} />
          <Route path="reports/:id" element={<ReportDetailPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="topics" element={<TopicsPage />} />
          <Route path="validation" element={<ValidationPage />} />
          <Route path="knowledge" element={<KnowledgePage />} />
          <Route path="audit" element={<AuditPage />} />
          <Route path="administration" element={<AdministrationPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
