import {Card} from '../Card';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {CorporationCard} from './CorporationCard';
import {IProjectCard} from '../IProjectCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
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

  public onCardPlayed(player: Player, card: IProjectCard) {
    this._onCardPlayed(player, card);
  }

  public onCorpCardPlayed(player: Player, card: CorporationCard) {
    return this._onCardPlayed(player, card);
  }

  private _onCardPlayed(player: Player, card: IProjectCard | CorporationCard) {
    for (const tag of card.tags) {
      if (tag === Tags.JOVIAN) {
        player.game.getCardPlayer(this.name).addProduction(Resources.MEGACREDITS);
      }
    }
  }

  public play(player: Player) {
    player.addProduction(Resources.TITANIUM);
    player.addProduction(Resources.MEGACREDITS);
    return undefined;
  }
}
