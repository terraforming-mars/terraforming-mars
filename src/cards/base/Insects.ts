import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';

export class Insects extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.INSECTS,
      tags: [Tags.MICROBE],
      cost: 9,

      requirements: CardRequirements.builder((b) => b.oxygen(6)),
      metadata: {
        cardNumber: '148',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.plants(1).slash().plants(1, {played}));
        }),
        description: 'Requires 6% oxygen. Increase your Plant production 1 step for each plant tag you have.',
      },
    });
  }
  public play(player: Player) {
    player.addProduction(Resources.PLANTS, player.getTagCount(Tags.PLANT), {log: true});
    return undefined;
  }
}
