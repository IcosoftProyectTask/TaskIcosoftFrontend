import { BiErrorCircle } from "../Icons";

export default function Error({ message }) {
  return (
    <div className="flex items-center m-1 text-sm text-red-500">
      <BiErrorCircle className="mr-1" />
      <span>{message}</span>
    </div>
  );
}
