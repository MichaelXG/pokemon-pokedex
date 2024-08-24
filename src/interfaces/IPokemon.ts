export interface IAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface IStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface IType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface ISprite {
  front_default: string; // URL da imagem padrão da frente.
  other?: {
    "official-artwork"?: {
      front_default?: string; // URL da imagem oficial de arte.
    };
  };
}

export interface ILocationArea {
  location_area: {
    name: string;
    url: string;
  };
}

export interface ISpecies {
  name: string;
  url: string;
  gender_rate: number;
  flavor_text_entries: {
    flavor_text: string;
    language: {
      name: string;
    };
  }[];
  genera: {
    genus: string;
    language: {
      name: string;
    };
  }[];
}

export interface IPokemonEvolution {
  id: number;
  name: string;
  image: string;
  types: IType[];
  type_evol: string[];
  evolutions?: IPokemonEvolution[];
}

export interface IPokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  abilities: IAbility[];
  types: IType[];
  location_areas: ILocationArea[];
  stats: IStat[];
  sprites: ISprite;
  species: ISpecies;
  description: string;
  gender: {
    male: string;
    female: string;
  };
  category: string;
  weaknesses: string[];
}

export interface IPokemonListResponse {
  count: number;
  results: IPokemon[];
  next?: string; // URL para a próxima página de resultados
  previous?: string; // URL para a página anterior de resultados
}
