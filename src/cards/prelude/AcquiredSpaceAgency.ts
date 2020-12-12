import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {DrawCards} from '../../deferredActions/DrawCards';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class AcquiredSpaceAgency extends PreludeCard implements IProjectCard {
    public tags = [];
    public name = CardName.ACQUIRED_SPACE_AGENCY;
    public play(player: Player, game: Game) {
      game.defer(new DrawCards(player, game, 2, Tags.SPACE));
      player.titanium += 6;
      return undefined;
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

