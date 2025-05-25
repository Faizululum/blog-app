"use client";

import Link from "next/link";
import styles from "./authLink.module.css"
import { useState } from "react";

const AuthLink = () => {
  const [open, setOpen] = useState(false);

  const status = "unauthenticated";

  return (
    <>
    {status === "unauthenticated" ? (
      <Link href="/login" className={styles.link}>Login</Link>
    ) : (
      <>
      <Link href="/write" className={styles.link}>Write</Link>
      <span className={styles.link}>Log out</span>
      </>
    )}
    <div className={styles.burger} onClick={() => setOpen(!open)}>
      <div className={styles.line}></div>
      <div className={styles.line}></div>
      <div className={styles.line}></div>
    </div>
    {open && (
      <div className={styles.responsiveMenu}>
        <Link href="/">HomePage</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/about">About</Link>
        {status === "unauthenticated" ? (
      <Link href="/login">Login</Link>
    ) : (
      <>
      <Link href="/write">Write</Link>
      <span className={styles.link}>Log out</span>
      </>
    )}
      </div>
    )}
    </>
  )
}

export default AuthLink