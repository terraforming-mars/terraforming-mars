import {AddResourcesToCard} from '../deferredActions/AddResourcesToCard';
import {CardName} from '../common/cards/CardName';
import {CardType} from '../common/cards/CardType';
import {Game, GameOptions} from '../Game';
import {GrantResourceDeferred} from './GrantResourceDeferred';
import {ICard} from '../cards/ICard';
import {IPathfindersData} from './IPathfindersData';
import {PlaceCityTile} from '../deferredActions/PlaceCityTile';
import {PlaceGreeneryTile} from '../deferredActions/PlaceGreeneryTile';
import {PlaceMoonMineTile} from '../moon/PlaceMoonMineTile';
import {PlaceMoonRoadTile} from '../moon/PlaceMoonRoadTile';
import {PlaceOceanTile} from '../deferredActions/PlaceOceanTile';
import {PlanetaryTrack} from '../common/pathfinders/PlanetaryTrack';
import {PlanetaryTracks} from '../common/pathfinders/PlanetaryTracks';
import {Player} from '../Player';
import {Resources} from '../common/Resources';
import {ResourceType} from '../common/ResourceType';
import {Reward} from '../common/pathfinders/Reward';
import {SelectResourcesDeferred} from '../deferredActions/SelectResourcesDeferred';
import {SendDelegateToArea} from '../deferredActions/SendDelegateToArea';
import {Tags} from '../common/cards/Tags';
import {Turmoil} from '../turmoil/Turmoil';
import {VictoryPointsBreakdown} from '../VictoryPointsBreakdown';
import {GlobalEventName} from '../common/turmoil/globalEvents/GlobalEventName';

export const PLANETARY_TAGS = [Tags.VENUS, Tags.EARTH, Tags.MARS, Tags.JOVIAN, Tags.MOON];
const TRACKS = PlanetaryTracks.initialize();

export class PathfindersExpansion {
  private constructor() {
  }

  public static initialize(gameOptions: GameOptions): IPathfindersData {
    return {
      venus: gameOptions.venusNextExtension ? 0 : -1,
      earth: 0,
      mars: 0,
      jovian: 0,
      moon: gameOptions.moonExpansion ? 0 : -1,
      vps: [],
    };
  }

  public static onCardPlayed(player: Player, card: ICard) {
    if (player.game.gameOptions.pathfindersExpansion === false) {
      return;
    }
    const tags = card.tags;
    tags.forEach((tag) => {
      if (PLANETARY_TAGS.includes(tag)) {
        PathfindersExpansion.raiseTrack(tag, player);
      }
    });

    // Communication Center hook
    if (card.cardType === CardType.EVENT) {
      for (const p of player.game.getPlayersInGenerationOrder()) {
        for (const c of p.playedCards) {
          if (c.name === CardName.COMMUNICATION_CENTER) {
            p.addResourceTo(c, {qty: 1, log: true});
            return;
          }
        }
      }
    }
  }

  private static readonly trackMap: Map<Tags, PlanetaryTrack | undefined> = new Map([
    [Tags.VENUS, TRACKS.venus],
    [Tags.EARTH, TRACKS.earth],
    [Tags.MARS, TRACKS.mars],
    [Tags.JOVIAN, TRACKS.jovian],
    [Tags.MOON, TRACKS.moon],
  ]);

  public static raiseTrack(tag: Tags, player: Player, steps: number = 1): void {
    PathfindersExpansion.raiseTrackEssense(tag, player, player.game, steps, true);
  }

  public static raiseTrackForGlobalEvent(tag: Tags, name: GlobalEventName, game: Game, steps: number = 1, gainRewards: boolean = true): void {
    PathfindersExpansion.raiseTrackEssense(tag, name, game, steps, gainRewards);
  }

