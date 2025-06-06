import Menu from "@/components/menu/Menu";
import styles from "./singlePage.module.css";
import Image from "next/image";
import Comments from "@/components/comments/Comments";

const SinglePage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>Lorem ipsum dolor sit amet consectetur adipisicing elit.</h1>
          <div className={styles.user}>
            <div className={styles.userImageContainer}>
              <Image src="/p1.jpeg" alt="" fill className={styles.avatar} />
            </div>
            <div className={styles.userTextContainer}>
              <span className={styles.username}>Jhon Doe</span>
              <span className={styles.date}>12 March 2023</span>
            </div>
          </div>
        </div>
        <div className={styles.imageContainer}>
          <Image src="/p1.jpeg" alt="" fill className={styles.image} />
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.post}>
          <div className={styles.description}>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Molestiae architecto quas maxime, expedita iusto distinctio natus culpa aperiam necessitatibus corrupti beatae corporis temporibus voluptates inventore repellat minus earum possimus aut.
          </p>
          <h2>Lorem ipsum, dolor sit amet consectetur adipisicing elit.</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Molestiae architecto quas maxime, expedita iusto distinctio natus culpa aperiam necessitatibus corrupti beatae corporis temporibus voluptates inventore repellat minus earum possimus aut.
          </p>
          </div>
          <div className={styles.comment}>
          <Comments />
          </div>
        </div>
        <Menu />
      </div>
    </div>
  );
};

export default SinglePage;
