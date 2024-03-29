import { IPlayer } from "../../IPlayer";
import { SelectionHandler } from "../selectables/SelectionHandler";
import { PlayerInputModel, SelectWithInputModel } from "../../../common/models/PlayerInputModel";
import { PlayerInput } from "../../PlayerInput";
import { InputResponse, SelectWithInputResponse } from "../../../common/inputs/InputResponse";
import { SelectOne } from "./SelectOne";

export class SelectWithInput<T> extends SelectOne<T> {
    constructor (
        selectionHandler: SelectionHandler<T>,
        public SecondaryInput: (option: T, player: IPlayer) => PlayerInput
    ) {
        super(selectionHandler);
    }

    public IndexedSecondaryInputs(player: IPlayer): Record<string, PlayerInputModel> {
        let record: Record<string, PlayerInputModel> = {};
        this.SelectionHandler.options.forEach((option) => {
            record[this.SelectionHandler.GetOptionName(option)] = this.SecondaryInput(option, player);
        })
        return record;
    }

    public override toModel(player: IPlayer): SelectWithInputModel {
        return {
            ...super.toModel(player),
            secondaryInputs: this.IndexedSecondaryInputs(player)
        };
    }

    public override process(response: InputResponse, player: IPlayer) {
        let typedResponse = this.ResponseAsType<SelectWithInputResponse>(response);
        let selectedOption = this.SelectionHandler.GetOptionfromName(typedResponse.option);
        player.runInput(typedResponse.response, this.SecondaryInput(selectedOption, player));
        return this.cb(selectedOption);
    }
}