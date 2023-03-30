import CompositionGallery from "@/components/CompositionGallery";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import React from "react";

export default withPageAuthRequired(function Dashboard() {
  return <CompositionGallery />;
});
