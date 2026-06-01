import HeroSection from '@/components/beranda/HeroSection';
import SipodoIntroSection from '@/components/beranda/SipodoIntroSection';
import RempahSection from '@/components/beranda/RempahSection';
import MiniPetaSection from '@/components/beranda/MiniPetaSection';
import FeaturedKulinerSection from '@/components/beranda/FeaturedKulinerSection';
import PromoGamesSection from '@/components/beranda/PromoGamesSection';
import FooterSection from '@/components/beranda/FooterSection';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <SipodoIntroSection />
      <RempahSection />
      <MiniPetaSection />
      <FeaturedKulinerSection />
      <PromoGamesSection />
      <FooterSection />
    </main>
  );
}
