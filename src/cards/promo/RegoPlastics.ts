import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class RegoPlastics extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.REGO_PLASTICS,
      tags: [Tags.BUILDING],
      cost: 10,

      metadata: {
        cardNumber: 'X10',
        renderData: CardRenderer.builder((b) => {
          b.effect('Your steel resources are worth 1 MC extra.', (eb) => {
            eb.steel(1).startEffect.plus(CardRenderItemSize.SMALL).megacredits(1);
          });
        }),
        victoryPoints: 1,
      },
    });
  }

  public play(player: Player) {
    player.increaseSteelValue();
    return undefined;
  }

  public getVictoryPoints() {
    return 1;
  }

  public onDiscard(player: Player): void {
    player.decreaseSteelValue();
  }
}
