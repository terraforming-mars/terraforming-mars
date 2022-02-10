import {CorporationCard} from '../corporation/CorporationCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardName} from '../../common/cards/CardName';
import {CardType} from '../../common/cards/CardType';
import {BuildColony} from '../../deferredActions/BuildColony';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';

export class Poseidon extends Card implements CorporationCard {
  constructor() {
    super({
      name: CardName.POSEIDON,
      startingMegaCredits: 45,
      cardType: CardType.CORPORATION,
      initialActionText: 'Place a colony',

      metadata: {
        cardNumber: 'R02',
        description: 'You start with 45 M€. As your first action, place a colony.',
        renderData: CardRenderer.builder((b) => {
          b.br.br;
          b.megacredits(45).nbsp.colonies(1);
          b.corpBox('effect', (ce) => {
            ce.effect('When any colony is placed, including this, raise your M€ production 1 step.', (eb) => {
              eb.colonies(1, {all}).startEffect.production((pb) => pb.megacredits(1));
            });
          });
        }),
      },
    });
  }

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
}
