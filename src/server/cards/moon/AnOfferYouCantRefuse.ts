import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {PlayerId} from '../../../common/Types';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {NeutralPlayer, Turmoil} from '../../turmoil/Turmoil';
import {PartyName} from '../../../common/turmoil/PartyName';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';
import {Game} from '../../Game';
import {IParty} from '../../turmoil/parties/IParty';
import {all} from '../Options';

export class AnOfferYouCantRefuse extends Card {
  constructor() {
    super({
      name: CardName.AN_OFFER_YOU_CANT_REFUSE,
      cardType: CardType.EVENT,
      cost: 5,

      metadata: {
        description: 'Exchange a NON-NEUTRAL NON-LEADER delegate with one of your own from the reserve. You may then move your delegate to another party.',
        cardNumber: 'M62',
        renderData: CardRenderer.builder((b) => {
          b.minus().delegates(1, {all}).asterix().nbsp.plus().delegates(1);
        }),
      },
    });
  }

  private isReplaceableDelegate(delegate: PlayerId | NeutralPlayer, player: Player, party: IParty): delegate is PlayerId {
    return delegate !== player.id && delegate !== 'NEUTRAL' && delegate !== party.partyLeader;
  }

  // You can play this if you have an available delegate, and if there are non-neutral non-leader delegates available to swap with.
  public override bespokeCanPlay(player: Player) {
    const turmoil = Turmoil.getTurmoil(player.game);
    const hasDelegate = turmoil.hasDelegatesInReserve(player.id) || turmoil.lobby.has(player.id);
    if (!hasDelegate) return false;

    return turmoil.parties.some((party) =>
      party.delegates.some((delegate) => this.isReplaceableDelegate(delegate, player, party)));
  }

  private moveToAnotherParty(game: Game, from: PartyName, delegate: PlayerId): OrOptions {
    const orOptions = new OrOptions();
    const turmoil = Turmoil.getTurmoil(game);

    turmoil.parties.forEach((party) => {
      if (party.name === from) {
        orOptions.options.push(new SelectOption('Do not move', '', () => {
          return undefined;
        }));
      } else {
        orOptions.options.push(new SelectOption(party.name, 'Select', () => {
          turmoil.removeDelegateFromParty(delegate, from, game);
          turmoil.sendDelegateToParty(delegate, party.name, game, 'reserve');
          return undefined;
        }));
      }
    });

    return orOptions;
  }

  public override bespokePlay(player: Player) {
    const game = player.game;
    const turmoil = Turmoil.getTurmoil(game);
    const orOptions = new OrOptions();

    turmoil.parties.forEach((party) => {
      party.getPresentPlayers() // getPresentPlayers removes duplicates.
        .forEach((delegate) => {
          if (!this.isReplaceableDelegate(delegate, player, party)) return;

          const playerName = game.getPlayerById(delegate).name;
          const option = new SelectOption(`${party.name} / ${playerName}`, 'Select', () => {
            const source = turmoil.hasDelegatesInReserve(player.id) ? 'reserve' : 'lobby';
            turmoil.replaceDelegateFromParty(delegate, player.id, source, party.name, game);
            turmoil.checkDominantParty(); // Check dominance right after replacement (replace doesn't check dominance.)
            return this.moveToAnotherParty(game, party.name, player.id);
          });
          orOptions.options.push(option);
        });
    });

    return orOptions;
  }
}
