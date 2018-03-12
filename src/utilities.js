
var generatedIds = {};

module.exports = {
    shuffle: function(arr) {
        var result = [];
        while (arr.length > 0) {
            result.push(arr.splice(Math.floor(Math.random() * arr.length), 1)[0]);
        }
        return result;
    },
    generateUUID: function() {
        var result = "";
        for (var i = 0; i < 16; i++) {
            result += new Number(Math.floor(Math.random() * 16)).toString(16);
        }
        if (generatedIds[result]) {
            return generateUUID();
        }
        generatedIds[result] = true;
        return result;
    },
    findBeginnerCard: function(corporationCards) {
        for (var i = 0; i < corporationCards.length; i++) {
            if (corporationCards[i].name === "Beginner Corporation") {
                return corporationCards.splice(i, 1)[0];
            }
        }
        throw "Unable to find beginner card";
    }
};

