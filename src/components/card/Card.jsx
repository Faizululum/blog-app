import Image from "next/image";
import styles from "./card.module.css";
import Link from "next/link";

const Card = () => {
  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <Image src="/p1.jpeg" alt="post1" fill className={styles.image} />
      </div>
      <div className={styles.textContainer}>
        <div className={styles.detail}>
          <span className={styles.date}>26 Feb 2025 - </span>
          <span className={styles.category}>CODING</span>
        </div>
        <Link href="/">
          <h1>How to use Next.js</h1>
        </Link>
        <p className={styles.desc}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam iure
          veritatis architecto qui, doloremque explicabo quibusdam rem dicta
          repellendus mollitia ipsam quod blanditiis? Animi neque quos
          voluptatibus doloremque dolorum totam.
        </p>
      <Link href="/" className={styles.link}>Read More</Link>
      </div>
    </div>
  );
};

export default Card;
