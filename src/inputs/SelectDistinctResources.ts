import {Player} from '../Player';
import {PlayerInput} from '../PlayerInput';
import {PlayerInputTypes} from '../PlayerInputTypes';
import {Units} from '../Units';

export class SelectDistinctResources implements PlayerInput {
  public inputType = PlayerInputTypes.SELECT_DISTINCT_RESOURCES;
  public readonly title: string;
  constructor(
    public standardResourceCount: number,
    public player: Player,
    public cb: (units: Units) => PlayerInput | undefined,
    public buttonLabel: string = 'Save',
  ) {
    this.title = `Select ${standardResourceCount} distinct resources.`;
  }
}
