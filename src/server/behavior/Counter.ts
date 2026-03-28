import * as utils from '../../common/utils/utils'; // Since there's already a sum variable.
import {Units} from '../../common/Units';
import {TileType} from '../../common/TileType';
import {ICard} from '../cards/ICard';
import {IPlayer} from '../IPlayer';
import {Countable, CountableUnits} from './Countable';
import {MoonExpansion} from '../moon/MoonExpansion';
import {CardResource} from '../../common/CardResource';
import {Space} from '../boards/Space';
import {once} from './Lazy';

/**
 * Counts things in game state.
 */
export interface ICounter {
  /**
   * Count using the applied countable definition.
   *
   * context: describes what to do in different counting contexts. Most of the time 'default' is correct, but
   * when counting victory points, use 'vp'. 'vp' applies to counting victory points. As of now, this only applies
   * to how it counts wild tags and other substitutions that only apply during an action.
   */
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
    this.cardIsUnplayed = !player.tableau.has(card.name);
  }

  private getAdjacentSpaces(countable: Exclude<Countable, number>): ReadonlyArray<Space> {
    if (countable.nextToThis === undefined) {
      return [];
    }

    const cardName = this.card.name;
    const game = this.player.game;
    const board = game.board;
    const cardSpace = board.getSpaceByTileCard(cardName);
    if (cardSpace !== undefined) {
      return board.getAdjacentSpaces(cardSpace);
    }
    if (game.moonData) {
      const board = game.moonData.moon;
      const moonSpace = board.getSpaceByTileCard(cardName);
      if (moonSpace !== undefined) {
        return board.getAdjacentSpaces(moonSpace);
      }
    }

    return [];
  }

  public count(countable: Countable, context: 'default' | 'vps' = 'default'): number {
    if (typeof(countable) === 'number') {
      return countable;
    }

    let sum = countable.start ?? 0;

    const player = this.player;
    const card = this.card;
    const game = player.game;

    // This is an advanced special case for counting spaces on the boards.
    // Some cards with special tiles reward VP for spaces adjacent to the
    // placed tile. In order to support the |nextToThis| attribute,
    // this computes spaces next to the tile placed with the card,
    // and returns either the counted spaces, or only those adjacent
    // to the tile.
    //
    // adjacentSpaces is of type Lazy, so adjacent spaces are counted once,
    // and if it's never used, it's never counted.
    const adjacentSpaces = once(() => this.getAdjacentSpaces(countable));
    const maybeAdjacentSpaces =(spaces: ReadonlyArray<Space>): ReadonlyArray<Space> => {
      if (countable.nextToThis === undefined) {
        return spaces;
      }
      return utils.intersection(spaces, adjacentSpaces());
    };

    if (countable.cities !== undefined) {
      const p = (countable.all === false) ? player : undefined;
      switch (countable.cities.where) {
      case 'offmars':
        sum += maybeAdjacentSpaces(game.board.getCitiesOffMars(p)).length;
        break;
      case 'onmars':
        sum += maybeAdjacentSpaces(game.board.getCitiesOnMars(p)).length;
        break;
      case 'everywhere':
      default:
        sum += maybeAdjacentSpaces(game.board.getCities(p)).length;
      }
    }

    if (countable.oceans !== undefined) {
      sum += maybeAdjacentSpaces(game.board.getOceanSpaces({upgradedOceans: true, wetlands: true})).length;
    }

    if (countable.floaters !== undefined) {
      sum += player.getResourceCount(CardResource.FLOATER);
    }

    if (countable.greeneries !== undefined) {
      const p = (countable.all === false) ? player : undefined;
      sum += maybeAdjacentSpaces(game.board.getGreeneries(p)).length;
    }
    if (countable.tag !== undefined) {
      const tag = countable.tag;

      if (Array.isArray(tag)) { // Multiple tags
        // These two error cases could be coded up, but they don't have a case just yet, and if they do come
        // up, better for the code to error than silently ignore it.
        if (countable.others === true) {
          throw new Error('Not counting others\' multiple Tags.');
        }

        sum += player.tags.multipleCount(tag);
        if (this.cardIsUnplayed) { // And include the card itself if it isn't already on the tableau.
          sum += player.tags.cardTagCount(card, tag);
        }
      } else { // Single tag
        if (countable.others !== true) { // Just count player's own tags.
          sum += player.tags.count(tag, context === 'vps' ? 'raw' : context);

          if (this.cardIsUnplayed) { // And include the card itself if it isn't already on the tableau.
            sum += card.tags.filter((t) => t === tag).length;
          }
        }

        // When counting all the other players' tags, just count raw, so as to disregard their wild tags.
        if (countable.all === true || countable.others === true) {
          player.opponents
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
        sum += maybeAdjacentSpaces(MoonExpansion.spaces(game, TileType.MOON_HABITAT, {surfaceOnly: true})).length;
      }
      if (moon.mine) {
        sum += maybeAdjacentSpaces(MoonExpansion.spaces(game, TileType.MOON_MINE, {surfaceOnly: true})).length;
      }
      if (moon.road) {
        sum += maybeAdjacentSpaces(MoonExpansion.spaces(game, TileType.MOON_ROAD, {surfaceOnly: true})).length;
      }
    }

    if (countable.underworld !== undefined) {
      const underworld = countable.underworld;
      if (underworld.corruption !== undefined) {
        if (countable.all === true) {
          sum += utils.sum(game.players.map((p) => p.underworldData.corruption));
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
      if (underworld.undergroundTokens !== undefined) {
        if (countable.all) {
          for (const p of game.players) {
            sum += p.underworldData.tokens.length;
          }
        } else {
          sum += player.underworldData.tokens.length;
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
