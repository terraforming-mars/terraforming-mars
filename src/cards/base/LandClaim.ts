import {Card} from '../Card';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {CardName} from '../../CardName';
import {LogHelper} from '../../LogHelper';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class LandClaim extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.LAND_CLAIM,
      cost: 1,

      metadata: {
        cardNumber: '066',
        renderData: CardRenderer.builder((b) => {
          b.text('Place your marker on a non-reserved area. Only you may place a tile there.', CardRenderItemSize.SMALL, true);
        }),
      },
    });
  }
  public canPlay(_player: Player, game: Game): boolean {
    return game.board.getNonReservedLandSpaces().length > 0;
  }
  public play(player: Player, game: Game) {
    return new SelectSpace(
      'Select space for claim',
      game.board.getNonReservedLandSpaces(),
      (foundSpace: ISpace) => {
        foundSpace.player = player;
        LogHelper.logBoardTileAction(player, foundSpace, 'land claim');
        return undefined;
      },
    );
  }
}
