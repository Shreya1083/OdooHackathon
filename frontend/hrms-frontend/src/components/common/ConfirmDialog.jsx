import Modal from './Modal.jsx';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  confirmClass = 'btn-danger',
  loading = false,
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
          <AlertTriangle size={20} className="text-red-500" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-surface-600">{message}</p>
          <div className="flex justify-end gap-3 mt-5">
            <button onClick={onClose} className="btn-secondary" disabled={loading}>
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={confirmClass}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Processing…
                </span>
              ) : (
                confirmLabel
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
