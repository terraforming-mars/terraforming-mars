import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Resources} from '../../Resources';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';

export class LunaGovernor implements IProjectCard {
    public cost = 4;
    public tags = [Tags.EARTH, Tags.EARTH];
    public name = CardName.LUNA_GOVERNOR;
    public cardType = CardType.AUTOMATED;

    public canPlay(player: Player): boolean {
      return player.getTagCount(Tags.EARTH) >= 3;
    }

    public play(player: Player) {
      player.addProduction(Resources.MEGACREDITS, 2);
      return undefined;
    }

    public metadata: CardMetadata = {
      cardNumber: 'C20',
      requirements: CardRequirements.builder((b) => b.tag(Tags.EARTH, 3)),
      renderData: CardRenderer.builder((b) => {
        b.production((pb) => pb.megacredits(2));
      }),
      description: 'Requires 3 Earth tags. Increase your MC production 2 steps.',
    };
}
