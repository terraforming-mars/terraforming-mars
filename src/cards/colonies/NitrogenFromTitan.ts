import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from '../CardType';
import { Player } from "../../Player";
import { CardName } from '../../CardName';
import { ResourceType } from '../../ResourceType';
import { Game } from '../../Game';

export class NitrogenFromTitan implements IProjectCard {
    public cost: number = 25;
    public tags: Array<Tags> = [Tags.JOVIAN, Tags.SPACE];
    public name: string = CardName.NITROGEN_FROM_TITAN;
    public cardType: CardType = CardType.AUTOMATED;

    public play(player: Player, game: Game) {
      player.terraformRating += 2;
      game.addResourceInterrupt(player, ResourceType.FLOATER, 2, Tags.JOVIAN);
      return undefined;
    }
    public getVictoryPoints() {
        return 1;
    }
}

