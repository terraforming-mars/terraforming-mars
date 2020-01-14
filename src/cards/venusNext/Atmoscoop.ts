import { IProjectCard } from '../IProjectCard';
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { OrOptions } from '../../inputs/OrOptions';
import { SelectOption } from '../../inputs/SelectOption';
import { MAX_TEMPERATURE, MAX_VENUS_SCALE } from "../../constants";
import { ResourceType } from '../../ResourceType';
import { SelectCard } from '../../inputs/SelectCard';
import { AndOptions } from '../../inputs/AndOptions';


export class Atmoscoop implements IProjectCard {
    public cost: number = 22;
    public tags: Array<Tags> = [Tags.JOVIAN, Tags.SPACE];
    public name: string = "Atmoscoop";
    public cardType: CardType = CardType.EVENT;
    public canPlay(player: Player): boolean {
        return player.getTagCount(Tags.SCIENCE) >= 3 ;
      }
    public play(player: Player, game: Game) {
        var opts: Array<OrOptions | SelectCard<IProjectCard>> = [];
        const floaterCards = player.getResourceCards(ResourceType.FLOATER);
        const raiseTemp = new SelectOption("Raise temperature 2 steps", () => {
            return game.increaseTemperature(player,2);
        });
        const raiseVenus = new SelectOption("Raise Venus 2 steps", () => {
            return game.increaseVenusScaleLevel(player,2);
        });

        const tempOrVenus = new OrOptions(raiseTemp, raiseVenus);
        
        const chooseCard = new SelectCard(
            'Select card to add 2 floaters',
            floaterCards,
            (foundCards: Array<IProjectCard>) => {
              player.addResourceTo(foundCards[0], 2);
              return undefined;
            }
        );

        if (game.getTemperature() < MAX_TEMPERATURE && game.getVenusScaleLevel() < MAX_VENUS_SCALE) {
            opts.push(tempOrVenus);
        } else if (game.getTemperature() < MAX_TEMPERATURE) {
            opts.push(new OrOptions(raiseTemp));
        } else if (game.getVenusScaleLevel() < MAX_VENUS_SCALE){
            opts.push(new OrOptions(raiseVenus));
        } 

        if (floaterCards.length > 0) {
            opts.push(chooseCard);
        }

        if (opts.length === 0) return undefined;

        return new AndOptions(
            () => {
                return undefined;
            },
            ...opts
        );
    }
    
    public getVictoryPoints() {
        return 1;
    } 
}