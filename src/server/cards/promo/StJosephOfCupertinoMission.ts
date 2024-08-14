import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IActionCard} from '../ICard';
import {IPlayer} from '../../IPlayer';
import {IGame} from '../../IGame';
import {Space} from '../../boards/Space';
import {SelectSpace} from '../../inputs/SelectSpace';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {SelectPayment} from '../../inputs/SelectPayment';
import {TITLES} from '../../inputs/titles';
import {message} from '../../logs/MessageBuilder';

export class StJosephOfCupertinoMission extends Card implements IActionCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.ST_JOSEPH_OF_CUPERTINO_MISSION,
      cost: 7,
      victoryPoints: 'special',

      metadata: {
        cardNumber: 'X64',
        renderData: CardRenderer.builder((b) => {
          b.action('Pay 5 M€ (STEEL MAY BE USED) to build  1 Cathedral in a city. Max 1 per city. City owner can pay 2 M€  to draw 1 card.', (eb) => {
            eb.megacredits(5).super((b) => b.steel(1)).startAction.cathedral().asterix();
          });
        }),
        description: '1 VP per City with a Cathedral in it.',
        victoryPoints: CardRenderDynamicVictoryPoints.cathedral(),
      },
    });
  }

  private getEligibleCities(game: IGame): Array<Space> {
    return game.board.getCities().filter((space) => !game.stJosephCathedrals.includes(space.id));
  }

  canAct(player: IPlayer): boolean {
    return this.getEligibleCities(player.game).length > 0 && player.canAfford({cost: 5, steel: true});
  }

  action(player: IPlayer): undefined {
    const cities = this.getEligibleCities(player.game);
    if (cities.length === 0) {
      return undefined;
    }

    player.game.defer(new SelectPaymentDeferred(player, 5, {canUseSteel: true, title: TITLES.payForCardAction(this.name)}))
      .andThen(() => {
        player.defer(new SelectSpace(
          message('Select new space for ${0}', (b) => b.card(this)),
          cities)
          .andThen((space) => {
            player.game.stJosephCathedrals.push(space.id);
            const spaceOwner = space.player;
            if (spaceOwner === undefined || spaceOwner.color === 'neutral') {
              return undefined;
            }
            if (spaceOwner.canAfford(2)) {
              spaceOwner.defer(
                new OrOptions(
                  new SelectPayment('Pay 2 M€ to draw a card', 2, {})
                    .andThen((payment) => {
                    // TODO(kberg): pay should have an afterPay for the heat / floaters costs.
                      spaceOwner.pay(payment);
                      spaceOwner.drawCard();
                      return undefined;
                    }),
                  new SelectOption('Do not buy a card'),
                ));
            }
            return undefined;
          }));
      });
    return undefined;
  }

  public override getVictoryPoints(player: IPlayer) {
    return player.game.stJosephCathedrals.length;
  }
}
