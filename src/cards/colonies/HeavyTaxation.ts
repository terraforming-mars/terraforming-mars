import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Resources} from '../../Resources';
import {CardRequirements} from '../CardRequirements';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';

export class HeavyTaxation extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 3,
      tags: [Tags.EARTH],
      name: CardName.HEAVY_TAXATION,
      cardType: CardType.AUTOMATED,

      metadata: {
        cardNumber: 'C14',
        requirements: CardRequirements.builder((b) => b.tag(Tags.EARTH, 2)),
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(2)).nbsp.megacredits(4);
        }),
        description: 'Requires 2 Earth tags. Increase your MC production 2 steps, and gain 4MC.',
        victoryPoints: -1,
      },
    });
  }

  public canPlay(player: Player): boolean {
    return player.getTagCount(Tags.EARTH) >= 2;
  }

  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, 2);
    player.megaCredits += 4;
    return undefined;
  }

  public getVictoryPoints() {
    return -1;
  }
}
