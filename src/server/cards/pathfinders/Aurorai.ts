import {CorporationCard} from '../corporation/CorporationCard';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardResource} from '../../../common/CardResource';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {Priority} from '../../deferredActions/Priority';

export class Aurorai extends CorporationCard {
  constructor() {
    super({
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

  public onIncreaseTerraformRating(player: IPlayer, cardOwner: IPlayer, steps: number) {
    if (player === cardOwner) {
      player.game.defer(new AddResourcesToCard(player, CardResource.DATA, {count: steps}), Priority.GAIN_RESOURCE_OR_PRODUCTION);
    }
  }
}
