"use client";
import { useRouter } from "next/navigation";

export default function AspectDesc({ aspect, id }) {
  const router = useRouter();

  const getBackgroundColor = (sentiment) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-500 group-hover:bg-green-600";
      case "negative":
        return "bg-red-500 group-hover:bg-red-600";
      case "mixed":
      default:
        return "bg-blue-500 group-hover:bg-blue-600";
    }
  };

  const handleAspectClick = () => {
    router.push(
      `/similar/${encodeURIComponent(
        aspect.aspect_id
      )}?excludeBookId=${encodeURIComponent(id)}`
    );
  };

  return (
    <div className="flex flex-row gap-x-4">
      <div className="w-2/5 group">
        <div
          className={`py-2 px-4 rounded-lg flex items-center font-bold text-center cursor-pointer text-white transition-colors duration-300  ${getBackgroundColor(
            aspect.sentiment
          )}`}
          onClick={handleAspectClick}
        >
          <p className="w-full text-white">{aspect.aspect}</p>
        </div>
        <p className="w-full text-xs mt-1 group-hover:underline">
          <i>mentioned by {aspect.mentionCount} reviews</i>
        </p>
      </div>

      <div className="w-3/5 flex items-center text-left">
        <p>{aspect.explanation}</p>
      </div>
    </div>
  );
}
