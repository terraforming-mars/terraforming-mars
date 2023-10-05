import {BasePlayerInput, PlayerInput} from '../PlayerInput';

export abstract class BasePlayerInputAndThen<T> extends BasePlayerInput {
  public cb: (param: T) => PlayerInput | undefined = () => undefined;
  public andThen(cb: (param: T) => PlayerInput | undefined): this {
    this.cb = cb;
    return this;
  }
}
