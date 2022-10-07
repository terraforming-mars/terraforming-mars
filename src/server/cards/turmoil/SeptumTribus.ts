import {IActionCard} from '../ICard';
import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../../common/Resources';
import {Turmoil} from '../../turmoil/Turmoil';

export class SeptumTribus extends Card implements IActionCard, ICorporationCard {
  constructor() {
    super({
      name: CardName.SEPTUM_TRIBUS,
      tags: [Tag.WILD],
      startingMegaCredits: 36,
      cardType: CardType.CORPORATION,

      metadata: {
        cardNumber: 'R15',
        description: 'You start with 36 M€. When you perform an action, the wild tag counts as any tag of your choice.',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.megacredits(36);
          b.corpBox('action', (ce) => {
            ce.action('Gain 2 M€ for each party where you have at least 1 delegate.', (eb) => {
              eb.empty().startAction.megacredits(2).slash().delegates(1).asterix();
            });
          });
        }),
      },
    });
  }

  public canAct(): boolean {
    return true;
  }

  public action(player: Player) {
    const turmoil = Turmoil.getTurmoil(player.game);
    const partiesWithPresence = turmoil.parties.filter((party) => party.delegates.has(player.id));
    player.addResource(Resources.MEGACREDITS, partiesWithPresence.length * 2, {log: true});

    return undefined;
  }
}
