import { IProjectCard } from "../IProjectCard";
import { ICard, IActionCard, IResourceCard } from '../ICard';
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { ResourceType } from "../../ResourceType";
import { SelectCard } from '../../inputs/SelectCard';
import { CardName } from '../../CardName';
import { Game } from "../../Game";
import { LogHelper } from "../../components/LogHelper";

export class FloatingHabs implements IActionCard,IProjectCard, IResourceCard {
    public cost: number = 5;
    public tags: Array<Tags> = [Tags.VENUS];
    public name: CardName = CardName.FLOATING_HABS;
    public cardType: CardType = CardType.ACTIVE;
    public resourceType: ResourceType = ResourceType.FLOATER;
    public resourceCount: number = 0;
    public canPlay(player: Player): boolean {
        return player.getTagCount(Tags.SCIENCE) >= 2 ;
    }
    public play() {
        return undefined;
    }
    public canAct(player: Player): boolean {
        return player.canAfford(2);
    }  

    public getVictoryPoints(): number {
        return Math.floor(this.resourceCount / 2);
    }
    
    public action(player: Player, game: Game) {
      const floaterCards = player.getResourceCards(ResourceType.FLOATER);

      // add to itself if no other available target
      if (floaterCards.length === 1) {
        game.addSelectHowToPayInterrupt(player, 2, false, false, "Select how to pay for Floating Habs action");
        LogHelper.logAddResource(game, player, floaterCards[0]);
        player.addResourceTo(floaterCards[0], 1);
        return undefined;
      }

      return new SelectCard(
          "Spend 2 MC and select card to add 1 floater",
          floaterCards,
          (foundCards: Array<ICard>) => {
            game.addSelectHowToPayInterrupt(player, 2, false, false, "Select how to pay for Floating Habs action");
            LogHelper.logAddResource(game, player, foundCards[0]);
            player.addResourceTo(foundCards[0], 1);
            return undefined;
          }
      );
  }
}