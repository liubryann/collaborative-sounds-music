import Head from "next/head";
import styles from "@/styles/Home.module.css";
import DigitalAudioWorkstation from "@/components/DigitalAudioWorkstation";

export default function Home() {
  return (
    <>
      <Head>
        <title>Collaborative Sounds Music</title>
        <meta name="description" content="collaborative music creating app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <DigitalAudioWorkstation />
      </main>
    </>
  );
}
