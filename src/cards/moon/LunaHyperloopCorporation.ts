import {CardName} from '../../CardName';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {TileType} from '../../TileType';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {CorporationCard} from '../corporation/CorporationCard';
import {IActionCard} from '../ICard';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {CardRenderer} from '../render/CardRenderer';
import {Tags} from '../Tags';

export class LunaHyperloopCorporation extends Card implements IActionCard, CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.LUNA_HYPERLOOP_CORPORATION,
      tags: [Tags.MOON, Tags.BUILDING],
      startingMegaCredits: 38,

      metadata: {
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
      },
    });
  }

  public play(player: Player) {
    player.steel += 4;
    return undefined;
  }

  public canAct() {
    return true;
  }

  public action(player: Player) {
    const roadTileCount = MoonExpansion.tiles(player.game, TileType.MOON_ROAD, {surfaceOnly: true}).length;
    player.addResource(Resources.MEGACREDITS, roadTileCount, {log: true});

    return undefined;
  }

  public getVictoryPoints(player: Player) {
    return MoonExpansion.tiles(player.game, TileType.MOON_ROAD, {surfaceOnly: true}).length;
  }
}
