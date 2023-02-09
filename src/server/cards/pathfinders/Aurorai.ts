import {Card} from '../Card';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {CardResource} from '../../../common/CardResource';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {Priority} from '../../deferredActions/DeferredAction';

export class Aurorai extends Card implements ICorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.AURORAI,
      tags: [Tag.MARS],
      startingMegaCredits: 33,
      resourceType: CardResource.DATA,

      behavior: {
        addResources: 2,
      },

      metadata: {
        cardNumber: 'PfC9',
        description: 'You start with 33 M€. and 2 data on this card',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(33).data({amount: 2}).br;
          b.effect('Whenever you increase your terraform rating, add 1 data per step to ANY card.', (eb) => {
            eb.tr(1).startEffect.data().asterix();
          }).br;
          b.effect('You can use data on this card as 3M€ each to pay for standard projects.', (eb) => {
            eb.data().startEffect.megacredits(3).asterix().text('standard project');
          });
        }),
      },
    });
  }

  public onIncreaseTerraformRating(player: Player, cardOwner: Player, steps: number) {
    if (player === cardOwner) {
      player.game.defer(new AddResourcesToCard(player, CardResource.DATA, {count: steps}), Priority.GAIN_RESOURCE_OR_PRODUCTION);
    }
  }
}
