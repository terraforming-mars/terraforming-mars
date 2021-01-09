import {Card} from '../Card';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CorporationCard} from './CorporationCard';
import {IProjectCard} from '../IProjectCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {ICard} from '../ICard';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';

export class SaturnSystems extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.SATURN_SYSTEMS,
      tags: [Tags.JOVIAN],
      startingMegaCredits: 42,

      metadata: {
        cardNumber: 'R03',
        description: 'You start with 1 titanium production and 42 MC.',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.production((pb) => pb.titanium(1)).nbsp.megacredits(42);
          b.corpBox('effect', (ce) => {
            ce.effect('Each time any Jovian tag is put into play, including this, increase your MC production 1 step.', (eb) => {
              eb.jovian().played.any.startEffect.production((pb) => pb.megacredits(1));
            });
          });
        }),
      },
    });
  }

  public onCardPlayed(_player: Player, game: Game, card: IProjectCard) {
    for (const tag of card.tags) {
      if (tag === Tags.JOVIAN) {
        game.getCardPlayer(this.name).addProduction(Resources.MEGACREDITS);
      }
    }
  }

  public onCorpCardPlayed(_player: Player, game: Game, card: CorporationCard) {
    return this.onCardPlayed(_player, game, card as ICard as IProjectCard);
  }

  public play(player: Player) {
    player.addProduction(Resources.TITANIUM);
    player.addProduction(Resources.MEGACREDITS);
    return undefined;
  }
}
