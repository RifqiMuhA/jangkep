'use client';

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const lastScrollY = useRef(0);

  // Refs for GSAP
  const menuRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Ensiklopedia', path: '/kuliner/katalog' },
    { name: 'Rasa', path: '/rasa' },
    { name: 'Peta Rasa', path: '/maps' },
    { name: 'Dolan', path: '/games' },
  ];

  useEffect(() => {
    // Close menu on route change
    setIsMobileMenuOpen(false);
    setNavHidden(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 50) {
        setIsAtTop(true);
        setNavHidden(false);
        lastScrollY.current = currentScrollY;
        return;
      }

      setIsAtTop(false);

      // Don't hide if menu is open
      if (isMobileMenuOpen) {
        setNavHidden(false);
        lastScrollY.current = currentScrollY;
        return;
      }

      // Threshold: Navbar tidak akan hilang sebelum melewati 300px
      if (currentScrollY < 300) {
        setNavHidden(false);
        lastScrollY.current = currentScrollY;
        return;
      }

      // Hide/Show berdasarkan arah scroll
      if (currentScrollY > lastScrollY.current) {
        // Scrolling down (dan sudah melewati threshold)
        setNavHidden(true);
      } else {
        // Scrolling up
        setNavHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!menuRef.current) return;

    if (isMobileMenuOpen) {
      // Body lock
      document.body.style.overflow = 'hidden';
      
      // Animate Overlay In
      gsap.to(menuRef.current, {
        opacity: 1,
        pointerEvents: 'auto',
        duration: 0.5,
        ease: 'power3.out'
      });

      // Animate Links In
      gsap.fromTo(linksRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'power3.out', delay: 0.2 }
      );
    } else {
      document.body.style.overflow = 'auto';
      // Animate Overlay Out
      gsap.to(menuRef.current, {
        opacity: 0,
        pointerEvents: 'none',
        duration: 0.4,
        ease: 'power3.inOut'
      });
    }
  }, [isMobileMenuOpen]);

  // Classes for the main nav wrapper
  const navClass = `
    ${styles.navbar} 
    ${isAtTop ? styles.atTop : styles.floating} 
    ${navHidden ? styles.hidden : ''}
  `.trim();

  return (
    <>
      <nav className={navClass}>
        <div className={styles.container}>

          {/* Left: Logo */}
          <div className={styles.logoWrap}>
            <Link href="/" className={styles.logo}>
              Jangkep<span className={styles.logoDot}>.</span>
            </Link>
          </div>

          {/* Center: Desktop Links (Pill Box mode) */}
          <div className={styles.desktopMenu}>
            {navLinks.map((link) => {
              const isActive = pathname === link.path || (link.path !== '/' && pathname?.startsWith(link.path));
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                >
                  {link.name}
                </Link>
              )
            })}
          </div>

          {/* Right: Actions */}
          <div className={styles.actions}>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`${styles.hamburger} ${isMobileMenuOpen ? styles.hamburgerOpen : ''}`}
              aria-label="Toggle Menu"
            >
              <div className={styles.hamburgerInner}>
                <span className={styles.bar}></span>
                <span className={styles.bar}></span>
                <span className={styles.bar}></span>
              </div>
            </button>
          </div>

        </div>
      </nav>

      {/* Full-Screen Mobile Menu Overlay */}
      <div ref={menuRef} className={styles.mobileOverlay}>
        <div className={styles.mobileLinks}>
          {navLinks.map((link, i) => {
            const isActive = pathname === link.path || (link.path !== '/' && pathname?.startsWith(link.path));
            return (
              <Link
                key={link.name}
                href={link.path}
                ref={(el: HTMLAnchorElement | null) => { linksRef.current[i] = el; }}
                className={`${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ''}`}
              >
                {link.name}
              </Link>
            )
          })}
        </div>
      </div>
    </>
  );
}
