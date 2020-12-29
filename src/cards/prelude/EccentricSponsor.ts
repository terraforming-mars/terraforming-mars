import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {PlayProjectCard} from '../../deferredActions/PlayProjectCard';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class EccentricSponsor extends PreludeCard implements IProjectCard {
    public tags = [];
    public name = CardName.ECCENTRIC_SPONSOR;

    public getCardDiscount(player: Player, _game: Game) {
      if (player.lastCardPlayed !== undefined && player.lastCardPlayed.name === this.name) {
        return 25;
      }
      return 0;
    }

    public play(player: Player, game: Game) {
      game.defer(new PlayProjectCard(player, game));
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: 'P11',
      renderData: CardRenderer.builder((b) => {
        b.text('Play a card from hand, reducing its cost by 25 MC', CardRenderItemSize.SMALL, true);
      }),
    }
}
