// import {AddResourcesToCard} from '../deferredActions/AddResourcesToCard';
// import {CardName} from '../CardName';
// import {CardType} from '../cards/CardType';
// import {CommunicationCenter} from '../cards/pathfinders/CommunicationCenter';
// import {GameOptions} from '../Game';
// import {GrantWildResourceDeferred} from './GrantWildResourceDeferred';
// import {ICard} from '../cards/ICard';
// import {IPathfindersData} from './IPathfindersData';
// import {PlaceCityTile} from '../deferredActions/PlaceCityTile';
// import {PlaceGreeneryTile} from '../deferredActions/PlaceGreeneryTile';
// import {PlaceMoonMineTile} from '../moon/PlaceMoonMineTile';
// import {PlaceMoonRoadTile} from '../moon/PlaceMoonRoadTile';
// import {PlaceOceanTile} from '../deferredActions/PlaceOceanTile';
// import {PlanetaryTrack} from './PlanetaryTrack';
// import {PlanetaryTracks} from './PlanetaryTracks';
import {Player} from '../Player';
// import {Resources} from '../Resources';
// import {ResourceType} from '../ResourceType';
// import {Reward} from './Reward';
// import {SelectResourcesDeferred} from '../deferredActions/SelectResourcesDeferred';
// import {SendDelegateToArea} from '../deferredActions/SendDelegateToArea';
import {Tags} from '../cards/Tags';
// import {Turmoil} from '../turmoil/Turmoil';

// const VALID_TAGS = [Tags.VENUS, Tags.EARTH, Tags.MARS, Tags.JOVIAN, Tags.MOON];
// const TRACKS = PlanetaryTracks.initialize();

export class PathfindersExpansion {
  private constructor() {
  }

  // public static initialize(gameOptions: GameOptions): IPathfindersData {
  //   return {
  //     venus: gameOptions.venusNextExtension ? 0 : -1,
  //     earth: 0,
  //     mars: 0,
  //     jovian: 0,
  //     moon: gameOptions.moonExpansion ? 0 : -1,
  //   };
  // }

  // public static onCardPlayed(player: Player, card: ICard) {
  //   if (player.game.gameOptions.pathfindersExpansion === false) {
  //     return;
  //   }
  //   const tags = card.tags;
  //   tags.forEach((tag) => {
  //     if (VALID_TAGS.includes(tag)) {
  //       PathfindersExpansion.raiseTrack(tag, player);
  //     }
  //   });

  //   // Communication Center hook
  //   if (card.cardType === CardType.EVENT) {
  //     player.game.getPlayers().forEach((p) => {
  //       p.playedCards.forEach((c) => {
  //         if (c.name === CardName.COMMUNICATION_CENTER) {
  //           (c as CommunicationCenter).bonus(p);
  //         }
  //       });
  //     });
  //   }
  // }

  public static raiseTrack(_tag: Tags, _player: Player, steps: number = 1): void {
    throw new Error('Not implemented: ' + steps);
  }

  //   const data = player.game.pathfindersData;
  //   if (data === undefined) {
  //     throw new Error('Pathfinders not defined');
  //   }

  //   const game = player.game;
  //   game.log('${0} raised the ${1} planetary track ${2} ${3}', (b) => {
  //     b.player(player).string(tag).number(steps).string(steps > 1 ? 'steps' : 'step');
  //   });

  //   for (let count = 0; count < steps; count++) {
  //     let track: PlanetaryTrack | undefined = undefined;
  //     let space = 0;

  //     switch (tag) {
  //     case Tags.VENUS:
  //       track = TRACKS.venus;
  //       space = ++data.venus;
  //       break;
  //     case Tags.EARTH:
  //       track = TRACKS.earth;
  //       space = ++data.earth;
  //       break;
  //     case Tags.MARS:
  //       track = TRACKS.mars;
  //       space = ++data.mars;
  //       break;
  //     case Tags.JOVIAN:
  //       track = TRACKS.jovian;
  //       space = ++data.jovian;
  //       break;
  //     case Tags.MOON:
  //       track = TRACKS.moon;
  //       space = ++data.moon;
  //       break;
  //     }

  //     if (track === undefined) {
  //       return;
  //     }

  //     if (space >= track.spaces.length) {
  //       return;
  //     }
  //     const rewards = track.spaces[space];

