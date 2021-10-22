import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {CardRequirements} from '../CardRequirements';

export class SkyDocks extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 18,
      tags: [Tags.SPACE, Tags.EARTH],
      name: CardName.SKY_DOCKS,
      cardType: CardType.ACTIVE,
      victoryPoints: 2,

      requirements: CardRequirements.builder((b) => b.tag(Tags.EARTH, 2)),
      cardDiscount: {amount: 1},
      metadata: {
        cardNumber: 'C36',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you play a card, you pay 1 M€ less for it.', (eb) => {
            eb.empty().startEffect.megacredits(-1);
          }).br;
          b.tradeFleet();
        }),
        description: 'Requires 2 Earth tags. Gain 1 Trade Fleet.',
      },
    });
  }

  public play(player: Player) {
    player.increaseFleetSize();
    return undefined;
  }

  public getCardDiscount() {
    return 1;
  }

  public onDiscard(player: Player): void {
    player.decreaseFleetSize();
  }
}
