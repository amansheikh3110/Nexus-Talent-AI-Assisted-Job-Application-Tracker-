import { useState } from 'react';
import { KanbanBoard } from '../components/KanbanBoard';
import { AIParserModal } from '../components/AIParserModal';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { MainLayout } from '../components/MainLayout';

export function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);

  const { data: applications = [], isLoading, refetch } = useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const { data } = await api.get('/jobs');
      return data;
    }
  });

  const openAIModal = () => setModalOpen(true);

  return (
    <>
      <MainLayout onAddApplication={openAIModal}>
        {isLoading ? (
          <div className="h-[500px] flex items-center justify-center text-on-surface-variant flex-col gap-4">
            <div className="w-10 h-10 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin"></div>
            <span className="font-body text-sm">Loading Architect Board...</span>
          </div>
        ) : (
          <KanbanBoard applications={applications} onOpenAI={openAIModal} refetchApps={refetch} />
        )}
      </MainLayout>
      <AIParserModal isOpen={modalOpen} onClose={() => { setModalOpen(false); refetch(); }} />
    </>
  );
}
