// entrance here
function diceParse(entry)
{
    if (typeof entry == "string") {
        if (entry.match(/^.rd/))
        {
            var parsed = entry.match(/^\s*.[a-z][a-z]\s\d+d\d+(\s*\+\s*\d+d\d+|\s*\+\s*\d+)*/);
            if (parsed) {
                return rdRoll(parsed[0]);
            }
            return false;
        }
        return false;
        //need to add more cases, placeholder
    }
    else {
        return false;
    }
}

// Normal rolls, results are automatically accumulated.
function rdRoll(entry) {
    var sum = 0;
    var chunks = entry.split("+");
    for (var i = 0; i < chunks.length; i++) {
        if (chunks[i].match(/\s*\d+d\d+\s*/)) {
            sum += rdDiceRanGen(chunks[i]);
        }
        else {
            sum += parseInt(chunks[i]);
        }
    }
    return sum;
}

// Random number generator for .rd rolls.
function rdDiceRanGen(entry) {
    var results = entry.match(/\d+/g);
    amount = parseInt(results[0]);
    type = parseInt(results[1]);
    return amount * Math.floor(Math.random() * type + 1);
}

//Tests
//console.log(diceParse(".rd 3d6 + 1d20 + 3 Here's some comments."));
