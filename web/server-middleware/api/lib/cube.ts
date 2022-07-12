export interface Config extends Record<string, Cube> {}

// helper function which infers keys and restricts values to ElementType
const asDimensions = <T>(et: { [K in keyof T]: Dimension }) => et
const asMeasurements = <T>(et: { [K in keyof T]: Measurement }) => et
const asSlice = <T>(et: { [K in keyof T]: Slice }) => et

export type ValueType = 'quantitative'|'temporal'|'ordinal'|'nominal'
export type MeasureType = 'number'|'count'|'countDistinct'|'countDistinctApprox'|'sum'|'avg'|'min'|'max'|'runningTotal'
export type DimensionType = 'time'|'string'|'number'|'boolean'|'geo'

export interface State {
  cubeId: string
  slices: SliceValue
  comparingSlices: SliceValue
  dimensionsIds: string[]
  measurementsIds: string[]
  sortId: string
  comparing: boolean
}

export interface Cube {
  id: string
  table: string
  name: string
  hidden: boolean
  dimensions: Dimension[]
  defaultDimensionsIds: string[]
  measurements: Measurement[]
  defaultMeasurementIds: string[]
  metaColumns: string[]
  slices: Slice[]
  defaultSliceValues: SliceValue
}

export interface Measurement {
  id: string
  name: string
  nameShort: string
  icon: string
  description: string
  formatter: string
  d3formatter: string
  sign: number
  percentage: boolean
  column: string // deprecate
  type: ValueType
  scale?: any // https://vega.github.io/vega-lite/docs/scale.html
  config: { // cube.js config
    sql: string
    type: MeasureType
  }
}

export interface Dimension {
  id: string
  name: string
  formatColumn: string
  formatter: string
  column: string
  anyColumns: string[]
  hidden: boolean
  type: ValueType
  scale?: any // https://vega.github.io/vega-lite/docs/scale.html
  config: { // cube.js config
    sql: string
    type: DimensionType
  }
}

export interface Slice {
  id: string
  name: string
  column: string
  // TODO: for description
  // formatter: string
}

export interface SliceValue extends Record<string, string[]> { }

const metaDimensions = asDimensions({
  season: {
    id: 'season',
    name: 'Bi-Week',
    formatColumn: 'trophy_season_end',
    formatter: '',
    column: 'trophy_season_end',
    anyColumns: [],
    hidden: false,
    type: 'temporal',
    scale: {
      nice: 'week',
    },
    config: {
      sql: 'trophy_season_end',
      type: 'time',
    },
  },
  day: {
    id: 'day',
    name: 'Day',
    formatColumn: 'timestamp_day',
    formatter: 'yyyy-MM-dd',
    column: 'timestamp_day',
    anyColumns: [],
    hidden: false,
    type: 'temporal',
    scale: {
      nice: 'day',
    },
    config: {
      sql: 'timestamp_day',
      type: 'time',
    },
  },
  timestamp: {
    id: 'timestamp',
    name: 'Timestamp',
    formatColumn: 'timestamp',
    formatter: 'yyyy-MM-ddTHH:mm',
    column: 'timestamp',
    anyColumns: [],
    hidden: false,
    type: 'temporal',
    scale: {
      nice: 'hour',
    },
    config: {
      sql: 'timestamp',
      type: 'time',
    },
  },
})

const playerDimensions = asDimensions({
  player: {
    id: 'player',
    name: 'Player',
    formatColumn: 'player_name',
    formatter: '',
    column: 'player_id',
    anyColumns: ['player_name', /* 'player_tag', FIXME */ 'player_icon_id'],
    hidden: false,
    type: 'nominal',
    config: {
      sql: 'player_id',
      type: 'string',
    },
  },
})

const brawlerDimensions = asDimensions({
  brawler: {
    id: 'brawler',
    name: 'Brawler',
    formatColumn: 'brawler_name',
    formatter: 'capitalizeWords',
    column: 'brawler_name',
    anyColumns: [],
    hidden: false,
    type: 'nominal',
    config: {
      sql: 'brawler_name',
      type: 'string',
    },
  },
  brawlerId: {
    id: 'brawlerId',
    name: 'Brawler ID',
    formatColumn: 'brawler_id',
    formatter: '',
    column: 'brawler_id',
    anyColumns: [],
    hidden: true,
    type: 'nominal',
    config: {
      sql: 'brawler_id',
      type: 'string',
    },
  },
  ally: {
    id: 'ally',
    name: 'Ally',
    formatColumn: 'ally_brawler_name',
    formatter: 'capitalizeWords',
    column: 'ally_brawler_name',
    anyColumns: [],
    hidden: false,
    type: 'nominal',
    config: {
      sql: 'ally_brawler_name',
      type: 'string',
    },
  },
  allyId: {
    id: 'allyId',
    name: 'Ally ID',
    formatColumn: 'ally_brawler_id',
    formatter: '',
    column: 'ally_brawler_id',
    anyColumns: [],
    hidden: true,
    type: 'nominal',
    config: {
      sql: 'ally_brawler_id',
      type: 'string',
    },
  },
  gadget: {
    id: 'gadget',
    name: 'Gadget',
    formatColumn: 'brawler_gadget_name',
    formatter: 'capitalizeWords',
    column: 'brawler_gadget_id',
    anyColumns: ['brawler_gadget_name', 'brawler_name'],
    hidden: false,
    type: 'nominal',
    config: {
      sql: 'brawler_gadget_id',
      type: 'string',
    },
  },
  starpower: {
    id: 'starpower',
    name: 'Star Power',
    formatColumn: 'brawler_starpower_name',
    formatter: 'capitalizeWords',
    column: 'brawler_starpower_id',
    anyColumns: ['brawler_starpower_name', 'brawler_name'],
    hidden: false,
    type: 'nominal',
    config: {
      sql: 'brawler_starpower_id',
      type: 'string',
    },
  },
  bigbrawler: {
    id: 'bigbrawler',
    name: 'Big Brawler',
    formatColumn: 'battle_is_bigbrawler',
    formatter: 'y/n',
    column: 'brawler_is_bigbrawler',
    anyColumns: [],
    hidden: true,
    type: 'nominal',
    config: {
      sql: 'battle_is_bigbrawler',
      type: 'boolean',
    },
  },
})

