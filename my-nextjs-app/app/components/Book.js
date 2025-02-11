import Badge from "./Badge";

export default function Book({ book }) {
  console.log(book.bookAspects);
  return (
    <div className="book-card flex flex-row gap-6 p-6 bg-white dark:bg-brown-800 shadow-lg rounded-2xl transition-all duration-300 hover:shadow-xl">
      {/* Book Cover */}
      <div className="w-2/5 flex justify-center items-center">
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full rounded-lg object-contained shadow-md"
        />
      </div>

      {/* Book Details */}
      <div className="flex flex-col w-3/5 space-y-2">
        <div>
          <h2>{book.title}</h2>
          <p>{book.authors.join(", ")}</p>
        </div>
        <p className="line-clamp-5">{book.summary}</p>
        <p>
          <span className="font-semibold">Average rating:</span>{" "}
          {book.averageRating}
        </p>
        <p>
          <span className="font-semibold">Number of ratings:</span>{" "}
          {book.ratingsCount}
        </p>
        <p>
          <span className="font-semibold">What People Liked:</span>
        </p>
        <div className="flex flex-wrap gap-1">
          {book.bookAspects &&
            Object.keys(book.bookAspects).map((aspect, index) => (
              <Badge key={index} text={aspect} />
            ))}
        </div>
      </div>
    </div>
  );
}
