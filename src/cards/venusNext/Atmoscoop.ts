import { IProjectCard } from '../IProjectCard';
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { OrOptions } from '../../inputs/OrOptions';
import { SelectOption } from '../../inputs/SelectOption';
import { ResourceType } from '../../ResourceType';
import { SelectCard } from '../../inputs/SelectCard';
import { ICard } from '../ICard';

export class Atmoscoop implements IProjectCard {
    public cost: number = 22;
    public tags: Array<Tags> = [Tags.JOVIAN, Tags.SPACE];
    public name: string = "Atmoscoop";
    public cardType: CardType = CardType.EVENT;
    public canPlay(player: Player): boolean {
        return player.getTagCount(Tags.SCIENCE) >= 3 ;
      }
    public play(player: Player, game: Game) {
        const floaterCards = player.getResourceCards(ResourceType.FLOATER);
        const raiseTemp = new SelectCard(
            'Select card to add 2 floaters and raise temperature 2 steps',
            floaterCards,
            (foundCards: Array<ICard>) => {
              player.addResourceTo(foundCards[0], 2);
              return game.increaseTemperature(player,2);
            }
        );
        const raiseVenus = new SelectCard(
            'Select card to add 2 floaters and raise Venus 2 steps',
            floaterCards,
            (foundCards: Array<ICard>) => {
              player.addResourceTo(foundCards[0], 2);
              return game.increaseVenusScaleLevel(player,2);
            }
        );
        const raiseTempOnly = new SelectOption("Raise temperature 2 steps", () => {
            return game.increaseTemperature(player,2);
        });
        const raiseVenusOnly = new SelectOption("Raise Venus 2 steps", () => {
            return game.increaseVenusScaleLevel(player,2);
        });

        if (floaterCards.length > 0) {
            return new OrOptions(raiseTemp, raiseVenus);
        } else {
            return new OrOptions(raiseTempOnly, raiseVenusOnly);
        }
    }
    
    public getVictoryPoints() {
        return 1;
    } 
}
