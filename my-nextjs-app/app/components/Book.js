export default function Book({ book }) {
    return (
        <div className="book-card flex flex-row gap-7">
            <div className="w-2/5 flex justify-center items-center">
                <img src={book.coverImage} alt={book.title} className="w-full object-contain" />
            </div>
            <div className="flex flex-col w-3/5">
                <h3>{book.title}</h3>
                <p>{book.authors.join(', ')}</p>
                <p>{book.summary}</p>
                <p>Pages: {book.pageCount}</p>
                <p>Genres: {book.categories.join(', ')}</p>
            </div>
        </div>
    );
}