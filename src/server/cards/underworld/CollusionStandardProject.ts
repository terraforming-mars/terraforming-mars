import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {StandardProjectCard} from '../StandardProjectCard';
import {Turmoil} from '../../turmoil/Turmoil';
import {SelectParty} from '../../inputs/SelectParty';
import {AndOptions} from '../../inputs/AndOptions';
import {PartyName} from '../../../common/turmoil/PartyName';
import {SelectAmount} from '../../inputs/SelectAmount';
import {all} from '../Options';

export class CollusionStandardProject extends StandardProjectCard {
  constructor(properties = {
    name: CardName.COLLUSION_STANDARD_PROJECT,
    cost: 0,

    metadata: {
      cardNumber: '',
      renderData: CardRenderer.builder((b) =>
        b.standardProject('Spend 1 corruption to convert 1 or 2 neutral delegates into your own delegates.',
          (eb) => {
            eb.corruption(1).startAction.text('-2').neutralDelegate(1, {all}).nbsp.text('+2').delegates(1);
          }),
      ),
    },
  }) {
    super(properties);
  }

  public override canAct(player: IPlayer): boolean {
    if (player.underworldData.corruption === 0) {
      return false;
    }
    const game = player.game;
    const turmoil = Turmoil.getTurmoil(game);
    if (!turmoil.hasDelegatesInReserve(player)) {
      return false;
    }
    if (this.getParties(turmoil).length === 0) {
      return false;
    }
    // return super.canAct(player); // Not necessary this time.
    return true;
  }

  actionEssence(player: IPlayer): void {
    player.underworldData.corruption--;
    player.defer(this.execute(player));
  }

  private getParties(turmoil: Turmoil) {
    return turmoil.parties.filter((party) => party.delegates.get('NEUTRAL') > 0).map((party) => party.name);
  }

  public execute(player: IPlayer) {
    const game = player.game;
    const turmoil = Turmoil.getTurmoil(game);
    const parties = this.getParties(turmoil);
    if (parties.length === 0) {
      return undefined;
    }

    const data = {
      partyName: PartyName.GREENS,
      amount: 0,
    };

    const andOptions = new AndOptions(
      new SelectAmount('Send 1 or 2 delegates', 'choose', 1, 2, true).andThen((amount) => {
        data.amount = amount;
        return undefined;
      }),
      new SelectParty('Choose a party', 'Send delegate', parties).andThen((partyName: PartyName) => {
        data.partyName = partyName;
        return undefined;
      }))
      .andThen(() => {
        const party = turmoil.getPartyByName(data.partyName);
        const available = party.delegates.get('NEUTRAL');
        if (available < data.amount) {
          throw new Error(`${data.partyName} does not have ${data.amount} neutral delegates.`);
        }
        if (turmoil.getAvailableDelegateCount(player) < data.amount) {
          throw new Error(`Player does not have ${data.amount} delegates in reserve`);
        }
        for (let i = 0; i < data.amount; i++) {
          turmoil.replaceDelegateFromParty('NEUTRAL', player, data.partyName, game);
        }

        player.totalDelegatesPlaced += data.amount;
        game.log('${0} replaced ${1} neutral delegate(s) in ${2} area', (b) =>
          b.player(player).number(data.amount).partyName(data.partyName));
        return undefined;
      });
    return andOptions;
  }
}
