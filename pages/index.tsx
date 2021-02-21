import Head from "next/head";
import styles from "../styles/Home.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Rick & Morty - Next</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="">Rick & Morty Front-End!</a>
        </h1>

        <p className={styles.description}></p>

        <div className={styles.grid}>
          <Link href="/characters">
            <a className={styles.card}>
              <h3>The Characters &rarr;</h3>
              <p>We can see all the Characters available in Rick & Morty API</p>
            </a>
          </Link>
        </div>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
}
