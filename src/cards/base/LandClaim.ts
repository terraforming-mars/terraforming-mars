import {Card} from '../Card';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {CardName} from '../../CardName';
import {LogHelper} from '../../LogHelper';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../render/Size';

export class LandClaim extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
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
  public canPlay(player: Player): boolean {
    return player.game.board.getNonReservedLandSpaces().length > 0;
  }
  public play(player: Player) {
    return new SelectSpace(
      'Select space for claim',
      player.game.board.getNonReservedLandSpaces(),
      (foundSpace: ISpace) => {
        foundSpace.player = player;
        LogHelper.logBoardTileAction(player, foundSpace, 'land claim');
        return undefined;
      },
    );
  }
}
