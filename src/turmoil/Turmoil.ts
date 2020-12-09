import {PartyName} from './parties/PartyName';
import {IParty} from './parties/IParty';
import {MarsFirst} from './parties/MarsFirst';
import {Scientists} from './parties/Scientists';
import {Unity} from './parties/Unity';
import {Kelvinists} from './parties/Kelvinists';
import {Reds} from './parties/Reds';
import {Greens} from './parties/Greens';
import {Player, PlayerId} from '../Player';
import {Game} from '../Game';
import {GlobalEventDealer, getGlobalEventByName} from './globalEvents/GlobalEventDealer';
import {IGlobalEvent} from './globalEvents/IGlobalEvent';
import {ISerializable} from '../ISerializable';
import {SerializedTurmoil} from './SerializedTurmoil';
import {PLAYER_DELEGATES_COUNT} from '../constants';
import {AgendaStyle, PoliticalAgendasData, PoliticalAgendas} from './PoliticalAgendas';

export interface IPartyFactory {
    partyName: PartyName;
    Factory: new () => IParty
}

export const ALL_PARTIES: Array<IPartyFactory> = [
  {partyName: PartyName.MARS, Factory: MarsFirst},
  {partyName: PartyName.SCIENTISTS, Factory: Scientists},
  {partyName: PartyName.UNITY, Factory: Unity},
  {partyName: PartyName.GREENS, Factory: Greens},
  {partyName: PartyName.REDS, Factory: Reds},
  {partyName: PartyName.KELVINISTS, Factory: Kelvinists},
];

const UNINITIALIZED_POLITICAL_AGENDAS_DATA: PoliticalAgendasData = {
  thisAgenda: {
    bonusId: 'none',
    policyId: 'none',
  },
  staticAgendas: undefined,
};

export class Turmoil implements ISerializable<SerializedTurmoil> {
    public chairman: undefined | PlayerId | 'NEUTRAL' = undefined;
    public rulingParty: undefined | IParty = undefined;
    public dominantParty: undefined | IParty = undefined;
    public lobby: Set<PlayerId> = new Set<PlayerId>();
    public delegate_reserve: Array<PlayerId | 'NEUTRAL'> = []; // eslint-disable-line camelcase
    public parties: Array<IParty> = ALL_PARTIES.map((cf) => new cf.Factory());
    public playersInfluenceBonus: Map<string, number> = new Map<string, number>();
    public readonly globalEventDealer: GlobalEventDealer = new GlobalEventDealer();
    public distantGlobalEvent: IGlobalEvent | undefined;
    public commingGlobalEvent: IGlobalEvent | undefined;
    public currentGlobalEvent: IGlobalEvent | undefined;
    public politicalAgendasData: PoliticalAgendasData = UNINITIALIZED_POLITICAL_AGENDAS_DATA;

    private constructor() {
    }

    // The agendaStyle parameter is just for tests.
    public static newInstance(game: Game, agendaStyle: AgendaStyle = AgendaStyle.STANDARD): Turmoil {
      const turmoil = new Turmoil();

      game.getPlayers().forEach((player) => {
        // Begin with one delegate in the lobby
        turmoil.lobby.add(player.id);
        // Begin with six delegates in the delegate reserve
        for (let i = 0; i < PLAYER_DELEGATES_COUNT - 1; i++) {
          turmoil.delegate_reserve.push(player.id);
        }
      });

      // The game begins with a Neutral chairman
      turmoil.chairman = 'NEUTRAL';

      // First ruling party is green
      turmoil.rulingParty = turmoil.getPartyByName(PartyName.GREENS);

      // Begin with 13 neutral delegates in the reserve
      for (let i = 0; i < 13; i++) {
        turmoil.delegate_reserve.push('NEUTRAL');
      }

      // Setup party bonuses and policies
      turmoil.politicalAgendasData = PoliticalAgendas.newInstance(agendaStyle, turmoil.parties, turmoil.rulingParty);

      // Init the global event dealer
      turmoil.globalEventDealer.initGlobalEvents(game);
      turmoil.initGlobalEvent(game);
      return turmoil;
    }

