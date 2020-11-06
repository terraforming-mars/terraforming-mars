import { IProjectCard } from "./../IProjectCard";
import { Tags } from "./../Tags";
import { CardType } from "./../CardType";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { IActionCard } from "./../ICard";
import { CardName } from "../../CardName";

export class SubCrustMeasurements implements IActionCard, IProjectCard {
    public cost = 20;
    public tags = [Tags.SCIENCE, Tags.STEEL, Tags.EARTH];
    public cardType = CardType.ACTIVE;
    public name = CardName.SUB_CRUST_MEASUREMENTS;

    public canPlay(player: Player): boolean {
      return player.getTagCount(Tags.SCIENCE) >= 2;
    }

    public play() {
      return undefined;
    }

    public canAct(): boolean {
      return true;
    }

    public getVictoryPoints() {
      return 2;
    }

    public action(player: Player, game: Game) {
      player.cardsInHand.push(game.dealer.dealCard());
      return undefined;
    }
}
