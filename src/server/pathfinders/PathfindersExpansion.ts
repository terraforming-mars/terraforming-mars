import {AddResourcesToCard} from '../deferredActions/AddResourcesToCard';
import {CardName} from '../../common/cards/CardName';
import {IGame} from '../IGame';
import {GrantResourceDeferred} from './GrantResourceDeferred';
import {ICard} from '../cards/ICard';
import {PathfindersData, PlanetaryTag, isPlanetaryTag} from './PathfindersData';
import {PlaceCityTile} from '../deferredActions/PlaceCityTile';
import {PlaceGreeneryTile} from '../deferredActions/PlaceGreeneryTile';
import {PlaceMoonMineTile} from '../moon/PlaceMoonMineTile';
import {PlaceMoonRoadTile} from '../moon/PlaceMoonRoadTile';
import {PlaceOceanTile} from '../deferredActions/PlaceOceanTile';
import {PlanetaryTracks} from '../../common/pathfinders/PlanetaryTracks';
import {IPlayer} from '../IPlayer';
import {Resource} from '../../common/Resource';
import {CardResource} from '../../common/CardResource';
import {Reward} from '../../common/pathfinders/Reward';
import {GainResources} from '../inputs/GainResources';
import {SendDelegateToArea} from '../deferredActions/SendDelegateToArea';
import {Tag} from '../../common/cards/Tag';
import {Turmoil} from '../turmoil/Turmoil';
import {VictoryPointsBreakdownBuilder} from '../game/VictoryPointsBreakdownBuilder';
import {GlobalEventName} from '../../common/turmoil/globalEvents/GlobalEventName';
import {Priority} from '../deferredActions/Priority';

export const TRACKS = PlanetaryTracks.initialize();

export class PathfindersExpansion {
  private constructor() {
  }

  public static initialize(game: IGame): PathfindersData {
    return {
      venus: game.tags.includes(Tag.VENUS) ? 0 : -1,
      earth: 0,
      mars: 0,
      jovian: 0,
      moon: game.tags.includes(Tag.MOON) ? 0 : -1,
      vps: [],
    };
  }

  public static onCardPlayed(player: IPlayer, card: ICard) {
    if (player.game.gameOptions.pathfindersExpansion === false) {
      return;
    }
    const tags = card.tags;
    tags.forEach((tag) => {
      if (isPlanetaryTag(tag)) {
        PathfindersExpansion.raiseTrack(tag, player);
      }
    });
  }

  public static raiseTrack(tag: PlanetaryTag, player: IPlayer, steps: number = 1): void {
    PathfindersExpansion.raiseTrackEssense(tag, player, player.game, steps, true);
  }

  public static raiseTrackForGlobalEvent(tag: PlanetaryTag, name: GlobalEventName, game: IGame, steps: number = 1, gainRewards: boolean = true): void {
    PathfindersExpansion.raiseTrackEssense(tag, name, game, steps, gainRewards);
  }

  private static raiseTrackEssense(tag: PlanetaryTag, from: IPlayer | GlobalEventName, game: IGame, steps: number = 1, gainRewards: boolean = true): void {
    const data = game.pathfindersData;
    if (data === undefined) {
      return;
      // throw new Error('Pathfinders not defined');
    }

    const track = TRACKS[tag];
    if (track === undefined) {
      return;
    }

    let space = data[tag];

    // Do not raise tracks unused this game.
    if (space === -1) {
      return;
    }

    const lastSpace = Math.min(track.spaces.length - 1, space + steps);
    const distance = lastSpace - space;
    if (distance === 0) return;

    if (typeof(from) === 'object') {
      game.log('${0} raised the ${1} planetary track ${2} step(s)', (b) => {
        b.player(from).string(tag).number(distance);
      });
    } else {
      game.log('Global Event ${0} raised the ${1} planetary track ${2} step(s)', (b) => {
        b.globalEventName(from).string(tag).number(distance);
      });
    }

    // game.indentation++;
    while (space < lastSpace) {
      space++;
      data[tag] = space;
      const rewards = track.spaces[space];

      // Can be false because of the Constant Struggle global event.
      if (gainRewards) {
        if (typeof(from) === 'object') {
          rewards.risingPlayer.forEach((reward) => {
            PathfindersExpansion.grant(reward, from, tag);
          });
        }
      }
      rewards.everyone.forEach((reward) => {
        game.getPlayers().forEach((p) => {
          PathfindersExpansion.grant(reward, p, tag);
        });
      });
      if (rewards.mostTags.length > 0) {
        const players = PathfindersExpansion.playersWithMostTags(
          tag,
          game.getPlayers().slice(),
          (typeof(from) === 'object') ? from : undefined);
        rewards.mostTags.forEach((reward) => {
          players.forEach((p) => {
            PathfindersExpansion.grant(reward, p, tag);
          });
        });
      }
      // game.indentation--;
    }
  }

