import styles from './FlavorTag.module.css';
import type { FlavorType } from '@/data/kuliner';

interface FlavorTagProps {
  flavor: FlavorType;
}

const flavorClassMap: Record<FlavorType, string> = {
  Pedas: styles.pedas,
  Manis: styles.manis,
  Gurih: styles.gurih,
  Segar: styles.segar,
  Legit: styles.legit,
};

export default function FlavorTag({ flavor }: FlavorTagProps) {
  return (
    <span className={`${styles.tag} ${flavorClassMap[flavor] ?? ''}`}>
      {flavor}
    </span>
  );
}
