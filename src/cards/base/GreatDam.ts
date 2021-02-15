import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {GlobalParameter} from '../../GlobalParameter';
import {Units} from '../../Units';

export class GreatDam extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.GREAT_DAM,
      tags: [Tags.ENERGY, Tags.BUILDING],
      cost: 12,
      productionBox: Units.of({energy: 2}),

      requirements: CardRequirements.builder((b) => b.oceans(4)),
      metadata: {
        cardNumber: '136',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(2));
        }),
        description: 'Requires 4 ocean tiles. Increase your Energy production 2 steps.',
        victoryPoints: 1,
      },
    });
  }
  public canPlay(player: Player): boolean {
    return player.game.checkMinRequirements(player, GlobalParameter.OCEANS, 4);
  }
  public play(player: Player) {
    player.addProduction(Resources.ENERGY, 2);
    return undefined;
  }
  public getVictoryPoints() {
    return 1;
  }
}

