import {Tag} from '../../../common/cards/Tag';
import {RoboticWorkforceBase} from './RoboticWorkforceBase';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {IPlayer} from '../../IPlayer';
import {Priority} from '../../deferredActions/Priority';
import {uppercase} from '../Options';

const HELP_TEXT = `
From the unofficial FAQ 1.7:

> * This card ONLY copies the production box (brown background) on the bottom of a building card, not other effects. Any decreases in production outlined in the box must still be performed.
>
>   For example, if playing this card on "Immigrant City", you would copy only the bottom production box (minus 1 energy production, minus 2 MC production) and not the top production box (1 MC production when a city is played).
>
> * This card can be used to duplicate production from a Prelude card with a building tag.
>
> * This card can be used to copy the Research Network prelude card to gain 1 MC production (by treating the Wild tag as a building tag for that action).
>
> * This card can also be used to duplicate production from a corporation with a building tag (e.g., Manutech).
> * It cannot copy production boxes that are part of an effect or action in the upper panel of a blue card or on a corporation.
> * Only a production box on the lower panel (on a green or blue card) can be copied, or production on a corporation that is NOT part of an action or effect. For example, "Robotic Workforce" can copy the steel production from the Factorum corporation, but not the energy
> production.
>
> * If copying a card that reduces production of any player (e.g., "Heat Trappers") you once again can choose any player to reduce production from (even a different player than was chosen for the originally played card).
> * This card cannot be played if you have no building cards in play with a production box that you can fully copy.
> * This card cannot be used on an opponent's project card/Prelude card/corporation - only your own.
> * When copying "Mining Rights" or "Mining Area" (placed on a space with a steel or titanium
> placement bonus, granting the corresponding production) Robotic Workforce will copy the exact production that was obtained from the tile when it was placed (either titanium or steel).
> * When copying "Medical Lab" , you recount your current number of building tags when you play "Robotic Workforce" and increase your MC production accordingly (in which case you may gain more production than when you originally played "Medical Lab").
` as const;

export class RoboticWorkforce extends RoboticWorkforceBase {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.ROBOTIC_WORKFORCE,
      tags: [Tag.SCIENCE],
      cost: 9,
      metadata: {
        cardNumber: '086',
        renderData: CardRenderer.builder((b) => {
          b.text('Copy A', {size: Size.SMALL, uppercase}).nbsp;
          b.production((pb) => pb.tag(Tag.BUILDING));
        }),
        description: 'Duplicate only the production box of one of your building cards.',
        helpText: HELP_TEXT,
      },
    });
  }

  public override bespokeCanPlay(player: IPlayer): boolean {
    return this.getPlayableBuildingCards(player).length > 0;
  }

  public override bespokePlay(player: IPlayer) {
    player.defer(
      this.selectBuildingCard(
        player,
        this.getPlayableBuildingCards(player),
        'Select builder card to copy',
      ),
      Priority.ROBOTIC_WORKFORCE,
    );
    return undefined;
  }
}
