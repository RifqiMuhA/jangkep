import styles from './DialogBubble.module.css';

interface DialogBubbleProps {
  message: string;
  position?: 'bottom-left' | 'bottom-right' | 'top-center';
  className?: string;
}

export default function DialogBubble({ 
  message, 
  position = 'bottom-left',
  className = '' 
}: DialogBubbleProps) {
  return (
    <div className={`${styles.bubble} ${styles[position]} ${className}`}>
      <p className={styles.text}>{message}</p>
    </div>
  );
}
