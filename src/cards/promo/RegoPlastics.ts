import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../render/Size';

export class RegoPlastics extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.REGO_PLASTICS,
      tags: [Tags.BUILDING],
      cost: 10,
      victoryPoints: 1,

      metadata: {
        cardNumber: 'X10',
        renderData: CardRenderer.builder((b) => {
          b.effect('Your steel resources are worth 1 M€ extra.', (eb) => {
            eb.steel(1).startEffect.plus(Size.SMALL).megacredits(1);
          });
        }),
      },
    });
  }

  public play(player: Player) {
    player.increaseSteelValue();
    return undefined;
  }

  public onDiscard(player: Player): void {
    player.decreaseSteelValue();
  }
}
