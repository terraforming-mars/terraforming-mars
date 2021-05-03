import {CardName} from '../../CardName';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {Player} from '../../Player';
import {TileType} from '../../TileType';
import {CardMetadata} from '../CardMetadata';
import {CardType} from '../CardType';
import {CorporationCard} from '../corporation/CorporationCard';
import {IActionCard} from '../ICard';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {CardRenderer} from '../render/CardRenderer';
import {Tags} from '../Tags';

export class LunaHyperloopCorporation implements IActionCard, CorporationCard {
  public name = CardName.LUNA_HYPERLOOP_CORPORATION;
  public startingMegaCredits = 38;
  public tags = [Tags.MOON, Tags.BUILDING];
  public cardType = CardType.CORPORATION;

  public play(player: Player) {
    player.steel += 4;
    return undefined;
  }

  public canAct() {
    return true;
  }

  public action(player: Player) {
    const roadTileCount = MoonExpansion.tiles(player.game, TileType.MOON_ROAD, {surfaceOnly: true}).length;
    player.megaCredits += roadTileCount;
    return undefined;
  }

  public getVictoryPoints(player: Player) {
    return MoonExpansion.tiles(player.game, TileType.MOON_ROAD, {surfaceOnly: true}).length;
  }

  public readonly metadata: CardMetadata = {
    description: 'You start with 38 M€ and 4 steel.',
    cardNumber: '',
    renderData: CardRenderer.builder((b) => {
      b.megacredits(38).steel(4).br;
      b.action('Gain 1 M€ for each road tile on the Moon.', (eb) => {
        eb.empty().startAction.megacredits(1).slash().moonRoad().any;
      }).br,
      b.vpText('1 VP for each road tile on the Moon.').br;
    }),
    victoryPoints: CardRenderDynamicVictoryPoints.moonRoadTile(1, true),
  }
}
