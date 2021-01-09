import {CorporationCard} from '../corporation/CorporationCard';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class Polyphemos implements CorporationCard {
    public name = CardName.POLYPHEMOS;
    public tags = [];
    public startingMegaCredits: number = 50;
    public cardType = CardType.CORPORATION;
    public cardCost = 5;

    public play(player: Player) {
      player.addProduction(Resources.MEGACREDITS, 5);
      player.titanium = 5;
      return undefined;
    }

    public metadata: CardMetadata = {
      cardNumber: 'R11',
      description: 'You start with 50MC. Increase your MC production 5 steps. Gain 5 titanium.',
      renderData: CardRenderer.builder((b) => {
        b.br;
        b.megacredits(50).nbsp.production((pb) => pb.megacredits(5)).nbsp.titanium(5).digit;
        b.corpBox('effect', (ce) => {
          ce.effect('When you buy a card to hand, pay 5MC instead of 3, including the starting hand.', (eb) => {
            eb.cards(1).asterix().startEffect.megacredits(5);
          });
        });
      }),
    }
}
