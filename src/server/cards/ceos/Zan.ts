import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';
import {PartyName} from '../../../common/turmoil/PartyName';
import {Turmoil} from '../../turmoil/Turmoil';
import {Size} from '../../../common/cards/render/Size';
import {Resource} from '../../../common/Resource';

export class Zan extends CeoCard {
  constructor() {
    super({
      name: CardName.ZAN,
      metadata: {
        cardNumber: 'L26',
        renderData: CardRenderer.builder((b) => {
          b.effect('You are immune to Reds\' ruling policy.', (eb) => eb.startEffect.redsInactive().asterix());
          b.br.br;
          b.opgArrow().text('ALL', Size.SMALL).delegates(1).colon().reds().megacredits(1);
        }),
        description: 'Once per game, place all of your available delegates in Reds. Gain 1 M€ for each delegate placed this way.',
      },
    });
  }

  public action(player: IPlayer): PlayerInput | undefined {
    this.isDisabled = true;
    const game = player.game;
    const turmoil = Turmoil.getTurmoil(game);
    const totalAvailableDelegates = turmoil.getAvailableDelegateCount(player);
    while (turmoil.getAvailableDelegateCount(player) > 0) {
      turmoil.sendDelegateToParty(player, PartyName.REDS, game);
    }
    // If we dont do this player will not get the bonus for POLITICAN Awards
    player.totalDelegatesPlaced += totalAvailableDelegates;
    player.stock.add(Resource.MEGACREDITS, totalAvailableDelegates, {log: true});
    return undefined;
  }
}