  /**
   * Grant the specified award.
   *
   * @param reward the reward to grant
   * @param player the player gaining the reward (which may not be the same as the player who triggers the reward)
   * @param tag the tag associated with the reward (used for logging VP rewards.)
   */
  public static grant(reward: Reward, player: IPlayer, tag: PlanetaryTag): void {
    const game = player.game;

    switch (reward) {
    case '1vp':
      game.pathfindersData?.vps.push({id: player.id, tag, points: 1});
      game.log('${0} has the most ${1} tags and earns 1VP', (b) => b.player(player).string(tag));
      break;
    case '2vp':
      game.pathfindersData?.vps.push({id: player.id, tag, points: 2});
      game.log('${0} has the most ${1} tags and earns 2VP', (b) => b.player(player).string(tag));
      break;
    case '3mc':
      player.stock.add(Resource.MEGACREDITS, 3, {log: true});
      break;
    case '6mc':
      player.stock.add(Resource.MEGACREDITS, 6, {log: true});
      break;
    case 'any_resource':
      game.defer(new GrantResourceDeferred(player, false));
      break;
    case 'card':
      player.drawCard();
      break;
    case 'city':
      game.defer(new PlaceCityTile(player));
      break;
    case 'delegate':
      Turmoil.ifTurmoilElse(game,
        (turmoil) => {
          if (turmoil.hasDelegatesInReserve(player)) {
            game.defer(new SendDelegateToArea(player));
          }
        },
        () => player.stock.add(Resource.MEGACREDITS, 3, {log: true}));
      break;
    case 'energy':
      player.stock.add(Resource.ENERGY, 1, {log: true});
      break;
    case 'energy_production':
      player.production.add(Resource.ENERGY, 1, {log: true});
      break;
    case 'floater':
      game.defer(new AddResourcesToCard(player, CardResource.FLOATER));
      break;
    case 'greenery':
      game.defer(new PlaceGreeneryTile(player));
      break;
    case 'heat':
      player.stock.add(Resource.HEAT, 1, {log: true});
      break;
    case 'heat_production':
      player.production.add(Resource.HEAT, 1, {log: true});
      break;
    case 'moon_mine':
      game.defer(new PlaceMoonMineTile(player));
      break;
    case 'moon_road':
      game.defer(new PlaceMoonRoadTile(player));
      break;
    case 'ocean':
      game.defer(new PlaceOceanTile(player));
      break;
    case 'plant':
      player.stock.add(Resource.PLANTS, 1, {log: true});
      break;
    case 'plant_production':
      player.production.add(Resource.PLANTS, 1, {log: true});
      break;
    case 'resource':
      player.defer(new GainResources(player, 1, 'Gain 1 resource for your Planetary track bonus.'));
      break;
    case 'steel':
      player.stock.add(Resource.STEEL, 1, {log: true});
      break;
    case 'steel_production':
      player.production.add(Resource.STEEL, 1, {log: true});
      break;
    case 'titanium':
      player.stock.add(Resource.TITANIUM, 1, {log: true});
      break;
    case 'titanium_production':
      player.production.add(Resource.TITANIUM, 1, {log: true});
      break;
    case 'tr':
      player.increaseTerraformRating();
      break;
    case 'venus_scale':
      if (game.gameOptions.venusNextExtension) {
        game.increaseVenusScaleLevel(player, 1);
      } else {
        player.game.log('TODO: come up with some reward in place of Increase Venus Scale.');
      }
      break;
    default:
      throw new Error('Unknown reward: ' + reward);
    }
  }

  private static playersWithMostTags(tag: Tag, players: Array<IPlayer>, activePlayer: IPlayer | undefined): Array<IPlayer> {
    const counts = players.map((player) => {
      // Wild tags only apply to a player taking an action.
      const includeWildTags = player.id === activePlayer?.id;
      const count = player.tags.count(tag, includeWildTags ? 'default' : 'raw');
      return {player, count};
    });
    const max = Math.max(...counts.map((c) => c.count));
    const filtered = counts.filter((c) => c.count === max);
    const result = filtered.map((c) => c.player);
    return result;
  }

  public static calculateVictoryPoints(player: IPlayer, builder: VictoryPointsBreakdownBuilder) {
    const data = player.game.pathfindersData;
    if (data === undefined) {
      return;
    }
    data.vps
      .filter((vp) => vp.id === player.id)
      .forEach((vp) => builder.setVictoryPoints('planetary tracks', vp.points, vp.tag));
  }

  public static addToSolBank(player: IPlayer) {
    const solBank = player.getCorporation(CardName.SOLBANK);
    if (solBank !== undefined) {
      player.defer(
        () => player.addResourceTo(solBank, {qty: 1, log: true}),
        Priority.GAIN_RESOURCE_OR_PRODUCTION);
    }
  }
}
