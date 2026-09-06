import { useOs } from '../os/store';

export default function Toasts() {
  const os = useOs();
  if (!os.toasts.length) return null;
  return (
    <div className="toasts" onClick={(e) => e.stopPropagation()}>
      {os.toasts.map((t) => (
        <div key={t.id} className="toast" onClick={(e) => {
          e.stopPropagation();
          os.dismissToast(t.id);
        }}>
          <span className="toast-icon">{t.icon}</span>
          <div className="toast-body">
            <b>{t.title}</b>
            <p>{t.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
}