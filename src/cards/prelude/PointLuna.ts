import {Tags} from '../Tags';
import {Player} from '../../Player';
import {CorporationCard} from './../corporation/CorporationCard';
import {IProjectCard} from '../IProjectCard';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class PointLuna implements CorporationCard {
    public name = CardName.POINT_LUNA;
    public tags = [Tags.SPACE, Tags.EARTH];
    public startingMegaCredits: number = 38;
    public cardType = CardType.CORPORATION;
    public onCardPlayed(player: Player, game: Game, card: IProjectCard) {
      const tagCount = card.tags.filter((tag) => tag === Tags.EARTH).length;
      if (player.isCorporation(this.name) && card.tags.indexOf(Tags.EARTH) !== -1) {
        player.drawCard(game, {amount: tagCount});
      }
    }
    public play(player: Player, game: Game) {
      player.addProduction(Resources.TITANIUM);
      return player.drawCard(game);
    }
    public metadata: CardMetadata = {
      cardNumber: 'R10',
      description: 'You start with 1 titanium production and 38 MC.',
      renderData: CardRenderer.builder((b) => {
        b.br;
        b.production((pb) => pb.titanium(1)).nbsp.megacredits(38);
        b.corpBox('effect', (ce) => {
          ce.effect('When you play an Earth tag, including this, draw a card.', (eb) => {
            eb.earth().played.startEffect.cards(1);
          });
        });
      }),
    }
}