  //     rewards.risingPlayer.forEach((reward) => {
  //       PathfindersExpansion.grant(reward, player);
  //     });
  //     rewards.everyone.forEach((reward) => {
  //       game.getPlayers().forEach((p) => {
  //         PathfindersExpansion.grant(reward, p);
  //       });
  //     });
  //     if (rewards.mostTags.length > 0) {
  //       // Wild tags probably only apply to the active player, not to the player who might have the wild tag.
  //       const players = PathfindersExpansion.playersWithMostTags(tag, player);
  //       rewards.mostTags.forEach((reward) => {
  //         players.forEach((p) => {
  //           PathfindersExpansion.grant(reward, p);
  //         });
  //       });
  //     }
  //   }
  // }

  // private static grant(reward: Reward, player: Player) {
  //   const game = player.game;

  //   switch (reward) {
  //   case '1vp':
  //     player.getVictoryPoints().setVictoryPoints('planetary tracks', 1);
  //     // TODO(kberg): log victory points.
  //     break;
  //   case '2vp':
  //     player.getVictoryPoints().setVictoryPoints('planetary tracks', 2);
  //     break;
  //   case '3mc':
  //     player.addResource(Resources.MEGACREDITS, 3, {log: true});
  //     break;
  //   case '6mc':
  //     player.addResource(Resources.MEGACREDITS, 6, {log: true});
  //     break;
  //   case 'any_resource':
  //     game.defer(new GrantWildResourceDeferred(player));
  //     break;
  //   case 'card':
  //     player.drawCard();
  //     break;
  //   case 'city':
  //     game.defer(new PlaceCityTile(player));
  //     break;
  //   case 'delegate':
  //     Turmoil.ifTurmoilElse(game,
  //       () => {
  //         game.defer(new SendDelegateToArea(player, 'Select where to send a delegate', {source: 'reserve'}));
  //       },
  //       () => {
  //         player.game.log('TODO: come up with some reward in place of Add Delegate.');
  //       });
  //     break;
  //   case 'energy':
  //     player.addResource(Resources.ENERGY, 1, {log: true});
  //     break;
  //   case 'energy_production':
  //     player.addProduction(Resources.ENERGY, 1, {log: true});
  //     break;
  //   case 'floater':
  //     game.defer(new AddResourcesToCard(player, ResourceType.FLOATER));
  //     break;
  //   case 'greenery':
  //     game.defer(new PlaceGreeneryTile(player));
  //     break;
  //   case 'heat':
  //     player.addResource(Resources.HEAT, 1, {log: true});
  //     break;
  //   case 'heat_production':
  //     player.addProduction(Resources.HEAT, 1, {log: true});
  //     break;
  //   case 'moon_mine':
  //     game.defer(new PlaceMoonMineTile(player));
  //     break;
  //   case 'moon_road':
  //     game.defer(new PlaceMoonRoadTile(player));
  //     break;
  //   case 'ocean':
  //     game.defer(new PlaceOceanTile(player));
  //     break;
  //   case 'plant':
  //     player.addResource(Resources.PLANTS, 1, {log: true});
  //     break;
  //   case 'plant_production':
  //     player.addProduction(Resources.PLANTS, 1, {log: true});
  //     break;
  //   case 'resource':
  //     game.defer(new SelectResourcesDeferred(player, 1, 'Gain 1 resource for your Planetary track bonus.'));
  //     break;
  //   case 'steel':
  //     player.addResource(Resources.STEEL, 1, {log: true});
  //     break;
  //   case 'steel_production':
  //     player.addProduction(Resources.STEEL, 1, {log: true});
  //     break;
  //   case 'titanium':
  //     player.addResource(Resources.TITANIUM, 1, {log: true});
  //     break;
  //   case 'titanium_production':
  //     player.addProduction(Resources.TITANIUM, 1, {log: true});
  //     break;
  //   case 'tr':
  //     player.increaseTerraformRating();
  //     break;
  //   case 'venus_scale':
  //     if (game.gameOptions.venusNextExtension) {
  //       game.increaseVenusScaleLevel(player, 1);
  //     } else {
  //       player.game.log('TODO: come up with some reward in place of Increase Venus Scale.');
  //     }
  //     break;
  //   default:
  //     throw new Error('Unknown reward: ' + reward);
  //   }
  // }

  // private static playersWithMostTags(tag: Tags, activePlayer: Player): Array<Player> {
  //   const players = activePlayer.game.getPlayers();
  //   const counts = players.map((player) => {
  //     // Wild tags only apply to a player taking an action.
  //     const includeWildTags: boolean = player.id === activePlayer.id;
  //     const count = player.getTagCount(tag, false, includeWildTags);
  //     return {player, count};
  //   });
  //   const max = Math.max(...counts.map((c) => c.count));
  //   const filtered = counts.filter((c) => c.count === max);
  //   const result = filtered.map((c) => c.player);
  //   return result;
  // }
}
