import { GetStaticProps, GetStaticPaths } from "next";
import Image from "next/image";
import { InferGetStaticPropsType } from "next";
import type {
  Character,
  Location,
  Episode,
  RickAndMortyApiResponse,
} from "../../core/types";
import request, { requestMany } from "../../core/src/request";
import styles from "../../styles/Profile.module.css";
import classnames from "classnames";
import Episodes from "../../core/components/episodes";

type ProfileType = {
  characterDetails: Character;
  origin: Location;
  location: Location;
  episodes: Episode[];
};

type IProps = {
  profile: ProfileType;
};

export default function Profile({
  profile: { characterDetails: character, origin, location, episodes },
}: IProps) {
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <div className={styles.section}>
          <div className={styles.card}>
            <div className={styles.imgWrapper}>
              <Image src={character.image} height={180} width={180} />
            </div>
            <div className={styles.contentWrapper}>
              <h3>{character.name}</h3>
              <p>{`${character.status} - ${character.species}`}</p>
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.imgWrapper}>
              <h3>Origin</h3>
            </div>
            <div className={styles.contentWrapper}>
              {origin && <h3>{origin.name}</h3>}
              {origin && <p>{`Type - ${origin.type}`}</p>}
              {origin && <p>{`Dimension - ${origin.dimension}`}</p>}
              {origin && (
                <p>{`Total number of Residents - ${origin.residents?.length}`}</p>
              )}
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.imgWrapper}>
              <h3>Location</h3>
            </div>
            <div className={styles.contentWrapper}>
              {location && <h3>{location.name}</h3>}
              {location && <p>{`Type - ${location.type}`}</p>}
              {location && <p>{`Dimension - ${location.dimension}`}</p>}
              {location && (
                <p>{`Total number of Residents - ${location.residents?.length}`}</p>
              )}
            </div>
          </div>
        </div>
        <div className={classnames(styles.section)}>
          {episodes && <Episodes episodes={episodes} />}
        </div>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  let profile = {};
  const locationUrlBase = "https://rickandmortyapi.com/api/location/";
  const episodeUrlBase = "https://rickandmortyapi.com/api/episode/";
  const {
    params: { profileId },
  } = context;
  try {
    let episodeIds: string[] = [];
    if (profileId) {
      const characterDetails = await request({
        url: `https://rickandmortyapi.com/api/character/${profileId}`,
      });

      profile = {
        ...profile,
        characterDetails,
      };
      if (
        characterDetails &&
        characterDetails.origin &&
        characterDetails.origin.url &&
        characterDetails.origin.url !== ""
      ) {
        const origin = await request({url: characterDetails.origin.url})
        profile = {
          ...profile,
          origin,
        };
      } 
      if (
        characterDetails &&
        characterDetails.location &&
        characterDetails.location.url &&
        characterDetails.location.url !== ""
      ) {
        const location = await request({url: characterDetails.location.url})
        profile = {
          ...profile,
          location,
        };
      } 

      if (characterDetails && characterDetails.episode) {
        episodeIds = characterDetails.episode.map((episodeUrl) =>
          episodeUrl.replace(episodeUrlBase, "")
        );
      }

      const episodes = await request({url : `${episodeUrlBase}${episodeIds.join(",")}`})

      profile = {
        ...profile,
        episodes: episodes
          ? Array.isArray(episodes)
            ? episodes
            : [episodes]
          : [],
      };
      return {
        props: {
          profile
        },
      };
    }
  } catch (err) {
    return {
      props: {
        profile,
      },
    };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  let paths = [];
  try {
    const { results }: RickAndMortyApiResponse = await request({
      url: "https://rickandmortyapi.com/api/character",
    });

    if (results) {
      paths = results.map(({ id }: Character) => ({
        params: {
          profileId: `${id}`,
        },
      }));
    }

    return {
      paths,
      fallback: false,
    };
  } catch (err) {
    return {
      paths,
      fallback: false,
    };
  }
};
