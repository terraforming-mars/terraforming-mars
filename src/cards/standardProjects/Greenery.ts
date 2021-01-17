import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {Game} from '../../Game';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {StandardProjectCard} from './StandardProjectCard';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import * as constants from '../../constants';
import {PlaceGreeneryTile} from '../../deferredActions/PlaceGreeneryTile';
import {AltSecondaryTag} from '../render/CardRenderItem';

export class Greenery extends StandardProjectCard {
  public name = CardName.STANDARD_GREENERY;
  public cost = 23;

  public canAct(player: Player, game: Game): boolean {
    let greeneryCost = this.cost;
    const oxygenNotMaxed = game.getOxygenLevel() < constants.MAX_OXYGEN_LEVEL;
    if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && oxygenNotMaxed) greeneryCost += REDS_RULING_POLICY_COST;

    return player.canAfford(greeneryCost) && game.board.getAvailableSpacesForGreenery(player).length > 0;
  }

  actionEssence(player: Player, game: Game): void {
    game.defer(new PlaceGreeneryTile(player, 'Select space for greenery'));
  }

  public metadata: CardMetadata = {
    cardNumber: 'SP6',
    renderData: CardRenderer.builder((b) =>
      b.standardProject('Spend 23 MC to place a greenery tile and raise oxygen 1 step.', (eb) => {
        eb.megacredits(23).startAction.greenery().secondaryTag(AltSecondaryTag.OXYGEN);
      }),
    ),
  };
}
