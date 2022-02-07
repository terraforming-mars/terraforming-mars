import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {Resources} from '../../common/Resources';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';

export class EarthElevator extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 43,
      tags: [Tags.SPACE, Tags.EARTH],
      name: CardName.EARTH_ELEVATOR,
      cardType: CardType.AUTOMATED,
      victoryPoints: 4,

      metadata: {
        description: 'Increase your titanium production 3 steps.',
        cardNumber: 'C08',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.titanium(3));
        }),
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.TITANIUM, 3);
    return undefined;
  }
}
