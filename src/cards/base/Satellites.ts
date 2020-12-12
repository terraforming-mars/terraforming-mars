import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class Satellites implements IProjectCard {
    public cost = 10;
    public cardType = CardType.AUTOMATED;
    public tags = [Tags.SPACE];
    public name = CardName.SATELLITES;

    public play(player: Player) {
      player.addProduction(Resources.MEGACREDITS, 1 + player.getTagCount(Tags.SPACE));
      return undefined;
    }

    public metadata: CardMetadata = {
      cardNumber: '175',
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => {
          pb.megacredits(1).slash().space().played;
        });
      }),
      description: 'Increase your MC production 1 step for each space tag your have, including this one.',
    }
}
