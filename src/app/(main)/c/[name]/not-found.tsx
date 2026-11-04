
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex w-full h-full flex-col items-center justify-center gap-4 bg-bg text-text text-center -translate-y-1/10">
      <h1 className="text-5xl font-bold">404</h1>

      <p className="text-xl">
        Nie udało nam się znaleźć społeczności której szukasz :c
      </p>

      <Link href="/" className="text-primary hover:underline">
        Wróć na stronę główną
      </Link>
    </main>
  );
}
