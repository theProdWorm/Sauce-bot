var timesCalced = 0;

function calc(message, args) {
    var equation = args.join('');

    const pi = equation.match(/pi/);
    if (pi) pi.forEach(m => {
        equation = equation.replace(m, `Math.PI`);
    });
    console.log(equation);

    const trigonomerty_W_p = equation.match(/(?:sin\([^ \+\*\-\/]+\)|cos\([^ \+\*\-\/]+\)|tan\([^ \+\*\-\/]+\)|asin\([^ \+\*\-\/]+\)|acos\([^ \+\*\-\/]+\)|atan\([^ \+\*\-\/]+\))+/);
    if (trigonomerty_W_p) trigonomerty_W_p.forEach(m => {
        var tf = m.match(/[a-z]+/);

        equation = equation.replace(m, `Math.${m}`);
    });
    console.log(equation);

    const trigonomerty_Wo_p = equation.match(/(?:sin(?:[0-9]\.[0-9]+|[0-9]+)+|cos(?:[0-9]\.[0-9]+|[0-9]+)+|tan(?:[0-9]\.[0-9]+|[0-9]+)+|asin(?:[0-9]\.[0-9]+|[0-9]+)+|acos(?:[0-9]\.[0-9]+|[0-9]+)+|atan(?:[0-9]\.[0-9]+|[0-9]+)+)+/);
    if (trigonomerty_Wo_p) trigonomerty_Wo_p.forEach(m => {
        var tf = m.match(/[a-z]+/)[0];

        equation = equation.replace(m, `Math.${m.substr(0, tf.length)}(${m.substr(tf.length)})`);
    });
    console.log("t = " + trigonomerty_Wo_p);
    console.log(equation);

    const p_powers = equation.match(/(\([^ \+\*\-\/]+\)\^(?:[0-9]\.[0-9]+|[0-9]+))/);
    if (p_powers) p_powers.forEach(m => {
        var base = m.match(/\(.+\)/)[0];
        var exp = m.replace(base + '^', '');

        base = base.replace('(', '');
        base = base.replace(')', '');

        equation = equation.replace(m, `Math.pow(${base}, ${exp})`);
    });
    console.log(equation);

    const powers = equation.match(/([^ \+\*\-\/]+\^[^ \+\*\-\/]+)+/);
    if (powers) powers.forEach(m => {
        var base_exp = m.split('^');

        equation = equation.replace(m, `Math.pow(${base_exp[0]}, ${base_exp[1]})`);
    });
    console.log(equation);

    const mult_parentheses = equation.match(/((?:[0-9]\.[0-9]+|[0-9]+)\()+/);
    if (mult_parentheses) mult_parentheses.forEach(m => {
        equation = equation.replace(m, `${m.charAt(0)}*${m.charAt(1)}`);
    });
    console.log(equation);

    const mult_var = equation.match(/(?:[0-9]\.[0-9]+|[0-9]+)+[a-zA-Z]+/);
    if (mult_var) mult_var.forEach(m => {
        var c = m.match(/(?:[0-9]\.[0-9]+|[0-9]+)+/);
        var _var = m.substr(c.length);

        equation = equation.replace(m, `${c}*${_var}`);
    });
    console.log(equation);

    fs.writeFileSync(`calcs/calc${timesCalced}.js`, `
function calc() {
    return ${equation};
}

module.exports = calc;`.trim());

    const _result = require('./calcs/calc' + timesCalced)();
    const _floored = _result.toString().match(/[0-9]+\.[0-9]{3}/)[0];
    const _rounded = Math.round(parseInt(_floored.substr(_floored.length - 2)) / 10);

    const result = _floored.substr(0, _floored.length - 2) + _rounded.toString();

    message.reply("= " + result);

    fs.unlinkSync(`calcs/calc${timesCalced}.js`);

    timesCalced++;
}

module.exports = { execute: calc }