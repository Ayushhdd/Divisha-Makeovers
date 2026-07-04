export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null;
  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className={`relative bg-white rounded-t-2xl sm:rounded-2xl w-full ${sizes[size]} max-h-[90vh] overflow-y-auto animate-fade-in`}>
        <div className="sticky top-0 bg-white border-b border-softpink-100 px-4 py-3 flex justify-between items-center">
          <h3 className="font-display text-lg font-semibold text-rosegold-700">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}
