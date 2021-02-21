export type BaseCharacter = {
  id: number;
  image: string;
  name: string;
};

type CharacterLocation = {
  name: string;
  url: string;
};

export type Character = BaseCharacter & {
  species: string;
  gender: string;
  status: string;
  type: string;
  origin: CharacterLocation;
  location: CharacterLocation;
  episode: string[];
  url?: string;
  created?: string;
};

export type Location = {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residents: string[];
  url?: string;
  created?: string;
};

export type Episode = {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
  url?: string;
  created?: string;
};

export type Profile = Character & Location & Episode;

export type PagesInfo = {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
};

export type RickAndMortyApiResponse = {
  info?: PagesInfo;
  results?: Array<any>;
};
