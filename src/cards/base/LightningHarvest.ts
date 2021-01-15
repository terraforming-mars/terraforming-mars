import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class LightningHarvest extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.LIGHTNING_HARVEST,
      tags: [Tags.ENERGY],
      cost: 8,

      metadata: {
        cardNumber: '046',
        requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE, 3)),
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(1).megacredits(1));
        }),
        description: 'Requires 3 Science tags. Increase your Energy production and your MC production one step each.',
        victoryPoints: 1,
      },
    });
  }

  public canPlay(player: Player): boolean {
    return player.getTagCount(Tags.SCIENCE) >= 3;
  }
  public play(player: Player, _game: Game) {
    if (player.getTagCount(Tags.SCIENCE) < 3) {
      throw 'Requires 3 science tags';
    }
    player.addProduction(Resources.ENERGY);
    player.addProduction(Resources.MEGACREDITS);
    return undefined;
  }
  public getVictoryPoints() {
    return 1;
  }
}
