"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import TaskForm from "@/components/TaskForm";
import { api } from "@/lib/api";
import { Task, KanbanState, TaskStatus } from "@/types/task";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Trash2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

const COLUMNS: { id: TaskStatus; title: string; colorClass: string }[] = [
  { id: "TODO", title: "To Do", colorClass: "border-todo text-todo" },
  { id: "IN_PROGRESS", title: "In Progress", colorClass: "border-inprogress text-inprogress" },
  { id: "DONE", title: "Done", colorClass: "border-done text-done" },
];

export default function DashboardPage() {
  const { user, token, loading, refreshUser } = useAuth();
  const router = useRouter();
  const [kanbanData, setKanbanData] = useState<KanbanState>({ TODO: [], IN_PROGRESS: [], DONE: [] });
  const [paymentLoading, setPaymentLoading] = useState<boolean>(false);
  const hasFetched = useRef<boolean>(false);
const [isUpgrading, setIsUpgrading] = useState<boolean>(false);
  useEffect(() => {
    if (!loading && !token) router.push("/login");
  }, [token, loading, router]);

  useEffect(() => {
    if (typeof window === "undefined" || !token) return;
    const paymentStatus = new URLSearchParams(window.location.search).get("payment");
    if (!paymentStatus) return;

    if (paymentStatus === "success") {
      (async () => {
        setIsUpgrading(true);
        try {
          await api.post("/api/payments/upgrade-premium");
          toast.success("🎉 Payment Successful! Account upgraded to Premium.");
          await refreshUser();
        } catch (err) {
          console.error("Upgrade error:", err);
        } finally {
          setIsUpgrading(false);
          router.replace("/dashboard");
        }
      })();
    } else if (paymentStatus === "cancel") {
      toast.error("❌ Something went wrong during upgrade.");
      router.replace("/dashboard");
    }
  }, [token, refreshUser, router]);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await api.get<{ tasks: Task[] }>("/api/tasks");
      const state: KanbanState = { TODO: [], IN_PROGRESS: [], DONE: [] };
      response.data.tasks.forEach((t) => state[t.status]?.push(t));
      setKanbanData(state);
    } catch (err) {
      console.error("Error loading tasks:", err);
    }
  }, []);

  useEffect(() => {
    if (token && !hasFetched.current) {
      hasFetched.current = true;
      fetchTasks();
    }
    return () => { hasFetched.current = false; };
  }, [token, fetchTasks]);

  const handleTaskCreated = (newTask: Task) => {
    setKanbanData((prev) => ({ ...prev, TODO: [newTask, ...prev.TODO] }));
  };

  const handleDeleteTask = async (id: string, status: TaskStatus) => {
    try {
      await api.delete(`/api/tasks/${id}`);
      setKanbanData((prev) => ({ ...prev, [status]: prev[status].filter((t) => t.id !== id) }));
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) return;

    const srcStatus = source.droppableId as TaskStatus;
    const destStatus = destination.droppableId as TaskStatus;

    const srcCol = [...kanbanData[srcStatus]];
    const destCol = source.droppableId === destination.droppableId ? srcCol : [...kanbanData[destStatus]];

    const [movedTask] = srcCol.splice(source.index, 1);
    const updatedTask = { ...movedTask, status: destStatus };
    destCol.splice(destination.index, 0, updatedTask);

    setKanbanData((prev) => ({ ...prev, [srcStatus]: srcCol, [destStatus]: destCol }));

    try {
      await api.patch(`/api/tasks/${draggableId}`, { status: destStatus });
    } catch (err) {
      console.error("Drag sync error:", err);
      fetchTasks();
    }
  };

  const handleUpgradeTrigger = async () => {
    setPaymentLoading(true);
    try {
      const response = await api.post<{ url: string }>("/api/payments/checkout", {
        successUrl: `${window.location.origin}/dashboard?payment=success`,
        cancelUrl: `${window.location.origin}/dashboard?payment=cancel`,
      });
      if (response.data.url) window.location.href = response.data.url;
    } catch (err) {
      console.error("Stripe error:", err);
      toast.error("Failed to initiate payment. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading || !user || isUpgrading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const totalTasksCount = Object.values(kanbanData).reduce((acc, col) => acc + col.length, 0);

  return (
    <div className="min-h-screen bg-background text-zinc-100">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-white">Workspace</h2>
            <p className="text-zinc-400 text-sm mt-1">Manage, update and drag your tasks efficiently.</p>
          </div>
          {!user.isPremium && (
            <button
              onClick={handleUpgradeTrigger}
              disabled={paymentLoading}
              className="flex items-center gap-2 rounded-xl bg-premium px-5 py-3 text-sm font-bold text-black transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-premium/20 disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4 fill-black" />
              {paymentLoading ? "Processing..." : "Unlock Unlimited Tasks ($5)"}
            </button>
          )}
        </div>

        <TaskForm onTaskCreated={handleTaskCreated} isPremium={user.isPremium} currentTaskCount={totalTasksCount} />

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {COLUMNS.map((col) => (
              <div key={col.id} className="bg-surface border border-border-muted rounded-2xl p-4 flex flex-col min-h-[450px]">
                <div className="mb-4 flex items-center justify-between border-b border-border-muted pb-3">
                  <span className={`text-sm font-bold uppercase tracking-wider px-2.5 py-1 border rounded-lg ${col.colorClass}`}>{col.title}</span>
                  <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-semibold text-zinc-400">{kanbanData[col.id].length}</span>
                </div>

                <Droppable droppableId={col.id}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className="flex-1 space-y-3 overflow-y-auto">
                      {kanbanData[col.id].map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(dragProvided) => (
                            <div
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              {...dragProvided.dragHandleProps}
                              className="group rounded-xl border border-border-muted bg-background/50 p-4 transition-all hover:border-zinc-700 hover:bg-background/80 shadow-md"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="font-semibold text-white break-words max-w-[85%]">{task.title}</h4>
                                <button
                                  onClick={() => handleDeleteTask(task.id, col.id)}
                                  className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-red-400 rounded-lg transition-all"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                              {task.description && <p className="mt-1 text-xs text-zinc-400 break-words line-clamp-2">{task.description}</p>}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </main>
    </div>
  );
}