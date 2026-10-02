import React, { useEffect, useId, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

export function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, confirmLabel = 'Confirm', confirmVariant = 'danger' }) {
  const dialogRef = useRef(null);
  const returnFocusRef = useRef(null);
  const onCancelRef = useRef(onCancel);
  const titleId = useId();
  const descriptionId = useId();
  onCancelRef.current = onCancel;

  useEffect(() => {
    if (!isOpen || !dialogRef.current) return;

    const dialog = dialogRef.current;
    returnFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const handleCancel = event => {
      event.preventDefault();
      onCancelRef.current?.();
    };
    const handleEscape = event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCancelRef.current?.();
      }
    };

    if (!dialog.open) dialog.showModal();
    dialog.addEventListener('cancel', handleCancel);
    dialog.addEventListener('keydown', handleEscape, true);
    dialog.querySelector('button')?.focus();

    return () => {
      dialog.removeEventListener('cancel', handleCancel);
      dialog.removeEventListener('keydown', handleEscape, true);
      if (dialog.open) dialog.close();
      if (returnFocusRef.current?.isConnected) {
        returnFocusRef.current.focus();
      }
      returnFocusRef.current = null;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDialogClick = event => {
    if (event.target === event.currentTarget) {
      onCancelRef.current?.();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onClick={handleDialogClick}
      className="confirm-dialog fixed inset-0 z-50 m-0 flex h-full w-full max-h-none max-w-none items-center justify-center border-0 bg-transparent p-4"
    >
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-gray-900 border border-white/10 p-6 shadow-2xl fade-in">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={20} className="text-red-400" />
          </div>
          <div>
            <h2 id={titleId} className="text-lg font-semibold text-white mb-1">{title}</h2>
            <p id={descriptionId} className="text-sm text-gray-400">{message}</p>
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-6">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant={confirmVariant} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
