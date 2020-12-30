import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Player, PlayerId} from '../../Player';
import {Game} from '../../Game';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectDelegate} from '../../inputs/SelectDelegate';
import {IParty} from '../../turmoil/parties/IParty';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {NeutralPlayer} from '../../turmoil/Turmoil';

export class BannedDelegate implements IProjectCard {
    public cost = 0;
    public tags = [];
    public name = CardName.BANNED_DELEGATE;
    public cardType = CardType.EVENT;

    public canPlay(player: Player, game: Game): boolean {
      if (game.turmoil !== undefined) {
        return game.turmoil.chairman === player.id;
      }
      return false;
    }

    public play(player: Player, game: Game) {
      const orOptions: Array<SelectDelegate> = [];
        // Take each party having more than just the party leader in the area
        game.turmoil!.parties.forEach((party) => {
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
                players.push(game.getPlayerById(playerId));
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
                game.turmoil!.removeDelegateFromParty(playerToRemove, party.name, game);
                this.log(game, player, party, selectedPlayer);
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

    private log(game: Game, player: Player, party: IParty, selectedPlayer: Player | NeutralPlayer) {
      if (selectedPlayer === 'NEUTRAL') {
        game.log('${0} removed neutral delegate from ${1}', (b) => b.player(player).party(party));
      } else {
        game.log('${0} removed ${1}\'s delegate from ${2}', (b) => b.player(player).player(selectedPlayer).party(party));
      }
    }
    public metadata: CardMetadata = {
      cardNumber: 'T02',
      description: 'Requires that you are Chairman. Remove any NON-LEADER delegate.',
      requirements: CardRequirements.builder((b) => b.chairman()),
      renderData: CardRenderer.builder((b) => {
        b.minus().delegates(1).any;
      }),
    };
}
