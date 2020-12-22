import {Tags} from '../Tags';
import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class VenusFirst extends PreludeCard implements IProjectCard {
    public tags = [Tags.VENUS];
    public name = CardName.VENUS_FIRST;

    public play(player: Player, game: Game) {
      game.increaseVenusScaleLevel(player, 2);

      const drawnCards = game.drawCardsByTag(Tags.VENUS, 2);

      if (drawnCards.length > 0) {
        for (const foundCard of drawnCards) {
          player.cardsInHand.push(foundCard);
        }

        if (drawnCards.length > 1) {
          game.log('${0} drew ${1} and ${2}', (b) => b.player(player).card(drawnCards[0]).card(drawnCards[1]));
        }
      }

      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: 'Y07',
      renderData: CardRenderer.builder((b) => {
        b.venus(2).br.br;
        b.cards(2).secondaryTag(Tags.VENUS);
      }),
      description: 'Raise Venus 2 steps. Draw 2 Venus cards from the deck.',
    }
}

