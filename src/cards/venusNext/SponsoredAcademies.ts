import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {DiscardCards} from '../../deferredActions/DiscardCards';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {DrawCards} from '../../deferredActions/DrawCards';

export class SponsoredAcademies implements IProjectCard {
    public cost = 9;
    public tags = [Tags.EARTH, Tags.SCIENCE];
    public name = CardName.SPONSORED_ACADEMIES;
    public cardType = CardType.AUTOMATED;

    public canPlay(player: Player): boolean {
      return player.cardsInHand.length > 1; // this card and at least another
    }

    public play(player: Player, game: Game) {
      game.defer(new DiscardCards(player));
      game.defer(DrawCards.keepAll(player, 3));
      const otherPlayers = game.getPlayers().filter((p) => p.id !== player.id);
      for (const p of otherPlayers) {
        game.defer(DrawCards.keepAll(p));
      }
      return undefined;
    }

    public getVictoryPoints() {
      return 1;
    }

    public metadata: CardMetadata = {
      cardNumber: '247',
      renderData: CardRenderer.builder((b) => {
        b.minus().cards(1).br;
        b.plus().cards(3).digit.asterix().nbsp.plus().cards(1).any.asterix();
      }),
      description: 'Discard 1 card from your hand and THEN draw 3 cards. All OPPONENTS draw 1 card.',
      victoryPoints: 1,
    };
}
