import { useState } from 'react';
import { DndContext, DragOverlay, closestCorners, useSensor, useSensors, PointerSensor, useDroppable } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import api from '../lib/api';
import { ApplicationDetailModal } from './ApplicationDetailModal';

const COLUMNS = ['Applied', 'Phone Screen', 'Interview', 'Offer', 'Rejected'];

const getColumnBorderColor = (col: string) => {
  switch (col) {
    case 'Applied': return 'border-slate-300';
    case 'Phone Screen': return 'border-primary';
    case 'Interview': return 'border-secondary';
    case 'Offer': return 'border-primary';
    case 'Rejected': return 'border-slate-400';
    default: return 'border-slate-300';
  }
};

/** Makes each column a valid drop target even when empty */
function DroppableColumn({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`space-y-4 min-h-[400px] rounded-lg p-3 transition-colors duration-200 ${
        isOver ? 'bg-secondary/5 ring-2 ring-secondary/20' : ''
      }`}
    >
      {children}
    </div>
  );
}

function SortableCard({ id, card, onSelect, onDelete }: { id: string; card: any; onSelect: (c: any) => void; onDelete: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const bdColor = getColumnBorderColor(card.status);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group relative bg-surface-container-lowest p-5 rounded-lg shadow-sm border-l-4 ${bdColor} hover:shadow-md transition-all cursor-grab active:cursor-grabbing ${isDragging ? 'ring-2 ring-secondary' : ''} ${card.status === 'Rejected' ? 'opacity-60 grayscale hover:opacity-100 hover:grayscale-0' : ''}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="w-8 h-8 rounded bg-slate-50 flex items-center justify-center font-bold text-primary font-headline text-sm">
          {card.company?.charAt(0) || '?'}
        </div>
        {card.status === 'Offer' && (
          <span className="text-[10px] font-bold py-1 px-2 rounded bg-secondary text-white uppercase tracking-wider animate-pulse">Offered</span>
        )}
        {card.status === 'Phone Screen' && (
          <span className="text-[10px] font-bold py-1 px-2 rounded bg-tertiary-container text-on-tertiary-container uppercase tracking-wider">Action</span>
        )}
        {card.status === 'Interview' && (
          <span className="text-[10px] font-bold py-1 px-2 rounded bg-primary-container text-on-primary-container uppercase tracking-wider">Interview</span>
        )}
      </div>

      <h3 className="font-headline font-bold text-lg text-on-surface leading-tight group-hover:text-primary transition-colors">
        {card.company}
      </h3>
      <p className="font-body text-sm text-on-surface-variant mb-3">{card.role}</p>

      {card.notes && (
        <div className="mb-3 p-3 rounded-lg bg-secondary-fixed/20 border border-secondary/10">
          <p className="text-[11px] text-secondary font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">insights</span> AI Note
          </p>
          <p className="text-xs text-on-surface-variant leading-relaxed italic line-clamp-2">{card.notes}</p>
        </div>
      )}

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-outline-variant/20">
        <span className="text-xs text-on-surface-variant flex items-center gap-1">
          <span className="material-symbols-outlined text-xs">calendar_today</span>
          {new Date(card.createdAt || card.dateApplied).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </span>
        {/* These buttons need pointer-events to work independently of the drag listener */}
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); onSelect(card); }}
            onPointerDown={(e) => e.stopPropagation()}
            className="material-symbols-outlined text-on-surface-variant text-sm hover:text-primary transition-colors cursor-pointer"
          >visibility</button>
          <button
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); onDelete(card._id); }}
            onPointerDown={(e) => e.stopPropagation()}
            className="material-symbols-outlined text-on-surface-variant text-sm hover:text-error transition-colors cursor-pointer"
          >delete</button>
        </div>
      </div>
    </div>
  );
}

