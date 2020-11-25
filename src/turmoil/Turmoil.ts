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
import {AgendaStyle, Agenda, PoliticalAgendasData} from './PoliticalAgendasData';
import {Bonus} from './Bonus';

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

export class Turmoil implements ISerializable<SerializedTurmoil, Turmoil> {
    public chairman: undefined | PlayerId | 'NEUTRAL' = undefined;
    public rulingParty: undefined | IParty = undefined;
    public dominantParty: undefined | IParty = undefined;
    public lobby: Set<PlayerId> = new Set<PlayerId>();
    public delegate_reserve: Array<PlayerId | 'NEUTRAL'> = []; // eslint-disable-line camelcase
    public parties: Array<IParty> = [];
    public playersInfluenceBonus: Map<string, number> = new Map<string, number>();
    public globalEventDealer: GlobalEventDealer;
    public distantGlobalEvent: IGlobalEvent | undefined;
    public commingGlobalEvent: IGlobalEvent | undefined;
    public currentGlobalEvent: IGlobalEvent | undefined;
    public politicalAgendasData: PoliticalAgendasData;

    constructor(game: Game, politicalAgendas: boolean) {
      // Init parties
      this.parties = ALL_PARTIES.map((cf) => new cf.Factory());

      game.getPlayers().forEach((player) => {
        // Begin with one delegate in the lobby
        this.lobby.add(player.id);
        // Begin with six delegates in the delegate reserve
        for (let i = 0; i < PLAYER_DELEGATES_COUNT - 1; i++) {
          this.delegate_reserve.push(player.id);
        }
      });

      // The game begin with Neutral chairman
      this.chairman = 'NEUTRAL';

      // First ruling party should be green
      this.rulingParty = this.getPartyByName(PartyName.GREENS);

      // Begin with 13 neutral delegates in the reserve
      for (let i = 0; i < 13; i++) {
        this.delegate_reserve.push('NEUTRAL');
      }

      // Setup party bonuses and policies
      this.politicalAgendasData = {
        agendas: ALL_PARTIES.map((p) => {
          return {
            partyName: p.partyName,
            definedBonus: this.getBonus(p.partyName, politicalAgendas ? AgendaStyle.RANDOM : AgendaStyle.STANDARD),
            definedPolicy: undefined,
          } as Agenda;
        }),
      };

      // Init the global event dealer
      this.globalEventDealer = new GlobalEventDealer();
      this.globalEventDealer.initGlobalEvents(game);
      this.initGlobalEvent(game);
    }

    private getBonus(partyName: PartyName, agendaStyle: AgendaStyle = AgendaStyle.RANDOM) : Bonus {
      const pf = ALL_PARTIES.find((pf) => partyName === pf.partyName);

      if (pf === undefined) {
        throw new Error('Undefined party ' + partyName);
      }

      const bonuses = new pf.Factory().bonuses;
      switch (agendaStyle) {
        case AgendaStyle.STANDARD:
          return bonuses[0];
        case AgendaStyle.RANDOM:
          return bonuses[Math.floor(Math.random() * bonuses.length)];
        default:
          throw new Error('Agenda style not yet suppoorted: ' + agendaStyle);
      }
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
        const agenda = this.politicalAgendasData.agendas.find((agenda) => agenda.partyName === rulingParty.name);

        if (agenda === undefined) {
          throw new Error('agenda not found for party ' + rulingParty.name);
        } else {
          agenda.definedBonus.grant(game);
        }

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
      };
      if (this.currentGlobalEvent !== undefined) {
        result.currentGlobalEvent = this.currentGlobalEvent;
      }
      return result;
    }

    // Function used to rebuild each objects
    public loadFromJSON(d: SerializedTurmoil): Turmoil {
      // Assign each attributes
      const o = Object.assign(this, d);

      this.lobby = new Set(d.lobby);
      this.parties = ALL_PARTIES.map((cf) => new cf.Factory());

      if (d.rulingParty) {
        this.rulingParty = this.getPartyByName(d.rulingParty.name);
      }
      if (d.dominantParty) {
        this.dominantParty = this.getPartyByName(d.dominantParty.name);
      }

      this.playersInfluenceBonus = new Map<string, number>(d.playersInfluenceBonus);

      // Rebuild Global Event Dealer
      this.globalEventDealer = new GlobalEventDealer();

      this.globalEventDealer.globalEventsDeck = d.globalEventDealer.globalEventsDeck.map((element: IGlobalEvent) => {
        return getGlobalEventByName(element.name)!;
      });

      this.globalEventDealer.discardedGlobalEvents = d.globalEventDealer.discardedGlobalEvents.map((element: IGlobalEvent) => {
        return getGlobalEventByName(element.name)!;
      });

      if (d.distantGlobalEvent) {
        this.distantGlobalEvent = getGlobalEventByName(d.distantGlobalEvent.name);
      }
      if (d.commingGlobalEvent) {
        this.commingGlobalEvent = getGlobalEventByName(d.commingGlobalEvent.name);
      }
      if (d.currentGlobalEvent) {
        this.currentGlobalEvent = getGlobalEventByName(d.currentGlobalEvent.name);
      }

      return o;
    }
}
