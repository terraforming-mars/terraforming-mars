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
        let addTempOrVenus: boolean = false;
        let addSelectcard: boolean = false;
        const floaterCards = player.getResourceCards(ResourceType.FLOATER);
        const tempOrVenus = new  OrOptions(
            new SelectOption("Raise temperature 2 steps", () => {
                game.increaseTemperature(player,2);
                return undefined;
            }),
            new SelectOption("Raise Venus 2 steps", () => {
                game.increaseVenusScaleLevel(player,2);
                return undefined;
            })
        );
        
        const chooseCard = new SelectCard(
            'Select card to add 2 floaters',
            floaterCards,
            (foundCards: Array<IProjectCard>) => {
              player.addResourceTo(foundCards[0], 2);
              return undefined;
            }
        );

        if (game.getTemperature() < MAX_TEMPERATURE && game.getVenusScaleLevel() < MAX_VENUS_SCALE) {
            addTempOrVenus = true;
        } else if (game.getTemperature() < MAX_TEMPERATURE) {
            addTempOrVenus = false;
            game.increaseTemperature(player,2);
        } else if (game.getVenusScaleLevel() < MAX_VENUS_SCALE){
            addTempOrVenus = false;
            game.increaseVenusScaleLevel(player,2);
        } else {
            addTempOrVenus = false;
        }

        
        if (floaterCards.length > 0) {
            addSelectcard = true;
        }

        if (!addSelectcard && !addTempOrVenus) return undefined;

        if (addTempOrVenus) opts.push(tempOrVenus);
        if (addSelectcard) opts.push(chooseCard);

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