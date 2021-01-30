import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Player, PlayerId} from '../../Player';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectDelegate} from '../../inputs/SelectDelegate';
import {IParty} from '../../turmoil/parties/IParty';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {NeutralPlayer} from '../../turmoil/Turmoil';

export class BannedDelegate extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.BANNED_DELEGATE,
      cost: 0,

      metadata: {
        cardNumber: 'T02',
        description: 'Requires that you are Chairman. Remove any NON-LEADER delegate.',
        requirements: CardRequirements.builder((b) => b.chairman()),
        renderData: CardRenderer.builder((b) => {
          b.minus().delegates(1).any;
        }),
      },
    });
  }

  public canPlay(player: Player): boolean {
    if (player.game.turmoil !== undefined) {
      return player.game.turmoil.chairman === player.id;
    }
    return false;
  }

  public play(player: Player) {
    const orOptions: Array<SelectDelegate> = [];
        // Take each party having more than just the party leader in the area
        player.game.turmoil!.parties.forEach((party) => {
          if (party.delegates.length > 1) {
            // Remove the party leader from available choices
            const delegates = party.delegates.slice();
            delegates.splice(party.delegates.indexOf(party.partyLeader!), 1);
            const playersId = Array.from(new Set<PlayerId | NeutralPlayer>(delegates));
            const players: Array<Player | NeutralPlayer> = [];
            playersId.forEach((playerId) => {
              if (playerId === 'NEUTRAL') {
                players.push('NEUTRAL');
              } else {
                players.push(player.game.getPlayerById(playerId));
              }
            });

            if (players.length > 0) {
              const selectDelegate = new SelectDelegate(players, 'Select player delegate to remove from ' + party.name + ' party', (selectedPlayer: Player | NeutralPlayer) => {
                let playerToRemove = '';
                if (selectedPlayer === 'NEUTRAL') {
                  playerToRemove = 'NEUTRAL';
                } else {
                  playerToRemove = selectedPlayer.id;
                }
                player.game.turmoil!.removeDelegateFromParty(playerToRemove, party.name, player.game);
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