    public initGlobalEvent(game: Game) {
      // Draw the first global event to setup the game
      this.commingGlobalEvent = this.globalEventDealer.draw();
      if (this.commingGlobalEvent !== undefined) {
        this.sendDelegateToParty('NEUTRAL', this.commingGlobalEvent.revealedDelegate, game);
      }
      this.distantGlobalEvent = this.globalEventDealer.draw();
      if (this.distantGlobalEvent !== undefined) {
        this.sendDelegateToParty('NEUTRAL', this.distantGlobalEvent.revealedDelegate, game);
      }
    }

    // Function to return a party by name
    public getPartyByName(partyName: PartyName): IParty | undefined {
      return this.parties.find((party) => party.name === partyName);
    }

    // Use to send a delegate to a specific party
    public sendDelegateToParty(
      playerId: PlayerId | 'NEUTRAL',
      partyName: PartyName,
      game: Game,
      fromLobby: boolean = true): void {
      const party = this.getPartyByName(partyName);
      if (party) {
        if (playerId !== 'NEUTRAL' && this.lobby.has(playerId) && fromLobby) {
          this.lobby.delete(playerId);
        } else {
          const index = this.delegate_reserve.indexOf(playerId);
          if (index > -1) {
            this.delegate_reserve.splice(index, 1);
          }
        }
        party.sendDelegate(playerId, game);
        this.checkDominantParty(party);
      } else {
        throw 'Party not found';
      }
    }

    // Use to remove a delegate from a specific party
    public removeDelegateFromParty(playerId: PlayerId | 'NEUTRAL', partyName: PartyName, game: Game): void {
      const party = this.getPartyByName(partyName);
      if (party) {
        this.delegate_reserve.push(playerId);
        party.removeDelegate(playerId, game);
        this.checkDominantParty(party);
      } else {
        throw 'Party not found';
      }
    }

    // Check dominant party
    public checkDominantParty(party:IParty): void {
      // If there is a dominant party
      if (this.dominantParty) {
        const sortParties = [...this.parties].sort(
          (p1, p2) => p2.delegates.length - p1.delegates.length,
        );
        const max = sortParties[0].delegates.length;
        if (this.dominantParty.delegates.length !== max) {
          this.setNextPartyAsDominant(this.dominantParty);
        }
      } else {
        this.dominantParty = party;
      }
    }

    // Function to get next dominant party taking into account the clockwise order
    public setNextPartyAsDominant(currentDominantParty: IParty) {
      const sortParties = [...this.parties].sort(
        (p1, p2) => p2.delegates.length - p1.delegates.length,
      );
      const max = sortParties[0].delegates.length;

      const currentIndex = this.parties.indexOf(currentDominantParty);

      let partiesToCheck = [];

      // Manage if it's the first party or the last
      if (currentIndex === 0) {
        partiesToCheck = this.parties.slice(currentIndex + 1);
      } else if (currentIndex === this.parties.length - 1) {
        partiesToCheck = this.parties.slice(0, currentIndex);
      } else {
        const left = this.parties.slice(0, currentIndex);
        const right = this.parties.slice(currentIndex + 1);
        partiesToCheck = right.concat(left);
      }

      // Take the clockwise order
      const partiesOrdered = partiesToCheck.reverse();

      partiesOrdered.some((newParty) => {
        if (newParty.delegates.length === max) {
          this.dominantParty = newParty;
          return true;
        }
        return false;
      });
    }

