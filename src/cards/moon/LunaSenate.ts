import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../Resources';
import {CardRequirements} from '../CardRequirements';
import {Card} from '../Card';
import {VictoryPoints} from '../ICard';
import {all} from '../Options';

export class LunaSenate extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.LUNA_SENATE,
      cardType: CardType.AUTOMATED,
      tags: [Tags.MOON, Tags.MOON],
      cost: 32,

      victoryPoints: VictoryPoints.tags(Tags.MOON, 1, 1),
      requirements: CardRequirements.builder((b) => b.tag(Tags.MOON, 3)),

      metadata: {
        description: 'Requires that you have 3 Moon tags. Increase your M€ production 1 step per Moon tag in the game (including these.)',
        cardNumber: 'M70',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(1)).slash().moon(1, {all});
          b.vpText('1 VP per Moon tag you have.');
        }),
      },
    });
  };

  public play(player: Player) {
    let count = player.game.getPlayers().map((p) => p.getTagCount(Tags.MOON, 'raw')).reduce((p, v) => p + v, 0);
    // Including wild tags here because if it were included above it would count opponents' wild tags.
    count += player.getTagCount(Tags.WILDCARD, 'raw');
    // count + 2 because the 2 moon tags above apply, and this card isn't in played cards yet.
    player.addProduction(Resources.MEGACREDITS, count + 2, {log: true});
    return undefined;
  }
}
