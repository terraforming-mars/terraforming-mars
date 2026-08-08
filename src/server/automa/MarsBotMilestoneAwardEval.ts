import {MilestoneName} from '../../common/ma/MilestoneName';
import {AwardName} from '../../common/ma/AwardName';
import {CardType} from '../../common/cards/CardType';
import {GlobalParameter} from '../../common/GlobalParameter';
import {IProjectCard} from '../cards/IProjectCard';
import {Board} from '../boards/Board';
import {IMarsBot} from './MarsBotCorpTypes';

/** Venus Next adds its track after the seven Mars tracks. */
const VENUS_TRACK = 7;

function trackPos(bot: IMarsBot, index: number): number {
  return bot.board.tracks[index]?.position ?? 0;
}

/** Every track position, including the Venus track when that expansion is in play. */
function trackPositions(bot: IMarsBot): Array<number> {
  return bot.board.tracks.map((track) => track.position);
}

/** The seven Mars tracks, leaving the Venus track out. */
function marsTrackPositions(bot: IMarsBot): Array<number> {
  return trackPositions(bot).slice(0, VENUS_TRACK);
}

function hasVenus(bot: IMarsBot): boolean {
  return bot.game.gameOptions.venusNextExtension;
}

function venusTrackPos(bot: IMarsBot): number {
  return bot.board.tracks.length > VENUS_TRACK ? bot.board.tracks[VENUS_TRACK].position : 0;
}

function allMarsTracksAtOrAbove(bot: IMarsBot, pos: number): boolean {
  return marsTrackPositions(bot).every((position) => position >= pos);
}

function anyTrackAtOrAbove(bot: IMarsBot, pos: number): boolean {
  return marsTrackPositions(bot).some((position) => position >= pos) ||
    (hasVenus(bot) && venusTrackPos(bot) >= pos);
}

function tracksAtOrAbove(bot: IMarsBot, pos: number): number {
  return trackPositions(bot).filter((position) => position >= pos).length;
}

function topThreeTracksSum(bot: IMarsBot): number {
  const [first, second, third] = marsTrackPositions(bot).sort((a, b) => b - a);
  return first + second + third;
}

function ownedTiles(bot: IMarsBot) {
  return bot.game.board.spaces.filter(Board.ownedBy(bot.player));
}

function tilesAdjacentToOcean(bot: IMarsBot): number {
  return ownedTiles(bot).filter((space) =>
    bot.game.board.getAdjacentSpaces(space).some(Board.isOceanSpace)).length;
}

function playedCards(bot: IMarsBot, include: (card: IProjectCard) => boolean): number {
  return bot.playedProjectCards.filter(include).length;
}

const isEvent = (card: IProjectCard) => card.type === CardType.EVENT;
const isGreenOrBlue = (card: IProjectCard) => !isEvent(card);
const isGreen = (card: IProjectCard) => card.type !== CardType.EVENT && card.type !== CardType.ACTIVE;

/**
 * How MarsBot claims a milestone. True when it qualifies, false when it does not, and
 * undefined for the milestones it reads off the board like any other player.
 */
type MilestoneEval = (bot: IMarsBot) => boolean | undefined;
export const MILESTONE_EVALS = new Map<MilestoneName, MilestoneEval>([
  // Tharsis
  ['Terraformer', (bot) => bot.player.terraformRating >= 35],
  ['Mayor', (bot) => bot.game.board.getCities(bot.player).length >= 3],
  ['Gardener', (bot) => bot.game.board.getGreeneries(bot.player).length >= 3],
  ['Builder', (bot) => trackPos(bot, 0) >= 8],
  ['Planner', (bot) => allMarsTracksAtOrAbove(bot, 4)],
  // Hellas
  ['Diversifier', (bot) => {
    if (!hasVenus(bot)) {
      return allMarsTracksAtOrAbove(bot, 3);
    }
    // With Venus the Venus track can stand in for one Mars track, so 7 of 8 is enough
    return tracksAtOrAbove(bot, 3) >= 7;
  }],
  ['Tactician', (bot) => bot.mcSupply >= 35],
  ['Polar Explorer', () => undefined],
  ['Energizer', (bot) => trackPos(bot, 4) >= 6],
  ['Rim Settler', (bot) => trackPos(bot, 1) >= 6 && trackPos(bot, 3) >= 6],
  // Elysium
  ['Generalist', (bot) => allMarsTracksAtOrAbove(bot, 2)],
  ['Specialist', (bot) => anyTrackAtOrAbove(bot, 10)],
  ['Ecologist', (bot) => trackPos(bot, 6) >= 4],
  ['Tycoon', (bot) => playedCards(bot, isGreenOrBlue) >= 15],
  ['Legend', (bot) => playedCards(bot, isEvent) >= 5],
  // Terra Cimmeria Nova
  ['Architect', (bot) => trackPos(bot, 3) >= 6],
  ['Coastguard', (bot) => tilesAdjacentToOcean(bot) >= 4],
  ['C. Forester', (bot) => trackPos(bot, 6) >= 10],
  // Vastitas Borealis Nova
  ['Agronomist', (bot) => trackPos(bot, 6) >= 4 && trackPos(bot, 3) >= 4],
  ['Engineer', (bot) => trackPos(bot, 4) + trackPos(bot, 3) >= 10],
  ['V. Spacefarer', (bot) => trackPos(bot, 1) >= 5],
  ['Geologist', () => undefined],
  ['Farmer', (bot) => (trackPos(bot, 3) >= 6 && trackPos(bot, 2) >= 6) || (trackPos(bot, 6) >= 6 && trackPos(bot, 3) >= 6)],
  // Modular
  ['Briber', (bot) => bot.mcSupply >= 20],
  ['Builder7', (bot) => trackPos(bot, 0) >= 7],
  ['Forester', (bot) => trackPos(bot, 6) >= 6],
  ['Fundraiser', (bot) => trackPos(bot, 4) >= 8],
  // Ocean tiles have no owner, so this counts the ocean steps MarsBot paid for, as the real milestone does
  ['Hydrologist', (bot) => bot.player.globalParameterSteps[GlobalParameter.OCEANS] >= 4],
  ['Landshaper', (bot) => bot.game.board.getCities(bot.player).length >= 1 &&
    bot.game.board.getGreeneries(bot.player).length >= 1 && trackPos(bot, 0) >= 5],
  ['Legend4', (bot) => playedCards(bot, isEvent) >= 4],
  ['Lobbyist', () => false],
  ['Merchant', (bot) => allMarsTracksAtOrAbove(bot, 2)],
  ['Metallurgist', (bot) => trackPos(bot, 0) + trackPos(bot, 1) >= 9],
  ['Philantropist', (bot) => playedCards(bot, (card) => card.getVictoryPoints(bot.player) >= 0) >= 5],
  ['Pioneer4', () => undefined],
  ['Planetologist', () => false],
  ['Producer', (bot) => topThreeTracksSum(bot) >= 16],
  ['Researcher', (bot) => trackPos(bot, 3) >= 4],
  ['Spacefarer4', (bot) => trackPos(bot, 1) >= 4],
  ['Sponsor', (bot) => playedCards(bot, (card) => card.cost >= 20) >= 3],
  ['Tactician4', (bot) => bot.mcSupply >= 30],
  ['Terraformer29', () => false],
  ['Terran5', (bot) => trackPos(bot, 5) >= 5],
  ['Thawer', (bot) => bot.temperatureRaises >= 5],
  ['Hoverlord', (bot) => bot.floaterCount >= 7],
  ['Trader', () => false],
  ['Tycoon10', (bot) => playedCards(bot, isGreenOrBlue) >= 10],
]);

