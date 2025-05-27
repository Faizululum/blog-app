import Image from "next/image"
import styles from "./navbar.module.css"
import Link from "next/link"
import ThemeToggle from "../themeToggle/ThemeToggle"
import AuthLink from "../authLink/AuthLink"

const Navbar = () => {
  return (
    <div className={styles.container}>
      {/* <div className={styles.social}>
        <Image src="/facebook.png" alt="facebook" width={24} height={24} />
        <Image src="/youtube.png" alt="youtube" width={24} height={24} />
        <Image src="/tiktok.png" alt="tiktok" width={24} height={24} />
        <Image src="/instagram.png" alt="instagram" width={24} height={24} />
      </div> */}
      <div className={styles.logo}>
      <Image src="/logo.png" alt="logo" width={48} height={48} />
      <h1 className={styles.logoTitle}>Faiz Blog</h1>
      </div>
      <div className={styles.links}>
        <ThemeToggle />
        <Link className={styles.link} href="/">Home</Link>
        <Link className={styles.link} href="/contact">Contact</Link>
        <Link className={styles.link} href="/about">About</Link>
        <AuthLink />
      </div>
    </div>
  )
}

export default Navbar