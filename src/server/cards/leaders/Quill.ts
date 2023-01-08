import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';
import {LeaderCard} from './LeaderCard';

import {CardResource} from '../../../common/CardResource';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';


export class Quill extends Card implements LeaderCard {
  constructor() {
    super({
      name: CardName.QUILL,
      cardType: CardType.LEADER,
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

  public isDisabled = false;

  public override play() {
    return undefined;
  }

  public canAct(): boolean {
    return this.isDisabled === false;
  }

  public action(player: Player): PlayerInput | undefined {
    const resourceCards = player.getResourceCards(CardResource.FLOATER);
    resourceCards.forEach((card) => player.addResourceTo(card, {qty: 2, log: true}));

    player.game.defer(new AddResourcesToCard(player, CardResource.FLOATER, {count: 2}));

    this.isDisabled = true;
    return undefined;
  }
}
