import {BasePlayerInput} from '../../PlayerInput';
import {InputResponse, SelectOneResponse} from '../../../common/inputs/InputResponse';
import {IPlayer} from '../../IPlayer';
import { SelectOneModel } from '../../../common/models/PlayerInputModel';
import { PlayerInputType } from '../../../common/input/PlayerInputType';
import { SelectionHandler } from '../selectables/SelectionHandler';

export class SelectOne<T> extends BasePlayerInput<T> {
    constructor (
        public SelectionHandler: SelectionHandler<T>,
    ) {
        super(PlayerInputType.SELECT_ONE, SelectionHandler.title);
        this.buttonLabel = SelectionHandler.buttonLabel;
    }

    public override toModel(player: IPlayer): SelectOneModel {
        return {
            ...this.SelectionHandler.toModel(player), 
            type: PlayerInputType.SELECT_ONE, 
        }
    }

    public override process(response: InputResponse, _player: IPlayer) {
        let typedResponse = this.ResponseAsType<SelectOneResponse>(response);
        let selectedOption = this.SelectionHandler.GetOptionfromName(typedResponse.option);
        return this.cb(selectedOption);
    }
}
