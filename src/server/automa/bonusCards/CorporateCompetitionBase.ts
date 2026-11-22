import {BonusCardName} from '@/common/automa/BonusCardName';
import {BoardName} from '@/common/boards/BoardName';
import {SpaceType} from '@/common/boards/SpaceType';
import {CardType} from '@/common/cards/CardType';
import {Tag} from '@/common/cards/Tag';
import {AwardName} from '@/common/ma/AwardName';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {marsBotUsesBoardGoals} from '@/server/automa/MarsBotMilestoneAwardEval';
import {cardTagsIncludingEvent} from '@/server/automa/MarsBotTags';
import {MarsBotTilePlacer} from '@/server/automa/MarsBotTilePlacer';
import {MarsBotBonusCard} from '@/server/automa/bonusCards/MarsBotBonusCard';
import {maybeRemoveAnimalOrMicrobe} from '@/server/automa/bonusCards/bonusCardHelpers';
import {Board, isSpecialTileSpace} from '@/server/boards/Board';
import {Space} from '@/server/boards/Space';
import {IProjectCard} from '@/server/cards/IProjectCard';

/**
 * Base class for Corporate Competition cards.
 *
 * Every card can help with every award, since random awards bring other boards' awards into play.
 */
export abstract class CorporateCompetitionBase extends MarsBotBonusCard {
  public override resolve(marsBot: IMarsBot): boolean {
    if (marsBot.megacredits < 5) {
      marsBot.maybeDrawAndResolveBonusCard();
      return false;
    }
    const funded = marsBot.game.awards.filter((a) => marsBot.game.hasBeenFunded(a));

    // The closest award is the one the player leads by the least or is tied on. If MarsBot
    // leads every funded award, it is the one with the smallest gap.
    let resolved = false;
    const sorted = funded.map((a) => {
      const humanVal = a.getScore(marsBot.humanPlayer);
      const marsBotVal = marsBot.awardValue(a);
      return {award: a, margin: humanVal - marsBotVal};
    }).sort((a, b) => {
      if ((a.margin >= 0) !== (b.margin >= 0)) {
        return a.margin >= 0 ? -1 : 1;
      }
      return Math.abs(a.margin) - Math.abs(b.margin);
    });

    for (const {award} of sorted) {
      if (this.tryHelperAction(marsBot, award.name)) {
        // Forecaster's helper is free (rulebook C, p.12). The modular award list on p.16 says it gains MarsBot
        // 5 M€ instead, which reads like Administrator's line copied over.
        if (award.name === 'Forecaster') {
          marsBot.game.log('MarsBot (${0}): helps with ${1}', (b) => b.bonusCardName(this.name).award(award));
        } else {
          // A helper can itself cost M€ (a colony cube), so MarsBot may have less than 5 left
          const lost = marsBot.loseMc(5);
          marsBot.game.log('MarsBot (${0}): helps with ${1}, loses ${2}:r:mc:', (b) => b.bonusCardName(this.name).award(award).number(lost));
        }
        resolved = true;
        break;
      }
    }

    if (!resolved) {
      marsBot.maybeDrawAndResolveBonusCard();
    }
    return false;
  }

