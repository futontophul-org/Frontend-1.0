export default function Logo({ size = 48, className = "" }) {
  return (
    <img
      src="/logo.webp" // <--- এখানে logo.png থেকে logo.webp করে দিন
      alt="ফুটন্ত ফুল লোগো"
      width={size}
      height={size}
      className={className}
      style={{ 
        objectFit: 'contain', 
        borderRadius: '50%',
        background: '#fff'
      }}
    />
  );
}