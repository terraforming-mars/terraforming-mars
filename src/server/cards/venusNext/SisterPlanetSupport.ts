import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../../common/Resources';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {Card} from '../Card';
import {IProjectCard} from '../IProjectCard';

export class SisterPlanetSupport extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.SISTER_PLANET_SUPPORT,
      cardType: CardType.AUTOMATED,
      tags: [Tag.VENUS, Tag.EARTH],
      cost: 7,

      requirements: CardRequirements.builder((b) => b.tag(Tag.VENUS).tag(Tag.EARTH)),
      metadata: {
        cardNumber: '244',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(3));
        }),
        description: 'Requires Venus and Earth tags. Increase your M€ production 3 steps.',
      },
    });
  }

  public override bespokePlay(player: Player) {
    player.production.add(Resources.MEGACREDITS, 3);
    return undefined;
  }
}
