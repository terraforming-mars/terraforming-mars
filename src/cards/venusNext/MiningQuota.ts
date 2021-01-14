import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class MiningQuota implements IProjectCard {
    public cost = 5;
    public tags = [Tags.BUILDING];
    public name = CardName.MINING_QUOTA;
    public cardType = CardType.AUTOMATED;

    public canPlay(player: Player): boolean {
      return player.checkMultipleTagPresence([Tags.VENUS, Tags.EARTH, Tags.JOVIAN]);
    }

    public play(player: Player) {
      player.addProduction(Resources.STEEL, 2);
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '239',
      requirements: CardRequirements.builder((b) => b.tag(Tags.VENUS).tag(Tags.EARTH).tag(Tags.JOVIAN)),
      renderData: CardRenderer.builder((b) => {
        b.production((pb) => pb.steel(2));
      }),
      description: 'Requires Venus, Earth and Jovian tags. Increase your steel production 2 steps.',
    }
}
