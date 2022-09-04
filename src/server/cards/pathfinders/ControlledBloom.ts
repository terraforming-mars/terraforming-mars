import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardResource} from '../../../common/CardResource';
import {Tag} from '../../../common/cards/Tag';
import {CardRequirements} from '../CardRequirements';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';

export class ControlledBloom extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.CONTROLLED_BLOOM,
      cost: 13,
      tags: [Tag.MICROBE, Tag.PLANT],
      victoryPoints: 1,

      requirements: CardRequirements.builder((b) => b.oceans(3)),

      behavior: {
        stock: {plants: 3},
      },

      metadata: {
        cardNumber: 'PFTmp',
        renderData: CardRenderer.builder((b) => {
          b.microbes(3).asterix().br;
          b.plants(3);
        }),
        description: 'Requires 3 oceans. Add 3 microbes to ANY card. Gain 3 plants.',
      },
    });
  }

  public override bespokePlay(player: Player) {
    player.game.defer(new AddResourcesToCard(player, CardResource.MICROBE, {count: 3}));
    return undefined;
  }
}
