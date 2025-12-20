'use client';

interface BackButtonProps {
  label?: string;
  className?: string;
}

export default function BackButton({ label = '뒤로가기', className = '' }: BackButtonProps) {
  return (
    <button
      onClick={() => window.history.back()}
      className={`flex items-center text-gray-600 hover:text-gray-900 transition-colors ${className}`}
    >
      <span className="mr-2">←</span>
      <span>{label}</span>
    </button>
  );
}
