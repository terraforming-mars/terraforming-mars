import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from '../CardType';
import { Player } from "../../Player";
import { CardName } from '../../CardName';
import { Game } from '../../Game';
import { OrOptions } from "../../inputs/OrOptions";
import { SelectOption } from "../../inputs/SelectOption";
import { AndOptions } from "../../inputs/AndOptions";

export class MarketManipulation implements IProjectCard {
    public cost: number = 1;
    public tags: Array<Tags> = [Tags.EARTH];
    public name: string = CardName.MARKET_MANIPULATION;
    public cardType: CardType = CardType.EVENT;

    public play(_player: Player, game: Game) {

        var opts: Array<OrOptions> = [];

        let selectColonyIncrease = new OrOptions();
        selectColonyIncrease.title = "Select colony to increase tile track";
        let increaseColonies = game.colonies.filter(colony => colony.trackPosition < 6);
        increaseColonies.forEach(colony => {
          const colonySelect =  new SelectOption(
            colony.name + " - (" + colony.description + ")", 
            () => {
              colony.increaseTrack();
              return undefined;
            }
          );
          selectColonyIncrease.options.push(colonySelect);
        });

        if (increaseColonies.length > 0 ) {
            opts.push(selectColonyIncrease);
        }

        let selectColonyDecrease = new OrOptions();
        selectColonyDecrease.title = "Select colony to decrease tile track"
        let decreaseColonies = game.colonies.filter(colony => colony.trackPosition > colony.colonies.length);
        decreaseColonies.forEach(colony => {
          const colonySelect =  new SelectOption(
            colony.name + " - (" + colony.description + ")", 
            () => {
              colony.decreaseTrack();
              return undefined;
            }
          );
          selectColonyDecrease.options.push(colonySelect);
        });
        
        if (decreaseColonies.length > 0 ) {
            opts.push(selectColonyDecrease);
        }

        return new AndOptions(()=> undefined,...opts);
    }
}
