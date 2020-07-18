export interface BrawlerMetaEntry {
  id: string;
  name: string;
  sampleSize: number;
  stats: {
    [stat: string]: number;
  }
}

export interface Map {
  map: string;
  mode: string;
  sampleSize: number;
}

export interface ModeMeta {
  mode: string;
  sampleSize: number;
  brawlers: {
    [brawler: string]: {
      name: string;
      sampleSize: number;
      stats: {
        [stat: string]: number;
      }
    }
  }
}

export interface StarpowerMetaEntry {
  id: string;
  brawlerName: string;
  brawlerId: number;
  starpowerName: string;
  sampleSize: number;
  stats: {
    winRate: number;
    starRate: number;
    rank1Rate: number;
  }
}

export interface GadgetMetaEntry {
  id: string;
  brawlerName: string;
  brawlerId: number;
  gadgetName: string;
  sampleSize: number;
  stats: {
    winRate: number;
    starRate: number;
    rank1Rate: number;
  }
}

export interface MapMeta extends ModeMeta {
  map: string;
}

export interface MapMetaMap {
  [event: string]: MapMeta;
}

export interface ModeMetaMap {
  [event: string]: ModeMeta;
}

export interface MapMap {
  [event: string]: Map;
}
