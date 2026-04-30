import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import Dashboard from './pages/Dashboard';
import ProposalForm from './pages/ProposalForm';
import ProposalView from './pages/ProposalView';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/new" element={<ProposalForm />} />
        <Route path="/list" element={<Dashboard />} />
        <Route path="/view/:id" element={<ProposalView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
