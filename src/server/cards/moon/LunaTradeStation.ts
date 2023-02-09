import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {MoonSpaces} from '../../../common/moon/MoonSpaces';
import {TileType} from '../../../common/TileType';
import {CardRenderer} from '../render/CardRenderer';
import {IActionCard} from '../ICard';
import {Card} from '../Card';
import {Game} from '../../Game';
import {Resources} from '../../../common/Resources';
import {all} from '../Options';

export class LunaTradeStation extends Card implements IActionCard {
  constructor() {
    super({
      name: CardName.LUNA_TRADE_STATION,
      cardType: CardType.ACTIVE,
      tags: [Tag.MOON, Tag.MOON, Tag.SPACE],
      cost: 10,
      reserveUnits: {titanium: 2},

      behavior: {
        moon: {
          tile: {
            type: TileType.LUNA_TRADE_STATION,
            space: MoonSpaces.LUNA_TRADE_STATION,
          },
        },
      },

      metadata: {
        description: 'Spend 2 titanium. Place this tile ON THE RESERVED AREA.',
        cardNumber: 'M13',
        renderData: CardRenderer.builder((b) => {
          b.action('Gain 2 M€ for each habitat tile on The Moon.', (eb) =>
            eb.empty().startAction.megacredits(2).slash().moonHabitat({all}));
          b.br.minus().titanium(2).tile(TileType.LUNA_TRADE_STATION, true).asterix();
        }),
      },
    });
  }

  private surfaceColonyCount(game: Game): number {
    return MoonExpansion.spaces(game, TileType.MOON_HABITAT, {surfaceOnly: true}).length;
  }

  public canAct(player: Player): boolean {
    return this.surfaceColonyCount(player.game) > 0;
  }

  public action(player: Player) {
    const surfaceColonies = this.surfaceColonyCount(player.game);
    player.addResource(Resources.MEGACREDITS, 2 * surfaceColonies, {log: true});
    return undefined;
  }
}
