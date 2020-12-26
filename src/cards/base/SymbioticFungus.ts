import {Tags} from '../Tags';
import {IActionCard, ICard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardType} from '../CardType';
import {SelectCard} from '../../inputs/SelectCard';
import {ResourceType} from '../../ResourceType';
import {CardName} from '../../CardName';
import {LogHelper} from '../../components/LogHelper';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class SymbioticFungus implements IActionCard, IProjectCard {
    public cost = 4;
    public tags = [Tags.MICROBE];
    public cardType = CardType.ACTIVE;
    public name = CardName.SYMBIOTIC_FUNGUS;
    public canPlay(player: Player, game: Game): boolean {
      return game.getTemperature() >= -14 - (2 * player.getRequirementsBonus(game));
    }
    public play() {
      return undefined;
    }
    public canAct(): boolean {
      return true;
    }
    public action(player: Player, game: Game) {
      const availableCards = player.getResourceCards(ResourceType.MICROBE);
      if (availableCards.length === 0) return undefined;

      if (availableCards.length === 1) {
        player.addResourceTo(availableCards[0]);
        LogHelper.logAddResource(game, player, availableCards[0]);
        return undefined;
      }

      return new SelectCard('Select card to add microbe', 'Add microbe', availableCards, (foundCards: Array<ICard>) => {
        player.addResourceTo(foundCards[0]);
        LogHelper.logAddResource(game, player, foundCards[0]);
        return undefined;
      });
    }
    public metadata: CardMetadata = {
      cardNumber: '133',
      requirements: CardRequirements.builder((b) => b.temperature(-14)),
      renderData: CardRenderer.builder((b) => {
        b.effectBox((eb) => {
          eb.empty().startAction.microbes(1).asterix();
          eb.description('Action: Add a microbe to ANOTHER card.');
        });
      }),
      description: 'Requires -14 C° or warmer.',
    };
}