const battleDimensions = asDimensions({
  mode: {
    id: 'mode',
    name: 'Mode',
    formatColumn: 'battle_event_mode',
    formatter: 'formatMode',
    column: 'battle_event_mode',
    anyColumns: [],
    hidden: false,
    type: 'nominal',
    config: {
      sql: 'battle_event_mode',
      type: 'string',
    },
  },
  map: {
    id: 'map',
    name: 'Map',
    formatColumn: 'battle_event_map',
    formatter: '',
    column: 'battle_event_map',
    anyColumns: ['battle_event_mode', 'battle_event_id'],
    hidden: false,
    type: 'nominal',
    config: {
      sql: 'battle_event_map',
      type: 'string',
    },
  },
  team: {
    id: 'team',
    name: 'Team',
    formatColumn: 'brawler_names',
    formatter: 'capitalizeWords',
    column: 'brawler_names',
    anyColumns: [],
    hidden: false,
    type: 'nominal',
    config: {
      sql: 'brawler_names',
      type: 'string',
    },
  },
  powerplay: {
    id: 'powerplay',
    name: 'Power Play',
    formatColumn: 'battle_power_play',
    formatter: 'y/n',
    column: 'battle_power_play',
    anyColumns: [],
    hidden: false,
    type: 'nominal',
    config: {
      sql: 'battle_power_play',
      type: 'boolean',
    },
  },
})

const commonDimensions = asDimensions({
  ...playerDimensions,
  ...brawlerDimensions,
  ...metaDimensions,
  ...battleDimensions,
})

const picks = 'SUM(picks)'
const winRate = `toFloat64(AVG(battle_victory))`
const winRateMerged = `toFloat64(avgMerge(battle_victory_state))`
const zP = '((avg(brawler_trophyrange)-5)*(avg(brawler_trophyrange)-5)/100+0.55)'
const winratePosterior = `(1583+${winRate}*${picks})/(1583/${zP}+${picks})`
const winratePosteriorMerged = `(1583+${winRateMerged}*${picks})/(1583/${zP}+${picks})`

