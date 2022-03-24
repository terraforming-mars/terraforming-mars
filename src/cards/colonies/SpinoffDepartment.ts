import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {Resources} from '../../common/Resources';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Units} from '../../common/Units';

export class SpinoffDepartment extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 10,
      tags: [Tags.BUILDING],
      name: CardName.SPINOFF_DEPARTMENT,
      cardType: CardType.ACTIVE,
      productionBox: Units.of({megacredits: 2}),

      metadata: {
        cardNumber: 'C41',
        renderData: CardRenderer.builder((b) => {
          b.effect('WHEN PLAYING A CARD WITH A BASIC COST OF 20M€ OR MORE, draw a card.', (eb) => {
            eb.megacredits(20).asterix().startEffect.cards(1);
          }).br;
          b.production((pb) => pb.megacredits(2));
        }),
        description: 'Increase your M€ production 2 steps.',
      },
    });
  }

  public onCardPlayed(player: Player, card: IProjectCard) {
    if (card.cost >= 20) {
      player.drawCard();
    }
  }

  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, 2);
    return undefined;
  }
}
