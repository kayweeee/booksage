import Image from "next/image";
import Badge from "./Badge";
import { useRouter } from "next/navigation";

export default function BookCard({ book }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/books/${encodeURIComponent(book.id)}`);
  };

  const negativeAspects = book.bookAspects
    .filter((aspect) => aspect.sentiment === "negative")
    .map((aspect) => aspect.aspect)
    .join(", ");

  const positiveAspects = book.bookAspects
    .filter((aspect) => aspect.sentiment === "positive")
    .map((aspect) => aspect.aspect)
    .join(", ");

  return (
    <div
      className="book-card flex flex-row gap-6 p-6 bg-white dark:bg-brown-800 shadow-lg rounded-2xl transition-all duration-300 hover:shadow-xl cursor-pointer group"
      onClick={handleClick}
    >
      <div className="w-1/5 flex justify-center items-center">
        <Image
          src={book.coverImage}
          alt={book.title}
          width={256}
          height={384}
          className="h-[200px] rounded-lg object-contained shadow-md"
        />
      </div>

      <div className="flex flex-col w-4/5 space-y-2 justify-center">
        <div>
          <h2 className="group-hover:underline">{book.title}</h2>
          <p>{book.authors.join(", ")}</p>
        </div>

        <div className="flex flex-wrap gap-1">
          {console.log(book.bookAspects)}
          {positiveAspects && (
            <p>
              <b>What people liked:</b> {positiveAspects}
            </p>
          )}
          {negativeAspects && (
            <p>
              <b>What people disliked:</b> {negativeAspects}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
