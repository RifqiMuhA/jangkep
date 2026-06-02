import Image from 'next/image';
import Link from 'next/link';
import PakarInteractiveImage from '@/components/PakarInteractiveImage';
import { RotatingText } from '@/components/RotatingText';
import { ExploreButton } from '@/components/ExploreButton';
import BatikTransition from '@/components/BatikTransition';
import FooterSection from '@/components/beranda/FooterSection';
import RotatingTextStyles from '@/components/RotatingText.module.css';
import styles from './kuliner.module.css';

const kulinerExperts = [
  { id: 1, name: "Mbah Joyo", designation: "Legenda Bakso", image: "/avatars/avatar_1.png" },
  { id: 3, name: "Raden Bima", designation: "Master Sate", image: "/avatars/avatar_3.png" },
  { id: 5, name: "Ki Darmo", designation: "Spesialis Gudeg", image: "/avatars/avatar_5.png" },
  { id: 4, name: "Sekar Ayu", designation: "Ratu Dawet", image: "/avatars/avatar_4.png" },
  { id: 2, name: "Nyi Roro", designation: "Pakar Lapis Legit", image: "/avatars/avatar_2.png" },
];

const mascotData = [
  { id: 1, name: 'Bakso', text: '“Baksoné anget, pentolé kenyal tenan”', slug: 'bakso', aksara1: 'ꦧꦏ꧀ꦱꦺꦴ', aksara2: 'ꦲꦔꦼꦠ꧀' },
  { id: 2, name: 'Nasi Liwet Solo', text: '“Nasi liwet Solo, santané gurih pol”', slug: 'nasi-liwet', aksara1: 'ꦭꦶꦮꦼꦠ꧀', aksara2: 'ꦱꦺꦴꦭꦺꦴ' },
  { id: 3, name: 'Sate', text: '“Sate ayam iki bumbuné medok”', slug: 'sate', aksara1: 'ꦱꦠꦺ', aksara2: 'ꦲꦪꦩ꧀' },
  { id: 4, name: 'Kue Lapis', text: '“Kue lapisé legit, cocok kanggo nyemil”', slug: 'kue-lapis', aksara1: 'ꦭꦥꦶꦱ꧀', aksara2: 'ꦭꦼꦒꦶꦠ꧀' },
  { id: 5, name: 'Tempe / Tahu Goreng', text: '“Tempe goreng anget, kriuké nggoda”', slug: 'tempe', aksara1: 'ꦠꦼꦩ꧀ꦥꦺ', aksara2: 'ꦏꦿꦶꦪꦸꦏ꧀' },
  { id: 6, name: 'Soto Jawa Tengah', text: '“Sotoné seger, kuah beningé ngangenin”', slug: 'soto', aksara1: 'ꦱꦺꦴꦠꦺꦴ', aksara2: 'ꦱꦼꦒꦼꦂ' },
  { id: 7, name: 'Jajanan Pasar', text: '“Getuk lan klepon iki favorit pasar lawas”', slug: 'jajanan-pasar', aksara1: 'ꦒꦼꦠꦸꦏ꧀', aksara2: 'ꦏ꧀ꦭꦺꦥꦺꦴꦤ꧀' },
  { id: 8, name: 'Bakpao / Kudapan Kukus', text: '“Bakpaoné empuk, isiné lumer”', slug: 'bakpao', aksara1: 'ꦧꦏ꧀ꦥꦲꦺꦴ', aksara2: 'ꦌꦩ꧀ꦥꦸꦏ꧀' },
  { id: 9, name: 'Lemper / Tumpeng Mini', text: '“Lemperé gurih, dibungkus godhong pisang”', slug: 'lemper', aksara1: 'ꦭꦼꦩ꧀ꦥꦼꦂ', aksara2: 'ꦒꦸꦫꦶꦃ' },
  { id: 10, name: 'Dawet Ayu', text: '“Daweté seger, manis maknyus tenan!”', slug: 'dawet-ayu', aksara1: 'ꦢꦮꦼꦠ꧀', aksara2: 'ꦱꦼꦒꦼꦂ' },
];

