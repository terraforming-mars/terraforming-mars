
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {SelectCard} from '../inputs/SelectCard';

export class EosChasmaNationalPark implements IProjectCard {
  public cost: number = 16;
  public nonNegativeVPIcon: boolean = true;
  public tags: Array<Tags> = [Tags.PLANT, Tags.STEEL];
  public name: string = 'EOS Chasma National Park';
  public cardType: CardType = CardType.AUTOMATED;
  public text: string = 'Requires -12C or warmer. Add 1 animal to any card. ' +
    'Gain 3 plants. Increase your mega credit production 2 steps. Gain 1 ' +
    'victory point.';
  public requirements: string = '-12C or Warmer';
  public description: string = 'A wonder of the world, doing wonders for ' +
    'the tourism business.';
  public canPlay(player: Player, game: Game): boolean {
    return game.getTemperature() >= -12 - (
      2 * player.getRequirementsBonus(game)
    );
  }
  public play(player: Player, game: Game) {
    const availableCards = game.getPlayedCardsWithAnimals();
    return new SelectCard(
        'Select card to add 1 animal',
        availableCards,
        (foundCards: Array<IProjectCard>) => {
          player.addResourceTo(foundCards[0]);
          player.plants += 3;
          player.megaCreditProduction += 2;
          player.victoryPoints++;
          return undefined;
        }
    );
  }
}
