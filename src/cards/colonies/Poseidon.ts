import {CorporationCard} from '../corporation/CorporationCard';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {BuildColony} from '../../deferredActions/BuildColony';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class Poseidon implements CorporationCard {
    public name = CardName.POSEIDON;
    public tags = [];
    public startingMegaCredits: number = 45;
    public cardType = CardType.CORPORATION;

    public initialActionText: string = 'Place a colony';
    public initialAction(player: Player) {
      if (player.game.gameOptions.coloniesExtension) {
        player.game.defer(new BuildColony(player, false, 'Poseidon first action - Select where to build colony'));
        return undefined;
      } else {
        console.warn('Colonies extension isn\'t selected.');
        return undefined;
      }
    }

    public play() {
      return undefined;
    }

    public metadata: CardMetadata = {
      cardNumber: 'R02',
      description: 'You start with 45MC. As your first action, place a colony.',
      renderData: CardRenderer.builder((b) => {
        b.br.br;
        b.megacredits(45).nbsp.colonies(1);
        b.corpBox('effect', (ce) => {
          ce.effect('When any colony is placed, including this, raise your MC production 1 step.', (eb) => {
            eb.colonies(1).any.startEffect.production((pb) => pb.megacredits(1));
          });
        });
      }),
    }
}
