import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {PartyName} from '../../turmoil/parties/PartyName';
import {Resources} from '../../Resources';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {SendDelegateToArea} from '../../deferredActions/SendDelegateToArea';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';
import {Turmoil} from '../../turmoil/Turmoil';

export class MartianMediaCenter extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.MARTIAN_MEDIA_CENTER,
      tags: [Tags.BUILDING],
      cost: 7,
      productionBox: Units.of({megacredits: 2}),

      requirements: CardRequirements.builder((b) => b.party(PartyName.MARS)),
      metadata: {
        cardNumber: 'T07',
        renderData: CardRenderer.builder((b) => {
          b.action('Pay 3 M€ to add a delegate to any party.', (eb) => {
            eb.megacredits(3).startAction.delegates(1);
          }).br;
          b.production((pb) => {
            pb.megacredits(2);
          });
        }),
        description: 'Requires that Mars First is ruling or that you have 2 delegates there. Increase your M€ production 2 steps.',
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, 2);
    return undefined;
  }

  public canAct(player: Player): boolean {
    return player.canAfford(3) && Turmoil.getTurmoil(player.game).hasDelegatesInReserve(player.id);
  }

  public action(player: Player) {
    player.game.defer(new SelectHowToPayDeferred(player, 3, {title: 'Select how to pay for Martian Media Center action'}));
    player.game.defer(new SendDelegateToArea(player, 'Select where to send a delegate', {source: 'reserve'}));
    return undefined;
  }
}
