"use client";

import AboutHero from "./AboutHero";
import WhoWeAre from "./WhoWeAre";
import WhyCreated from "./WhyCreated";
import Philosophy from "./Philosophy";
import Approach from "./Approach";
import WhatMakesDifferent from "./WhatMakesDifferent";
import VisionMission from "./VisionMission";
import Ecosystem from "./Ecosystem";
import JoinMovement from "./JoinMovement";
import Footer from "../layout/Footer";

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <VisionMission />
      <WhoWeAre />
      <WhyCreated />
      <Philosophy />
      <Approach />
      <WhatMakesDifferent />
      <Ecosystem />
      <JoinMovement />
    </main>
  );
}