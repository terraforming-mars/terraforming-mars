import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {SendDelegateToArea} from '../../deferredActions/SendDelegateToArea';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class Recruitment implements IProjectCard {
    public cost = 2;
    public tags = [];
    public name = CardName.RECRUITMENT;
    public cardType = CardType.EVENT;
    public hasRequirements = false;

    public canPlay(player: Player, game: Game): boolean {
      if (game.turmoil !== undefined) {
        if (!game.turmoil!.hasAvailableDelegates(player.id)) {
          return false;
        }

        const parties = game.turmoil!.parties.filter((party) => {
          if (party.delegates.length > 1) {
            const delegates = party.delegates.slice();
            delegates.splice(party.delegates.indexOf(party.partyLeader!), 1);
            return delegates.indexOf('NEUTRAL') !== -1;
          } else {
            return false;
          }
        });
        return parties.length > 0;
      }
      return false;
    }

    public play(player: Player, game: Game) {
      game.defer(new SendDelegateToArea(player, game, 'Select which Neutral delegate to remove', 1, 'NEUTRAL', undefined, false));
      return undefined;
    }

    public metadata: CardMetadata = {
      cardNumber: 'T11',
      renderData: CardRenderer.builder((b) => {
        b.minus().delegates(1).any.asterix().nbsp.delegates(1);
      }),
      description: 'Exchange one NEUTRAL NON-LEADER delegate with one of your own from the reserve.',
    }
}
