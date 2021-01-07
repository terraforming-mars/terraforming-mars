import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {PreludeCard} from './PreludeCard';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class UNMIContractor extends PreludeCard {
    public tags = [Tags.EARTH];
    public name = CardName.UNMI_CONTRACTOR;

    public play(player: Player, game: Game) {
      player.increaseTerraformRatingSteps(3, game);
      return player.drawCard(game);
    }
    public metadata: CardMetadata = {
      cardNumber: 'P34',
      renderData: CardRenderer.builder((b) => {
        b.tr(3).br;
        b.cards(1);
      }),
      description: 'Increase your TR 3 steps. Draw a card.',
    }
}
