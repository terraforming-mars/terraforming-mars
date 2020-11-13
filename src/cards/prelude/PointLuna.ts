import {Tags} from '../Tags';
import {Player} from '../../Player';
import {CorporationCard} from './../corporation/CorporationCard';
import {IProjectCard} from '../IProjectCard';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';

export class PointLuna implements CorporationCard {
    public name = CardName.POINT_LUNA;
    public tags = [Tags.SPACE, Tags.EARTH];
    public startingMegaCredits: number = 38;
    public cardType = CardType.CORPORATION;
    public onCardPlayed(player: Player, game: Game, card: IProjectCard) {
      const tagCount = card.tags.filter((tag) => tag === Tags.EARTH).length;
      if (player.isCorporation(this.name) && card.tags.indexOf(Tags.EARTH) !== -1) {
        for (let i = 0; i < tagCount; i++) {
          player.cardsInHand.push(game.dealer.dealCard());
        }
      }
    }
    public play(player: Player, game: Game) {
      player.addProduction(Resources.TITANIUM);
      player.cardsInHand.push(game.dealer.dealCard());
      return undefined;
    }
}
