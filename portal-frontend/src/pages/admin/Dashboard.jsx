import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats } from '../../store/adminSlice';
import StatCard from '../../components/ui/StatCard';
import { formatCurrency } from '../../utils/helpers';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { stats } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (!stats) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="font-display text-2xl font-bold text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Customers" value={stats.totalCustomers} icon="👥" />
        <StatCard title="Total Appointments" value={stats.totalAppointments} icon="📅" color="blue" />
        <StatCard title="Today's Appointments" value={stats.todayAppointments} icon="📆" color="green" />
        <StatCard title="Pending Approval" value={stats.pendingAppointments} icon="⏳" color="orange" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Revenue" value={formatCurrency(stats.revenue)} icon="💰" color="green" />
        <StatCard title="Advance Revenue" value={formatCurrency(stats.advanceRevenue)} icon="💳" />
        <StatCard title="Remaining Payments" value={formatCurrency(stats.remainingPayments)} icon="📊" color="orange" />
      </div>
    </div>
  );
}
