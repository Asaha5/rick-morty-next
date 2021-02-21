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
          <Episodes episodes={episodes} />
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
    const urls: string[] = [];
    const locationIds: string[] = [];
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
        characterDetails.origin.url
      ) {
        locationIds.push(
          characterDetails.origin.url.replace(locationUrlBase, "")
        );
      }

      if (
        characterDetails &&
        characterDetails.location &&
        characterDetails.location.url
      ) {
        locationIds.push(
          characterDetails.location.url.replace(locationUrlBase, "")
        );
      }

      if (characterDetails && characterDetails.episode) {
        episodeIds = characterDetails.episode.map((episodeUrl) =>
          episodeUrl.replace(episodeUrlBase, "")
        );
      }
      urls.push(`${locationUrlBase}${locationIds.join(",")}`);
      urls.push(`${episodeUrlBase}${episodeIds.join(",")}`);
      const [originAndLocationDetails, episodes]: [
        Array<Location>,
        Array<Episode>
      ] = await requestMany(urls);

      if (originAndLocationDetails && originAndLocationDetails.length > 0) {
        const origin = originAndLocationDetails[0];
        profile = {
          ...profile,
          origin: origin ?? {},
        };
      }

      if (originAndLocationDetails && originAndLocationDetails.length > 1) {
        const location = originAndLocationDetails[1];
        profile = {
          ...profile,
          location: location ?? {},
        };
      } else {
        const location = originAndLocationDetails[0];
        profile = {
          ...profile,
          location: location ?? {},
        };
      }

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
          profile,
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
