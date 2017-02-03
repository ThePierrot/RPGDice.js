//格式：.rd[空格][你要投掷的内容]

//var Blaysiel = {
//    input: ""
//}
// Used for test purpose, omitted.

Blaysiel.input = ".rd 3d6 + 2d2000 + 4 - 10"; // Dice Machine interface


var diceInput = Blaysiel.input;

var settings = {
    amountThreshold: 100,
    sideThreshold: 1000,
    maxChunks: 10,
    checkSyntax: /^\s\d+d\d+((\s*(\+|-)\s*\d+d\d+)|(\s*(\+|-)\s*\d+))*/g,
    chopSyntax: /(^\s*\d+d\d+)|((\+|-)(\s*\d+d\d+))|((\+|-)\s*\d+)/g
}

// Basic dice class.
function Dice(type) {
    this.type = type;
}

// .rd type dice
function RdDice(type, sides) {
    Dice.call(this, type);
    this.sides = sides;
}

RdDice.prototype.roll = function() {
    return Math.floor(Math.random() * this.sides + 1);
} // end of the class

// entrance here
function diceParse(entry) {
    diceType = entry.slice(0, 3);
    diceContent = entry.substring(3);
    output = "";
    switch (diceType) {
        case ".rd": // Normal rolls
            return rdPrinter(rdParse(diceContent));
        default:
            return "";
    }
}

// Parser of rd rolls
function rdParse(entry) {
    expressions = entry.match(settings.checkSyntax);
    if (expressions) { // syntax check
        var comment = entry.substring(expressions[0].length);
        var sum = 0
        var bonus = 0;
        var chunkResult;
        var resultCollection = [];
        var diceChunks = expressions[0].match(settings.chopSyntax);
        if (diceChunks.length > settings.maxChunks) // drop too long expressions
        {
            return {
                error: 101,
            };
        }
        for (var i = 0; i < diceChunks.length; i++) {
            if (diceChunks[i].charAt(0) === "+")
            {
                chunkResult = rdChunkSum (diceChunks, i);
                if (!chunkResult) {
                    return {
                        error: 102,
                    };
                }
                sum += chunkResult.sum;
                bonus += chunkResult.bonus;
                resultCollection = resultCollection.concat(chunkResult.results);
            }
            else if (diceChunks[i].charAt(0) === "-") {
                chunkResult = rdChunkSum (diceChunks, i);
                if (!chunkResult) {
                    return {
                        error: 102,
                    };
                }
                sum -= chunkResult.sum;
                bonus -= chunkResult.bonus;
                resultCollection = resultCollection.concat(chunkResult.results);
            }
            else {
                diceChunks[i] = "+" + diceChunks[i];
                chunkResult = rdChunkSum (diceChunks, i);
                if (!chunkResult) {
                    return {
                        error: 102,
                    };
                }
                sum += chunkResult.sum;
                bonus += chunkResult.bonus;
                resultCollection = resultCollection.concat(chunkResult.results);
            }
        }
        return {
            sum: sum,
            bonus: bonus,
            comment: comment,
            resultCollection: resultCollection
        }
    }
    return "";
}

function rdChunkSum (diceChunks, counter) {
    var sum = 0;
    var bonus = 0;
    var results = [];
    if (diceChunks[counter].match(/\d+d\d+/g))
    {
        var amountAndSides = diceChunks[counter].match(/\d+/g);
        results = rdRollDices(parseInt(amountAndSides[0]), parseInt(amountAndSides[1]));
        if (amountAndSides[0] > settings.amountThreshold || amountAndSides[1] > settings.sideThreshold) {
            return false;
        }
        for (var i = 0; i < results.length; i++) {
            sum += results[i];
        }
    }
    else {
        bonus = parseInt(diceChunks[counter].match(/\d+/g));
    }
    return {
        sum: sum,
        bonus: bonus,
        results: results,
    }
}

// rdParse helper
function rdRollDices(amount, sides) {
    var results = [];
    for (var i = 0; i < amount; i++) {
        results.push(new RdDice("rd", sides).roll());
    };
    return results;
}

function rdPrinter(entry)
{
    var output = ""
    if (entry.error !== 0) {
        switch(entry.error) {
            case 101:
                return "错误101：表达式过长";
            case 102:
                return "错误102：变量过大";
        }
    }
    if (entry.comment) {
        output += "因为：";
        output += entry.comment + "，";
    }
    output += "骰机发出了奇怪的响声，随后吐出了："
    if (entry.resultCollection.length >= 50)
    {
        for (var i = 0; i < 50; i++) {
            output += entry.resultCollection[i] + ", ";
        }
        output += "......你丢的骰子太多了！骰机懒得全部列出。你的总加值为：";
        output += entry.bonus;
        output += "，点数总和为：";
        output += entry.sum + "。";
    }
    else {
        for (var j = 0; j < entry.resultCollection.length; j++) {
            output += entry.resultCollection[j] + ", ";
        }
        if (entry.bonus) {
            output += "你的总调整值为：";
            output += entry.bonus;
            output += "，点数总和为：";
        }
        else {
            output += "点数总和为：";
        }
        output += entry.sum + "。";
    }
    return output;
}

//var Iturya = {
//    output: ""
//}

Iturya.output = diceParse(diceInput); // Dice Machine interface

//console.log(Iturya.output);
