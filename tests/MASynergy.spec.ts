import { expect } from "chai";
import { buildSynergies, SYNERGIES } from "../src/MASynergy";

describe("MASynergy", function () {
    it("verify that hand-built synergies is the same as the predefined array", function () {
        expect(buildSynergies()).is.eql(SYNERGIES);
    });
});