export const playerMeasurements = asMeasurements({
  playerName: {
    id: 'playerName',
    name: 'Most common name',
    nameShort: 'Name',
    icon: '',
    description: '',
    formatter: '',
    d3formatter: '',
    sign: -1,
    percentage: false,
    column: 'player_name',
    type: 'nominal',
    config: {
      sql: 'any(player_name)',
      type: 'number',
    },
  },
  clubName: {
    id: 'clubName',
    name: 'Most common Club name',
    nameShort: 'Club Name',
    icon: '',
    description: '',
    formatter: '',
    d3formatter: '',
    sign: -1,
    percentage: false,
    column: 'player_club_name',
    type: 'nominal',
    config: {
      sql: 'any(player_club_name)',
      type: 'number',
    },
  },
  playerIcon: {
    id: 'playerIcon',
    name: 'Most common icon',
    nameShort: 'Icon',
    icon: '',
    description: '',
    formatter: '',
    d3formatter: '',
    sign: -1,
    percentage: false,
    column: 'player_icon_id',
    type: 'nominal',
    config: {
      sql: 'any(player_icon_id)',
      type: 'number',
    },
  },
  playerNameColor: {
    id: 'playerNameColor',
    name: 'Most common color',
    nameShort: 'Name Color',
    icon: '',
    description: '',
    formatter: '',
    d3formatter: '',
    sign: -1,
    percentage: false,
    column: 'player_name_color',
    type: 'nominal',
    config: {
      sql: 'any(player_name_color)',
      type: 'number',
    },
  },
  playerTrophies: {
    id: 'playerTrophies',
    name: 'Player Trophies',
    nameShort: 'Trophies',
    icon: '',
    description: '',
    formatter: '.2s',
    d3formatter: '.2s',
    sign: -1,
    percentage: false,
    column: 'player_trophies',
    type: 'quantitative',
    scale: {
      zero: false,
    },
    config: {
      sql: 'player_trophies',
      type: 'max',
    },
  },
  playerHighestTrophies: {
    id: 'playerHighestTrophies',
    name: 'Player Highest Trophies',
    nameShort: 'Trophy Max',
    icon: '',
    description: '',
    formatter: '.2s',
    d3formatter: '.2s',
    sign: -1,
    percentage: false,
    column: 'player_highest_trophies',
    type: 'quantitative',
    scale: {
      zero: false,
    },
    config: {
      sql: 'player_highest_trophies',
      type: 'max',
    },
  },
  victories: {
    id: 'victories',
    name: '3v3 Victories',
    nameShort: 'Victories',
    icon: '',
    description: '',
    formatter: '.2s',
    d3formatter: '.2s',
    sign: -1,
    percentage: false,
    column: 'player_3vs3_victories',
    type: 'quantitative',
    scale: {
      zero: false,
    },
    config: {
      sql: 'player_3vs3_victories',
      type: 'max',
    },
  },
  exp: {
    id: 'exp',
    name: 'Experience',
    nameShort: 'EXP',
    icon: '',
    description: '',
    formatter: '.2s',
    d3formatter: '.2s',
    sign: -1,
    percentage: false,
    column: 'player_exp_points',
    type: 'quantitative',
    scale: {
      zero: false,
    },
    config: {
      sql: 'player_exp',
      type: 'max',
    },
  },
  soloVictories: {
    id: 'soloVictories',
    name: 'Solo Victories',
    nameShort: 'SD Victories',
    icon: '',
    description: '',
    formatter: '.2s',
    d3formatter: '.2s',
    sign: -1,
    percentage: false,
    column: 'player_solo_victories',
    type: 'quantitative',
    scale: {
      zero: false,
    },
    config: {
      sql: 'player_solo_victories',
      type: 'max',
    },
  },
  duoVictories: {
    id: 'duoVictories',
    name: 'Duo Victories',
    nameShort: 'SD Victories',
    icon: '',
    description: '',
    formatter: '.2s',
    d3formatter: '.2s',
    sign: -1,
    percentage: false,
    column: 'player_duo_victories',
    type: 'quantitative',
    scale: {
      zero: false,
    },
    config: {
      sql: 'player_duo_victories',
      type: 'max',
    },
  },
  users: {
    id: 'users',
    name: 'Players',
    nameShort: 'Players',
    icon: '🧑',
    description: 'The total number of players.',
    formatter: '.1s',
    d3formatter: '.1s',
    sign: -1,
    percentage: false,
    column: 'users',
    type: 'quantitative',
    config: {
      sql: 'uniqCombined(player_id)',
      type: 'number',
    },
  },
  powerPlayPoints: {
    id: 'powerPlayPoints',
    name: 'Power Play Points',
    nameShort: 'Points',
    icon: '',
    description: '',
    formatter: '',
    d3formatter: '',
    sign: -1,
    percentage: false,
    column: 'player_power_play_points',
    type: 'quantitative',
    config: {
      sql: 'player_power_play_points',
      type: 'max',
    },
  },
  highestPowerPlayPoints: {
    id: 'highestPowerPlayPoints',
    name: 'Highest Power Play Points',
    nameShort: 'Points Max',
    icon: '',
    description: '',
    formatter: '',
    d3formatter: '',
    sign: -1,
    percentage: false,
    column: 'player_highest_power_play_points',
    type: 'quantitative',
    config: {
      sql: 'player_highest_power_play_points',
      type: 'max',
    },
  },
  expLevel: {
    id: 'expLevel',
    name: 'EXP Level',
    nameShort: 'EXP',
    icon: '',
    description: '',
    formatter: '',
    d3formatter: '',
    sign: -1,
    percentage: false,
    column: 'player_exp_level',
    type: 'quantitative',
    config: {
      sql: 'player_exp_level',
      type: 'max',
    },
  },
  expPoints: {
    id: 'expPoints',
    name: 'EXP',
    nameShort: 'EXP',
    icon: '',
    description: '',
    formatter: '',
    d3formatter: '',
    sign: -1,
    percentage: false,
    column: 'player_exp_points',
    type: 'quantitative',
    config: {
      sql: 'player_exp_points',
      type: 'max',
    },
  },
  brawlers: {
    id: 'brawlers',
    name: 'Brawlers',
    nameShort: 'Brawlers',
    icon: '',
    description: '',
    formatter: '',
    d3formatter: '',
    sign: -1,
    percentage: false,
    column: 'player_brawlers_length',
    type: 'quantitative',
    config: {
      sql: 'player_brawlers_length',
      type: 'max',
    },
  },
})

export const brawlerMeasurements = asMeasurements({
  highestTrophies: {
    id: 'highestTrophies',
    name: 'Highest Trophies',
    nameShort: 'Highest Trophies',
    icon: '',
    description: '',
    formatter: '.2s',
    d3formatter: '.2s',
    sign: -1,
    percentage: false,
    column: 'brawler_highest_trophies',
    type: 'quantitative',
    config: {
      sql: 'brawler_highest_trophies',
      type: 'max',
    },
  },
  trophies: {
    id: 'trophies',
    name: 'Trophies',
    nameShort: 'Trophies',
    icon: 'trophy',
    description: 'The amount of Trophies tells you how many trophies players have with this Brawler on average.',
    formatter: '.2s',
    d3formatter: '.2s',
    sign: -1,
    percentage: false,
    column: 'brawler_trophies',
    type: 'quantitative',
    scale: {
      zero: false,
    },
    config: {
      sql: 'brawler_trophies',
      type: 'avg',
    },
  },
  brawler: {
    id: 'brawler',
    name: 'Most played Brawler',
    nameShort: 'Brawler',
    icon: '',
    description: '',
    formatter: 'capitalizeWords',
    d3formatter: '',
    sign: -1,
    percentage: false,
    column: 'brawler_name',
    type: 'nominal',
    config: {
      sql: 'anyHeavy(brawler_name)',
      type: 'number',
    },
  },
  starpowers: {
    id: 'starpowers',
    name: 'Star Powers',
    nameShort: 'Star Powers',
    icon: '',
    description: '',
    formatter: '',
    d3formatter: '',
    sign: -1,
    percentage: false,
    column: 'brawler_starpowers_length',
    type: 'quantitative',
    config: {
      sql: 'brawler_starpowers_length',
      type: 'max',
    },
  },
  gadgets: {
    id: 'gadgets',
    name: 'Gadgets',
    nameShort: 'Gadgets',
    icon: '',
    description: '',
    formatter: '',
    d3formatter: '',
    sign: -1,
    percentage: false,
    column: 'brawler_gadgets_length',
    type: 'quantitative',
    config: {
      sql: 'brawler_gadgets_length',
      type: 'max',
    },
  },
})

