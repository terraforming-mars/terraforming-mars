import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {PreludeCard} from './PreludeCard';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class UNMIContractor extends PreludeCard {
  constructor() {
    super({
      name: CardName.UNMI_CONTRACTOR,
      tags: [Tags.EARTH],
      metadata: {
        cardNumber: 'P34',
        renderData: CardRenderer.builder((b) => {
          b.tr(3).br;
          b.cards(1);
        }),
        description: 'Increase your TR 3 steps. Draw a card.',
      },
    });
  }

  public play(player: Player, game: Game) {
    player.increaseTerraformRatingSteps(3, game);
    player.drawCard();
    return undefined;
  }
}
