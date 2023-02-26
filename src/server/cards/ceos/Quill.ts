import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';

import {CardResource} from '../../../common/CardResource';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';


export class Quill extends CeoCard {
  constructor() {
    super({
      name: CardName.QUILL,
      metadata: {
        cardNumber: 'L17',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().cards(1, {secondaryTag: AltSecondaryTag.FLOATER}).colon().nbsp;
          b.plus().floaters(2).asterix();
        }),
        description: 'Once per game, add 2 floaters to each of your cards that collect floaters, then add 2 floaters to ANY card.',
      },
    });
  }

  public action(player: Player): PlayerInput | undefined {
    this.isDisabled = true;
    const resourceCards = player.getResourceCards(CardResource.FLOATER);
    resourceCards.forEach((card) => player.addResourceTo(card, {qty: 2, log: true}));

    player.game.defer(new AddResourcesToCard(player, CardResource.FLOATER, {count: 2}));

    return undefined;
  }
}
