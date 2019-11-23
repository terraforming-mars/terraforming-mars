
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';

export class Farming implements IProjectCard {
  public cost: number = 16;
  public tags: Array<Tags> = [Tags.PLANT];
  public name: string = 'Farming';
  public cardType: CardType = CardType.AUTOMATED;
  public text: string = 'Requires +4C or warmer. Increase your mega credit ' +
    'production 2 steps and your plant production 2 steps. Gain 2 plants. ' +
    'Gain 2 victory points.';
  public requirements: string = '+4C or Warmer';
  public description: string = 'At last we can have a decent food production' +
    ' allowing for rapid population increase.';
  public canPlay(player: Player, game: Game): boolean {
    return game.getTemperature() >= 4 - (2 * player.getRequirementsBonus(game));
  }
  public play(player: Player) {
    player.megaCreditProduction += 2;
    player.plantProduction += 2;
    player.plants += 2;
    return undefined;
  }
}
