import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../Resources';
import {Tags} from '../Tags';
import {CardRequirements} from '../CardRequirements';
import {played} from '../Options';

export class MartianMonuments extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.MARTIAN_MONUMENTS,
      cost: 5,
      tags: [Tags.EARTH, Tags.MARS],
      requirements: CardRequirements.builder((b) => b.cities()),

      metadata: {
        cardNumber: 'Pf09',
        renderData: CardRenderer.builder((b) => {
          b.production(((pb) => pb.megacredits(1))).slash().mars(1, {played});
        }),
        description: 'Requires that you own a city on Mars. Raise your M€ production 1 step for every Mars tag you own (including this.)',
      },
    });
  }


  public play(player: Player) {
    const count = player.getTagCount(Tags.MARS) + 1; // +1 is the "including this"
    player.addProduction(Resources.MEGACREDITS, count, {log: true});
    return undefined;
  }
}

