import {PlayerInput} from '../PlayerInput';
import {PlayerInputTypes} from '../PlayerInputTypes';
import {HowToPay} from './HowToPay';
import {IProjectCard} from '../cards/IProjectCard';

export class SelectHowToPayForProjectCard implements PlayerInput {
  public inputType: PlayerInputTypes = PlayerInputTypes.SELECT_HOW_TO_PAY_FOR_PROJECT_CARD;
  public title = 'Play project card';
  public buttonLabel: string = 'Play card';
  constructor(
    public cards: Array<IProjectCard>,
    public microbes: number,
    public floaters: number,
    public canUseHeat: boolean,
    public cb: (cardToPlay: IProjectCard, howToPay: HowToPay) => PlayerInput | undefined) {
  }
}
