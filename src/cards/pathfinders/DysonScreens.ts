import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {SpaceName} from '../../SpaceName';
import {SpaceType} from '../../SpaceType';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../Resources';
import {IActionCard} from '../ICard';
import {digit} from '../Options';

export class DysonScreens extends Card implements IProjectCard, IActionCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.DYSON_SCREENS,
      tags: [Tags.SCIENCE, Tags.VENUS, Tags.ENERGY, Tags.SPACE],
      cost: 28,
      victoryPoints: 1,
      tr: {temperature: 1},

      metadata: {
        cardNumber: 'Pf15',
        renderData: CardRenderer.builder((b) => {
          b.action(
            'Pay 2 titanium to raise your heat and energy production 1 step each.',
            (ab) => ab.titanium(2, {digit}).startAction.production((pb) => pb.heat(1).energy(1))).br;
          b.temperature(1).cards(1).city().asterix().br;
        }),
        description: 'Raise the temperature 1 step. Draw a card. Place a city tile ON THE RESERVED AREA.',
      },
    });
  }

  public canAct(player: Player) {
    return player.titanium >= 2;
  }

  public action(player: Player) {
    player.titanium -= 2;
    player.addProduction(Resources.HEAT, 1);
    player.addProduction(Resources.ENERGY, 1);
    return undefined;
  }

  public play(player: Player) {
    const game = player.game;
    game.increaseTemperature(player, 1);
    player.drawCard();
    player.game.addCityTile(player, SpaceName.DYSON_SCREENS, SpaceType.COLONY);
    return undefined;
  }
}
