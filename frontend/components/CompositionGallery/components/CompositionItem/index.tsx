import React from "react";

interface CompositionItemProps {
  id: number;
  title: string;
  owner: string;
  updatedAt: string;
  handleDelete: (e: React.MouseEvent<HTMLButtonElement>, id: number) => void;
}

export default function CompositionItem({
  id,
  title,
  owner,
  updatedAt,
  handleDelete,
}: CompositionItemProps) {
  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-US", { month: 'short' });
  }
  return (
    <div>x
      <div>{title}</div>
      <div>{formatDate(updatedAt)}</div>
      <button onClick={(e) => handleDelete(e, id)}>x</button>
    </div>
  );
}
