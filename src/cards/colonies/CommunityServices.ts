import {IProjectCard} from '../IProjectCard';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Resources} from '../../Resources';

export class CommunityServices implements IProjectCard {
    public cost = 13;
    public tags = [];
    public name = CardName.COMMUNITY_SERVICES;
    public cardType = CardType.AUTOMATED;

    public play(player: Player) {
      player.addProduction(Resources.MEGACREDITS, player.getNoTagsCount() + 1);
      return undefined;
    }

    public getVictoryPoints() {
      return 1;
    }
}
