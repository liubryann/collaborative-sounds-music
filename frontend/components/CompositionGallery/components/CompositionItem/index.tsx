import { useRouter } from "next/router";
import React from "react";

interface CompositionItemProps {
  id: number;
  title: string;
  owner: string;
  updatedAt: string;
}

export default function CompositionItem({
  id,
  title,
  owner,
  updatedAt,
}: CompositionItemProps) {
  const router = useRouter();

  function selectComposition() {
    router.push(`/compose/${id}`);
  }

  return (
    <div>
      <div onClick={selectComposition}>{title}</div>
    </div>
  );
}
