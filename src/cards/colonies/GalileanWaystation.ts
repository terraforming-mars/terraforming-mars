import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Resources} from '../../Resources';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';
import {all, played} from '../Options';

export class GalileanWaystation extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 15,
      tags: [Tags.SPACE],
      name: CardName.GALILEAN_WAYSTATION,
      cardType: CardType.AUTOMATED,
      victoryPoints: 1,

      metadata: {
        description: 'Increase your M€ production 1 step for every Jovian tag in play.',
        cardNumber: 'C13',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(1).slash().jovian({played, all}));
        }),
      },
    });
  }

  public play(player: Player) {
    const amount = player.game.getPlayers()
      .map((aplayer) => aplayer.getTagCount(Tags.JOVIAN, player.id === aplayer.id ? 'default' : 'raw'))
      .reduce((a, c) => a + c, 0);
    player.addProduction(Resources.MEGACREDITS, amount, {log: true});
    return undefined;
  }
}