  private static raiseTrackEssense(tag: Tags, from: Player | GlobalEventName, game: Game, steps: number = 1, gainRewards: boolean = true): void {
    const data = game.pathfindersData;
    if (data === undefined) {
      return;
      // throw new Error('Pathfinders not defined');
    }

    const track = PathfindersExpansion.trackMap.get(tag);
    if (track === undefined) {
      return;
    }

    let space = IPathfindersData.getValue(data, tag);

    // Do not raise tracks unused this game.
    if (space === -1) {
      return;
    }

    const lastSpace = Math.min(track.spaces.length - 1, space + steps);
    const distance = lastSpace - space;
    if (distance === 0) return;

    if (from instanceof Player) {
      game.log('${0} raised the ${1} planetary track ${2} ${3}', (b) => {
        b.player(from).string(tag).number(distance).string(distance > 1 ? 'steps' : 'step');
      });
    } else {
      game.log('Global Event ${0} raised the ${1} planetary track ${2} ${3}', (b) => {
        b.globalEventName(from).string(tag).number(distance).string(distance > 1 ? 'steps' : 'step');
      });
    }

    // game.indentation++;
    while (space < lastSpace) {
      space++;
      IPathfindersData.setValue(data, tag, space);
      const rewards = track.spaces[space];

      // Can be false because of the Constant Struggle global event.
      if (gainRewards) {
        if (from instanceof Player) {
          rewards.risingPlayer.forEach((reward) => {
            PathfindersExpansion.grant(reward, from, tag);
          });
        }
        rewards.everyone.forEach((reward) => {
          game.getPlayersInGenerationOrder().forEach((p) => {
            PathfindersExpansion.grant(reward, p, tag);
          });
        });
        if (rewards.mostTags.length > 0) {
          const players = PathfindersExpansion.playersWithMostTags(
            tag,
            game.getPlayersInGenerationOrder(),
            (from instanceof Player) ? from : undefined);
          rewards.mostTags.forEach((reward) => {
            players.forEach((p) => {
              PathfindersExpansion.grant(reward, p, tag);
            });
          });
        }
      }
      // game.indentation--;
    }
  }

  private static grant(reward: Reward, player: Player, tag: Tags) {
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
      player.addResource(Resources.MEGACREDITS, 3, {log: true});
      break;
    case '6mc':
      player.addResource(Resources.MEGACREDITS, 6, {log: true});
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
        () => {
          game.defer(new SendDelegateToArea(player, 'Select where to send a delegate', {source: 'reserve'}));
        },
        () => {
          player.game.log('TODO: come up with some reward in place of Add Delegate.');
        });
      break;
    case 'energy':
      player.addResource(Resources.ENERGY, 1, {log: true});
      break;
    case 'energy_production':
      player.addProduction(Resources.ENERGY, 1, {log: true});
      break;
    case 'floater':
      game.defer(new AddResourcesToCard(player, ResourceType.FLOATER));
      break;
    case 'greenery':
      game.defer(new PlaceGreeneryTile(player));
      break;
    case 'heat':
      player.addResource(Resources.HEAT, 1, {log: true});
      break;
    case 'heat_production':
      player.addProduction(Resources.HEAT, 1, {log: true});
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
      player.addResource(Resources.PLANTS, 1, {log: true});
      break;
    case 'plant_production':
      player.addProduction(Resources.PLANTS, 1, {log: true});
      break;
    case 'resource':
      game.defer(new SelectResourcesDeferred(player, 1, 'Gain 1 resource for your Planetary track bonus.'));
      break;
    case 'steel':
      player.addResource(Resources.STEEL, 1, {log: true});
      break;
    case 'steel_production':
      player.addProduction(Resources.STEEL, 1, {log: true});
      break;
    case 'titanium':
      player.addResource(Resources.TITANIUM, 1, {log: true});
      break;
    case 'titanium_production':
      player.addProduction(Resources.TITANIUM, 1, {log: true});
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

  private static playersWithMostTags(tag: Tags, players: Array<Player>, activePlayer: Player | undefined): Array<Player> {
    const counts = players.map((player) => {
      // Wild tags only apply to a player taking an action.
      const includeWildTags = player.id === activePlayer?.id;
      const count = player.getTagCount(tag, includeWildTags ? 'default' : 'raw');
      return {player, count};
    });
    const max = Math.max(...counts.map((c) => c.count));
    const filtered = counts.filter((c) => c.count === max);
    const result = filtered.map((c) => c.player);
    return result;
  }

  public static calculateVictoryPoints(player: Player, victoryPointsBreakdown: VictoryPointsBreakdown) {
    const data = player.game.pathfindersData;
    if (data === undefined) {
      return;
    }
    data.vps
      .filter((vp) => vp.id === player.id)
      .forEach((vp) => victoryPointsBreakdown.setVictoryPoints('planetary tracks', vp.points, vp.tag));
  }
}
