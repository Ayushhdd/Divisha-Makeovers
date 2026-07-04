import { Link } from 'react-router-dom';

export default function Logo({ size = 'md' }) {
  const sizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <Link to="/divisha" className="flex items-center gap-2">
      <span className={`font-display font-bold text-rosegold-600 ${sizes[size]}`}>
        Divisha
      </span>
      <span className={`font-display text-gray-400 ${size === 'lg' ? 'text-xl' : 'text-base'}`}>
        Makeovers
      </span>
    </Link>
  );
}