const metaMeasurements = asMeasurements({
  timestamp: {
    // TODO
    id: 'timestamp',
    name: 'Last Update',
    nameShort: 'Updated',
    icon: '⌚',
    description: '',
    formatter: '',
    d3formatter: '',
    sign: -1,
    percentage: false,
    column: 'timestamp',
    type: 'temporal',
    config: {
      sql: 'formatDateTime(MAX(timestamp), \'%FT%TZ\', \'UTC\')',
      type: 'number',
    },
  },
  day: {
    // TODO
    id: 'day',
    name: 'Day',
    nameShort: 'Day',
    icon: '⌚',
    description: '',
    formatter: '',
    d3formatter: '',
    sign: -1,
    percentage: false,
    column: 'timestamp_day',
    type: 'temporal',
    config: {
      sql: 'formatDateTime(MAX(toStartOfDay(timestamp)), \'%FT%TZ\', \'UTC\')',
      type: 'number',
    },
  },
})

const battleMeasurements = asMeasurements({
  trophyChange: {
    id: 'trophyChange',
    name: 'Trophy Change',
    nameShort: 'TrophyD',
    icon: 'trophy',
    description: '',
    formatter: '+.2f',
    d3formatter: '+.2f',
    sign: -1,
    percentage: false,
    column: 'battle_trophy_change',
    type: 'quantitative',
    scale: {
      zero: false,
    },
    config: {
      sql: 'battle_trophy_change',
      type: 'avg',
    },
  },
  winRate: {
    id: 'winRate',
    name: 'Win Rate',
    nameShort: 'Win',
    icon: '📈',
    description: 'The Win Rate tells you the % of battles a Brawler wins or ranks high.',
    formatter: '.1%',
    d3formatter: '.1%',
    sign: -1,
    percentage: false,
    column: 'battle_victory',
    type: 'quantitative',
    scale: {
      zero: false,
    },
    config: {
      sql: 'battle_victory',
      type: 'avg',
    },
  },
  winRateAdj: {
    id: 'winRateAdj',
    name: 'Adjusted Win Rate',
    nameShort: 'Win',
    icon: '📈',
    description: 'The Adjusted Win Rate tells you the % of battles a Brawler wins or ranks high. For Brawlers with few picks, this value is interpolated.',
    formatter: '.1%',
    d3formatter: '.1%',
    sign: -1,
    percentage: false,
    column: 'battle_victory_adj',
    type: 'quantitative',
    scale: {
      zero: false,
    },
    config: {
      sql: winratePosterior,
      type: 'number',
    },
  },
  winRateDiff: {
    id: 'winRateDiff',
    name: 'Win Rate Diff',
    nameShort: 'WinD',
    icon: '📈',
    description: 'The Win Rate Difference compares the Win Rate of Brawlers with a Star Power / Gadget to those without.',
    formatter: '+.2%',
    d3formatter: '+.2%',
    sign: -1,
    percentage: false,
    column: 'battle_victory',
    type: 'quantitative',
    config: {
      sql: '', // TODO needs join
      type: 'number',
    },
  },
  wins: {
    id: 'wins',
    name: 'Wins',
    nameShort: 'Wins',
    icon: '📈',
    description: 'The number of Wins recorded ranks Brawlers high who are played a lot and win a lot.',
    formatter: '.2s',
    d3formatter: '.2s',
    sign: -1,
    percentage: false,
    column: 'wins',
    type: 'quantitative',
    config: {
      sql: 'battle_victory',
      type: 'sum',
    },
  },
  winsZScore: {
    id: 'winsZScore',
    name: 'Wins z-Score',
    nameShort: 'Win-z',
    icon: '📈',
    description: 'The Wins z-score uses a statistical test to compare the wins of Brawlers with a Star Power / Gadget to those without. Scores higher/lower than 2 are good/bad.',
    formatter: '.2f',
    d3formatter: '.2f',
    sign: -1,
    percentage: false,
    column: 'wins',
    type: 'quantitative',
    config: {
      sql: '', // TODO needs join
      type: 'number',
    },
  },
  picks: {
    id: 'picks',
    name: 'Picks recorded',
    nameShort: 'Picks',
    icon: '👇',
    description: '',
    formatter: '.2s',
    d3formatter: '.2s',
    sign: -1,
    percentage: false,
    column: 'picks',
    type: 'quantitative',
    config: {
      sql: '',
      type: 'count',
    },
  },
  pickRate: {
    id: 'pickRate',
    name: 'Pick Rate',
    nameShort: 'Picked',
    icon: '👇',
    description: 'The Pick Rate tells you the % of battles this Brawler appears in.',
    formatter: '.2%',
    d3formatter: '.2%',
    sign: -1,
    percentage: true,
    column: 'picks',
    type: 'quantitative',
    scale: {
      zero: false,
    },
    config: {
      sql: '',
      type: 'count',
    },
  },
  useRate: {
    id: 'useRate',
    name: 'Use Rate',
    nameShort: 'Used',
    icon: '🎯',
    description: 'The Use Rate measures the popularity of a Brawler, adjusted to how many players unlocked them. It is the main statistic Supercell uses to balance Brawlers.',
    formatter: '.2%',
    d3formatter: '.2%',
    sign: -1,
    percentage: true,
    column: 'picks_weighted',
    type: 'quantitative',
    scale: {
      zero: false,
    },
    config: {
      sql: 'player_brawlers_length',
      type: 'sum',
    },
  },
  starRate: {
    id: 'starRate',
    name: 'Star Player',
    nameShort: 'Star',
    icon: '⭐',
    description: 'The Star Rate tells you the % of battles this Brawler becomes Star Player.',
    formatter: '.1%',
    d3formatter: '.1%',
    sign: -1,
    percentage: false,
    column: 'battle_starplayer',
    type: 'quantitative',
    scale: {
      zero: false,
    },
    config: {
      sql: 'player_brawlers_length',
      type: 'sum',
    },
  },
  starRateDiff: {
    id: 'starRateDiff',
    name: 'Star Player Diff.',
    nameShort: 'StarD',
    icon: '⭐',
    description: 'The Star Rate Difference compares the Star Rate of Brawlers with a Star Power / Gadget to those without.',
    formatter: '+.2%',
    d3formatter: '+.2%',
    sign: -1,
    percentage: false,
    column: 'battle_starplayer',
    type: 'quantitative',
    config: {
      sql: '', // TODO needs join
      type: 'number',
    },
  },
  rank: {
    id: 'rank',
    name: 'Average Rank',
    nameShort: 'Rank',
    icon: 'leaderboards',
    description: 'The Average Rank tells you what place the Brawler is ranked in Showdown on average.',
    formatter: '.2f',
    d3formatter: '.2f',
    sign: +1,
    percentage: false,
    column: 'battle_rank',
    type: 'quantitative',
    scale: {
      zero: false,
    },
    config: {
      sql: 'battle_rank',
      type: 'avg',
    },
  },
  rank1: {
    id: 'rank1',
    name: '#1 Recorded',
    nameShort: 'Rank 1',
    icon: '🏅',
    description: '',
    formatter: '.2s',
    d3formatter: '.2s',
    sign: -1,
    percentage: false,
    column: 'battle_rank1',
    type: 'quantitative',
    config: {
      sql: 'battle_rank1',
      type: 'sum',
    },
  },
  rank1Rate: {
    id: 'rank1Rate',
    name: '#1 Rate',
    nameShort: 'SD Win',
    icon: '📈',
    description: 'The #1 Rate tells you the % of Showdown battles a Brawler is #1.',
    formatter: '.2%',
    d3formatter: '.2%',
    sign: -1,
    percentage: false,
    column: 'battle_rank1',
    type: 'quantitative',
    scale: {
      zero: false,
    },
    config: {
      sql: 'battle_rank1',
      type: 'avg',
    },
  },
  rank1RateDiff: {
    id: 'rank1RateDiff',
    name: '#1 Rate Diff.',
    nameShort: 'SD WinD',
    icon: '📈',
    description: 'The #1 Rate Difference compares the #1 Rate of Brawlers with a Star Power / Gadget to those without.',
    formatter: '+.2%',
    d3formatter: '+.2%',
    sign: -1,
    percentage: false,
    column: 'battle_rank1',
    type: 'quantitative',
    config: {
      sql: '', // TODO needs join
      type: 'number',
    },
  },
  duration: {
    id: 'duration',
    name: 'Duration',
    nameShort: 'Duration',
    icon: '⏰',
    description: 'The Duration tells you how long battles with this Brawler last on average in seconds.',
    formatter: 'duration',
    d3formatter: 'duration',
    sign: +1,
    percentage: false,
    column: 'battle_duration',
    type: 'quantitative',
    config: {
      sql: 'battle_duration',
      type: 'avg',
    },
  },
  level: {
    id: 'level',
    name: 'Average Level',
    nameShort: 'Level',
    icon: '🏅',
    description: '',
    formatter: '.2f',
    d3formatter: '.2f',
    sign: -1,
    percentage: false,
    column: 'battle_level',
    type: 'quantitative',
    scale: {
      zero: false,
    },
    config: {
      sql: 'battle_level',
      type: 'avg',
    },
  },
  power: {
    id: 'power',
    name: 'Power',
    nameShort: 'Power',
    icon: '🏅',
    description: '',
    formatter: '.2f',
    d3formatter: '.2f',
    sign: -1,
    percentage: false,
    column: 'brawler_power',
    type: 'quantitative',
    scale: {
      zero: false,
    },
    config: {
      sql: 'brawler_power',
      type: 'avg',
    },
  },
})

