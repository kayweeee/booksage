import Badge from "./Badge";
import { useRouter } from "next/navigation";

export default function SmallBookCard({ book }) {
  const router = useRouter();

  const allAspects = book.bookAspects ? Object.keys(book.bookAspects) : [];
  const displayedAspects = allAspects.slice(0, 3);

  const handleClick = () => {
    router.push(`/books/${encodeURIComponent(book.id)}`);
  };

  return (
    <div
      className="w-[400px] flex flex-col gap-3 py-3 rounded-2xl transition-all duration-300 hover:shadow-xl items-center hover:cursor-pointer"
      onClick={handleClick}
    >
      {/* Book Cover */}
      <div className="w-1/2 flex justify-center items-center">
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full rounded-lg object-contained shadow-md"
          draggable={false}
        />
      </div>

      {/* Book Details */}
      <div className="flex flex-col w-full space-y-2">
        <div className="flex flex-wrap gap-1 items-center justify-center">
          {displayedAspects.map((aspect, index) => (
            <Badge key={index} text={aspect} />
          ))}
          {allAspects.length > 3 && (
            <span className="text-gray-500 text-sm">... and more</span>
          )}
        </div>
      </div>
    </div>
  );
}
