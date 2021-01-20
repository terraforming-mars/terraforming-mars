import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {MoonSpaces} from '../../moon/MoonSpaces';
import {TileType} from '../../TileType';
import {CardRenderer} from '../render/CardRenderer';
import {IActionCard} from '../ICard';
import {Units} from '../../Units';
import {Card} from '../Card';

export class LunaTradeStation extends Card implements IActionCard {
  constructor() {
    super({
      name: CardName.LUNA_TRADE_STATION,
      cardType: CardType.ACTIVE,
      tags: [Tags.MOON, Tags.MOON, Tags.SPACE],
      cost: 10,
      productionDelta: Units.of({}),

      metadata: {
        description: 'Spend 2 titanium. Place this tile ON THE RESERVED AREA.',
        cardNumber: 'M13',
        renderData: CardRenderer.builder((b) => {
          b.action('Gain 1 MC for each mining tile on the Moon.', (eb) =>
            eb.empty().startAction.megacredits(2).slash().tile(TileType.MOON_COLONY, false));
          b.br.minus().titanium(2).tile(TileType.LUNA_TRADE_STATION, true).asterix();
        }),
      },
    });
  };
  public reserveUnits = Units.of({titanium: 2});

  public play(player: Player) {
    Units.deductUnits(this.reserveUnits, player);
    MoonExpansion.addTile(
      player,
      MoonSpaces.LUNA_TRADE_STATION,
      {
        tileType: TileType.LUNA_TRADE_STATION,
        card: this.name,
      });
    return undefined;
  }

  public canAct(): boolean {
    return true;
  }

  public action(player: Player, game: Game) {
    const surfaceColonies = MoonExpansion.tiles(game, TileType.MOON_COLONY, true).length;
    player.megaCredits += surfaceColonies * 2;
    return undefined;
  }
}