// same as battleMeasurements, but using clickhouse merge for mv
const mergedbattleMeasurements = asMeasurements({
  trophyChange: {
    id: 'trophyChange',
    name: 'Trophy Change',
    nameShort: 'TrophyD',
    icon: 'trophy',
    description: '',
    formatter: '+.2f',
    d3formatter: '+.2f',
    sign: -1,
    percentage: false,
    column: 'battle_trophy_change',
    type: 'quantitative',
    scale: {
      zero: false,
    },
    config: {
      sql: 'avgMerge(battle_trophy_change_state)',
      type: 'number',
    },
  },
  winRate: {
    id: 'winRate',
    name: 'Win Rate',
    nameShort: 'Win',
    icon: '📈',
    description: 'The Win Rate tells you the % of battles a Brawler wins or ranks high.',
    formatter: '.1%',
    d3formatter: '.1%',
    sign: -1,
    percentage: false,
    column: 'battle_victory',
    type: 'quantitative',
    scale: {
      zero: false,
    },
    config: {
      sql: 'avgMerge(battle_victory_state)',
      type: 'number',
    },
  },
  winRateAdj: {
    id: 'winRateAdj',
    name: 'Adjusted Win Rate',
    nameShort: 'Win',
    icon: '📈',
    description: 'The Adjusted Win Rate tells you the % of battles a Brawler wins or ranks high. For Brawlers with few picks, this value is interpolated.',
    formatter: '.1%',
    d3formatter: '.1%',
    sign: -1,
    percentage: false,
    column: 'battle_victory_adj',
    type: 'quantitative',
    scale: {
      zero: false,
    },
    config: {
      sql: winratePosteriorMerged,
      type: 'number',
    },
  },
  wins: {
    id: 'wins',
    name: 'Wins',
    nameShort: 'Wins',
    icon: '📈',
    description: 'The number of Wins recorded ranks Brawlers high who are played a lot and win a lot.',
    formatter: '.2s',
    d3formatter: '.2s',
    sign: -1,
    percentage: false,
    column: 'wins',
    type: 'quantitative',
    config: {
      sql: `${winRateMerged}*${picks}`,
      type: 'number',
    },
  },
  pickRate: {
    id: 'pickRate',
    name: 'Pick Rate',
    nameShort: 'Picked',
    icon: '👇',
    description: 'The Pick Rate tells you the % of battles this Brawler appears in.',
    formatter: '.2%',
    d3formatter: '.2%',
    sign: -1,
    percentage: true,
    column: 'picks',
    type: 'quantitative',
    scale: {
      zero: false,
    },
    config: {
      sql: 'SUM(picks)',
      type: 'number',
    },
  },
  starRate: {
    id: 'starRate',
    name: 'Star Player',
    nameShort: 'Star',
    icon: '⭐',
    description: 'The Star Rate tells you the % of battles this Brawler becomes Star Player.',
    formatter: '.1%',
    d3formatter: '.1%',
    sign: -1,
    percentage: false,
    column: 'battle_starplayer',
    type: 'quantitative',
    scale: {
      zero: false,
    },
    config: {
      sql: 'avgMerge(battle_starplayer_state_state)',
      type: 'sum',
    },
  },
  rank: {
    id: 'rank',
    name: 'Average Rank',
    nameShort: 'Rank',
    icon: 'leaderboards',
    description: 'The Average Rank tells you what place the Brawler is ranked in Showdown on average.',
    formatter: '.2f',
    d3formatter: '.2f',
    sign: +1,
    percentage: false,
    column: 'battle_rank',
    type: 'quantitative',
    scale: {
      zero: false,
    },
    config: {
      sql: 'avgMerge(battle_rank_state)',
      type: 'number',
    },
  },
  rank1Rate: {
    id: 'rank1Rate',
    name: '#1 Rate',
    nameShort: 'SD Win',
    icon: '📈',
    description: 'The #1 Rate tells you the % of Showdown battles a Brawler is #1.',
    formatter: '.2%',
    d3formatter: '.2%',
    sign: -1,
    percentage: false,
    column: 'battle_rank1',
    type: 'quantitative',
    scale: {
      zero: false,
    },
    config: {
      sql: 'avgMerge(battle_rank1_state)',
      type: 'number',
    },
  },
  duration: {
    id: 'duration',
    name: 'Duration',
    nameShort: 'Duration',
    icon: '⏰',
    description: 'The Duration tells you how long battles with this Brawler last on average in seconds.',
    formatter: 'duration',
    d3formatter: 'duration',
    sign: +1,
    percentage: false,
    column: 'battle_duration',
    type: 'quantitative',
    config: {
      sql: 'avgMerge(battle_duration)',
      type: 'number',
    },
  },
})