  /**
   * Takes the helper action Corporate Competition names for the award `awardName`.
   *
   * Returns false when the award has no helper or its helper can't be taken.
   */
  public tryHelperAction(marsBot: IMarsBot, awardName: AwardName): boolean {
    const board = marsBot.game.board;
    const marsBotBoard = marsBot.marsBotBoard;
    switch (awardName) {
    // Tharsis (B08)
    case 'Landlord': return marsBot.maybePlaceGreenery();
    case 'Banker': return tryAdvanceEitherTrack(marsBot, [Tag.BUILDING, Tag.EVENT], 'less');
    case 'Scientist': return tryAdvanceTrackOfTag(marsBot, Tag.SCIENCE);
    case 'Thermalist': return tryAdvanceTrackOfTag(marsBot, Tag.POWER);
    case 'Miner': return tryAdvanceTrackOfTag(marsBot, Tag.SPACE);
    // Hellas (B09)
    case 'Cultivator': return marsBot.maybePlaceGreenery();
    case 'Magnate': return tryRevealAndResolveCard(marsBot, this.name, (card) => card.type === CardType.AUTOMATED);
    case 'Space Baron': return tryAdvanceTrackOfTag(marsBot, Tag.SPACE);
    case 'Excentric': return maybeRemoveAnimalOrMicrobe(marsBot, this.name);
    case 'Contractor': return tryAdvanceTrackOfTag(marsBot, Tag.BUILDING);
    // Elysium (B10)
    case 'Celebrity': return tryRevealAndResolveCard(marsBot, this.name, (card) => card.cost >= 20);
    case 'Industrialist': return tryAdvanceTrackOfTag(marsBot, Tag.POWER);
    case 'Desert Settler': return marsBot.maybePlaceGreenery((space) => space.y > board.equatorRow);
    case 'Estate Dealer': return marsBot.maybePlaceGreenery((space) => isNextToOcean(board, space));
    case 'Benefactor': { marsBot.player.increaseTerraformRating(2); return true; }
    // Utopia Planitia (B11)
    case 'Suburbian': return marsBot.maybePlaceGreenery((space) => space.edge);
    case 'Investor': return tryAdvanceTrackOfTag(marsBot, Tag.EARTH);
    case 'Botanist': return tryAdvanceTrackOfTag(marsBot, Tag.PLANT);
    case 'Incorporator': return tryRevealAndResolveCard(marsBot, this.name, (card) => card.cost <= 10);
    case 'Metropolist': return tryPlaceCity(marsBot);
    // Terra Cimmeria (B12)
    case 'Electrician': return tryAdvanceTrackOfTag(marsBot, Tag.POWER);
    case 'Founder': return tryPlaceCity(marsBot, (space) => board.getAdjacentSpaces(space).some(isSpecialTileSpace));
    case 'Mogul': return tryAdvanceTrack(marsBot, marsBotBoard.getMostAdvancedTrackIndex());
    case 'A. Zoologist':
    case 'Zoologist': return tryAdvanceTrackOfTag(marsBot, Tag.ANIMAL);
    case 'Forecaster': return tryRevealAndResolveCard(marsBot, this.name, (card) => card.requirements.length > 0);
    // Vastitas Borealis (B13). Traveller follows B14, the card for random awards.
    case 'Traveller': return tryAdvanceEitherTrack(marsBot, [Tag.EARTH, Tag.JOVIAN], 'more');
    case 'Landscaper': return marsBot.maybePlaceGreenery();
    case 'Highlander': return marsBot.maybePlaceGreenery((space) => isHighlanderSpace(marsBot, space));
    case 'Promoter': return tryAdvanceTrackOfTag(marsBot, Tag.EVENT);
    case 'Blacksmith': return tryAdvanceEitherTrack(marsBot, [Tag.BUILDING, Tag.SPACE], 'more');
    // Milestones and awards (B14)
    case 'Administrator': return tryRevealAndResolveCard(marsBot, this.name, (card) => cardTagsIncludingEvent(card).length === 0, 5);
    case 'Biologist': return tryAdvanceTrackOfTag(marsBot, Tag.MICROBE);
    case 'Collector': return tryAdvanceTrack(marsBot, marsBotBoard.getLeastAdvancedTrackIndex());
    case 'Innovator': return tryRevealAndResolveCard(marsBot, this.name, () => true);
    case 'Constructor': return tryPlaceCity(marsBot);
    case 'Manufacturer': return tryAdvanceEitherTrack(marsBot, [Tag.BUILDING, Tag.POWER], 'less');
    case 'Physicist': return tryAdvanceEitherTrack(marsBot, [Tag.SCIENCE, Tag.SPACE], 'less');
    case 'Politician': return false;
    case 'Visionary': return tryAdvanceTrack(marsBot, marsBotBoard.getLeastAdvancedTrackIndex(true));
    // Venus Next adds this award to every Corporate Competition variant
    case 'Venuphile': return tryAdvanceTrackOfTag(marsBot, Tag.VENUS);
    default:
      return false;
    }
  }
}

/**
 * Advances MarsBot's track `trackIndex`, or returns false when the track is maxed.
 *
 * A helper that would advance a maxed track is impossible, so MarsBot skips its award instead of taking a Failed
 * Action (rulebook A, p.7).
 */
