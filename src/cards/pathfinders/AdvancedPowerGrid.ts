import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tags} from '../Tags';
import {Resources} from '../../Resources';
import {played} from '../Options';

export class AdvancedPowerGrid extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.ADVANCED_POWER_GRID,
      cost: 18,
      tags: [Tags.ENERGY, Tags.BUILDING, Tags.MARS],

      metadata: {
        cardNumber: 'Pf56',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(2).br.megacredits(1).slash().energy(1, {played}));
        }),
        description: 'Increase your energy production 2 steps. Increase your M€ production 1 step per Power tag you have, including this.',
      },
    });
  }

  public produce(player: Player) {
    player.addProduction(Resources.ENERGY, 2, {log: true});
    const tagCount = player.getTagCount(Tags.ENERGY) + 1; // +1 is including this.
    player.addProduction(Resources.MEGACREDITS, tagCount, {log: true});
  }

  public play(player: Player) {
    this.produce(player);
    return undefined;
  }
}

