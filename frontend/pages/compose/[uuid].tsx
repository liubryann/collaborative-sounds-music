import Container from "@/components/Container";
import { UserProvider } from "@/contexts/UserContext";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
const DigitalAudioWorkstation = dynamic(
  () => import("@/components/DigitalAudioWorkstation"),
  { ssr: false }
);

export default withPageAuthRequired(function Workstation() {
  const router = useRouter();
  const uuid = router.query.uuid as string;

  return (
    <Container>
      <DigitalAudioWorkstation roomId={uuid} />
    </Container>
  );
});