    // Launch the turmoil phase
    public endGeneration(game: Game): void {
      // 1 - All player lose 1 TR
      game.getPlayers().forEach((player) => {
        player.decreaseTerraformRating();
      });

      // 2 - Global Event
      if (this.currentGlobalEvent) {
        this.currentGlobalEvent.resolve(game, this);
      }

      // 3 - New Gouvernment
      this.rulingParty = this.dominantParty;

      // 3.a - Ruling Policy change
      if (this.rulingParty) {
        this.setRulingParty(game);
      }

      // 3.b - New dominant party
      this.setNextPartyAsDominant(this.rulingParty!);

      // 3.c - Fill the lobby
      this.lobby.forEach((playerId) => {
        this.delegate_reserve.push(playerId);
      });
      this.lobby = new Set<string>();

      game.getPlayers().forEach((player) => {
        if (this.getDelegates(player.id) > 0) {
          const index = this.delegate_reserve.indexOf(player.id);
          if (index > -1) {
            this.delegate_reserve.splice(index, 1);
          }
          this.lobby.add(player.id);
        }
      });

      // 4 - Changing Time
      if (this.currentGlobalEvent) {
        this.globalEventDealer.discardedGlobalEvents.push(this.currentGlobalEvent);
      }
      // 4.a - Coming Event is now Current event. Add neutral delegate.
      this.currentGlobalEvent = this.commingGlobalEvent;
      if (this.currentGlobalEvent) {
        this.sendDelegateToParty('NEUTRAL', this.currentGlobalEvent.currentDelegate, game);
      }
      // 4.b - Distant Event is now Coming Event
      this.commingGlobalEvent = this.distantGlobalEvent;
      // 4.c - Draw the new distant event and add neutral delegate
      this.distantGlobalEvent = this.globalEventDealer.draw();
      if (this.distantGlobalEvent) {
        this.sendDelegateToParty('NEUTRAL', this.distantGlobalEvent.revealedDelegate, game);
      }
      game.log('Turmoil phase has been resolved');
    }

    // Ruling Party changes
    public setRulingParty(game: Game): void {
      if (this.rulingParty !== undefined) {
        const rulingParty = this.rulingParty;

        // Resolve Ruling Bonus
        PoliticalAgendas.setAgenda(rulingParty, this.politicalAgendasData);

        // This will have to move below chairman selection if they get to choose it once per
        // generation.
        const bonusId = this.politicalAgendasData.thisAgenda.bonusId;
        const bonus = rulingParty.bonuses.find((b) => b.id === bonusId);
        if (bonus === undefined) {
          throw new Error(`Bonus id ${bonusId} not found in party ${rulingParty.name}`);
        }
        bonus.grant(game);

        // Change the chairman
        if (this.chairman) {
          this.delegate_reserve.push(this.chairman);
        }

        this.chairman = this.rulingParty.partyLeader;
        if (this.chairman) {
          if (this.chairman !== 'NEUTRAL') {
            const player = game.getPlayerById(this.chairman);
            player.increaseTerraformRating(game);
            game.log('${0} is the new chairman and got 1 TR increase', (b) => b.player(player));
          }
        } else {
          console.error('No chairman');
        }

        const index = this.rulingParty.delegates.indexOf(this.rulingParty.partyLeader!);
        // Remove the party leader from the delegates array
        this.rulingParty.delegates.splice(index, 1);
        // Fill the delegate reserve
        this.delegate_reserve = this.delegate_reserve.concat(this.rulingParty.delegates);

        // Clean the party
        this.rulingParty.partyLeader = undefined;
        this.rulingParty.delegates = [];
      }
    }

    public getPlayerInfluence(player: Player) {
      let influence: number = 0;
      if (this.chairman !== undefined && this.chairman === player.id) influence++;

      if (this.dominantParty !== undefined) {
        const dominantParty : IParty = this.dominantParty;
        const isPartyLeader = dominantParty.partyLeader === player.id;
        const delegateCount = dominantParty.delegates.filter((delegate) => delegate === player.id).length;

        if (isPartyLeader) {
          influence++;
          if (delegateCount > 1) influence++; // at least 1 non-leader delegate
        } else {
          if (delegateCount > 0) influence++;
        }
      }

      if (this.playersInfluenceBonus.has(player.id)) {
        const bonus = this.playersInfluenceBonus.get(player.id);
        if (bonus) {
          influence+= bonus;
        }
      }
      return influence;
    }

