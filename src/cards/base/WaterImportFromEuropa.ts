import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {MAX_OCEAN_TILES, REDS_RULING_POLICY_COST} from '../../constants';
import {CardName} from '../../CardName';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {CardMetadata} from '../CardMetadata';
import {CardRenderItemSize} from '../render/CardRenderItemSize';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';

export class WaterImportFromEuropa implements IActionCard, IProjectCard {
    public cost = 25;
    public tags = [Tags.JOVIAN, Tags.SPACE];
    public name = CardName.WATER_IMPORT_FROM_EUROPA;
    public cardType = CardType.ACTIVE;

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
      game.defer(new SelectHowToPayDeferred(player, 12, false, true, 'Select how to pay for action'));
      game.defer(new PlaceOceanTile(player, game));
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '012',
      renderData: CardRenderer.builder((b) => {
        b.effectBox((eb) => {
          eb.megacredits(12).titanium(1).brackets.startAction.oceans(1);
          eb.description('Action: Pay 12 MC to place an ocean tile. TITANIUM MAY BE USED as if playing a Space card.');
        }).br;
        b.text('1 VP for each Jovian tag you have.', CardRenderItemSize.TINY, true);
      }),
      description: 'Requires 2 ocean tiles.',
      victoryPoints: CardRenderDynamicVictoryPoints.jovians(1, 1),
    }
}
