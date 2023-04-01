import {
  signout,
  getUsersCompositions,
  createComposition,
} from "@/services/api-service";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import CardContainer from "../CardContainer";
import styles from "./composition-gallery.module.scss";
import CompositionItem from "./components/CompositionItem";

interface Composition {
  id: number;
  title: string;
  owner: string;
  pageUuid: string;
  createdAt: string;
  updatedAt: string;
}

export default function CompositionGallery() {
  const router = useRouter();
  const [compositions, setCompositions] = useState<Composition[]>([]);
  const [newCompositionTitle, setNewCompositionTitle] = useState<string>("");

  useEffect(() => {
    getUsersCompositions().then((res) => {
      setCompositions(res.compositions);
    });
  }, []);

  function createNewComposition(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    createComposition(newCompositionTitle)
      .then((res) => {
        setCompositions([...compositions, res.composition]);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setNewCompositionTitle("");
      });
  }

  function handleSignout(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    signout().then(() => {
      router.push("/");
    });
  }
  function selectComposition(uuid: string) {
    router.push(`/compose/${uuid}`);
  }
  function handleDelete(e: React.MouseEvent<HTMLButtonElement>, id: number) {
    e.stopPropagation();
    setCompositions(
      compositions.filter((composition) => composition.id !== id)
    );
  }

  return (
    <div>
      <div className={styles["dashboard-header"]}>
        <form onSubmit={createNewComposition}>
          <input
            type="text"
            name="title"
            placeholder="Composition Title"
            value={newCompositionTitle}
            onChange={(e) => setNewCompositionTitle(e.target.value)}
          />
          <button type="submit">New Composition</button>
        </form>
        <button onClick={handleSignout}>Sign out</button>
      </div>
      <div className={styles["composition-grid"]}>
        {compositions.map((composition) => {
          return (
            <CardContainer
              key={composition.id}
              handleClick={() => selectComposition(composition.pageUuid)}
            >
              <CompositionItem
                key={composition.id}
                id={composition.id}
                title={composition.title}
                owner={composition.owner}
                updatedAt={composition.updatedAt}
                handleDelete={handleDelete}
              />
            </CardContainer>
          );
        })}
      </div>
    </div>
  );
}
