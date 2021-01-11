import {CorporationCard} from '../corporation/CorporationCard';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class MonsInsurance implements CorporationCard {
    public name = CardName.MONS_INSURANCE;
    public tags = [];
    public startingMegaCredits: number = 48;
    public cardType = CardType.CORPORATION;

    public play(player: Player, game: Game) {
      player.addProduction(Resources.MEGACREDITS, 6);
      for (const player of game.getPlayers()) {
        player.addProduction(Resources.MEGACREDITS, -2);
      }
      game.monsInsuranceOwner = player.id;
      return undefined;
    }

    public metadata: CardMetadata = {
      cardNumber: 'R46',
      description: 'You start with 48 MC. Increase your MC production 4 steps. ALL OPPONENTS DECREASE THEIR MC PRODUCTION 2 STEPS. THIS DOES NOT TRIGGER THE EFFECT BELOW.',
      renderData: CardRenderer.builder((b) => {
        b.megacredits(48).production((pb) => {
          pb.megacredits(4).nbsp.megacredits(-2).any.asterix();
        });
        b.corpBox('effect', (cb) => {
          cb.vSpace(CardRenderItemSize.SMALL);
          cb.effect('When a player causes another player to decrease production or lose resources, pay 3MC to the victim, or as much as possible.', (eb) => {
            eb.production((pb) => pb.wild(1).any).or().minus().wild(1).any;
            eb.startEffect.text('pay', CardRenderItemSize.SMALL, true).megacredits(3);
          });
        });
      }),
    }
}
