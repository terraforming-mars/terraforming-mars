import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { CardName } from "../../CardName";
import { Game } from "../../Game";
import { OrOptions } from "../../inputs/OrOptions";
import { SelectOption } from "../../inputs/SelectOption";

export class MarketManipulation implements IProjectCard {
    public cost: number = 1;
    public tags: Array<Tags> = [Tags.EARTH];
    public name: CardName = CardName.MARKET_MANIPULATION;
    public cardType: CardType = CardType.EVENT;
    public hasRequirements = false;

    public canPlay(_player: Player, game: Game): boolean {
      const increasableColonies = this.getIncreasableColonies(game);
      const decreasableColonies = this.getDecreasableColonies(game);

      if (increasableColonies.length === 0) return false;
      if (decreasableColonies.length === 0) return false;
      if (increasableColonies.length === 1 && decreasableColonies.length === 1 && increasableColonies[0] === decreasableColonies[0]) {
        return false;
      }
            
      return true;
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

        const increasableColonies = this.getIncreasableColonies(game);
        const decreasableColonies = this.getDecreasableColonies(game);

        increasableColonies.forEach(function(c1){
          decreasableColonies.forEach(function(c2){
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
