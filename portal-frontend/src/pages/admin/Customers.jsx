import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { formatDate } from '../../utils/helpers';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/customers').then(({ data }) => {
      setCustomers(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="font-display text-2xl font-bold">Customers</h1>
      <p className="text-sm text-gray-500">{customers.length} registered customers</p>

      <div className="space-y-2">
        {customers.map((c) => (
          <Link key={c._id} to={`/admin/customers/${c._id}`} className="card block hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{c.fullName}</p>
                <p className="text-sm text-gray-500">{c.email} · {c.mobile}</p>
                <p className="text-xs text-gray-400">{c.address?.district}, {c.address?.state}</p>
              </div>
              <div className="text-right text-sm text-gray-500">
                <p>Joined {formatDate(c.createdAt)}</p>
                <span className="text-rosegold-600">View →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
