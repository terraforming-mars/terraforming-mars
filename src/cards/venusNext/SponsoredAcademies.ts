import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {DrawCards} from '../../deferredActions/DrawCards';
import {DiscardCards} from '../../deferredActions/DiscardCards';

export class SponsoredAcademies implements IProjectCard {
    public cost = 9;
    public tags = [Tags.EARTH, Tags.SCIENCE];
    public name = CardName.SPONSORED_ACADEMIES;
    public cardType = CardType.AUTOMATED;
    public hasRequirements = false;

    public canPlay(player: Player): boolean {
      return player.cardsInHand.length > 1; // this card and at least another
    }

    public play(player: Player, game: Game) {
      game.defer(new DiscardCards(player, game));
      game.defer(new DrawCards(player, game, 3));
      const otherPlayers = game.getPlayers().filter((p) => p.id !== player.id);
      for (const p of otherPlayers) {
        game.defer(new DrawCards(p, game));
      }
      return undefined;
    }

    public getVictoryPoints() {
      return 1;
    }
}
