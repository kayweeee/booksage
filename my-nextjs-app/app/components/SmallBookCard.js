import Badge from "./Badge";

export default function SmallBookCard({ book }) {
  return (
    <div className="max-w-[400px] flex flex-col gap-6 p-6 bg-white dark:bg-brown-800 shadow-lg rounded-2xl transition-all duration-300 hover:shadow-xl">
      {/* Book Cover */}
      <div className="w-3/5 flex justify-center items-center">
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full rounded-lg object-contained shadow-md"
        />
      </div>

      {/* Book Details */}
      <div className="flex flex-col w-3/5 space-y-2">
        <div className="flex flex-wrap gap-1">
          {book.aspects.map((aspect, index) => (
            <Badge key={index} text={aspect} />
          ))}
        </div>
      </div>
    </div>
  );
}
