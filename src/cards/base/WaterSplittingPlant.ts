import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {MAX_OXYGEN_LEVEL, REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class WaterSplittingPlant implements IProjectCard {
    public cost = 12;
    public tags = [Tags.STEEL];
    public name = CardName.WATER_SPLITTING_PLANT;
    public cardType = CardType.ACTIVE;
    public canPlay(player: Player, game: Game): boolean {
      return game.board.getOceansOnBoard() >= 2 - player.getRequirementsBonus(game);
    }
    public play() {
      return undefined;
    }
    public canAct(player: Player, game: Game): boolean {
      const hasEnoughEnergy = player.energy >= 3;
      const oxygenMaxed = game.getOxygenLevel() === MAX_OXYGEN_LEVEL;

      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && !oxygenMaxed) {
        return player.canAfford(REDS_RULING_POLICY_COST) && hasEnoughEnergy;
      }

      return hasEnoughEnergy;
    }
    public action(player: Player, game: Game) {
      player.energy -= 3;
      return game.increaseOxygenLevel(player, 1);
    }
    public metadata: CardMetadata = {
      cardNumber: '177',
      requirements: CardRequirements.builder((b) => b.oceans(2)),
      renderData: CardRenderer.builder((b) => {
        b.effectBox((eb) => {
          eb.energy(3).startAction.oxygen(1);
          eb.description('Action: Spend 3 Energy to raise oxygen 1 step.');
        });
      }),
      description: 'Requires 2 ocean tiles.',
    }
}
