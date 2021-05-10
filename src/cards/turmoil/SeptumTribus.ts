import {IActionCard} from '../ICard';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {CorporationCard} from '../corporation/CorporationCard';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../Resources';

export class SeptumTribus extends Card implements IActionCard, CorporationCard {
  constructor() {
    super({
      name: CardName.SEPTUM_TRIBUS,
      tags: [Tags.WILDCARD],
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

  public play() {
    return undefined;
  }

  public canAct(player: Player): boolean {
    return player.game.gameOptions.turmoilExtension;
  }

  public action(player: Player) {
    if (player.game.turmoil !== undefined) {
      const partiesWithPresence = player.game.turmoil.parties.filter((party) => party.delegates.includes(player.id));
      player.addResource(Resources.MEGACREDITS, partiesWithPresence.length * 2, {log: true});
    }

    return undefined;
  }
}
