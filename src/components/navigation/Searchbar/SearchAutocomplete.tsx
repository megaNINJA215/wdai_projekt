import { cn } from '@/utils/cn';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import ProfilePicture from '../../ui/ProfilePicture';
import Link from "next/link";

export interface SearchAutocompleteProps {
  setSearchValue: (value: string) => void;
  query: string;
  ref: React.RefObject<HTMLInputElement | null>;
  show: boolean;
  setShow: (value: boolean) => void;
}

export default function SearchAutocomplete(props: SearchAutocompleteProps) {
  const [debouncedQuery, setDebouncedQuery] = useState(props.query);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedQuery(props.query.trim());
    }, 200);

    return () => window.clearTimeout(timeoutId);
  }, [props.query]);

  const trimmedQuery = props.query.trim();
  const ready = trimmedQuery.length > 0 && trimmedQuery === debouncedQuery;

  const { data: autocompleteData, isPending } = useQuery<{ data: { communities: { name: string, description: string }[], users: { username: string }[] } }>({
    queryKey: ["autocomplete", debouncedQuery],
    enabled: ready,
    placeholderData: keepPreviousData,
    queryFn: async ({ signal }) => {
      const response = await fetch(
        `/api/search/autocomplete?query=${encodeURIComponent(
          debouncedQuery
        )}`,
        {
          method: "GET",
          signal,
          headers: {
            Accept: "application/json",
          },
        }
      );

      return await response.json();
    },
  });


  return (
    <div className={cn(
      "absolute top-11 w-7/10 rounded-3xl border-4 border-border bg-fg p-2 text-md text-text",
      props.show ? "block" : "hidden"
    )} ref={props.ref}>

      {autocompleteData ? (
        <>
          {autocompleteData.data.communities.length > 0 && (
            <div className="mb-3">
              <p className="text-text-muted p-3 py-0 pl-1.5 font-bold">
                SPOŁECZNOŚCI
              </p>
              {autocompleteData.data.communities.map((community) => (
                <Link
                  onClick={() => props.setShow(false)}
                  href={`/c/${community.name}`}
                  key={community.name}
                  className="cursor-pointer hover:bg-fg-hover p-2 px-4 rounded-2xl flex flex-row items-center"
                >
                  <ProfilePicture name={community.name} size={36} type="community" />
                  <div className="px-2 min-w-0 flex-1">
                    <p className="truncate text-md">
                      <span className="text-text-muted">c/</span>
                      <span>{community.name}</span>
                    </p>
                    <p className="truncate text-sm text-text-secondary">{community.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
          {autocompleteData.data.users.length > 0 && (
            <div>
              <p className="text-text-muted p-3 py-0 pl-1.5 font-bold">
                UŻYTKOWNICY
              </p>
              {autocompleteData.data.users.map((user) => (
                <Link
                  onClick={() => props.setShow(false)}
                  key={user.username}
                  href={`/u/${user.username}`}
                  className="cursor-pointer hover:bg-fg-hover p-2 px-4 rounded-2xl flex flex-row"
                >
                  <ProfilePicture name={user.username} size={32} type="user" />
                  <p className="truncate px-2 pb- flex items-center text-md">
                    <span className="text-text-muted">u/</span>
                    <span>{user.username}</span>
                  </p>
                </Link>
              ))}
            </div>
          )}
          {autocompleteData.data.communities.length == 0 && autocompleteData.data.users.length == 0 && (
            <p className="text-text-muted p-3">
              Brak wyników.
            </p>
          )}
        </>
      ) : isPending ? (
        "Wczytywanie..."
      ) : (
        "Nie udało się załadować wyników."
      )}

    </div>
  );
};