/**
 * How MarsBot scores an award, or undefined for the awards it scores off the board like
 * any other player.
 */
type AwardEval = (bot: IMarsBot) => number | undefined;
export const AWARD_EVALS = new Map<AwardName, AwardEval>([
  // Tharsis
  ['Landlord', (bot) => ownedTiles(bot).length],
  ['Banker', (bot) => trackPos(bot, 0) + trackPos(bot, 2)],
  ['Scientist', (bot) => trackPos(bot, 3)],
  ['Thermalist', (bot) => trackPos(bot, 4) + 5],
  ['Miner', (bot) => trackPos(bot, 1) + 5],
  // Hellas
  ['Cultivator', () => undefined],
  ['Magnate', (bot) => playedCards(bot, isGreen)],
  ['Space Baron', (bot) => trackPos(bot, 1)],
  ['Excentric', (bot) => Math.floor(bot.mcSupply / 5)],
  ['Contractor', (bot) => trackPos(bot, 0)],
  // Elysium
  ['Celebrity', (bot) => playedCards(bot, (card) => card.cost >= 20)],
  ['Industrialist', (bot) => trackPos(bot, 4) + 5],
  ['Desert Settler', () => undefined],
  ['Estate Dealer', () => undefined],
  ['Benefactor', (bot) => Math.max(0, bot.player.terraformRating - 15)],
  // Terra Cimmeria
  ['Electrician', (bot) => trackPos(bot, 4)],
  ['Founder', () => undefined],
  ['Mogul', (bot) => Math.max(...trackPositions(bot)) * 2],
  ['Zoologist', (bot) => trackPos(bot, 6) + 5],
  ['Forecaster', (bot) => Math.floor(bot.mcSupply / 7)],
  // Utopia Planitia
  ['Suburbian', () => undefined],
  ['Investor', (bot) => trackPos(bot, 0) + trackPos(bot, 3)],
  ['Botanist', (bot) => Math.max(0, trackPos(bot, 6) - 2)],
  ['Incorporator', (bot) => playedCards(bot, (card) => card.cost <= 10)],
  ['Metropolist', () => undefined],
  // Vastitas Borealis Nova
  ['Traveller', (bot) => trackPos(bot, 0) + trackPos(bot, 3) + 5],
  ['Landscaper', () => undefined],
  ['Highlander', () => undefined],
  ['Manufacturer', (bot) => trackPos(bot, 0) + trackPos(bot, 4)],
  ['Blacksmith', (bot) => Math.max(trackPos(bot, 0), trackPos(bot, 1))],
  // Modular
  ['Administrator', (bot) => playedCards(bot, (card) => card.tags.length === 0) + 2],
  ['Collector', (bot) => tracksAtOrAbove(bot, 3)],
  ['Constructor', () => undefined],
  ['Politician', () => 5],
  ['Visionary', (bot) => {
    const positions = trackPositions(bot).sort((a, b) => a - b);
    // Venus in play means the second lowest counts instead of the lowest
    return (hasVenus(bot) ? positions[1] : positions[0]) * 2;
  }],
  ['Promoter', (bot) => trackPos(bot, 4)],
  // Venus Next
  ['Venuphile', (bot) => venusTrackPos(bot)],
]);
