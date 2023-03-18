import Head from "next/head";
import styles from "@/styles/Home.module.css";
import DigitalAudioWorkstation from "@/components/DigitalAudioWorkstation";
import Container from "@/components/Container";

export default function Home() {
  return (
    <Container>
      <DigitalAudioWorkstation />
    </Container>
  );
}
