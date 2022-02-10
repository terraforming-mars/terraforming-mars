import {Tags} from '../../common/cards/Tags';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {Card} from '../Card';

export class SisterPlanetSupport extends Card {
  constructor() {
    super({
      name: CardName.SISTER_PLANET_SUPPORT,
      cardType: CardType.AUTOMATED,
      tags: [Tags.VENUS, Tags.EARTH],
      cost: 7,

      requirements: CardRequirements.builder((b) => b.tag(Tags.VENUS).tag(Tags.EARTH)),
      metadata: {
        cardNumber: '244',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(3));
        }),
        description: 'Requires Venus and Earth tags. Increase your M€ production 3 steps.',
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, 3);
    return undefined;
  }
}
