import {Tags} from '../../common/cards/Tags';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {SpaceName} from '../../SpaceName';
import {SpaceType} from '../../common/boards/SpaceType';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
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
      victoryPoints: 3,

      metadata: {
        cardNumber: '220',
        description: 'Requires 4 Science tags. Decrease your energy production 1 step. Increase your titanium production 1 step. Place a City tile on the RESERVED AREA.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1).br;
            pb.plus().titanium(1);
          }).nbsp.city().asterix();
        }),
      },
    });
  }
  public override canPlay(player: Player): boolean {
    return player.getProduction(Resources.ENERGY) >= 1;
  }
  public play(player: Player) {
    player.addProduction(Resources.ENERGY, -1);
    player.addProduction(Resources.TITANIUM, 1);
    player.game.addCityTile(player, SpaceName.DAWN_CITY, SpaceType.COLONY);
    return undefined;
  }
}
