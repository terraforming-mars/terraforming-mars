import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
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
        description: 'Requires Venus and Earth tags. Increase your MC production 3 steps.',
      },
    });
  };
  public canPlay(player: Player): boolean {
    return player.checkMultipleTagPresence([Tags.VENUS, Tags.EARTH]);
  }
  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, 3);
    return undefined;
  }
}
