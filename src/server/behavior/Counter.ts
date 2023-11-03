import {Units} from '../../common/Units';
import {TileType} from '../../common/TileType';
import {ICard} from '../cards/ICard';
import {IPlayer} from '../IPlayer';
import {Countable, CountableUnits} from './Countable';
import {hasIntersection} from '../../common/utils/utils';
import {MoonExpansion} from '../moon/MoonExpansion';
import {CardResource} from '../../common/CardResource';
import * as utils from '../../common/utils/utils'; // Since there's already a sum variable.

/**
 * Counts things in game state.
 */
export interface ICounter {
  count(countable: Countable, context?: 'default' | 'vps'): number;
  countUnits(countableUnits: Partial<CountableUnits>): Units;
}

/**
 * Counts things in game state.
 *
 * The constructor accepts the game state, which is essentially the player, and the card being played or acted upon.
 */
export class Counter {
  /**
   * True if the `this.card` is still in the player's hand.
   *
   * Many cards that counts tags have this "+1" that includes itself. That's because the
   * card isn't already in the playedCards pile. If it was, we wouldn't need this additional bit of
   * playedCard.
   *
   * The other part of why includeCard is interesting is sometimes this counting is related to a card
   * being replayed via Robotic Workforce. In that case, the card is already played.
   *
   * Counter is not meant to be kept between game states, so dispose of this after making calcuations.
   */
  private cardIsUnplayed: boolean;

  public constructor(private player: IPlayer, private card: ICard) {
    this.cardIsUnplayed = !player.cardIsInEffect(card.name);
  }

  public count(countable: Countable, context: 'default' | 'vps' = 'default'): number {
    if (typeof(countable) === 'number') {
      return countable;
    }

    let sum = countable.start ?? 0;

    const player = this.player;
    const card = this.card;
    const game = player.game;

    if (countable.cities !== undefined) {
      const p = (countable.all === false) ? player : undefined;
      switch (countable.cities.where) {
      case 'offmars':
        sum = game.board.getCitiesOffMars(p).length;
        break;
      case 'onmars':
        sum += game.board.getCitiesOnMars(p).length;
        break;
      case 'everywhere':
      default:
        sum += game.board.getCities(p).length;
      }
    }

    if (countable.oceans !== undefined) {
      sum += game.board.getOceanSpaces({upgradedOceans: true, wetlands: true}).length;
    }

    if (countable.floaters !== undefined) {
      sum += player.getResourceCount(CardResource.FLOATER);
    }

    if (countable.greeneries !== undefined) {
      const p = (countable.all === false) ? player : undefined;
      sum += game.board.getGreeneries(p).length;
    }
    if (countable.tag !== undefined) {
      const tag = countable.tag;

      if (Array.isArray(tag)) { // Multiple tags
        // These two error cases could be coded up, but they don't have a case just yet, and if they do come
        // up, better for the code to error than silently ignore it.
        if (this.cardIsUnplayed && hasIntersection(tag, card.tags)) {
          throw new Error(`Not supporting the case counting tags ${tag} when played card tags are ${card.tags}`);
        }
        if (countable.others === true) {
          throw new Error('Not counting others\' multiple Tags.');
        }

        sum += player.tags.multipleCount(tag);
      } else { // Single tag
        if (countable.others !== true) { // Just count player's own tags.
          sum += player.tags.count(tag, context === 'vps' ? 'raw' : context);

          if (this.cardIsUnplayed) { // And include the card itself if it isn't already on the tableau.
            sum += card.tags.filter((t) => t === tag).length;
          }
        }

        // When counting all the other players' tags, just count raw, so as to disregard their wild tags.
        if (countable.all === true || countable.others === true) {
          game.getPlayers()
            .filter((p) => p.id !== player.id)
            .forEach((p) => sum += p.tags.count(tag, 'raw'));
        }
      }
    }

    if (countable.resourcesHere !== undefined) {
      sum += card.resourceCount;
    }

    if (countable.colonies !== undefined) {
      player.game.colonies.forEach((colony) => {
        if (countable.all) {
          sum += colony.colonies.length;
        } else {
          sum += colony.colonies.filter((colony) => colony === player.id).length;
        }
      });
    }

    if (countable.moon !== undefined) {
      const moon = countable.moon;
      MoonExpansion.ifMoon(game, (moonData) => {
        if (moon.habitatRate) {
          sum += moonData.habitatRate;
        }
        if (moon.miningRate) {
          sum += moonData.miningRate;
        }
        if (moon.logisticRate) {
          sum += moonData.logisticRate;
        }
      });
      if (moon.habitat) {
        sum += MoonExpansion.spaces(game, TileType.MOON_HABITAT, {surfaceOnly: true}).length;
      }
      if (moon.mine) {
        sum += MoonExpansion.spaces(game, TileType.MOON_MINE, {surfaceOnly: true}).length;
      }
      if (moon.road) {
        sum += MoonExpansion.spaces(game, TileType.MOON_ROAD, {surfaceOnly: true}).length;
      }
    }

    if (countable.underworld !== undefined) {
      const underworld = countable.underworld;
      if (underworld.corruption !== undefined) {
        if (countable.all === true) {
          sum += utils.sum(game.getPlayers().map((p) => p.underworldData.corruption));
        } else {
          sum += player.underworldData.corruption;
        }
      }
      if (underworld.excavationMarkers !== undefined) {
        if (countable.all) {
          sum += player.game.board.spaces.filter((space) => space.excavator !== undefined).length;
        } else {
          sum += player.game.board.spaces.filter((space) => space.excavator === player).length;
        }
      }
    }

    if (countable.each !== undefined) {
      sum = sum * countable.each;
    }
    if (countable.per !== undefined) {
      sum = Math.floor(sum / countable.per);
    }
    return sum;
  }

  public countUnits(countableUnits: Partial<CountableUnits>): Units {
    const units: Units = {...Units.EMPTY};
    for (const key of Object.keys(units)) {
      const safeKey = key as keyof CountableUnits;
      const countable = countableUnits[safeKey] ?? 0;
      units[safeKey] = this.count(countable);
    }
    return units;
  }
}
