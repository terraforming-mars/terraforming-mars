import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {PreludeCard} from './PreludeCard';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class AcquiredSpaceAgency extends PreludeCard {
    public tags = [];
    public name = CardName.ACQUIRED_SPACE_AGENCY;
    public play(player: Player, game: Game) {
      player.titanium += 6;
      return player.drawCard(game, {amount: 2, tag: Tags.SPACE});
    };
    public metadata: CardMetadata = {
      cardNumber: 'P35',
      renderData: CardRenderer.builder((b) => {
        b.titanium(6, false).br.br; // double break intentional
        b.cards(2).secondaryTag(Tags.SPACE);
      }),
      description: 'Gain 6 titanium. Reveal cards until you reveal two cards with Space Tags. Take them into your hand, discard the rest.',
    }
}

