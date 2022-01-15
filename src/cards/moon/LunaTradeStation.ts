import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {MoonSpaces} from '../../moon/MoonSpaces';
import {TileType} from '../../TileType';
import {CardRenderer} from '../render/CardRenderer';
import {IActionCard} from '../ICard';
import {Units} from '../../Units';
import {MoonCard} from './MoonCard';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {all} from '../Options';

export class LunaTradeStation extends MoonCard implements IActionCard {
  constructor() {
    super({
      name: CardName.LUNA_TRADE_STATION,
      cardType: CardType.ACTIVE,
      tags: [Tags.MOON, Tags.MOON, Tags.SPACE],
      cost: 10,
      reserveUnits: Units.of({titanium: 2}),

      metadata: {
        description: 'Spend 2 titanium. Place this tile ON THE RESERVED AREA.',
        cardNumber: 'M13',
        renderData: CardRenderer.builder((b) => {
          b.action('Gain 2 M€ for each colony tile on the Moon.', (eb) =>
            eb.empty().startAction.megacredits(2).slash().moonColony({all}));
          b.br.minus().titanium(2).tile(TileType.LUNA_TRADE_STATION, true).asterix();
        }),
      },
    });
  };

  public override play(player: Player) {
    super.play(player);
    MoonExpansion.addTile(
      player,
      MoonSpaces.LUNA_TRADE_STATION,
      {
        tileType: TileType.LUNA_TRADE_STATION,
        card: this.name,
      });
    return undefined;
  }

  private surfaceColonyCount(game: Game): number {
    return MoonExpansion.tiles(game, TileType.MOON_COLONY, {surfaceOnly: true}).length;
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
