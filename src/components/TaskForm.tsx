"use client";

import React, { useState, FormEvent } from "react";
import { api } from "@/lib/api";
import { Task } from "@/types/task";
import { Plus, AlertCircle } from "lucide-react";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

interface TaskFormProps {
  onTaskCreated: (newTask: Task) => void;
  isPremium: boolean;
  currentTaskCount: number;
}

const INPUT_CLASS = "w-full rounded-xl border border-border-muted bg-background px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-primary focus:outline-none disabled:opacity-40 transition-colors";

export default function TaskForm({ onTaskCreated, isPremium, currentTaskCount }: TaskFormProps) {
  const [form, setForm] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState<boolean>(false);

  const isLimitReached = !isPremium && currentTaskCount >= 3;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isLimitReached) return;
    setLoading(true);

    try {
      const response = await api.post<{ task: Task }>("/api/tasks", {
        title: form.title.trim(),
        description: form.description.trim() || null,
        status: "TODO",
      });
      onTaskCreated(response.data.task);
      setForm({ title: "", description: "" }); 
      toast.success("🎉 Task created successfully!");
    } catch (err) {
      const errMsg = (err as AxiosError<{ error: string }>).response?.data?.error || "Failed to create task";
      toast.error(`❌ ${errMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface border border-border-muted rounded-2xl p-6 shadow-xl mb-8">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Plus className="h-5 w-5 text-primary" /> Create New Task
      </h3>

      {isLimitReached && (
        <div className="mb-4 flex items-start gap-2 rounded-xl bg-premium/10 border border-premium/20 p-3 text-sm text-premium">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Free Plan Limit Reached:</span> You have used your 3 free tasks. Please upgrade to Premium to add unlimited tasks.
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="md:col-span-1">
            <input
              type="text"
              required
              disabled={isLimitReached || loading}
              placeholder="Task Title..."
              className={INPUT_CLASS}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className="md:col-span-2 flex gap-3">
            <input
              type="text"
              disabled={isLimitReached || loading}
              placeholder="Description (optional)..."
              className={INPUT_CLASS}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <button
              type="submit"
              disabled={isLimitReached || loading || !form.title.trim()}
              className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-30 whitespace-nowrap"
            >
              Add Task
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}