export default function KulinerIndex() {
  return (
    <main className={styles.mainWrapper}>
      {/* SVG Definitions for Hover Fill */}
      <svg width="0" height="0" style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <pattern id="batikHover" patternUnits="userSpaceOnUse" width="184" height="108">
            <rect x="0" y="0" width="184" height="108" fill="var(--color-kuning-kepodang, #EBAC00)" />
            <image href="/batik/batik_kawung.webp" x="0" y="0" width="184" height="108" preserveAspectRatio="xMidYMid slice" opacity="0.2" />
          </pattern>
        </defs>
      </svg>


      {/* Container utama halaman */}
      <div className={styles.topSection}>
        <div className={styles.gridContainer} style={{ paddingBottom: 0 }}>

        {/* HERO SECTION AWWWARDS STYLE */}
        <section className={styles.heroSection}>
          <h1 className={styles.heroTitle}>
            Sopo Sing Arep
            <RotatingText
              texts={['Mampir?', 'Pinarak?', 'ꦥꦶꦤꦫꦏ꧀?']}
              mainClassName={RotatingTextStyles.highlightBadge}
              staggerFrom="last"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              staggerDuration={0.025}
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              rotationInterval={2000}
              splitBy="characters"
              auto
              loop
            />
          </h1>

          <div className={styles.heroDescription}>
            Menjelajahi keanekaragaman <span className={styles.aksaraInline}>ꦏꦸꦭꦶꦤꦼꦂ</span> (kuliner) khas Jawa Tengah bagaikan napak tilas ke masa keemasan kerajaan Nusantara masa lampau. Dari setiap gigitan <span className={styles.aksaraInline}>ꦗꦗꦤ꧀ꦥꦱꦂ</span> (jajan pasar) tradisional yang legit memanjakan lidah, hingga pesona kehangatan kuah kaldu rempah pilihan, tersimpan pusaka rasa yang telah berurat akar melintasi zaman. Setiap resep masakan yang terhidang adalah <span className={styles.aksaraInline}>ꦮꦫꦶꦱꦤ꧀</span> (warisan) luhur, selalu dijaga kemurniannya dan diwariskan dengan cinta dari generasi ke generasi oleh tangan-tangan terampil para sesepuh kita. Mari kita <span className={styles.aksaraInline}>ꦩꦔꦤ꧀</span> (mangan) dan mencecap setiap kisah unik di balik penciptaannya. Temukan teman jalan yang tepat untuk memandumu mengarungi lautan kenikmatan rasa yang begitu otentik, membumi, dan tentu saja tak akan pernah terlupakan di dalam ingatan lidahmu.
          </div>

          <PakarInteractiveImage items={kulinerExperts} />
        </section>
        </div>
      </div>

      <BatikTransition />

      <div className={styles.bottomSection}>
        <div className={styles.gridContainer} style={{ paddingTop: 'var(--spacing-64)' }}>

        {/* TITLE KULINER POPULER */}
        <div className={styles.sectionTitleHeader}>
          <Image src="/motif/dekor_header_atas.webp" alt="Dekorasi Atas" width={250} height={40} className={styles.dekorAtas} unoptimized />
          <h2 className={styles.sectionTitle}>Kuliner Populer</h2>
          <Image src="/motif/dekor_header_bawah.webp" alt="Dekorasi Bawah" width={250} height={40} className={styles.dekorBawah} unoptimized />
        </div>

        {/* Grid Responsive Baru */}
        <section className={styles.gridScattered}>
          {mascotData.map((item) => (
            <Link
              href={`/kuliner/katalog/${item.slug}`}
              key={item.id}
              className={styles.mascotItem}
            >
              <div className={styles.mascotContent}>
                {/* Aksara Animasi (Hidden by default, fly out on hover) */}
                <div className={styles.aksaraLeft}>
                  <span>{item.aksara1}</span>
                  <span>{item.aksara2}</span>
                </div>
                <div className={styles.aksaraRight}>
                  <span>{item.aksara1}</span>
                  <span>{item.aksara2}</span>
                </div>

                <div className={styles.bubble}>
                  {item.text}
                </div>

                <div
                  className={styles.imgWrapper}
                  style={item.id === 7 ? { width: '220px' } : undefined}
                >
                  <Image
                    src={`/kuliner/mascot_kuliner_${item.id}.webp`}
                    alt={item.name}
                    fill
                    style={{ objectFit: 'contain', objectPosition: 'bottom center' }}
                    sizes={item.id === 7 ? "220px" : "180px"}
                    priority={item.id <= 5}
                    unoptimized={true}
                  />
                </div>
              </div>

              {/* Floor Tile SVG */}
              <svg className={styles.floorSvg} viewBox="0 0 184 108">
                <path d="M 2 54 L 92 2 L 182 54 L 92 106 Z" className={styles.floorPath} />
              </svg>
            </Link>
          ))}
        </section>

        {/* Explore Button Section */}
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <ExploreButton
            href="/kuliner/katalog"
            textDesktop="Monggo, Ngubengi Kuliner Jateng"
            textTablet="Ngubengi Kuliner Jateng"
            textMobile="Monggo"
          />
        </div>
        </div>
      </div>
      <FooterSection />
    </main>
  );
}
