
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ProjectsPage from "./pages/ProjectsPage";
import StudiesPage from "./pages/StudiesPage";
import CreateStudyPage from "./pages/CreateStudyPage";
import CreateProjectPage from "./pages/CreateProjectPage";
import ImportPage from "./pages/ImportPage";
import NotFound from "./pages/NotFound";
import GateStudyPlanPage from "./pages/GateStudyPlanPage";
import GateStudyViewPage from "./pages/GateStudyViewPage";
import TimeTrackingPage from "./pages/TimeTrackingPage";
import ProjectViewPage from "./pages/ProjectViewPage";
import ProjectEditPage from "./pages/ProjectEditPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/new" element={<CreateProjectPage />} />
          <Route path="/projects/:id/edit" element={<ProjectEditPage />} />
          <Route path="/projects/:id/view" element={<ProjectViewPage />} />
          <Route path="/studies" element={<StudiesPage />} />
          <Route path="/studies/new" element={<CreateStudyPage />} />
          <Route path="/gate-study" element={<GateStudyPlanPage />} />
          <Route path="/gate-study/:id" element={<GateStudyPlanPage />} />
          <Route path="/studies/:id" element={<GateStudyViewPage />} />
          <Route path="/import" element={<ImportPage />} />
          <Route path="/time-tracking" element={<TimeTrackingPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
