
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class BeamFromAThoriumAsteroid extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.BEAM_FROM_A_THORIUM_ASTEROID,
      tags: [Tags.JOVIAN, Tags.SPACE, Tags.ENERGY],
      cost: 32,

      metadata: {
        cardNumber: '058',
        description: 'Requires a Jovian tag. Increase your heat production and Energy production 3 steps each',
        requirements: CardRequirements.builder((b) => b.tag(Tags.JOVIAN)),
        renderData: CardRenderer.builder((b) => {
          b.productionBox((pb) => {
            pb.heat(3).br;
            pb.energy(3);
          });
        }),
        victoryPoints: 1,
      },
    });
  }
  public canPlay(player: Player): boolean {
    return player.getTagCount(Tags.JOVIAN) >= 1;
  }
  public play(player: Player) {
    player.addProduction(Resources.HEAT, 3);
    player.addProduction(Resources.ENERGY, 3);
    return undefined;
  }
  public getVictoryPoints() {
    return 1;
  }
}

