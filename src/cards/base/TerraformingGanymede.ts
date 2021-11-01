import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';

export class TerraformingGanymede extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.TERRAFORMING_GANYMEDE,
      tags: [Tags.JOVIAN, Tags.SPACE],
      cost: 33,
      victoryPoints: 2,

      metadata: {
        cardNumber: '197',
        renderData: CardRenderer.builder((b) => {
          b.tr(1).slash().jovian({played});
        }),
        description: 'Raise your TR 1 step for each Jovian tag you have, including this.',
      },
    });
  }
  public canPlay(player: Player): boolean {
    const steps = 1 + player.getTagCount(Tags.JOVIAN);
    return player.canAfford(player.getCardCost(this), {titanium: true, tr: {tr: steps}});
  }
  public play(player: Player) {
    const steps = 1 + player.getTagCount(Tags.JOVIAN);
    player.increaseTerraformRatingSteps(steps, {log: true});

    return undefined;
  }
}
