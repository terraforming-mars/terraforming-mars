import {CardName} from '../../../common/cards/CardName';
import {PlayerInput} from '../../PlayerInput';
import {IPlayer} from '../../IPlayer';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';
import {all} from '../Options';
import {Tag} from '../../../common/cards/Tag';
import {Resource} from '../../../common/Resource';
import {sum} from '../../../common/utils/utils';

export class Xu extends CeoCard {
  constructor() {
    super({
      name: CardName.XU,
      tags: [Tag.VENUS],

      metadata: {
        cardNumber: 'L37',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().tag(Tag.VENUS, {all}).colon().megacredits(2).megacredits(8).asterix();
          b.br.br;
        }),
        description: 'Once per game, gain 2 M€ for each Venus tag in play. Gain an additional 8 M€ if you Have the most Venus tags in play.',
      },
    });
  }

  public action(player: IPlayer): PlayerInput | undefined {
    this.isDisabled = true;
    const players = player.game.getPlayers();

    // If the player being counted is Me, include Wild tags. Dont include opponent wild tags
    const counts = players.map((p) => p.tags.count(Tag.VENUS, player.id === p.id ? 'default' : 'raw'));

    const total = sum(counts);
    player.stock.add(Resource.MEGACREDITS, total * 2, {log: true});

    const maxPlayerVenusTagCount = Math.max(...counts);
    if (maxPlayerVenusTagCount === player.tags.count(Tag.VENUS)) {
      player.stock.add(Resource.MEGACREDITS, 8, {log: true});
    }

    return undefined;
  }
}
