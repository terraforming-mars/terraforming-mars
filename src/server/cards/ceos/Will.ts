import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';

import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {CardResource} from '../../../common/CardResource';

export class Will extends CeoCard {
  constructor() {
    super({
      name: CardName.WILL,
      metadata: {
        cardNumber: 'L23',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().text('GAIN THESE RESOURCES').br;
          b.resource(CardResource.ANIMAL).resource(CardResource.ANIMAL).resource(CardResource.MICROBE).resource(CardResource.MICROBE).br;
          b.resource(CardResource.FLOATER).resource(CardResource.FLOATER).wild(1).wild(1);
          b.br;
        }),
        description: 'Once per game, add the following resources to your cards: 2 animals, 2 microbes, 2 floaters, 2 wild.',
      },
    });
  }

  public action(player: IPlayer): PlayerInput | undefined {
    this.isDisabled = true;
    player.game.defer(new AddResourcesToCard(player, CardResource.ANIMAL, {count: 2}));
    player.game.defer(new AddResourcesToCard(player, CardResource.MICROBE, {count: 2}));
    player.game.defer(new AddResourcesToCard(player, CardResource.FLOATER, {count: 2}));
    player.game.defer(new AddResourcesToCard(player, undefined, {count: 2}));

    return undefined;
  }
}
