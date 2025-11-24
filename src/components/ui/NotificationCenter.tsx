import { useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { removeNotification } from '../../store/slices/uiSlice';

type NotificationVariant = 'success' | 'error' | 'warning' | 'info';

type VariantConfig = {
  icon: string;
  baseClass: string;
};

const VARIANT_STYLES: Record<NotificationVariant, VariantConfig> = {
  success: {
    icon: '✅',
    baseClass: 'border-success-200 bg-success-50 text-success-700',
  },
  error: {
    icon: '⛔',
    baseClass: 'border-danger-200 bg-danger-50 text-danger-700',
  },
  warning: {
    icon: '⚠️',
    baseClass: 'border-warning-200 bg-warning-50 text-warning-700',
  },
  info: {
    icon: 'ℹ️',
    baseClass: 'border-primary-200 bg-primary-50 text-primary-700',
  },
};

function useBodyPortal() {
  const portal = useMemo(() => document.createElement('div'), []);

  useEffect(() => {
    document.body.appendChild(portal);
    return () => {
      if (portal.parentNode) {
        portal.parentNode.removeChild(portal);
      }
    };
  }, [portal]);

  return portal;
}

type NotificationToastProps = {
  id: string;
  message: string;
  type: NotificationVariant;
};

function NotificationToast({ id, message, type }: NotificationToastProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(removeNotification(id));
    }, 4000);

    return () => {
      clearTimeout(timer);
    };
  }, [dispatch, id]);

  const style = VARIANT_STYLES[type];

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border px-4 py-3 shadow-lg backdrop-blur-sm ${style.baseClass}`}
    >
      <span className="text-xl" aria-hidden="true">{style.icon}</span>
      <p className="flex-1 text-sm leading-5">{message}</p>
      <button
        type="button"
        aria-label="Fermer la notification"
        className="text-sm text-gray-500 transition-colors hover:text-gray-700"
        onClick={() => dispatch(removeNotification(id))}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function NotificationCenter() {
  const notifications = useAppSelector((state) => state.ui.notifications);
  const portalTarget = useBodyPortal();

  if (notifications.length === 0) {
    return null;
  }

  return createPortal(
    <div className="fixed bottom-5 right-5 z-2000 flex w-80 flex-col gap-3">
      {notifications.map((notification) => (
        <NotificationToast
          key={notification.id}
          id={notification.id}
          message={notification.message}
          type={notification.type}
        />
      ))}
    </div>,
    portalTarget
  );
}
