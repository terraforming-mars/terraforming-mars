import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {ActiveCorporationCard} from '../corporation/CorporationCard';
import {digit} from '../Options';
import {CardResource} from '../../../common/CardResource';
import {IPlayer} from '../../IPlayer';
import {SimpleDeferredAction} from '../../deferredActions/DeferredAction';
import {SelectCard} from '../../inputs/SelectCard';
import {Space} from '../../boards/Space';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';

export class AeronGenomics extends ActiveCorporationCard {
  constructor() {
    super({
      name: CardName.AERON_GENOMICS,
      tags: [Tag.ANIMAL],
      startingMegaCredits: 35,
      resourceType: CardResource.ANIMAL,

      victoryPoints: {resourcesHere: {}, per: 3},

      behavior: {
        stock: {steel: 5},
        addResources: 1,
      },

      metadata: {
        cardNumber: 'UC05',
        description: 'You start with 35 M€, 5 steel, and 1 animal resource on this card. 1 VP per 3 animals on this card.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(35).steel(5, {digit}).resource(CardResource.ANIMAL).br;
          b.effect('After you excavate an underground resource, put an animal on this card.', (eb) => {
            eb.excavate(1).startEffect.resource(CardResource.ANIMAL);
          }).br;
          b.action('Spend 1 M€ to move an animal from here to another card.', (ab) => {
            ab.megacredits(1).resource(CardResource.ANIMAL).startAction.resource(CardResource.ANIMAL).asterix();
          });
        }),
      },
    });
  }

  onExcavation(player: IPlayer, _space: Space) {
    player.addResourceTo(this, {qty: 1, log: true});
  }

  public override canAct(player: IPlayer): boolean {
    if (!player.canAfford(1)) {
      return false;
    }
    // >1 because this player already has Aeron Genomics.
    return this.resourceCount > 0 && player.getResourceCards(this.resourceType).length > 1;
  }

  public override action(player: IPlayer) {
    player.game.defer(new SimpleDeferredAction(
      player,
      () => {
        const resourceCards = player.getResourceCards(this.resourceType).filter((card) => card.name !== this.name);

        if (resourceCards.length === 0) {
          return undefined;
        }

        if (resourceCards.length === 1 && player.canAfford(1)) {
          player.game.defer(new SelectPaymentDeferred(player, 1, {title: 'Select how to pay for action'}))
            .andThen(() => {
              this.resourceCount--;
              player.addResourceTo(resourceCards[0], 1);
              player.game.log('${0} moved 1 animal from ${1} to ${2}.', (b) => b.player(player).card(this).card(resourceCards[0]));
            });
          return undefined;
        }

        return new SelectCard(
          'Select card to add 1 animal',
          'Add animal',
          resourceCards)
          .andThen(([card]) => {
            this.resourceCount--;
            player.addResourceTo(card, 1);
            player.game.log('${0} moved 1 animal from ${1} to ${2}.', (b) => b.player(player).card(this).card(resourceCards[0]));
            return undefined;
          });
      },
    ));
    return undefined;
  }
}
