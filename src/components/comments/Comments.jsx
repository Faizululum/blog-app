import Link from "next/link"
import styles from "./comments.module.css"
import Image from "next/image"

const Comments = () => {

  const status = "authenticated"
  return (
    <div className={styles.container}>
      {status === "authenticated" ? (
        <div className={styles.write}>
          <textarea name="comment" id="comment" placeholder="Write a comment..." className={styles.input} />
          <button className={styles.button}>Comment</button>
        </div>
      ) : (
        <Link href="/login">Login to comment</Link>
      )}
      <div className={styles.comments}>
        <div className={styles.comment}>
          <div className={styles.user}>
            <Image src="/p1.jpeg" alt="" width={50} height={50} className={styles.image} />
            <div className={styles.userInfo}>
              <span className={styles.username}>Jhon Doe</span>
              <span className={styles.date}>12 March 2023</span>
            </div>
          </div>
          <p className={styles.desc}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae architecto quas maxime, expedita iusto distinctio natus culpa aperiam necessitatibus corrupti beatae corporis temporibus voluptates inventore repellat minus earum possimus aut.</p>
        </div>
        <div className={styles.comment}>
          <div className={styles.user}>
            <Image src="/p1.jpeg" alt="" width={50} height={50} className={styles.image} />
            <div className={styles.userInfo}>
              <span className={styles.username}>Jhon Doe</span>
              <span className={styles.date}>12 March 2023</span>
            </div>
          </div>
          <p className={styles.desc}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae architecto quas maxime, expedita iusto distinctio natus culpa aperiam necessitatibus corrupti beatae corporis temporibus voluptates inventore repellat minus earum possimus aut.</p>
        </div>
        <div className={styles.comment}>
          <div className={styles.user}>
            <Image src="/p1.jpeg" alt="" width={50} height={50} className={styles.image} />
            <div className={styles.userInfo}>
              <span className={styles.username}>Jhon Doe</span>
              <span className={styles.date}>12 March 2023</span>
            </div>
          </div>
          <p className={styles.desc}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae architecto quas maxime, expedita iusto distinctio natus culpa aperiam necessitatibus corrupti beatae corporis temporibus voluptates inventore repellat minus earum possimus aut.</p>
        </div>
      </div>
    </div>
  )
}

export default Comments