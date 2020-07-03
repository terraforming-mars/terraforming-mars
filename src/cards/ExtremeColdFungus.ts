
import {ICard, IActionCard} from './ICard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {OrOptions} from '../inputs/OrOptions';
import {SelectOption} from '../inputs/SelectOption';
import {SelectCard} from '../inputs/SelectCard';
import {IProjectCard} from './IProjectCard';
import { ResourceType } from '../ResourceType';
import { CardName } from '../CardName';
import { LogHelper } from '../components/LogHelper';
import { Resources } from '../Resources';

export class ExtremeColdFungus implements IActionCard, IProjectCard {
    public cost: number = 13;
    public tags: Array<Tags> = [Tags.MICROBES];
    public cardType: CardType = CardType.ACTIVE;
    public name: CardName = CardName.EXTREME_COLD_FUNGUS;
    public canPlay(player: Player, game: Game): boolean {
      return game.getTemperature() <= -10 + (
        2 * player.getRequirementsBonus(game)
      );
    }
    public play() {
      return undefined;
    }
    public canAct(): boolean {
      return true;
    }
    public action(player: Player, game: Game) {
      const otherMicrobeCards = player.getResourceCards(ResourceType.MICROBE);

      if (otherMicrobeCards.length === 0) {
        player.plants++;
        LogHelper.logGainStandardResource(game, player, Resources.PLANTS);
        return undefined;
      }

      const gainPlantOption = new SelectOption('Gain 1 plant', () => {
        player.plants++;
        LogHelper.logGainStandardResource(game, player, Resources.PLANTS);
        return undefined;
      })

      if (otherMicrobeCards.length === 1) {
        const targetCard = otherMicrobeCards[0];

        return new OrOptions(
          new SelectOption('Add 2 microbes to ' + targetCard.name, () => {
            player.addResourceTo(targetCard, 2);
            LogHelper.logAddResource(game, player, targetCard, 2);
            return undefined;
          }),
          gainPlantOption
        );
      }

      return new OrOptions(
        new SelectCard(
          'Select card to add 2 microbes',
          otherMicrobeCards,
          (foundCards: Array<ICard>) => {
              player.addResourceTo(foundCards[0], 2);
              LogHelper.logAddResource(game, player, foundCards[0], 2);
              return undefined;
          }
        ),
        gainPlantOption
      );
    }
}