    public addInfluenceBonus(player: Player, bonus:number = 1) {
      if (this.playersInfluenceBonus.has(player.id)) {
        let current = this.playersInfluenceBonus.get(player.id);
        if (current) {
          current += bonus;
          this.playersInfluenceBonus.set(player.id, current);
        }
      } else {
        this.playersInfluenceBonus.set(player.id, bonus);
      }
    }

    public canPlay(player: Player, partyName : PartyName): boolean {
      if (this.rulingParty === this.getPartyByName(partyName)) {
        return true;
      }

      const party = this.getPartyByName(partyName);
      if (party !== undefined && party.getDelegates(player.id) >= 2) {
        return true;
      }

      return false;
    }

    // List players present in the reserve
    public getPresentPlayers(): Array<PlayerId | 'NEUTRAL'> {
      return Array.from(new Set(this.delegate_reserve));
    }

    // Return number of delegate
    public getDelegates(playerId: PlayerId | 'NEUTRAL'): number {
      const delegates = this.delegate_reserve.filter((p) => p === playerId).length;
      return delegates;
    }

    // Check if player has delegates available
    public hasAvailableDelegates(playerId: PlayerId | 'NEUTRAL'): boolean {
      return this.getDelegates(playerId) > 0;
    }

    // Get Victory Points
    public getPlayerVictoryPoints(player: Player): number {
      let victory: number = 0;
      if (this.chairman !== undefined && this.chairman === player.id) victory++;
      this.parties.forEach(function(party) {
        if (party.partyLeader === player.id) {
          victory++;
        }
      });
      return victory;
    }

    public serialize(): SerializedTurmoil {
      const result: SerializedTurmoil = {
        chairman: this.chairman,
        rulingParty: this.rulingParty,
        dominantParty: this.dominantParty,
        lobby: Array.from(this.lobby),
        delegate_reserve: this.delegate_reserve,
        parties: this.parties,
        playersInfluenceBonus: Array.from(this.playersInfluenceBonus.entries()),
        globalEventDealer: this.globalEventDealer,
        distantGlobalEvent: this.distantGlobalEvent,
        commingGlobalEvent: this.commingGlobalEvent,
        politicalAgendasData: this.politicalAgendasData,
      };
      if (this.currentGlobalEvent !== undefined) {
        result.currentGlobalEvent = this.currentGlobalEvent;
      }
      return result;
    }

    // Function used to rebuild each objects
    public static deserialize(d: SerializedTurmoil): Turmoil {
      const turmoil = new Turmoil();
      // Assign each attributes
      const o = Object.assign(turmoil, d);

      turmoil.lobby = new Set(d.lobby);

      if (d.rulingParty) {
        turmoil.rulingParty = turmoil.getPartyByName(d.rulingParty.name);
      }
      if (d.dominantParty) {
        turmoil.dominantParty = turmoil.getPartyByName(d.dominantParty.name);
      }

      turmoil.playersInfluenceBonus = new Map<string, number>(d.playersInfluenceBonus);

      // Rebuild Global Event Dealer
      turmoil.globalEventDealer.globalEventsDeck = d.globalEventDealer.globalEventsDeck.map((element: IGlobalEvent) => {
        return getGlobalEventByName(element.name)!;
      });

      turmoil.globalEventDealer.discardedGlobalEvents = d.globalEventDealer.discardedGlobalEvents.map((element: IGlobalEvent) => {
        return getGlobalEventByName(element.name)!;
      });

      if (d.distantGlobalEvent) {
        turmoil.distantGlobalEvent = getGlobalEventByName(d.distantGlobalEvent.name);
      }
      if (d.commingGlobalEvent) {
        turmoil.commingGlobalEvent = getGlobalEventByName(d.commingGlobalEvent.name);
      }
      if (d.currentGlobalEvent) {
        turmoil.currentGlobalEvent = getGlobalEventByName(d.currentGlobalEvent.name);
      }

      return o;
    }
}
