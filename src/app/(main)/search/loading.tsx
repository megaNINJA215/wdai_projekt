import LoadingInfo from "@/components/ui/InfoText";
import SearchTabsDummy from "@/components/ui/search/SearchTabsDummy";

export default function Loading() {
  return <>
    <SearchTabsDummy />
    <LoadingInfo text="Szukanie..." />
  </>;
}