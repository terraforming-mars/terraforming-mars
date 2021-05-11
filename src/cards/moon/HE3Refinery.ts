import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Resources} from '../../Resources';

export class HE3Refinery extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.HE3_REFINERY,
      cost: 8,
      tags: [Tags.MOON],

      metadata: {
        cardNumber: 'M49',
        renderData: CardRenderer.builder((b) => {
          b.action('Gain 1 M€ for each level of Mining Rate.', (eb) => {
            eb.empty().startAction;
            eb.megacredits(1).slash().moonMiningRate();
          });
        }),
      },
    });
  }

  public play() {
    return undefined;
  }

  public canAct() {
    return true;
  }

  public action(player: Player) {
    player.addResource(Resources.MEGACREDITS, MoonExpansion.moonData(player.game).miningRate, {log: true});
    return undefined;
  }
}
