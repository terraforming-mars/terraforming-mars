import {IProjectCard} from '../IProjectCard';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {MAX_OXYGEN_LEVEL, REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {RemoveAnyPlants} from '../../deferredActions/RemoveAnyPlants';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class MiningExpedition implements IProjectCard {
    public cost = 12;
    public tags = [];
    public cardType = CardType.EVENT;
    public name = CardName.MINING_EXPEDITION;
    public hasRequirements = false;

    public canPlay(player: Player, game: Game): boolean {
      const oxygenMaxed = game.getOxygenLevel() === MAX_OXYGEN_LEVEL;

      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && !oxygenMaxed) {
        return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST);
      }

      return true;
    }

    public play(player: Player, game: Game) {
      game.defer(new RemoveAnyPlants(player, game, 2));
      player.steel += 2;
      return game.increaseOxygenLevel(player, 1);
    }

    public metadata: CardMetadata = {
      cardNumber: '063',
      renderData: CardRenderer.builder((b) => {
        b.oxygen(1);
        b.minus().plants(-2).any;
        b.steel(2);
      }),
      description: 'Raise oxygen 1 step. Remove 2 plants from any player. Gain 2 steel.',
    }
}