export function KanbanBoard({ applications, onOpenAI, refetchApps }: { applications: any[]; onOpenAI: () => void; refetchApps: () => void }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeCard, setActiveCard] = useState<any>(null);
  const [selectedCard, setSelectedCard] = useState<any>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this application forever?")) {
      try {
        await api.delete(`/jobs/${id}`);
        refetchApps();
      } catch (e) {
        console.error("Failed to delete", e);
      }
    }
  };

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
    setActiveCard(applications.find(a => a._id === event.active.id));
  };

  const handleDragEnd = async (event: any) => {
    setActiveId(null);
    setActiveCard(null);
    const { active, over } = event;
    if (!over) return;

    const overId = over.id as string;
    let newStatus: string;

    // If dropped over a column ID directly
    if (COLUMNS.includes(overId)) {
      newStatus = overId;
    } else {
      // Dropped over another card — use that card's status
      const overCard = applications.find(a => a._id === overId);
      if (overCard) {
        newStatus = overCard.status;
      } else {
        return;
      }
    }

    const draggedCard = applications.find(a => a._id === active.id);
    if (draggedCard && draggedCard.status !== newStatus) {
      try {
        await api.put(`/jobs/${active.id}`, { status: newStatus });
        refetchApps();
      } catch (error) {
        console.error("Failed to update status", error);
      }
    }
  };

  return (
    <>
      {/* Header Section */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface mb-2">Strategy Board</h1>
          <p className="text-on-surface-variant font-body">Curating your path to the next executive milestone.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onOpenAI}
            className="px-5 py-2.5 bg-secondary text-white font-bold rounded-lg flex items-center gap-2 shadow-lg shadow-secondary/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-lg">auto_awesome</span>
            <span>AI Smart Entry</span>
          </button>
        </div>
      </div>

      {/* Empty state */}
      {applications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 opacity-60">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">view_kanban</span>
          <h3 className="font-headline font-bold text-xl text-on-surface mb-2">Your Board is Empty</h3>
          <p className="text-on-surface-variant text-sm mb-6">Click "AI Smart Entry" above to add your first application</p>
          <button onClick={onOpenAI} className="px-6 py-3 milled-gradient text-white font-bold rounded-lg shadow-lg flex items-center gap-2 hover:brightness-110 transition-all">
            <span className="material-symbols-outlined">add</span> Add First Application
          </button>
        </div>
      )}

      {/* Kanban Grid */}
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 items-start pb-20">
          {COLUMNS.map(col => {
            const colApps = applications.filter(app => app.status === col);
            return (
              <div key={col}>
                <div className="flex items-center justify-between px-2 mb-3">
                  <h2 className="font-headline font-bold text-sm tracking-widest text-on-surface-variant uppercase">
                    {col} <span className="ml-2 text-xs font-normal bg-surface-container-highest px-2 py-0.5 rounded-full">{colApps.length}</span>
                  </h2>
                  <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary text-lg">more_horiz</span>
                </div>

                <SortableContext id={col} items={colApps.map(a => a._id)} strategy={verticalListSortingStrategy}>
                  <DroppableColumn id={col}>
                    {colApps.map(card => (
                      <SortableCard key={card._id} id={card._id} card={card} onSelect={setSelectedCard} onDelete={handleDelete} />
                    ))}
                  </DroppableColumn>
                </SortableContext>
              </div>
            );
          })}
        </div>

        <DragOverlay>
          {activeId && activeCard ? (
            <div className={`bg-surface-container-lowest p-5 rounded-lg shadow-2xl border-l-4 ${getColumnBorderColor(activeCard.status)} cursor-grabbing rotate-2 opacity-90 w-[280px]`}>
              <h3 className="font-headline font-bold text-lg text-on-surface leading-tight">{activeCard.company}</h3>
              <p className="font-body text-sm text-on-surface-variant">{activeCard.role}</p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button onClick={onOpenAI} className="flex items-center gap-2 bg-primary text-white p-4 rounded-full shadow-2xl hover:bg-primary-container transition-all group overflow-hidden">
          <span className="material-symbols-outlined">add</span>
          <span className="max-w-0 group-hover:max-w-xs transition-all duration-500 ease-in-out font-bold whitespace-nowrap overflow-hidden">New Strategy Entry</span>
        </button>
      </div>

      {/* Application Detail Overlay */}
      {selectedCard && (
        <ApplicationDetailModal
          application={selectedCard}
          onClose={() => setSelectedCard(null)}
          onDelete={() => { handleDelete(selectedCard._id); setSelectedCard(null); }}
          refetchApps={refetchApps}
        />
      )}
    </>
  );
}
