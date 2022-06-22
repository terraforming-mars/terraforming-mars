import {Tags} from '../../common/cards/Tags';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {played} from '../Options';

export class SulphurExports extends Card {
  constructor() {
    super({
      name: CardName.SULPHUR_EXPORTS,
      cardType: CardType.AUTOMATED,
      tags: [Tags.VENUS, Tags.SPACE],
      cost: 21,
      tr: {venus: 1},

      metadata: {
        cardNumber: '250',
        renderData: CardRenderer.builder((b) => {
          b.venus(1).br;
          b.production((pb) => pb.megacredits(1).slash().venus(1, {played}));
        }),
        description: 'Increase Venus 1 step. Increase your M€ production 1 step for each Venus tag you have, including this.',
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, player.getTagCount(Tags.VENUS) + 1, {log: true});
    player.game.increaseVenusScaleLevel(player, 1);
    return undefined;
  }
}
