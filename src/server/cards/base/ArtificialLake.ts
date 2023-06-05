import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../requirements/CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class ArtificialLake extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.ARTIFICIAL_LAKE,
      tags: [Tag.BUILDING],
      cost: 15,
      tr: {oceans: 1},
      victoryPoints: 1,

      behavior: {
        ocean: {on: 'land'},
      },

      requirements: CardRequirements.builder((b) => b.temperature(-6)),
      metadata: {
        description: 'Requires -6 C or warmer. Place 1 ocean tile ON AN AREA NOT RESERVED FOR OCEAN.',
        cardNumber: '116',
        renderData: CardRenderer.builder((b) => b.oceans(1).asterix()),
      },
    });
  }

  public override bespokeCanPlay(player: Player) {
    // This is not covered in executor.
    if (!player.game.canAddOcean()) return true; // Card is playable, it just has no effect.
    return player.game.board.getAvailableSpacesOnLand(player).length > 0;
  }
}
