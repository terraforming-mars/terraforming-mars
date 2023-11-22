import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {ICorporationCard} from './ICorporationCard';
import {CorporationCard} from './CorporationCard';
import {IProjectCard} from '../IProjectCard';
import {Resource} from '../../../common/Resource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {all, played} from '../Options';

export class SaturnSystems extends CorporationCard {
  constructor() {
    super({
      name: CardName.SATURN_SYSTEMS,
      tags: [Tag.JOVIAN],
      startingMegaCredits: 42,

      behavior: {
        // The 1MC is for the card effect related to itself.
        production: {titanium: 1, megacredits: 1},
      },

      metadata: {
        cardNumber: 'R03',
        description: 'You start with 1 titanium production and 42 M€.',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.production((pb) => pb.titanium(1)).nbsp.megacredits(42);
          b.corpBox('effect', (ce) => {
            ce.effect('Each time any Jovian tag is put into play, including this, increase your M€ production 1 step.', (eb) => {
              eb.jovian({played, all}).startEffect.production((pb) => pb.megacredits(1));
            });
          });
        }),
      },
    });
  }

  public onCardPlayed(player: IPlayer, card: IProjectCard) {
    this._onCardPlayed(player, card);
  }

  public onCorpCardPlayed(player: IPlayer, card: ICorporationCard) {
    this._onCardPlayed(player, card);
    return undefined;
  }

  private _onCardPlayed(player: IPlayer, card: IProjectCard | ICorporationCard) {
    for (const tag of card.tags) {
      if (tag === Tag.JOVIAN) {
        player.game.getCardPlayerOrThrow(this.name).production.add(Resource.MEGACREDITS, 1, {log: true});
      }
    }
  }
}
