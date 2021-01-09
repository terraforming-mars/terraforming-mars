import {IProjectCard} from '../IProjectCard';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Resources} from '../../Resources';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

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
    public metadata: CardMetadata = {
      cardNumber: 'C04',
      description: 'Increase your MC production 1 step per CARD WITH NO TAGS, including this.',
      renderData: CardRenderer.builder((b) => {
        b.production((pb) => {
          pb.megacredits(1);
        }).slash().noTags();
      }),
      victoryPoints: 1,
    }
}
