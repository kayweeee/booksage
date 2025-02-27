"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function Loader({ message = "Loading..." }) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-20">
      <FontAwesomeIcon
        icon={faSpinner}
        className="text-blue-500 text-5xl animate-spin"
      />
      <p className="mt-3 text-gray-600 text-lg">{message}</p>
    </div>
  );
}
