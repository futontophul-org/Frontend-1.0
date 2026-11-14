export default function Skeleton({ variant = 'text', width, height, className = '' }) {
  if (variant === 'card') return <div className={`skeleton skeleton-card ${className}`} />;
  if (variant === 'avatar') return <div className={`skeleton skeleton-avatar ${className}`} />;
  if (variant === 'title') return <div className={`skeleton skeleton-title ${className}`} style={{ width, height }} />;
  return <div className={`skeleton skeleton-text ${className}`} style={{ width, height }} />;
}