export const commonMeasurements = asMeasurements({
  ...metaMeasurements,
  ...playerMeasurements,
  ...brawlerMeasurements,
  ...battleMeasurements,
})

const metaSlices = asSlice({
  season: {
    id: 'season',
    name: 'Since Time',
    column: 'trophy_season_end',
  },
  seasonExact: {
    id: 'seasonExact',
    name: 'Time',
    column: 'trophy_season_end_exact',
  },
  timestamp: {
    id: 'timestamp',
    name: 'Since Time',
    column: 'timestamp',
  },
})

const playerSlices = asSlice({
  playerName: {
    id: 'playerName',
    name: 'Player Name',
    column: 'player_name_ilike',
  },
  playerId: {
    id: 'playerId',
    name: 'Player ID',
    column: 'player_id',
  },
  playerTag: {
    id: 'playerTag',
    name: 'Player Tag',
    column: 'player_tag',
  },
})

const brawlerSlices = asSlice({
  brawler: {
    id: 'brawler',
    name: 'Brawler',
    column: 'brawler_name',
  },
  brawlerId: {
    id: 'brawlerId',
    name: 'Brawler ID',
    column: 'brawler_id',
  },
  ally: {
    id: 'ally',
    name: 'Ally',
    column: 'ally_brawler_name',
  },
  allyId: {
    id: 'allyId',
    name: 'Ally ID',
    column: 'ally_brawler_id',
  },
  trophies: {
    id: 'trophies',
    name: 'Trophies',
    column: 'brawler_trophyrange',
  },
  withStarpower: {
    id: 'withStarpower',
    name: 'Star Power detected',
    column: 'with_starpower',
  },
  withGadget: {
    id: 'withGadget',
    name: 'Gadget detected',
    column: 'with_gadget',
  },
})

