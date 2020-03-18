import { IProjectCard } from "../IProjectCard";
import {ICard, IActionCard} from '../ICard';
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { ResourceType } from "../../ResourceType";
import { SelectCard } from '../../inputs/SelectCard';
import { SelectHowToPay } from '../../inputs/SelectHowToPay';
import { CardName } from '../../CardName';

export class FloatingHabs implements IActionCard,IProjectCard {
    public cost: number = 5;
    public tags: Array<Tags> = [Tags.VENUS];
    public name: CardName = CardName.FLOATING_HABS;
    public cardType: CardType = CardType.ACTIVE;
    public resourceType: ResourceType = ResourceType.FLOATER;
    public canPlay(player: Player): boolean {
        return player.getTagCount(Tags.SCIENCE) >= 2 ;
    }
    public play() {
        return undefined;
    }
    public canAct(player: Player): boolean {
        return player.canAfford(2);
    }  

    public getVictoryPoints(player: Player): number {
        return Math.floor(player.getResourcesOnCard(this) / 2);
    }
    
    public action(player: Player) {
      const floaterCards = player.getResourceCards(ResourceType.FLOATER);
      return new SelectCard(
          "Spend 2 MC and select card to add 1 floater",
          floaterCards,
          (foundCards: Array<ICard>) => {
            if (player.canUseHeatAsMegaCredits && player.heat > 0) {
              return new SelectHowToPay(
                'Select how to pay ', false, false,
                true,
                2,
                (htp) => {
                  if (htp.heat + htp.megaCredits < 2) {
                      throw new Error('Not enough spent to buy card');
                  }
                  player.megaCredits -= htp.megaCredits;
                  player.heat -= htp.heat;
                  player.addResourceTo(foundCards[0], 1);
                  return undefined;
                }
              );
            }
            player.addResourceTo(foundCards[0], 1);
            player.megaCredits -= 2;
            return undefined;
          }
      );
  }
}