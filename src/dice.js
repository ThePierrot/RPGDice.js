//格式：.rd[空格][你要投掷的内容]

//var Blaysiel = {
//    input: ""
//}
//Blaysiel.input = ".rd 3d20 +99d100- 900 +73随便丢";
// Used for test purpose, omitted.

var diceInput = Blaysiel.input;

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
            result = rdParse(diceContent);
            if (result) {
                return rdPrinter(result);
            }
            else {
                return "";
            }
        default:
            return "";
    }
}

// Parser of rd rolls
function rdParse(entry) {
    syntax = entry.match(/^\s\d{0,2}d\d{0,3}((\s*(\+|-)\s*\d{0,2}d\d{0,3})|(\s*(\+|-)\s*\d{0,3}))*/g);
    if (syntax) { // syntax check
        var comment = entry.substring(syntax[0].length);
        var sum = 0
        var bonus = 0;
        var resultCollection = [];
        var diceChunks = syntax[0].match(/(^\s*\d+d\d+)|((\+|-)(\s*\d+d\d+))|((\+|-)\s*\d+)/g);
        if (diceChunks.length > 10) // drop too long expressions
        {
            return "";
        }
        for (var i = 0; i < diceChunks.length; i++) {
            if (diceChunks[i].charAt(0) === "+")
            {
                if (diceChunks[i].match(/\d+d\d+/g))
                {
                    var amountAndSides = diceChunks[i].match(/\d+/g);
                    results = rdRollDices(parseInt(amountAndSides[0]),parseInt(amountAndSides[1]));
                    for (i2 = 0; i2 < results.length; i2++) {
                        sum += results[i2];
                    }
                    resultCollection = resultCollection.concat(results);
                }
                else {
                    bonusVal = parseInt(diceChunks[i].match(/\d+/g));
                    bonus += bonusVal;
                    sum += bonusVal;
                }
            }
            else if (diceChunks[i].charAt(0) === "-") {
                if (diceChunks[i].match(/\d+d\d+/g))
                {
                    var amountAndSides = diceChunks[i].match(/\d+/g);
                    results = rdRollDices(amountAndSides[0], amountAndSides[1]);
                    for (var i3 = 0; i3 < results.length; i3++) {
                        sum -= results[i3];
                    }
                    resultCollection = resultCollection.concat(results);
                }
                else {                                          // if not + or -
                    bonusVal = parseInt(diceChunks[i].match(/\d+/g));
                    bonus -= bonusVal;
                    sum -= bonusVal;
                }
            }
            else {
                var amountAndSides = diceChunks[i].match(/\d+/g);
                results = rdRollDices(parseInt(amountAndSides[0]),parseInt(amountAndSides[1]));
                for (i4 = 0; i4 < results.length; i4++) {
                    sum += results[i4];
                }
                resultCollection = resultCollection.concat(results);
            }
        }
        var output = {
            sum: sum,
            bonus: bonus,
            comment: comment,
            resultCollection: resultCollection
        };
        return output;
    }
    return "";
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
            output += "你的总加值为：";
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

Iturya.output = diceParse(diceInput);

// console.log(Iturya.output);
