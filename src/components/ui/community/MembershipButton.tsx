"use client";

import { MEMBERSHIP_QUERY_KEYS } from "@/utils/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from 'next/navigation';

export interface MembershipButtonProps {
  community_name: string;
  is_member: boolean;
  setIsMember: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MembershipButton(props: MembershipButtonProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate, isPending, } = useMutation({
    mutationKey: ["membership", props.community_name],
    mutationFn: async () => {
      const result = await fetch(
        `/api/communities/${encodeURIComponent(props.community_name)}/membership`,
        {
          method: props.is_member ? "DELETE" : "POST",
        }
      );

      return result.json();
    },
    onSuccess: () => {
      MEMBERSHIP_QUERY_KEYS.map((queryKey) =>
        queryClient.resetQueries({ queryKey })
      )
      router.refresh();
    }
  });

  return (
    <button onClick={() => { mutate(); props.setIsMember(prev => !prev); }} disabled={isPending} className="bg-primary text-text px-2 sm:px-4 py-1 sm:py-2 rounded-full hover:cursor-pointer hover:bg-primary-hover h-8 sm:h-10">

      {props.is_member
        ? "Opuść"
        : "Dołącz"}
    </button>
  );
};