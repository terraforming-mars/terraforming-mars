import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from '../CardType';
import { Player } from "../../Player";
import { CardName } from '../../CardName';
import { ResourceType } from '../../ResourceType';
import { Game } from '../../Game';
import { Resources } from '../../Resources';

export class SubZeroSaltFish implements IProjectCard {
    public cost: number = 5;
    public tags: Array<Tags> = [Tags.ANIMAL];
    public name: CardName = CardName.SUBZERO_SALT_FISH;
    public cardType: CardType = CardType.ACTIVE;
    public resourceType = ResourceType.ANIMAL;

    public canAct(): boolean {
        return true;
    }

    public canPlay(player: Player, game: Game): boolean {
      if (game.getPlayers().length > 1 && game.getPlayers().filter((p) => p.getProduction(Resources.PLANTS) > 0).length === 0) return false;
        return game.getTemperature() >= -6 - (player.getRequirementsBonus(game) * 2);
      }

    public action(player: Player) {
      player.addResourceTo(this);
      return undefined;
    }

    public play(player: Player, game: Game) {
      game.addResourceProductionDecreaseInterrupt(player, Resources.PLANTS, 1);
      return undefined;
    }

    public getVictoryPoints(player: Player): number {
        return Math.floor(player.getResourcesOnCard(this) / 2);
    }
}