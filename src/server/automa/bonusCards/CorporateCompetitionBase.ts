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
 * The Corporate Competition helpers that don't cost MarsBot 5 M€ (rulebook C, p.12).
 *
 * The modular award list on p.16 says Forecaster gains MarsBot 5 M€ instead, which reads like Administrator's
 * line copied over. This follows p.12.
 */
const FREE_HELPER_AWARDS: ReadonlyArray<AwardName> = ['Forecaster'];

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
        if (FREE_HELPER_AWARDS.includes(award.name)) {
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
    const game = marsBot.game;
    const marsBotBoard = marsBot.marsBotBoard;
    const board = game.board;
    const tilePlacer = new MarsBotTilePlacer(marsBot);
    // A helper that would advance a maxed track is impossible, so MarsBot skips its award
    // instead of taking a Failed Action (rulebook A, p.7).
    const advance = (trackIndex: number) => {
      if (!marsBotBoard.tracks[trackIndex].canAdvance()) {
        return false;
      }
      marsBot.advanceTrack(trackIndex);
      return true;
    };
    const advanceTrackOf = (tag: Tag) => {
      const trackIndex = marsBotBoard.tagToTrack[tag];
      return trackIndex !== undefined && marsBotBoard.tracks[trackIndex].canAdvance() &&
        marsBot.advanceTrackOfTag(tag);
    };
    // Advances the less or the more advanced of two tags' tracks, the upper track when tied. The
    // player's cards see an advance of each named tag on that track (Saturn Systems for Traveller).
    const advanceTrackOfEither = (tags: [Tag, Tag], pick: 'less' | 'more') => {
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
      if (!advance(chosen)) {
        return false;
      }
      for (const tag of tags) {
        if (marsBotBoard.tagToTrack[tag] === chosen) {
          marsBot.notifyTagAdvance(tag);
        }
      }
      return true;
    };
    const placeCity = (filter?: (space: Space) => boolean) => {
      const space = tilePlacer.findCitySpace(filter);
      if (space) {
        game.addCity(marsBot.player, space);
        marsBot.gainMc(tilePlacer.getTotalPlacementMC(space));
        return true;
      }
      return false;
    };
    // Reveals cards until one passes `filter`, resolves it, then gains `mc` M€. It gives up only
    // once the whole deck, discards included, has been seen.
    const revealAndResolveCard = (filter: (card: IProjectCard) => boolean, mc: number = 0) => {
      const [card] = game.projectDeck.drawByConditionOrThrow(game, 1, filter);
      if (card === undefined) {
        return false;
      }
      game.log('MarsBot (${0}): reveals and resolves ${1}', (b) => b.bonusCardName(this.name).card(card));
      marsBot.resolveProjectCard(card);
      marsBot.gainMc(mc);
      return true;
    };
    const nextToOcean = (space: Space) => board.getAdjacentSpaces(space).some(Board.isOceanSpace);
    // Vastitas Borealis' Highlander also keeps away from the spaces reserved for an ocean (rulebook C, p.12).
    // The modular Highlander only looks at placed oceans (p.16).
    const vastitasRules = marsBotUsesBoardGoals(marsBot, BoardName.VASTITAS_BOREALIS_NOVA);
    const nextToReservedOcean = (space: Space) =>
      board.getAdjacentSpaces(space).some((s) => s.spaceType === SpaceType.OCEAN);
    const nextToSpecialTile = (space: Space) => board.getAdjacentSpaces(space).some(isSpecialTileSpace);
    const onEdge = (space: Space) => space.edge;
    const southOfEquator = (space: Space) => space.y > board.equatorRow;

    switch (awardName) {
    // Tharsis (B08)
    case 'Landlord': return marsBot.maybePlaceGreenery();
    case 'Banker': return advanceTrackOfEither([Tag.BUILDING, Tag.EVENT], 'less');
    case 'Scientist': return advanceTrackOf(Tag.SCIENCE);
    case 'Thermalist': return advanceTrackOf(Tag.POWER);
    case 'Miner': return advanceTrackOf(Tag.SPACE);
    // Hellas (B09)
    case 'Cultivator': return marsBot.maybePlaceGreenery();
    case 'Magnate': return revealAndResolveCard((c) => c.type === CardType.AUTOMATED);
    case 'Space Baron': return advanceTrackOf(Tag.SPACE);
    case 'Excentric': return maybeRemoveAnimalOrMicrobe(marsBot, this.name);
    case 'Contractor': return advanceTrackOf(Tag.BUILDING);
    // Elysium (B10)
    case 'Celebrity': return revealAndResolveCard((c) => c.cost >= 20);
    case 'Industrialist': return advanceTrackOf(Tag.POWER);
    case 'Desert Settler': return marsBot.maybePlaceGreenery(southOfEquator);
    case 'Estate Dealer': return marsBot.maybePlaceGreenery(nextToOcean);
    case 'Benefactor': { marsBot.player.increaseTerraformRating(2); return true; }
    // Utopia Planitia (B11)
    case 'Suburbian': return marsBot.maybePlaceGreenery(onEdge);
    case 'Investor': return advanceTrackOf(Tag.EARTH);
    case 'Botanist': return advanceTrackOf(Tag.PLANT);
    case 'Incorporator': return revealAndResolveCard((c) => c.cost <= 10);
    case 'Metropolist': return placeCity();
    // Terra Cimmeria (B12)
    case 'Electrician': return advanceTrackOf(Tag.POWER);
    case 'Founder': return placeCity(nextToSpecialTile);
    case 'Mogul': return advance(marsBotBoard.getMostAdvancedTrackIndex());
    case 'A. Zoologist':
    case 'Zoologist': return advanceTrackOf(Tag.ANIMAL);
    case 'Forecaster': return revealAndResolveCard((c) => c.requirements.length > 0);
    // Vastitas Borealis (B13). Traveller follows B14, the card for random awards.
    case 'Traveller': return advanceTrackOfEither([Tag.EARTH, Tag.JOVIAN], 'more');
    case 'Landscaper': return marsBot.maybePlaceGreenery();
    case 'Highlander': return marsBot.maybePlaceGreenery((space) => !nextToOcean(space) && !(vastitasRules && nextToReservedOcean(space)));
    case 'Promoter': return advanceTrackOf(Tag.EVENT);
    case 'Blacksmith': return advanceTrackOfEither([Tag.BUILDING, Tag.SPACE], 'more');
    // Milestones and awards (B14)
    case 'Administrator': return revealAndResolveCard((c) => cardTagsIncludingEvent(c).length === 0, 5);
    case 'Biologist': return advanceTrackOf(Tag.MICROBE);
    case 'Collector': return advance(marsBotBoard.getLeastAdvancedTrackIndex());
    case 'Innovator': return revealAndResolveCard(() => true);
    case 'Constructor': return placeCity();
    case 'Manufacturer': return advanceTrackOfEither([Tag.BUILDING, Tag.POWER], 'less');
    case 'Physicist': return advanceTrackOfEither([Tag.SCIENCE, Tag.SPACE], 'less');
    case 'Politician': return false;
    case 'Visionary': return advance(marsBotBoard.getLeastAdvancedTrackIndex(true));
    // Venus Next adds this award to every Corporate Competition variant
    case 'Venuphile': return advanceTrackOf(Tag.VENUS);
    default:
      return false;
    }
  }
}
