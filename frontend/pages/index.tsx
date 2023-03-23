import styles from "@/styles/Home.module.css";
// import DigitalAudioWorkstation from "@/components/DigitalAudioWorkstation";
import Container from "@/components/Container";
import dynamic from "next/dynamic";
const DigitalAudioWorkstation = dynamic(
  () => import("@/components/DigitalAudioWorkstation"),
  { ssr: false }
);

export default function Home() {
  return (
    <Container>
      <DigitalAudioWorkstation />
    </Container>
  );
}
