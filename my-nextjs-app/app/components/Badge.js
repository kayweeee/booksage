export default function Badge({ text }) {
  return (
    <span className="px-3 py-1 bg-brown-300 text-brown-900 rounded-full text-xs font-medium shadow-md">
      {text}
    </span>
  );
}
