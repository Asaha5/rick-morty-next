import type { Episode } from "../../types/index";
import styles from "./Episodes.module.css";

type IProps = {
  episodes: Episode[];
};

export default function Episodes({ episodes }: IProps) {
  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h3>Episodes/Chapters Featured on</h3>
      </div>
      <div className={styles.episodeContainer}>
        {episodes.map((episode) => {
          return (
            <div key={episode.id} className={styles.episode}>
              <div className={styles.nameWrapper}>
                <h3>{episode.name}</h3>
              </div>
              <div className={styles.contentWrapper}>
                <p>{`Aired on - ${episode.air_date}`}</p>
                <p>{`Created on - ${episode.air_date}`}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
