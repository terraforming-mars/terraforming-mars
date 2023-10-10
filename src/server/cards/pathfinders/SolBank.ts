import {Card} from '../Card';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {CardResource} from '../../../common/CardResource';
import {IPlayer} from '../../IPlayer';

export class SolBank extends Card implements ICorporationCard {
  constructor() {
    super({
      type: CardType.CORPORATION,
      name: CardName.SOLBANK,
      startingMegaCredits: 40,
      resourceType: CardResource.DATA,

      metadata: {
        cardNumber: 'PfC13',
        description: 'You start with 40 M€',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(40).br;
          b.effect('Whenever you spend M€ (or steel or titanium) add 1 data to this card.', (eb) =>
            eb.minus().megacredits(1).slash().steel(1).slash().titanium(1).startEffect.data());
          b.br;
          b.effect('During the production phase convert each data from this card into 1M€ each.', (eb) => eb.data().asterix().startEffect.megacredits(1));
        }),
      },
    });
  }

  // Behavior is in Pathfinders.addToSolBank.
  public onProductionPhase(player: IPlayer): undefined {
    player.megaCredits += this.resourceCount;
    this.resourceCount = 0;
    return undefined;
  }
}
