import {IMilestone} from './IMilestone';
import {Player} from '../Player';
import {ResourceType} from '../common/ResourceType';

export class Hoverlord implements IMilestone {
  public name: string = 'Hoverlord';
  public description: string = 'Having at least 7 floater resources on your cards';
  public getScore(player: Player): number {
    let floaterResources: number = 0;
    player.getCardsWithResources(ResourceType.FLOATER).forEach((card) => {
      floaterResources += card.resourceCount;
    });
    return floaterResources;
  }
  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 7;
  }
}
