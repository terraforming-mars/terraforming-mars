import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {SpaceName} from '../../SpaceName';
import {SpaceType} from '../../SpaceType';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class DawnCity extends Card {
  constructor() {
    super({
      name: CardName.DAWN_CITY,
      cardType: CardType.AUTOMATED,
      tags: [Tags.CITY, Tags.SPACE],
      cost: 15,

      requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE, 4)),
      metadata: {
        cardNumber: '220',
        description: 'Requires 4 Science tags. Decrease your energy production 1 step. Increase your titanium production 1 step. Place a City tile on the RESERVED AREA.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1).br;
            pb.plus().titanium(1);
          }).nbsp.city().asterix();
        }),
        victoryPoints: 3,
      },
    });
  };
  public canPlay(player: Player): boolean {
    return super.canPlay(player) && player.getProduction(Resources.ENERGY) >= 1;
  }
  public play(player: Player) {
    player.addProduction(Resources.ENERGY, -1);
    player.addProduction(Resources.TITANIUM, 1);
    player.game.addCityTile(player, SpaceName.DAWN_CITY, SpaceType.COLONY);
    return undefined;
  }
  public getVictoryPoints() {
    return 3;
  }
}
