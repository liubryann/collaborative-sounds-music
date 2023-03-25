import {
  getUsersCompositions,
  deleteComposition,
} from "@/services/api-service";
import React, { useEffect, useState } from "react";
import CompositionItem from "./components/CompositionItem";

export default function CompositionGallery() {
  const [compositions, setCompositions] = useState<[]>([]);

  useEffect(() => {
    getUsersCompositions().then((res) => {
      setCompositions(res.compositions);
    });
  }, []);

  return (
    <div>
      Choose a composition to edit:
      <div>
        {compositions.map((composition) => {
          return (
            <CompositionItem
              key={composition.id}
              id={composition.id}
              title={composition.title}
              owner={composition.owner}
              updatedAt={composition.updatedAt}
            />
          );
        })}
      </div>
    </div>
  );
}
