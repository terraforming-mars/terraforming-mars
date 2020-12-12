import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {SelectSpace} from '../../inputs/SelectSpace';
import {SpaceType} from '../../SpaceType';
import {ISpace} from '../../ISpace';
import {CardName} from '../../CardName';
import {MAX_OXYGEN_LEVEL, REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class Mangrove implements IProjectCard {
    public cost = 12;
    public tags = [Tags.PLANT];
    public name = CardName.MANGROVE;
    public cardType = CardType.AUTOMATED;

    public canPlay(player: Player, game: Game): boolean {
      const meetsTemperatureRequirements = game.getTemperature() >= 4 - (2 * player.getRequirementsBonus(game));
      const oxygenMaxed = game.getOxygenLevel() === MAX_OXYGEN_LEVEL;

      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && !oxygenMaxed) {
        return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST, game, false, false, false, true) && meetsTemperatureRequirements;
      }

      return meetsTemperatureRequirements;
    }

    public play(player: Player, game: Game) {
      return new SelectSpace('Select ocean space for greenery tile', game.board.getAvailableSpacesForOcean(player), (foundSpace: ISpace) => {
        return game.addGreenery(player, foundSpace.id, SpaceType.OCEAN);
      });
    }
    public getVictoryPoints() {
      return 1;
    }

    public metadata: CardMetadata = {
      cardNumber: '059',
      requirements: CardRequirements.builder((b) => b.temperature(4)),
      renderData: CardRenderer.builder((b) => b.greenery(CardRenderItemSize.MEDIUM, true).asterix()),
      description: 'Requires +4 C or warmer. Place a greenery tile ON AN AREA RESERVED FOR OCEAN and raise oxygen 1 step. Disregard normal placement restrictions for this.',
      victoryPoints: 1,
    };
}
