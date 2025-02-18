import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div  className="p-5">
       <Link className=" text-lg text-white py-2 px-4 rounded-md bg-black" href="/chatPage">Go to chat</Link>
    </div>
  );
}
