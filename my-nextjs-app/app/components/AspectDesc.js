export default function AspectDesc({ aspect, desc }) {
  return (
    <div className="flex flex-row gap-x-4">
      <div className="w-1/4">
        <div className="py-2 px-4 bg-blue-500 rounded-lg flex items-center font-bold text-center">
          <p className="w-full">{aspect}</p>
        </div>
      </div>
      <div className="w-3/4 flex items-center">
        <p>{desc}</p>
      </div>
    </div>
  );
}
