import {ActiveCorporationCard} from '../corporation/CorporationCard';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardResource} from '../../../common/CardResource';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {digit} from '../Options';
import {ICard} from '../ICard';
import {ICorporationCard} from '../corporation/ICorporationCard';

export class RobinHaulings extends ActiveCorporationCard implements ICorporationCard {
  constructor() {
    super({
      name: CardName.ROBIN_HAULINGS,
      tags: [Tag.MARS, Tag.VENUS],
      startingMegaCredits: 39,
      resourceType: CardResource.FLOATER,

      action: {
        or: {
          autoSelect: true,
          behaviors: [
            {title: 'Spend 3 floaters here to raise Venus 1 step', spend: {resourcesHere: 3}, global: {venus: 1}},
            {title: 'Spend 3 floaters here to raise oxygen 1 step', spend: {resourcesHere: 3}, global: {oxygen: 1}},
          ],
        },
      },

      metadata: {
        cardNumber: 'PfC17',
        description: 'You start with 39 M€.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(39).br;
          b.effect('Whenever you play a card with a Venus tag add 1 floater to ANY card.', (eb) => {
            eb.tag(Tag.VENUS).asterix().startEffect.resource(CardResource.FLOATER).asterix();
          });
          b.br;
          b.action('Remove 3 floaters from this card to raise Venus 1 step or raise oxygen 1 step', (ab) => {
            ab.resource(CardResource.FLOATER, {amount: 3, digit}).startAction.venus(1).or().oxygen(1);
          });
        }),
      },
    });
  }

  public onCardPlayed(player: IPlayer, card: ICard) {
    if (card.tags.includes(Tag.VENUS)) {
      player.game.defer(new AddResourcesToCard(player, CardResource.FLOATER));
    }
  }
}
