export default function Alert({ type = 'error', message, onClose }) {
  if (!message) return null;
  const styles = {
    error: 'bg-red-50 text-red-700 border-red-200',
    success: 'bg-green-50 text-green-700 border-green-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
  };
  return (
    <div className={`p-3 rounded-xl border text-sm ${styles[type]} animate-fade-in flex justify-between items-start gap-2`}>
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className="text-current opacity-60 hover:opacity-100" aria-label="Close">
          &times;
        </button>
      )}
    </div>
  );
}
