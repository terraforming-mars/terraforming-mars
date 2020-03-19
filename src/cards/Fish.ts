
import { IActionCard, IResourceCard } from './ICard';
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {ResourceType} from '../ResourceType';
import {Player} from '../Player';
import {Game} from '../Game';
import { Resources } from '../Resources';
import { CardName } from '../CardName';

export class Fish implements IActionCard, IProjectCard, IResourceCard {
  public cost: number = 9;
  public tags: Array<Tags> = [Tags.ANIMAL];
  public name: CardName = CardName.FISH;
  public resourceType: ResourceType = ResourceType.ANIMAL;
  public resourceCount: number = 0;
  public cardType: CardType = CardType.ACTIVE;

  public canPlay(player: Player, game: Game): boolean {
    if (game.getPlayers().length > 1 && game.getPlayers().filter((p) => p.getProduction(Resources.PLANTS) > 0).length === 0) return false;
    return game.getTemperature() >= 2 - (player.getRequirementsBonus(game) * 2);
  }
  public getVictoryPoints(player: Player): number {
    return player.getResourcesOnCard(this);
  }
  public play(player: Player, game: Game) {
    game.addResourceProductionDecreaseInterrupt(player, Resources.PLANTS, 1);
    return undefined;
  }
  public canAct(): boolean {
    return true;
  }
  public action(player: Player) {
    player.addResourceTo(this);
    return undefined;
  }
}
