import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Size} from '../../../common/cards/render/Size';
import {Player} from '../../Player';
import {SpaceName} from '../../SpaceName';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../../common/Resources';
import {IActionCard} from '../ICard';
import {digit} from '../Options';
import {SpaceType} from '../../../common/boards/SpaceType';

export class DysonScreens extends Card implements IProjectCard, IActionCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.DYSON_SCREENS,
      tags: [Tag.SCIENCE, Tag.VENUS, Tag.ENERGY, Tag.SPACE],
      cost: 28,
      victoryPoints: 1,

      behavior: {
        production: {energy: 2, heat: 2},
        drawCard: 1,
        global: {temperature: 1},
        city: {space: SpaceName.DYSON_SCREENS, type: SpaceType.COLONY},
      },

      metadata: {
        cardNumber: 'Pf15',
        renderData: CardRenderer.builder((b) => {
          b.action(
            'Pay 2 titanium to raise your heat and energy production 1 step each.',
            (ab) => ab.titanium(2, {digit}).startAction.production((pb) => pb.heat(1).energy(1))).br;
          b.temperature(1).cards(1, {size: Size.SMALL}).city({size: Size.SMALL}).asterix();
          b.production((pb) => pb.heat(2, {digit}).energy(2, {digit}));
        }),
        description: 'Raise the temperature 1 step. Draw a card. Place a city tile ON THE RESERVED AREA. Raise your energy and heat production 2 steps.',
      },
    });
  }

  public canAct(player: Player) {
    return player.titanium >= 2;
  }

  public action(player: Player) {
    player.titanium -= 2;
    player.production.add(Resources.HEAT, 1);
    player.production.add(Resources.ENERGY, 1);
    return undefined;
  }
}