function tryAdvanceTrack(marsBot: IMarsBot, trackIndex: number): boolean {
  if (!marsBot.marsBotBoard.tracks[trackIndex].canAdvance()) {
    return false;
  }
  marsBot.advanceTrack(trackIndex);
  return true;
}

/** Advances the track that carries `tag`, or returns false when no track carries it or that track is maxed. */
function tryAdvanceTrackOfTag(marsBot: IMarsBot, tag: Tag): boolean {
  const trackIndex = marsBot.marsBotBoard.tagToTrack[tag];
  return trackIndex !== undefined && marsBot.marsBotBoard.tracks[trackIndex].canAdvance() &&
    marsBot.advanceTrackOfTag(tag);
}

/**
 * Advances the less or the more advanced of two tags' tracks, the upper track when tied.
 *
 * The player's cards see an advance of each named tag on that track (Saturn Systems for Traveller).
 */
function tryAdvanceEitherTrack(marsBot: IMarsBot, tags: [Tag, Tag], pick: 'less' | 'more'): boolean {
  const marsBotBoard = marsBot.marsBotBoard;
  const position = (trackIndex: number) => marsBotBoard.tracks[trackIndex].position;
  const trackIndexes = tags.map((tag) => marsBotBoard.tagToTrack[tag])
    .filter((trackIndex) => trackIndex !== undefined)
    .sort((a, b) => a - b);
  if (trackIndexes.length === 0) {
    return false;
  }
  const chosen = trackIndexes.reduce((best, trackIndex) => {
    const better = pick === 'less' ? position(trackIndex) < position(best) : position(trackIndex) > position(best);
    return better ? trackIndex : best;
  });
  if (!tryAdvanceTrack(marsBot, chosen)) {
    return false;
  }
  for (const tag of tags) {
    if (marsBotBoard.tagToTrack[tag] === chosen) {
      marsBot.notifyTagAdvance(tag);
    }
  }
  return true;
}

/**
 * Places a city for MarsBot on the best space that passes `filter`, and gains its placement M€.
 *
 * Returns false when no space passes.
 */
function tryPlaceCity(marsBot: IMarsBot, filter?: (space: Space) => boolean): boolean {
  const tilePlacer = new MarsBotTilePlacer(marsBot);
  const space = tilePlacer.findCitySpace(filter);
  if (space === undefined) {
    return false;
  }
  marsBot.game.addCity(marsBot.player, space);
  marsBot.gainMc(tilePlacer.getTotalPlacementMC(space));
  return true;
}

/**
 * Reveals cards until one passes `filter`, resolves it for MarsBot, then gains `mc` M€.
 *
 * Gives up only once the whole deck, discards included, has been seen.
 */
function tryRevealAndResolveCard(
  marsBot: IMarsBot, bonusCardName: BonusCardName, filter: (card: IProjectCard) => boolean, mc: number = 0): boolean {
  const game = marsBot.game;
  const [card] = game.projectDeck.drawByConditionOrThrow(game, 1, filter);
  if (card === undefined) {
    return false;
  }
  game.log('MarsBot (${0}): reveals and resolves ${1}', (b) => b.bonusCardName(bonusCardName).card(card));
  marsBot.resolveProjectCard(card);
  marsBot.gainMc(mc);
  return true;
}

/** Whether `space` is next to a placed ocean tile. */
function isNextToOcean(board: Board, space: Space): boolean {
  return board.getAdjacentSpaces(space).some(Board.isOceanSpace);
}

/**
 * Whether Highlander lets MarsBot's greenery go on `space`: not next to an ocean.
 *
 * Vastitas Borealis' Highlander also keeps away from the spaces reserved for an ocean (rulebook C, p.12). The
 * modular Highlander only looks at placed oceans (p.16).
 */
function isHighlanderSpace(marsBot: IMarsBot, space: Space): boolean {
  const board = marsBot.game.board;
  if (isNextToOcean(board, space)) {
    return false;
  }
  return !marsBotUsesBoardGoals(marsBot, BoardName.VASTITAS_BOREALIS_NOVA) ||
    !board.getAdjacentSpaces(space).some((adjacent) => adjacent.spaceType === SpaceType.OCEAN);
}
