import Badge from "./Badge";
import { useRouter } from "next/navigation";
import StarRating from "./StarRating";

export default function SimilarBookCard({ book }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/books/${encodeURIComponent(book.id)}`);
  };

  return (
    <div
      className="book-card flex flex-row gap-6 p-6 bg-white dark:bg-brown-800 shadow-lg rounded-2xl transition-all duration-300 hover:shadow-xl cursor-pointer group"
      onClick={handleClick}
    >
      <div className="w-1/5 flex justify-center items-center">
        <img
          src={book.coverImage}
          alt={book.title}
          className="h-[200px] rounded-lg object-contained shadow-md"
        />
      </div>

      <div className="flex flex-col w-4/5 space-y-2 justify-center">
        <div>
          <h2 className="group-hover:underline">{book.title}</h2>
          <p>{book.authors.join(", ")}</p>
        </div>
        <StarRating
          rating={book.averageRating}
          numberOfReviews={book.ratingsCount}
        />
        <p>{book.aspectEvaluation}</p>
      </div>
    </div>
  );
}
