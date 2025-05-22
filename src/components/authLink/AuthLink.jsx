import Link from "next/link";
import styles from "./authLink.module.css"

const AuthLink = () => {
  const status = "unauthenticated";

  return (
    <>
    {status === "unauthenticated" ? (
      <Link href="/login">Login</Link>
    ) : (
      <>
      <Link href="/write">Write</Link>
      <span className={styles.link}>Log out</span>
      </>
    )}
    </>
  )
}

export default AuthLink