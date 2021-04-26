import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../Resources';
import {CardRequirements} from '../CardRequirements';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {Card} from '../Card';

export class LunaSenate extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.LUNA_SENATE,
      cardType: CardType.AUTOMATED,
      tags: [Tags.MOON, Tags.MOON],
      cost: 32,
      requirements: CardRequirements.builder((b) => b.tag(Tags.MOON, 3)),

      metadata: {
        description: 'Requires that you have 3 Moon tags. Increase your M€ production 1 step per Moon tag in the game (including these.)',
        cardNumber: 'M70',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(1)).slash().moon().any;
          b.vpText('1 VP per Moon tag you have.');
        }),
        victoryPoints: CardRenderDynamicVictoryPoints.moon(1, 1),
      },
    });
  };

  public play(player: Player) {
    // count + 2 because the 2 moon tags above apply, and this card isn't in
    // played cards yet.
    const count = player.game.getPlayers().map((p) => p.getTagCount(Tags.MOON)).reduce((p, v) => p + v, 0);
    player.addProduction(Resources.MEGACREDITS, count + 2, {log: true});
    return undefined;
  }

  public getVictoryPoints(player: Player) {
    return player.getTagCount(Tags.MOON, true, false);
  }
}
