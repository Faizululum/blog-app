import CardList from "@/components/cardList/CardList"
import styles from "./page.module.css"
import Menu from "@/components/menu/Menu"

const page = () => {
  return (
    <div className={styles.container}>
      <h1 className={`${styles.title} ${styles.coding}`}>
        Coding Blog
      </h1>
      <div className={styles.content}>
        <CardList />
        <Menu />
      </div>
    </div>
  )
}

export default page