const battleSlices = asSlice({
  mode: {
    id: 'mode',
    name: 'Mode',
    column: 'battle_event_mode',
  },
  map: {
    id: 'map',
    name: 'Map',
    column: 'battle_event_map',
  },
  mapLike: {
    id: 'mapLike',
    name: 'Map Name',
    column: 'battle_event_map_like',
  },
  mapNotLike: {
    id: 'mapNotLike',
    name: 'not Map Name',
    column: 'battle_event_map_notlike',
  },
  powerplay: {
    id: 'powerplay',
    name: 'Power Play',
    column: 'battle_event_powerplay',
  },
  bigbrawler: {
    id: 'bigbrawler',
    name: 'Big Brawler',
    column: 'battle_is_bigbrawler',
  },
})

const commonSlices = asSlice({
  ...metaSlices,
  ...playerSlices,
  ...battleSlices,
  ...brawlerSlices,
})

const brawlerBattleMeasurements = [
  /*
  mergedbattleMeasurements.trophySeasonEnd,
  mergedbattleMeasurements.timestamp,
  */
  mergedbattleMeasurements.trophyChange,
  mergedbattleMeasurements.winRate,
  mergedbattleMeasurements.winRateAdj,
  mergedbattleMeasurements.wins,
  commonMeasurements.picks,
  mergedbattleMeasurements.pickRate,
  commonMeasurements.useRate,
  mergedbattleMeasurements.starRate,
  mergedbattleMeasurements.rank,
  mergedbattleMeasurements.rank1Rate,
  mergedbattleMeasurements.duration,
  commonMeasurements.level,
  commonMeasurements.brawler,
]

const brawlerBattleDimensions = [
  commonDimensions.brawler,
  commonDimensions.season,
]

const brawlerBattleSlices = [
  commonSlices.season,
  commonSlices.seasonExact,
  commonSlices.trophies,
  commonSlices.brawler,
]

const brawlerBattleDefaultSliceValues: SliceValue = {
  season: ['month'],
  trophies: [],
  brawler: [],
}

const playerBrawlerDimensions = [
  commonDimensions.season,
  commonDimensions.timestamp,
  commonDimensions.day,
  commonDimensions.player,
  commonDimensions.brawler,
  commonDimensions.brawlerId,
]

const playerBrawlerMeasurements = [
  commonMeasurements.picks,
  commonMeasurements.pickRate,
  commonMeasurements.useRate,
  commonMeasurements.users,
  // commonMeasurements.season,
  commonMeasurements.timestamp,
  commonMeasurements.day,
  commonMeasurements.playerName,
  commonMeasurements.playerNameColor,
  commonMeasurements.playerIcon,
  commonMeasurements.playerTrophies,
  commonMeasurements.playerHighestTrophies,
  commonMeasurements.powerPlayPoints,
  commonMeasurements.highestPowerPlayPoints,
  commonMeasurements.expPoints,
  // commonMeasurements.championshipQualified,
  commonMeasurements.victories,
  commonMeasurements.soloVictories,
  commonMeasurements.duoVictories,
  // commonMeasurements.roboRumble,
  // commonMeasurements.bigBrawler,
  commonMeasurements.brawlers,
  // commonMeasurements.clubId,
  // commonMeasurements.clubTag,
  commonMeasurements.clubName,

  // commonMeasurements.brawlerId,
  commonMeasurements.brawler,
  commonMeasurements.power,
  commonMeasurements.trophies,
  commonMeasurements.highestTrophies,
  commonMeasurements.starpowers,
  commonMeasurements.gadgets,
]

const playerBrawlerSlices = [
  commonSlices.playerTag,
  commonSlices.playerName,
  commonSlices.season,
  commonSlices.trophies,
  commonSlices.brawlerId,
  commonSlices.brawler,
]

const playerBrawlerDefaultSliceValues = {
  playerTag: [],
  playerName: [],
  season: ['current'],
  trophies: [],
  brawlerId: [],
  brawlerName: [],
}

