import {IActionCard} from '../ICard';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CorporationCard} from '../corporation/CorporationCard';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class SeptumTribus implements IActionCard, CorporationCard {
    public name = CardName.SEPTUM_TRIBUS;
    public tags = [Tags.WILDCARD];
    public startingMegaCredits: number = 36;
    public cardType = CardType.CORPORATION;
    public play() {
      return undefined;
    }

    public canAct(_player: Player, game: Game): boolean {
      return game.gameOptions.turmoilExtension;
    }

    public action(player: Player, game: Game) {
      if (game.turmoil !== undefined) {
        const partiesWithPresence = game.turmoil.parties.filter((party) => party.delegates.includes(player.id));
        player.megaCredits += partiesWithPresence.length * 2;
      }

      return undefined;
    }

    public metadata: CardMetadata = {
      cardNumber: 'R15',
      description: 'You start with 36 MC. When you perform an action, the wild tag counts as any tag of your choice.',
      renderData: CardRenderer.builder((b) => {
        b.br;
        b.megacredits(36);
        b.corpBox('action', (ce) => {
          ce.action('Gain 2 MC for each party where you have at least 1 delegate.', (eb) => {
            eb.empty().startAction.megacredits(2).slash().delegates(1).asterix();
          });
        });
      }),
    }
}
