import {CorporationCard} from '../corporation/CorporationCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IPlayer} from '../../../server/IPlayer';
import {PlayerInput} from '../../../server/PlayerInput';
import {Turmoil} from '../../turmoil/Turmoil';
import {IParty} from '../../../server/turmoil/parties/IParty';
import {ChooseAlliedParty} from '../../../server/deferredActions/ChooseAlliedParty';

export class MarsFrontierAlliance extends CorporationCard {
  constructor() {
    super({
      name: CardName.MARS_FRONTIER_ALLIANCE,
      tags: [],
      startingMegaCredits: 40,

      metadata: {
        cardNumber: 'PfCXXX',
        description:
          'Start the game with 40 M€. When you reveal this card, select any remaining political program tile (you may use its effect as a passive effect of your corporation or as ruling party this generation).',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(40).nbsp.policy().br;
          b.effect(
            'after new ruling party is chosen, place the political program tile of the second most popular party on this card (you may use its ef fect as a passive effect of your corporation or as ruling party this generation)',
            (eb) => {
              eb.empty().startEffect.plus().policy().asterix();
            },
          ).br;
        }),
      },
    });
  }

  public override bespokePlay(player: IPlayer): PlayerInput | undefined {
    const game = player.game;
    const turmoil = Turmoil.getTurmoil(game);
    const availableParties: Array<IParty> = [];

    for (const party of turmoil.parties) {
      // if (turmoil.politicalAgendasData.agendaStyle === AgendaStyle.CHAIRMAN) {
      //   const toAdd = party.policies.filter((p) => p.id !== turmoil.rulingPolicy().id);
      //   availablePolicies = availablePolicies.concat(toAdd);
      // } else {
      availableParties.push(party);
      // }
    }
    game.defer(new ChooseAlliedParty(player, availableParties, (p) => {
      player.pathfindersData.alliedParty = {
        name: p.name,
        bonus: p.bonuses[0].id,
        policy: p.policies[0].id,
      };
      const alliedPolicy = player.game.turmoil?.getPartyByName(p.name).policies.find((t) => t.id === p.policies[0].id);
      if (alliedPolicy !== undefined) alliedPolicy.onPolicyStart?.(player.game, player);
    }));
    return undefined;
  }
}