const cubes: Record<string, Cube> = {
  map: {
    id: 'map',
    table: 'map_meta',
    name: 'Map',
    hidden: false,
    dimensions: [
      ...brawlerBattleDimensions,
      commonDimensions.mode,
      commonDimensions.map,
    ],
    defaultDimensionsIds: ['brawler'],
    measurements: [
      ...brawlerBattleMeasurements,
    ],
    defaultMeasurementIds: ['winRateAdj'],
    metaColumns: ['picks', 'timestamp'],
    slices: [
      ...brawlerBattleSlices,
      commonSlices.mode,
      commonSlices.map,
      commonSlices.mapLike,
      commonSlices.mapNotLike,
      commonSlices.powerplay,
    ],
    defaultSliceValues: {
      ...brawlerBattleDefaultSliceValues,
      mode: [],
      map: [],
      mapLike: [],
      mapNotLike: [],
      powerplay: ['false'],
    },
  },
  starpower: {
    id: 'starpower',
    table: 'starpower_meta',
    name: 'Star Power',
    hidden: false,
    dimensions: [
      ...brawlerBattleDimensions,
      commonDimensions.brawlerId,
      commonDimensions.starpower,
    ],
    defaultDimensionsIds: ['brawler', 'starpower'],
    measurements: [
      ...Object.values(brawlerBattleMeasurements),
    ],
    defaultMeasurementIds: ['winRateAdj'],
    metaColumns: ['picks', 'timestamp'],
    slices: [
      ...brawlerBattleSlices,
      commonSlices.withStarpower,
    ],
    defaultSliceValues: {
      ...brawlerBattleDefaultSliceValues,
      withStarpower: ['true'],
    },
  },
  gadget: {
    id: 'gadget',
    table: 'gadget_meta',
    name: 'Gadget',
    hidden: false,
    dimensions: [
      ...brawlerBattleDimensions,
      commonDimensions.brawlerId,
      commonDimensions.gadget,
    ],
    defaultDimensionsIds: ['brawler', 'gadget'],
    measurements: [
      ...brawlerBattleMeasurements,
    ],
    defaultMeasurementIds: ['winRateAdj'],
    metaColumns: ['picks', 'timestamp'],
    slices: [
      ...brawlerBattleSlices,
      commonSlices.withGadget,
    ],
    defaultSliceValues: {
      ...brawlerBattleDefaultSliceValues,
      withGadget: ['true'],
    },
  },
  synergy: {
    id: 'synergy',
    table: 'synergy_meta',
    name: 'Synergies',
    hidden: false,
    dimensions: [
      ...brawlerBattleDimensions,
      commonDimensions.brawlerId,
      commonDimensions.ally,
      commonDimensions.allyId,
      commonDimensions.mode,
      commonDimensions.map,
    ],
    defaultDimensionsIds: ['brawler'],
    measurements: [
      ...brawlerBattleMeasurements,
    ],
    defaultMeasurementIds: ['winRateAdj'],
    metaColumns: ['picks', 'timestamp'],
    slices: [
      ...brawlerBattleSlices,
      commonSlices.mode,
      commonSlices.map,
      commonSlices.brawlerId,
      commonSlices.ally,
      commonSlices.allyId,
    ],
    defaultSliceValues: {
      ...brawlerBattleDefaultSliceValues,
      mode: [],
      map: [],
      ally: [],
    },
  },
  team: {
    id: 'team',
    table: 'team',
    name: 'Teams',
    hidden: false,
    dimensions: [
      commonDimensions.team,
    ],
    defaultDimensionsIds: ['team'],
    measurements: [
      commonMeasurements.wins,
      commonMeasurements.picks,
      commonMeasurements.winRate,
    ],
    defaultMeasurementIds: ['wins'],
    metaColumns: ['picks', 'timestamp'],
    slices: [
      ...brawlerBattleSlices,
      commonSlices.mode,
      commonSlices.map,
      commonSlices.brawlerId,
      commonSlices.ally,
      commonSlices.allyId,
    ],
    defaultSliceValues: {
      ...brawlerBattleDefaultSliceValues,
      mode: [],
      map: [],
      ally: [],
    },
  },
  player: {
    id: 'player',
    table: 'player',
    name: 'Leaderboard',
    hidden: true,
    dimensions: [
      commonDimensions.player,
    ],
    defaultDimensionsIds: ['player'],
    measurements: [
      commonMeasurements.playerName,
      commonMeasurements.playerIcon,
      commonMeasurements.expPoints,
      commonMeasurements.victories,
      commonMeasurements.soloVictories,
      commonMeasurements.duoVictories,
    ],
    defaultMeasurementIds: ['victories'],
    metaColumns: ['timestamp'],
    slices: [
      commonSlices.timestamp,
    ],
    defaultSliceValues: {
      timestamp: [],
    },
  },
  player_brawler: {
    id: 'player_brawler',
    table: 'player_brawler',
    name: 'Brawler Leaderboard',
    hidden: false,
    dimensions: [
      commonDimensions.player,
      commonDimensions.brawlerId,
    ],
    defaultDimensionsIds: ['player'],
    measurements: [
      commonMeasurements.playerName,
      commonMeasurements.playerIcon,
      commonMeasurements.brawler,
      commonMeasurements.highestTrophies,
    ],
    defaultMeasurementIds: ['highestTrophies'],
    metaColumns: ['timestamp'],
    slices: [
      commonSlices.timestamp,
    ],
    defaultSliceValues: {
      timestamp: [],
    },
  },
  brawler: {
    id: 'brawler',
    table: 'brawler',
    name: 'Raw Brawlers',
    hidden: true,
    dimensions: [
      ...playerBrawlerDimensions,
    ],
    defaultDimensionsIds: ['player'],
    measurements: [
      ...playerBrawlerMeasurements,
    ],
    defaultMeasurementIds: ['picks'],
    metaColumns: ['timestamp'],
    slices: [
      ...playerBrawlerSlices,
    ],
    defaultSliceValues: {
      ...playerBrawlerDefaultSliceValues,
    },
  },
  battle: {
    id: 'battle',
    table: 'battle',
    name: 'Raw Battles',
    hidden: true,
    dimensions: [
      ...playerBrawlerDimensions,
      commonDimensions.mode,
      commonDimensions.map,
      commonDimensions.powerplay,
    ],
    defaultDimensionsIds: ['player'],
    measurements: [
      ...playerBrawlerMeasurements,
      commonMeasurements.wins,
      commonMeasurements.duration,
      commonMeasurements.rank,
      commonMeasurements.rank1,
      commonMeasurements.trophyChange,
      commonMeasurements.winRate,
      // TODO
    ],
    defaultMeasurementIds: ['picks'],
    metaColumns: ['timestamp'],
    slices: [
      ...playerBrawlerSlices,
      commonSlices.mode,
      commonSlices.map,
      commonSlices.powerplay,
    ],
    defaultSliceValues: {
      ...playerBrawlerDefaultSliceValues,
      mode: [],
      map: [],
      powerplay: [],
    },
  },
}

export default cubes
