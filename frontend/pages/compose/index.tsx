import styles from "@/styles/Home.module.css";
import Container from "@/components/Container";
import Auth from "@/components/Auth";
import dynamic from "next/dynamic";
const DigitalAudioWorkstation = dynamic(
  () => import("@/components/DigitalAudioWorkstation"),
  { ssr: false }
);

export default function Workstation() {
  return (
    <Container>
      <DigitalAudioWorkstation />
    </Container>
  );
}
