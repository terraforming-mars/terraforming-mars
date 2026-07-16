import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {SelectSpace} from '../../inputs/SelectSpace';
import {CardName} from '../../../common/cards/CardName';
import {LogHelper} from '../../LogHelper';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';

export class LandClaim extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.LAND_CLAIM,
      cost: 1,

      metadata: {
        cardNumber: '066',
        renderData: CardRenderer.builder((b) => {
          b.text('Place your marker on a non-reserved area. Only you may place a tile there.', Size.SMALL, true);
        }),
      },
    });
  }
  public override bespokeCanPlay(player: IPlayer): boolean {
    return player.game.board.getNonReservedLandSpaces().length > 0;
  }
  public override bespokePlay(player: IPlayer) {
    return new SelectSpace(
      'Select space for claim',
      player.game.board.getNonReservedLandSpaces())
      .andThen((space) => {
        space.player = player;
        LogHelper.logBoardTileAction(player, space, 'land claim');
        return undefined;
      });
  }
}
