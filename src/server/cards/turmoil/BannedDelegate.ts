import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {PlayerId} from '../../../common/Types';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectDelegate} from '../../inputs/SelectDelegate';
import {IParty} from '../../turmoil/parties/IParty';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {NeutralPlayer, Turmoil} from '../../turmoil/Turmoil';
import {all} from '../Options';
import {MultiSet} from 'mnemonist';

export class BannedDelegate extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.BANNED_DELEGATE,
      cost: 0,

      requirements: CardRequirements.builder((b) => b.chairman()),
      metadata: {
        cardNumber: 'T02',
        description: 'Requires that you are Chairman. Remove any NON-LEADER delegate.',
        renderData: CardRenderer.builder((b) => {
          b.minus().delegates(1, {all});
        }),
      },
    });
  }

  public override bespokePlay(player: Player) {
    const turmoil = Turmoil.getTurmoil(player.game);
    const orOptions: Array<SelectDelegate> = [];
    // Take each party having more than just the party leader in the area
    turmoil.parties.forEach((party) => {
      if (party.delegates.size > 1) {
        // Remove the party leader from available choices
        const copy = MultiSet.from(party.delegates);
        if (party.partyLeader !== undefined) {
          copy.remove(party.partyLeader);
        } else {
          // This wouldn't happen normally.
          throw new Error(`partyLeader not defined for ${player.game.id}`);
        }
        const players: Array<Player | NeutralPlayer> = [];
        for (const playerId of copy) {
          if (playerId === 'NEUTRAL') {
            players.push('NEUTRAL');
          } else {
            players.push(player.game.getPlayerById(playerId));
          }
        }

        if (players.length > 0) {
          const selectDelegate = new SelectDelegate(players, 'Select player delegate to remove from ' + party.name + ' party', (selectedPlayer: Player | NeutralPlayer) => {
            let playerToRemove: PlayerId | NeutralPlayer;
            if (selectedPlayer === 'NEUTRAL') {
              playerToRemove = 'NEUTRAL';
            } else {
              playerToRemove = selectedPlayer.id;
            }
            turmoil.removeDelegateFromParty(playerToRemove, party.name, player.game);
            this.log(player, party, selectedPlayer);
            return undefined;
          });
          selectDelegate.buttonLabel = 'Remove delegate';
          orOptions.push(selectDelegate);
        }
      }
    });
    if (orOptions.length === 0) {
      return undefined;
    } else if (orOptions.length === 1) {
      return orOptions[0];
    } else {
      const options = new OrOptions(...orOptions);
      return options;
    }
  }

  private log(player: Player, party: IParty, selectedPlayer: Player | NeutralPlayer) {
    if (selectedPlayer === 'NEUTRAL') {
      player.game.log('${0} removed neutral delegate from ${1}', (b) => b.player(player).party(party));
    } else {
      player.game.log('${0} removed ${1}\'s delegate from ${2}', (b) => b.player(player).player(selectedPlayer).party(party));
    }
  }
}
