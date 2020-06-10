import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import { Resources } from '../Resources';
import { CardName } from '../CardName';
import { Expansion } from '../Expansion';

export class AcquiredCompany implements IProjectCard {

    public cost: number = 10;
    public tags: Array<Tags> = [Tags.EARTH];
    public name: CardName = CardName.ACQUIRED_COMPANY;
    public cardType: CardType = CardType.AUTOMATED;

    public play(player: Player) {
      player.setProduction(Resources.MEGACREDITS,3);
      return undefined;
    }

    public expansion: Expansion = Expansion.CORPORATE_ERA;
    public cardNumber: string = "106";
    public content: string = `
        <div class="production-box">
            <div class="money production">3</div>
        </div>
        <div class="description">
            (Increase your MC production 3 steps.)
        </div>
    `;

}
