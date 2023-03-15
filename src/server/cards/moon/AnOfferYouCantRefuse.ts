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
      type: CardType.EVENT,
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
    if (!turmoil.hasDelegatesInReserve(player.id)) {
      return false;
    }

    for (const party of turmoil.parties) {
      for (const delegate of party.delegates.keys()) {
        if (this.isReplaceableDelegate(delegate, player, party)) {
          return true;
        }
      }
    }
    return false;
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
          turmoil.sendDelegateToParty(delegate, party.name, game);
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

    for (const party of turmoil.parties) {
      for (const delegate of party.delegates.keys()) {
        if (!this.isReplaceableDelegate(delegate, player, party)) {
          continue;
        }

        const playerName = game.getPlayerById(delegate).name;
        const option = new SelectOption(`${party.name} / ${playerName}`, 'Select', () => {
          turmoil.replaceDelegateFromParty(delegate, player.id, party.name, game);
          turmoil.checkDominantParty(); // Check dominance right after replacement (replace doesn't check dominance.)
          return this.moveToAnotherParty(game, party.name, player.id);
        });
        orOptions.options.push(option);
      }
    }
    return orOptions;
  }
}
