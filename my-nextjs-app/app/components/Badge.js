export default function Badge({ text, sentiment }) {
  const getBackgroundColor = (sentiment) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-500";
      case "negative":
        return "bg-red-500";
      case "mixed":
      default:
        return "bg-yellow-500";
    }
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold shadow-md  ${getBackgroundColor(
        sentiment
      )}`}
    >
      {text}
    </span>
  );
}
