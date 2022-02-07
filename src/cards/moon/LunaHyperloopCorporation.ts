import {CardName} from '../../common/cards/CardName';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {Player} from '../../Player';
import {Resources} from '../../common/Resources';
import {TileType} from '../../common/TileType';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {CorporationCard} from '../corporation/CorporationCard';
import {IActionCard} from '../ICard';
import {all} from '../Options';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {CardRenderer} from '../render/CardRenderer';
import {Tags} from '../../common/cards/Tags';

export class LunaHyperloopCorporation extends Card implements IActionCard, CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.LUNA_HYPERLOOP_CORPORATION,
      tags: [Tags.MOON, Tags.BUILDING],
      startingMegaCredits: 38,

      victoryPoints: 'special',

      metadata: {
        description: 'You start with 38 M€ and 4 steel.',
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(38).steel(4).br;
          b.action('Gain 1 M€ for each road tile on the Moon.', (eb) => {
            eb.empty().startAction.megacredits(1).slash().moonRoad({all});
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
    const roadTileCount = MoonExpansion.spaces(player.game, TileType.MOON_ROAD, {surfaceOnly: true}).length;
    player.addResource(Resources.MEGACREDITS, roadTileCount, {log: true});

    return undefined;
  }

  public override getVictoryPoints(player: Player) {
    return MoonExpansion.spaces(player.game, TileType.MOON_ROAD, {surfaceOnly: true}).length;
  }
}
