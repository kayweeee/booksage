export default function Badge({ text }) {
    return (
      <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200 rounded-full text-sm font-medium shadow-md">
        {text}
      </span>
    );
  }
  