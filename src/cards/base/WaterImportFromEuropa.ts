import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {MAX_OCEAN_TILES, REDS_RULING_POLICY_COST} from '../../constants';
import {CardName} from '../../CardName';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';

export class WaterImportFromEuropa extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.WATER_IMPORT_FROM_EUROPA,
      tags: [Tags.JOVIAN, Tags.SPACE],
      cost: 25,

      metadata: {
        cardNumber: '012',
        renderData: CardRenderer.builder((b) => {
          b.action('Pay 12 MC to place an ocean tile. TITANIUM MAY BE USED as if playing a Space card.', (eb) => {
            eb.megacredits(12).titanium(1).brackets.startAction.oceans(1);
          }).br;
          b.vpText('1 VP for each Jovian tag you have.');
        }),
        victoryPoints: CardRenderDynamicVictoryPoints.jovians(1, 1),
      },
    });
  }
  public getVictoryPoints(player: Player) {
    return player.getTagCount(Tags.JOVIAN, false, false);
  }
  public play() {
    return undefined;
  }
  public canAct(player: Player, game: Game): boolean {
    const oceansMaxed = game.board.getOceansOnBoard() === MAX_OCEAN_TILES;
    const oceanCost = 12;

    if (oceansMaxed) return player.canAfford(oceanCost, game, false, true);

    if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
      return player.canAfford(oceanCost + REDS_RULING_POLICY_COST, game, false, true);
    }

    return player.canAfford(oceanCost, game, false, true); ;
  }
  public action(player: Player, game: Game) {
    game.defer(new SelectHowToPayDeferred(player, 12, {canUseTitanium: true, title: 'Select how to pay for action'}));
    game.defer(new PlaceOceanTile(player));
    return undefined;
  }
}
