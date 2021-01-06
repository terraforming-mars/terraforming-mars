import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {Game} from '../../Game';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import * as constants from '../../constants';
import {AltSecondaryTag} from '../render/CardRenderItem';
import {StandardAction} from './StandardAction';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';


export class ConvertPlants extends StandardAction {
  public name = CardName.CONVERT_PLANTS;

  public canAct(player: Player, game: Game): boolean {
    const hasEnoughPlants = player.plants >= player.plantsNeededForGreenery;
    const canPlaceGreenery = game.board.getAvailableSpacesForGreenery(player).length > 0;
    const oxygenIsMaxed = game.getOxygenLevel() === constants.MAX_OXYGEN_LEVEL;

    const redsAreRuling = PartyHooks.shouldApplyPolicy(game, PartyName.REDS);
    const canAffordReds = !redsAreRuling || (redsAreRuling && player.canAfford(REDS_RULING_POLICY_COST));

    return hasEnoughPlants && canPlaceGreenery && (oxygenIsMaxed || (!oxygenIsMaxed && canAffordReds));
  }

  public action(player: Player, game: Game) {
    return new SelectSpace(
      `Convert ${player.plantsNeededForGreenery} plants into greenery`,
      game.board.getAvailableSpacesForGreenery(player),
      (space: ISpace) => {
        this.actionPlayed(player, game);
        game.addGreenery(player, space.id);
        player.plants -= player.plantsNeededForGreenery;
        return undefined;
      },
    );
  }

  public metadata: CardMetadata = {
    cardNumber: 'SA1',
    renderData: CardRenderer.builder((b) =>
      b.standardProject('Spend 8 Plants to place a greenery tile and raise oxygen 1 step.', (eb) => {
        eb.plants(8).startAction.greenery().secondaryTag(AltSecondaryTag.OXYGEN);
      }),
    ),
  };
}
