import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {max} from '../Options';

export class DesignedMicroOrganisms extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.DESIGNED_MICRO_ORGANISMS,
      tags: [Tags.SCIENCE, Tags.MICROBE],
      cost: 16,

      requirements: CardRequirements.builder((b) => b.temperature(-14, {max})),
      metadata: {
        cardNumber: '155',
        description: 'It must be -14 C or colder. Increase your Plant production 2 steps.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.plants(2));
        }),
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.PLANTS, 2);
    return undefined;
  }
}
