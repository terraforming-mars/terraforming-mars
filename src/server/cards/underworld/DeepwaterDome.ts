import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {intersection} from '../../../common/utils/utils';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {Space} from '../../boards/Space';
import {SelectSpace} from '../../inputs/SelectSpace';
import {LogHelper} from '../../LogHelper';
import {UnderworldExpansion} from '../../underworld/UnderworldExpansion';

export class DeepwaterDome extends PreludeCard {
  constructor() {
    super({
      name: CardName.DEEPWATER_DOME,
      tags: [Tag.PLANT, Tag.BUILDING],

      behavior: {
        production: {plants: 1},
      },

      metadata: {
        cardNumber: 'UP11',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.plants(1));
          b.oceans(1).emptyTile().identify().asterix();
        }),
        description: 'Increase your plant production 1 step. Place an ocean. ' +
        'Then place a player cube on an adjacent unreserved space. ' +
        'Only you may place a tile there. Identify the underground resources in both spaces.',
      },
    });
  }

  public getAdjacentSpaces(player: IPlayer, oceanSpace: Space) {
    const board = player.game.board;
    const emptySpaces = board.getAvailableSpacesOnLand(player).filter((space) => {
      // Don't place a marker on a space where you already have a marker.
      return space.player === undefined;
    });
    return intersection(board.getAdjacentSpaces(oceanSpace), emptySpaces);
  }

  public getCandidateSpaces(player: IPlayer) {
    return player.game.board
      .getAvailableSpacesForOcean(player)
      .filter((space) => this.getAdjacentSpaces(player, space));
  }
  public override bespokeCanPlay(player: IPlayer): boolean {
    if (!player.game.canAddOcean()) {
      return false;
    }
    return this.getCandidateSpaces(player).length > 0;
  }

  public override bespokePlay(player: IPlayer) {
    player.game.defer(new PlaceOceanTile(player).andThen((oceanSpace) => {
      UnderworldExpansion.identify(player.game, oceanSpace, player);
      player.defer(new SelectSpace('Select space for claim', this.getAdjacentSpaces(player, oceanSpace))
        .andThen((claimedSpace) => {
          claimedSpace.player = player;
          LogHelper.logBoardTileAction(player, claimedSpace, 'land claim');
          UnderworldExpansion.identify(player.game, claimedSpace, player);
          return undefined;
        }));
    }));

    return undefined;
  }
}

