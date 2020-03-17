
import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { CardName } from '../../CardName';

export class MartianSurvey implements IProjectCard {
    public cost: number = 9;
    public tags: Array<Tags> = [Tags.SCIENCE];
    public name: string = CardName.MARTIAN_SURVEY;
    public cardType: CardType = CardType.EVENT;
    public canPlay(player: Player, game: Game): boolean {
		return game.getOxygenLevel() <= 4 + player.getRequirementsBonus(game);
    }

    public play(player: Player, game: Game) {
		for (let i = 0; i < 2; i++) {
            player.cardsInHand.push(game.dealer.dealCard());
        } 
        return undefined;
    }
    public getVictoryPoints() {
      return 1;
  }
}
