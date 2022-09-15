import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {SpaceType} from '../../../common/boards/SpaceType';
import {Tag} from '../../../common/cards/Tag';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class ProtectedValley extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.PROTECTED_VALLEY,
      tags: [Tag.PLANT, Tag.BUILDING],
      cost: 23,
      tr: {oxygen: 1},

      behavior: {
        production: {megacredits: 2},
      },

      metadata: {
        cardNumber: '174',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(2)).nbsp;
          b.greenery().asterix();
        }),
        description: 'Increase your M€ production 2 steps. Place a greenery tile ON AN AREA RESERVED FOR OCEAN, disregarding normal placement restrictions, and increase oxygen 1 step.',
      },
    });
  }

  public override bespokePlay(player: Player) {
    return new SelectSpace(
      'Select space reserved for ocean to place greenery tile',
      player.game.board.getAvailableSpacesForOcean(player),
      (space: ISpace) => {
        return player.game.addGreenery(player, space.id, SpaceType.OCEAN);
      },
    );
  }
}
