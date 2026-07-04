export default function StatCard({ title, value, icon, color = 'rosegold' }) {
  const colors = {
    rosegold: 'bg-rosegold-50 text-rosegold-600',
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="card animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        {icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${colors[color]}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
