import {MoonExpansion} from '../moon/MoonExpansion';
import {Player} from '../Player';
import {PlayerInput} from '../PlayerInput';
import {Card} from './Card';
import {IProjectCard} from './IProjectCard';

export class ProjectCard extends Card implements IProjectCard {
  public play(player: Player): PlayerInput | undefined {
    const adjustedReserveUnits = MoonExpansion.adjustedReserveCosts(player, this);
    player.deductUnits(adjustedReserveUnits);
    return undefined;
  }
}
