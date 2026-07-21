import { motion, AnimatePresence } from "framer-motion";
import { useState, type FormEvent } from "react";
import { FormSelect, type FormSelectOption } from "./FormSelect";
import type { TaskCategory, TaskInput, TaskPriority, TaskStatus, User } from "../types/task";
import { STATUS_LABELS } from "../types/task";

interface Props {
  initial?: Partial<TaskInput>;
  users: User[];
  submitLabel: string;
  onSubmit: (data: TaskInput) => Promise<void>;
  onCancel: () => void;
}

const emptyForm: TaskInput = {
  title: "",
  description: "",
  category: "learning",
  priority: "medium",
  status: "planned",
  ownerId: 0,
  dueDate: "",
};

const CATEGORY_OPTIONS: FormSelectOption<TaskCategory>[] = [
  { value: "learning", label: "Learning", icon: "📚", accent: "form-select__accent--learning" },
  { value: "project", label: "Project", icon: "🚀", accent: "form-select__accent--project" },
  { value: "research", label: "Research", icon: "🔬", accent: "form-select__accent--research" },
  { value: "other", label: "Other", icon: "📌", accent: "form-select__accent--other" },
];

const PRIORITY_OPTIONS: FormSelectOption<TaskPriority>[] = [
  { value: "low", label: "Low", icon: "▽", hint: "When time allows", accent: "form-select__accent--priority-low" },
  { value: "medium", label: "Medium", icon: "◆", hint: "Standard focus", accent: "form-select__accent--priority-medium" },
  { value: "high", label: "High", icon: "🔥", hint: "Needs attention", accent: "form-select__accent--priority-high" },
];

const STATUS_OPTIONS: FormSelectOption<TaskStatus>[] = [
  { value: "planned", label: STATUS_LABELS.planned, icon: "📋", accent: "form-select__accent--planned" },
  { value: "in_progress", label: STATUS_LABELS.in_progress, icon: "🚀", accent: "form-select__accent--progress" },
  { value: "completed", label: STATUS_LABELS.completed, icon: "✅", accent: "form-select__accent--done" },
];

export function TaskForm({
  initial,
  users,
  submitLabel,
  onSubmit,
  onCancel,
}: Props) {
  const [form, setForm] = useState<TaskInput>({
    ...emptyForm,
    ownerId: users[0]?.id ?? 0,
    ...initial,
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [titleFocused, setTitleFocused] = useState(false);

  const ownerOptions: FormSelectOption<number>[] = users.map((user) => ({
    value: user.id,
    label: user.name,
    hint: user.role,
    icon: user.name.charAt(0).toUpperCase(),
    accent: "form-select__accent--owner",
  }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setSubmitting(true);
    try {
      await onSubmit(form);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Save failed.";
      setErrors(message.split(". ").filter(Boolean));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
        aria-hidden="true"
      />
      <motion.div
        className="modal-wrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="modal modal--premium"
          role="dialog"
          aria-modal="true"
          aria-labelledby="task-form-title"
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
        >
          <span className="modal__glow" aria-hidden="true" />
          <span className="modal__rim" aria-hidden="true" />

          <header className="modal__header modal__header--premium">
            <motion.div
              className="modal__header-icon"
              aria-hidden="true"
              animate={{ rotate: [0, 4, -4, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              ✦
            </motion.div>
            <motion.div
              className="modal__header-copy"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 }}
            >
              <h2 id="task-form-title">{submitLabel}</h2>
              <p>Fill in the details below — fields marked with * are required.</p>
            </motion.div>
            <motion.button
              type="button"
              className="modal__close modal__close--premium"
              onClick={onCancel}
              aria-label="Close"
              whileHover={{ scale: 1.06, rotate: 90 }}
              whileTap={{ scale: 0.94 }}
            >
              ✕
            </motion.button>
          </header>

          <form className="modal__form modal__form--premium" onSubmit={handleSubmit} noValidate>
            {errors.length > 0 && (
              <motion.div
                className="form-errors form-errors--premium"
                role="alert"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <ul>
                  {errors.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              </motion.div>
            )}

            <section className="form-section">
              <h3 className="form-section__title">Task details</h3>

              <label className={`form-field form-field--premium${titleFocused ? " form-field--focused" : ""}`}>
                <span className="form-field__label">
                  Title <span className="required">*</span>
                </span>
                <input
                  type="text"
                  required
                  placeholder="e.g. Complete React module"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  onFocus={() => setTitleFocused(true)}
                  onBlur={() => setTitleFocused(false)}
                />
              </label>

              <label className="form-field form-field--premium">
                <span className="form-field__label">Description</span>
                <textarea
                  rows={4}
                  placeholder="Add context, links, or acceptance criteria…"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </label>
            </section>

            <section className="form-section">
              <h3 className="form-section__title">Classification</h3>
              <motion.div
                className="form-row"
                initial="hidden"
                animate="show"
                variants={{
                  hidden: { opacity: 0 },
                  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
                }}
              >
                <motion.div variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}>
                  <FormSelect
                    label="Category"
                    required
                    value={form.category}
                    options={CATEGORY_OPTIONS}
                    onChange={(category) => setForm({ ...form, category })}
                  />
                </motion.div>
                <motion.div variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}>
                  <FormSelect
                    label="Priority"
                    required
                    value={form.priority}
                    options={PRIORITY_OPTIONS}
                    onChange={(priority) => setForm({ ...form, priority })}
                  />
                </motion.div>
              </motion.div>

              <motion.div
                className="form-row"
                initial="hidden"
                animate="show"
                variants={{
                  hidden: { opacity: 0 },
                  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
                }}
              >
                <motion.div variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}>
                  <FormSelect
                    label="Status"
                    required
                    value={form.status}
                    options={STATUS_OPTIONS}
                    onChange={(status) => setForm({ ...form, status })}
                  />
                </motion.div>
                <motion.div variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}>
                  <FormSelect
                    label="Owner"
                    required
                    value={form.ownerId}
                    options={ownerOptions}
                    placeholder="Select owner"
                    onChange={(ownerId) => setForm({ ...form, ownerId })}
                  />
                </motion.div>
              </motion.div>
            </section>

            <section className="form-section">
              <h3 className="form-section__title">Scheduling</h3>
              <label className="form-field form-field--premium form-field--date">
                <span className="form-field__label">Due date</span>
                <span className="form-date-wrap">
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  />
                  <span className="form-date-wrap__icon" aria-hidden="true">📅</span>
                </span>
              </label>
            </section>

            <div className="form-actions form-actions--premium">
              <motion.button
                type="submit"
                className="btn btn--primary btn--glow btn--premium-submit"
                disabled={submitting}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="btn__shine" aria-hidden="true" />
                {submitting ? "Saving…" : submitLabel}
              </motion.button>
              <motion.button
                type="button"
                className="btn btn--ghost btn--premium-cancel"
                onClick={onCancel}
                disabled={submitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                Cancel
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
