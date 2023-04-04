import React from "react";
import Head from "next/head";
import styles from "./container.module.scss";
import Header from "@/components/Header";
import Footer from "../Footer";

interface ContainerProps {
  children: React.ReactNode;
}

export default function Container({ children }: ContainerProps) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Collaborative Sounds Music</title>
        <meta name="description" content="collaborative music creating app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
}
