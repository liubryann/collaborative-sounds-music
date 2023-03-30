import Container from "@/components/Container";
import { UserProvider } from "@/contexts/UserContext";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
const DigitalAudioWorkstation = dynamic(
  () => import("@/components/DigitalAudioWorkstation"),
  { ssr: false }
);

export default function Workstation() {
  const router = useRouter();
  const uuid = router.query.uuid as string;

  return (
    <UserProvider>
      <Container>
        <DigitalAudioWorkstation roomId={uuid} />
      </Container>
    </UserProvider>
  );
}
