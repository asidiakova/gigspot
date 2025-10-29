import Link from "next/link";

export default function Home() {
  return (
    <div>
        <main>
        <h1>Home Page</h1>
            <Link href={"/feed"}>Go to Main Feed</Link>
        </main>
    </div>

  );
}
