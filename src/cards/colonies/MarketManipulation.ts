import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from '../CardType';
import { Player } from "../../Player";
import { CardName } from '../../CardName';
import { Game } from '../../Game';
import { OrOptions } from "../../inputs/OrOptions";
import { SelectOption } from "../../inputs/SelectOption";

export class MarketManipulation implements IProjectCard {
    public cost: number = 1;
    public tags: Array<Tags> = [Tags.EARTH];
    public name: CardName = CardName.MARKET_MANIPULATION;
    public cardType: CardType = CardType.EVENT;
    
    public canPlay(_player: Player, game: Game): boolean {
      return this.getIncreasableColonies(game).length > 0 && this.getDecreasableColonies(game).length > 0;
    }

    private getIncreasableColonies(game: Game) {
      return game.colonies.filter(colony => colony.trackPosition < 6 && colony.isActive);
    }

    private getDecreasableColonies(game: Game) {
      return game.colonies.filter(colony => colony.trackPosition > colony.colonies.length && colony.isActive);
    }

    public play(_player: Player, game: Game) {
        let selectColonies = new OrOptions();
        selectColonies.title = "Select colonies to increase and decrease tile track";

        let increaseColonies = this.getIncreasableColonies(game);
        let decreaseColonies = this.getDecreasableColonies(game);

        increaseColonies.forEach(function(c1){
          decreaseColonies.forEach(function(c2){
            if (c1.name !== c2.name) {
              let description = "Increase " + c1.name + " (" + c1.description + ") and decrease " + c2.name + " (" + c2.description + ")"
              const colonySelect =  new SelectOption(
                description,
                () => {
                  c1.increaseTrack();
                  c2.decreaseTrack();
                  return undefined;
                }
              );

              selectColonies.options.push(colonySelect);
            };
          });
        });

        return selectColonies;
    }
}
