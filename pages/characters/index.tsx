import { GetStaticProps } from "next";
import Link from "next/link";
import Image from "next/image";
import { InferGetStaticPropsType } from "next";
import type { Character, RickAndMortyApiResponse } from "../../core/types";
import request from "../../core/src/request";
import styles from "../../styles/Character.module.css";

type IProps = {
  characters: Array<Character>;
};

export default function Characters({ characters }: IProps) {
  return (
    <div className={styles.grid}>
      {characters.map((character) => {
        return (
          <Link href={`/profile/${character.id}`} key={`${character.id}`}>
            <a className={styles.card}>
              <div className={styles.imgWrapper}>
                <Image src={character.image} height={200} width={200} />
              </div>
              <div className={styles.contentWrapper}>
                <h3>{character.name} &rarr;</h3>
                <p>{`${character.status} - ${character.species}`}</p>
              </div>
            </a>
          </Link>
        );
      })}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  let characters: Character[] = [];
  try {
    const { results }: RickAndMortyApiResponse = await request({
      url: "https://rickandmortyapi.com/api/character",
    });

    if (results) {
      characters = results.map((character: Character) => character);
    }

    return {
      props: {
        characters,
      },
    };
  } catch (err) {
    return {
      props: {
        characters,
      },
    };
  }
};
