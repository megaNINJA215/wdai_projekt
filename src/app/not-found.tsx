
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg text-text text-center">
      <h1 className="text-5xl font-bold">404</h1>

      <p className="text-xl">
        Nie udało nam się znaleźć strony której szukasz :c <br />
        Może została usunięta lub nigdy nie istniała?
      </p>

      <Link href="/" className="text-primary hover:underline">
        Wróć na stronę główną
      </Link>
    </main>
  );
}
