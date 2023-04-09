import {CardName} from '../../../common/cards/CardName';
import {PlayerInput} from '../../PlayerInput';
import {Player} from '../../Player';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';
import {played, all} from '../Options';
import {Tag} from '../../../common/cards/Tag';
import {Resources} from '../../../common/Resources';

export class Xu extends CeoCard {
  constructor() {
    super({
      name: CardName.XU,
      tags: [Tag.VENUS],

      metadata: {
        cardNumber: 'L37',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().venus(1, {played, all}).colon().megacredits(2).megacredits(8).asterix();
          b.br.br;
        }),
        description: 'Once per game, gain 2 M€ for each Venus tag in play. Gain an additional 8 M€ if you have the most Venus tags in play.',
      },
    });
  }

  public action(player: Player): PlayerInput | undefined {
    this.isDisabled = true;
    const players = player.game.getPlayers();
    const amount = players
      .map((p) => p.tags.count(Tag.VENUS, player.id === p.id ? 'default' : 'raw')) // If the player being counted is Me, include Wild tags. Dont include opponent wild tags
      .reduce((a, c) => a + c, 0);

    player.addResource(Resources.MEGACREDITS, amount * 2, {log: true});

    const maxPlayerVenusTagCount = Math.max(...players.map((p) => p.tags.count(Tag.VENUS, player.id === p.id ? 'default' : 'raw')));

    if (maxPlayerVenusTagCount === player.tags.count(Tag.VENUS)) {
      player.addResource(Resources.MEGACREDITS, 8, {log: true});
    }

    return undefined;
  }
}
