import { useRouter } from "next/navigation";
import StarRating from "./StarRating";
import ReactMarkdown from "react-markdown";
import Image from "next/image";

export default function SimilarBookCard({ book }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/books/${encodeURIComponent(book.id)}`);
  };

  return (
    <div
      className="book-card flex flex-row gap-6 p-6 bg-white shadow-lg rounded-2xl transition-all duration-300 hover:shadow-xl cursor-pointer group"
      onClick={handleClick}
    >
      <div className="w-1/5 flex justify-center">
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
        <StarRating
          rating={book.averageRating}
          numberOfReviews={book.ratingsCount}
        />
        <ReactMarkdown>{book.aspectEvaluation}</ReactMarkdown>
      </div>
    </div>
  );
}
