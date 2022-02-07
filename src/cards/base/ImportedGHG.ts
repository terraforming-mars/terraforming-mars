import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class ImportedGHG extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.IMPORTED_GHG,
      tags: [Tags.EARTH, Tags.SPACE],
      cost: 7,

      metadata: {
        cardNumber: '162',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.heat(1)).heat(3);
        }),
        description: 'Increase your heat production 1 step and gain 3 heat.',
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.HEAT, 1);
    player.heat += 3;
    return undefined;
  }
}

