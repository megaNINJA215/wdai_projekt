import { redirect } from "next/navigation";
import SearchPageComponent from "./SearchPageComponent";

type Props = {
  searchParams: Promise<{ query?: string }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const { query } = await searchParams;

  if (!query || query.trim() === "") {
    redirect("/");
  }

  return (
    <SearchPageComponent query={query} />
  );
}