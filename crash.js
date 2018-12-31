
"use strict";

class SrcLoc {
    constructor(filename, row, col) {
        this.filename = filename;
        this.row = row;
        this.col = col;
    }

    toString() {
        return this.filename + ':' + this.row + ':' + this.col;
    }
}

exports.SrcLoc = SrcLoc;

class Node {
    constructor(loc) {
        this.loc = loc;
    }
}

exports.Node = Node;

// Identifier.
class Ident extends Node {
    constructor(loc, text) {
        super(loc);
        this.text = text;
    }

    toString() {
        return this.text;
    }
}

exports.Ident = Ident;

// An expression.
// expression ::= literal | func_call | dynamic_list | if_stmt
class Expr extends Node {
    constructor(loc) {
        super(loc);
    }
}

// A function call.
class FuncCall extends Expr {
    // loc: SrcLoc
    // func: ident
    // args: array of Expr.
    constructor(loc, func, args) {
        super(loc);
        this.func = func;
        this.args = args;
    }

    toString() {
        var result = this.func.toString();
        for (var i = 0; i < this.args.length; ++i) {
            result += ' ' + this.args[i];
        }
        return result;
    }
}

exports.FuncCall = FuncCall;

class List extends Expr {
    // loc: SrcLoc
    // contents: array of Expr.
    constructor(loc, contents) {
        super(loc);
        this.contents = contents;
    }

    toString() {
        var result = '';
        for (var i = 0; i < this.contents.length; ++i) {
            result += this.contents[i] + ';'
        }
        return result;
    }
}

exports.List = List;

class StringLiteral extends Expr {
    // loc: SrcLoc
    // contents: string
    constructor(loc, contents) {
        super(loc);
        this.contents = contents;
    }

    toString() {
        return "'" + this.contents + "'";
    }
}

exports.StringLiteral = StringLiteral;

class IntegerLiteral extends Expr {
    // loc: SrcLoc
    // val: int
    constructor(loc, val) {
        super(loc);
        this.val = val;
    }

    toString() {
        return this.val.toString();
    }
}

exports.IntegerLiteral = IntegerLiteral;

class FloatLiteral extends Expr {
    // loc: SrcLoc
    // val: float
    constructor(loc, val) {
        super(loc);
        this.val = val;
    }

    toString() {
        return this.val.toString();
    }
}

exports.FloatLiteral = FloatLiteral;

// A list that is to be evaluated during the course of execution.
class DynamicList extends List {
    // loc: SrcLoc
    // contents: array of Expr
    constructor(loc, contents) {
        super(loc, contents);
    }

    toString() {
        return '(' + super.toString() + ')';
    }
}

exports.DynamicList = DynamicList;

// A list that is to be passed into a function without being evaluated.
class StaticList extends List {
    // loc: SrcLoc
    // contents: array of Expr
    constructor(loc, contents) {
        super(loc, contents);
    }

    toString() {
        return '{' + super.toString() + '}';
    }
}

exports.StaticList = StaticList;

class IfStmt extends Expr {
    // loc: SrcLoc
    // cond: Expr  Condition, if true "onTrue" is evaluated, otherwise onFalse.
    // onTrue: StaticList
    // onTrue: StaticList or null
    constructor(loc, cond, onTrue, onFalse) {
        super(loc);
        this.cond = cond;
        this.onTrue = onTrue;
        this.onFalse = onFalse;
    }

    toString() {
        var result = 'if ' + this.cond + ' ' + this.onTrue;
        if (this.onFalse) {
            result += ' ' + this.onFalse;
        }
        return result;
    }
}

exports.IfStmt = IfStmt;

class ForStmt extends Expr {
    // loc: SrcLoc
    // initializer: Expr or null
    // cond: Expr or null
    // doAfter: Expr or null
    // block: StaticList or null
    constructor(loc, initializer, cond, doAfter, block) {
        super(loc);
        this.initializer = initializer;
        this.cond = cond;
        this.doAfter = doAfter;
        this.block = block;
    }

    toString() {
        // TODO: come up wih syntax that actually works.
        var result = 'for';
        if (this.initializer)
            result += ' ' + this.initializer;
        if (this.cond)
            result += ' ' + this.cond;
        if (this.doAfter)
            result += ' ' + this.doAfter;
        if (this.block)
            result += ' ' + this.block;
        return result;
    }
}

exports.ForStmt = ForStmt;

const TOK_EOF = 0;
exports.TOK_EOF = TOK_EOF;
const TOK_LPAREN = 1;
exports.TOK_LPAREN = TOK_LPAREN;
const TOK_RPAREN = 2;
exports.TOK_RPAREN = TOK_RPAREN;
const TOK_IDENT = 3;
exports.TOK_IDENT = TOK_IDENT;
const TOK_SEMI = 4;
exports.TOK_SEMI = TOK_SEMI;
const TOK_STRLIT = 5;
exports.TOK_STRLIT = TOK_STRLIT;
const TOK_INT = 6;
exports.TOK_INT = TOK_INT;
const TOK_FLOAT = 7;
exports.TOK_FLOAT = TOK_FLOAT;
const TOK_LCURLY = 8;
exports.TOK_LCURLY = TOK_LCURLY;
const TOK_RCURLY = 9;
exports.TOK_RCURLY = TOK_RCURLY;

class Token {
    // loc: SrcLoc
    // type: int (see TOK_* values)
    // text: string
    constructor(loc, type, text) {
        this.loc = loc;
        this.type = type;
        this.text = text;
    }

    toString() {
        if (this.text)
            return JSON.stringify(this.text);
        else if (this.type == TOK_EOF)
            return '<EOF>';
        else
            return ':' + type + ':';
    }

    isEOF() { return this.type == TOK_EOF; }
    isFloat() { return this.type == TOK_FLOAT; }
    isIdent(val) {
        return this.type == TOK_IDENT &&
            (val == undefined || this.text == val);
    }
    isInt() { return this.type == TOK_INT; }
    isLCurly() { return this.type == TOK_LCURLY; }
    isLParen() { return this.type == TOK_LPAREN; }
    isRCurly() { return this.type == TOK_RCURLY; }
    isRParen() { return this.type == TOK_RPAREN; }
    isSemi() { return this.type == TOK_SEMI; }
    isStrLit() { return this.type == TOK_STRLIT; }
    isTerminator() {
        return this.type == TOK_EOF || this.type == TOK_RCURLY ||
            this.type == TOK_RPAREN;
    }
}

class ParseError extends Error {
    constructor(text) { super(text); }
}

class Toker {
//    String contents;
//    uint pos;
//    uint row, col;
//
//    ## Stores the last row and column position.  This should be the beginning
//    ## of the current token.  It is updated by __makeTok() and __updateLoc().
//    uint lastRow, lastCol;

    // contents: string -- complete text of the script to parse.
    // row:
    constructor(contents, filename, row) {
        this.contents = contents;
        this.row = row;
        this.col = 0;
        this.filename = filename;
    }

    // Consume contents up to position 'pos' (an int).
    consume(pos) {
        let result = this.contents.substring(0, pos);
        this.contents = this.contents.substring(pos);

        // Adjust the row and column for the result.
        let rx = /\n/g;
        let m = null;
        let lastIndex = 0;
        while (m = rx.exec(result)) {
            this.row += 1;
            this.col = 0;
            lastIndex = rx.lastIndex;
        }
        this.col += result.length - lastIndex;

        return result
    }

    makeToken(match, tokType) {
        return new Token(new SrcLoc(this.filename, this.row, this.col), tokType,
                         this.consume(match[0].length)
                         );
    }

    // Tries to match a regex at the beginning of the string, returns null if
    // it's undefined.
    match(regex) {
        let match = regex.exec(this.contents);
        if (match && match.index == 0)
            return match;
        else
            return null;
    }

    getToken() {

        // Clear all whitespace and comments from the beginning of the line.
        let m = null;
        while (m = this.match(/^(\s(#[^\n]*)?)+/)) {
            this.consume(m[0].length);
        }

        // EOF.
        if (!this.contents)
            return this.makeToken([''], TOK_EOF);

        // Identifier.
        m = this.match(/^[a-zA-Z_][a-zA-Z_0-9]*/);
        if (m)
            return this.makeToken(m, TOK_IDENT);

        // Single character symbols.
        m = this.match(/^[;\{\}\(\)]/);
        if (m)
            return this.makeToken(m,
                                  ({';': TOK_SEMI,
                                    '{': TOK_LCURLY, '}': TOK_RCURLY,
                                    '(': TOK_LPAREN, ')': TOK_RPAREN
                                   })[m[0]]
                                   );

        // Hex, octal and binary integers.
        if (m = this.match(/^0x[0-9a-fA-F]+/))
            return this.makeToken(m, TOK_INT);
        if (m = this.match(/^0o[0-7]+/))
            return this.makeToken(m, TOK_INT);
        if (m = this.match(/^0b[01]+/))
            return this.makeToken(m, TOK_INT);

        // Floats and integers.
        if (m = this.match(/^\d+(\.\d+)?([eE][+\-]?\d+)?/)) {
            if (this.match(/^\d+[\.eE]/))
                return this.makeToken(m, TOK_FLOAT);
            else
                return this.makeToken(m, TOK_INT);
        }

        // Strings.
        if (m = this.match(/^'([^'\\]|\\.)*'/))  // '
            return this.makeToken(m, TOK_STRLIT);

        console.log('no match, contents: ' + JSON.stringify(this.contents));

//
//        while (true) {
//            byte ch;
//            if (pos == contents.size)
//                ch = 0;
//            else {
//                ch = contents[pos++];
//                if (ch == b'\n') {
//                    row++;
//                    col = 0;
//                } else {
//                    col += 1;
//                }
//            }
//            if (state == BASE) {
//                if (!ch)
//                    return __makeTok(TOK_EOF, null);
//                if (ch == b'\n' || ch == b';')
//                    return __makeTok(TOK_SEMI, String(1, ch));
//                if (ch == b'{') {
//                    return __makeTok(TOK_LCURLY, String(1, ch));
//                } else if (ch == b'}') {
//                    return __makeTok(TOK_RCURLY, String(1, ch));
//                } else if (ch == b'(') {
//                    return __makeTok(TOK_LPAREN, String(1, ch));
//                } else if (ch == b')') {
//                    return __makeTok(TOK_RPAREN, String(1, ch));
//                } else if (ch == b"'") {
//                    state = LIT_STR;
//                } else if (ch == b'#') {
//                    state = COMMENT;
//                } else if (ch >= b'A' && ch <= b'Z' ||
//                           ch >= b'a' && ch <= b'z' ||
//                           ch == b'_') {
//                    result.append(ch);
//                    state = IDENT;
//                } else if (isDigit(ch)) {
//                    result.append(ch);
//                    state = INTEGER;
//                } else if (isSpace(ch)) {
//                    __updateLoc();
//                } else {
//                    throw ParseError(
//                        FStr() I`$(SrcLoc.get('filename', lastRow, lastCol)) \
//                                 Unrecognized character: $ch`
//                    );
//                }
//            } else if (state == IDENT) {
//                if (ch >= b'A' && ch <= b'Z' ||
//                    ch >= b'a' && ch <= b'z' ||
//                    ch == b'_' ||
//                    isDigit(ch)
//                    ) {
//                    result.append(ch);
//                } else {
//                    # Back up so we can catch it if it's a newline.
//                    if (ch) backup();
//                    return __makeTok(TOK_IDENT, String(result, true));
//                }
//            } else if (state == INTEGER) {
//                if (isDigit(ch)) {
//                    result.append(ch);
//                } else if (ch == b'.') {
//                    result.append(ch);
//                    state = FRACTION;
//                } else if (ch == b'e' || ch == b'E') {
//                    result.append(ch);
//                    state = EXPONENT_SIGN;
//                } else {
//                    if (ch) backup();
//                    return __makeTok(TOK_INT, String(result, true));
//                }
//            } else if (state == FRACTION) {
//                if (isDigit(ch)) {
//                    result.append(ch);
//                } else if (ch == b'e' || ch == b'E') {
//                    result.append(ch);
//                    state = EXPONENT_SIGN;
//                } else {
//                    if (ch) backup();
//                    return __makeTok(TOK_FLOAT, String(result, true));
//                }
//            } else if (state == EXPONENT_SIGN) {
//                if (isDigit(ch)) {
//                    state = EXPONENT;
//                    result.append(ch);
//                } else if (ch == b'+' || ch == b'-') {
//                    result.append(ch);
//                    state = EXPONENT;
//                } else {
//                    if (ch) backup();
//                    return __makeTok(TOK_FLOAT, String(result, true));
//                }
//            } else if (state == EXPONENT) {
//                if (isDigit(ch)) {
//                    result.append(ch);
//                } else {
//                    if (ch) backup();
//                    return __makeTok(TOK_FLOAT, String(result, true));
//                }
//            } else if (state == LIT_STR) {
//                if (ch == b'\\')
//                    state = LIT_STR_ESC;
//                else if (ch == b"'")
//                    return __makeTok(TOK_STRLIT, String(result, true));
//                else if (!ch)
//                    throw ParseError('Premature end of file in string literal.');
//                else
//                    result.append(ch);
//            } else if (state == LIT_STR_ESC) {
//                if (ch == b'n') {
//                    ch = b'\n';
//                } else if (ch == b't') {
//                    ch = b'\t';
//                } else if (ch == b'a') {
//                    ch = b'\a';
//                } else if (ch == b'r') {
//                    ch = b'\r';
//                } else if (ch == b'b') {
//                    ch = b'\b';
//                } else if (ch == b'x') {
//                    state = LIT_STR_HEX;
//                    val = 0;
//                    continue;
//                } else if (ch == b'o') {
//                    state = LIT_STR_OCT;
//                    val = 0;
//                    continue;
//                } else if (ch >= b'0' && ch <= b'7') {
//                    state = LIT_STR_OCT + 1;
//                    val = ch - b'0';
//                    continue;
//                }
//
//                result.append(ch);
//                state = LIT_STR;
//            } else if (state >= LIT_STR_HEX && state < LIT_STR_OCT) {
//                if (ch >= b'0' && ch <= b'9')
//                    ch -= b'0';
//                else if (ch >= b'a' && ch <= b'f')
//                    ch = ch - b'a' + 10;
//                else if (ch >= b'A' && ch <= b'F')
//                    ch = ch - b'A' + 10;
//                else {
//                    # Not a legal hex character.  Add what we've got so far
//                    # and switch to the next state.
//                    result.append(val);
//                    if (ch == b'\\') {
//                        state = LIT_STR_ESC;
//                        continue;
//                    } else if (ch == b"'") {
//                        return __makeTok(TOK_STRLIT, String(result, true));
//                    } else {
//                        result.append(ch);
//                        state = LIT_STR;
//                        continue;
//                    }
//                }
//
//                val = (val << 4) | ch;
//
//                # Next character.
//                ++state;
//                if (state == LIT_STR_OCT) {
//                    result.append(val);
//                    state = LIT_STR;
//                }
//            } else if (state >= LIT_STR_OCT && state < COMMENT) {
//                if (ch >= b'0' && ch <= b'7')
//                    ch -= b'0';
//                else {
//                    # Not a legal octal character.
//                    result.append(val);
//                    if (ch == b'\\') {
//                        state = LIT_STR_ESC;
//                        continue;
//                    } else if (ch == b"'") {
//                        return __makeTok(TOK_STRLIT, String(result, true));
//                    } else {
//                        result.append(ch);
//                        state = LIT_STR;
//                        continue;
//                    }
//                }
//
//                val = (val << 3) | ch;
//
//                ++state;
//                if (state == COMMENT) {
//                    result.append(val);
//                    state = LIT_STR;
//                    continue;
//                }
//            } else if (state == COMMENT) {
//                if (ch == b'\n') {
//                    state = BASE;
//                    __updateLoc();
//                } else if (!ch) {
//                    return __makeTok(TOK_EOF, null);
//                }
//            }
//        }
//
//        return null;
    }
}

exports.Toker = Toker;

class Parser {
    // toker: Toker
    constructor(toker) {
        this.toker = toker;
        this.putback = [];
    }

    getToken() {
        if (this.putback.length)
            return this.putback.pop();
        else
            return this.toker.getToken();
    }

    putBack(tok) { this.putback.push(tok); }

    parseExpr(longFuncCalls) {
        let tok = this.getToken();
        if (tok.isIdent()) {
            if (longFuncCalls) {
                this.putBack(tok);
                return this.parseFuncCall(tok);
            } else {
                return
                    new FuncCall(loc, Ident(tok.loc, tok.text), Array[Expr]());
            }
        } else if (tok.isStrLit()) {
            return new StringLiteral(tok.loc, eval(tok.text));
        } else if (tok.isInt()) {
            return new IntegerLiteral(tok.loc, eval(tok.text));
        } else if (tok.isFloat()) {
            return new FloatLiteral(tok.loc, eval(tok.text));
        } else if (tok.isLParen()) {
            return this.parseDynamicList(tok.loc);
        } else if (tok.isLCurly()) {
            return this.parseStaticList(tok.loc);
        } else {
            throw new ParseError('Unexpected token: ' + tok);
        }
    }

    parseFuncCall(ident) {
        let name = new Ident(ident.loc, ident.text);
        let tok = this.getToken();
        let args = [];
        while (!(tok = this.getToken()).isTerminator() && !tok.isSemi()) {
            this.putBack(tok);
            args.push(this.parseExpr(false));
        }
        if (!tok.isSemi())
            this.putBack(tok);
        return new FuncCall(ident.loc, name, args);
    }

    parseIfStmt(ident) {
        let cond = this.parseExpr(false);
        let tok = this.getToken();
        let onTrue = null;
        let onFalse = null;
        if (tok.isLCurly()) {
            onTrue = this.parseStaticList(tok.loc);
        } else {
            // If we don't get a curly, just parse the rest as a statement.
            this.putBack(tok);
            let stmt = this.parseStatement();
            onTrue = new StaticList(tok.loc, [stmt]);
        }

        tok = this.getToken();
        if (tok.isIdent('else')) {
            tok = this.getToken();
            if (tok.isLCurly()) {
                onFalse = this.parseStaticList(tok.loc);
            } else {
                let stmt = this.parseStatement();
                onFalse = new StaticList(tok.loc, [stmt]);
            }
        } else {
            this.putBack(tok);
        }

        return new IfStmt(ident.loc, cond, onTrue, onFalse);
    }

    // Returns null if we just parse a semicolon.
    parseStatement() {
        let tok = this.getToken();
        if (tok.isSemi())
            return null;
        else if (tok.isIdent('if'))
            return this.parseIfStmt(tok);
        this.putBack(tok);
        return this.parseExpr(true);
    }

    parseList(list) {
        let tok = null;
        while (!(tok = this.getToken()).isTerminator()) {
            this.putBack(tok);
            let expr = this.parseStatement();
            if (expr)
                list.push(expr);
        }
        this.putBack(tok);
    }

    parseStaticList(loc) {
        let list = [];
        this.parseList(list);
        let tok = null;
        if (!(tok = this.getToken()).isRCurly())
            throw new ParseError("Expected '}', got " + tok);
        return new StaticList(loc, list);
    }

    parseDynamicList(loc) {
        let list = [];
        this.parseList(list);
        let tok = null;
        if (!(tok = this.getToken()).isRParen())
            throw new ParseError("Expected ')', got " + tok);
        return new DynamicList(loc, list);
    }

    parse() {
        // Peek at the first token to store its location.
        let firstTok = this.getToken();
        this.putBack(firstTok);

        let list = [];
        this.parseList(list);
        let tok = null;
        if (!(tok = this.getToken()).isEOF())
            throw new ParseError("Expected EOF, got " + tok);
        return new List(firstTok.loc, list);
    }
}

exports.Parser = Parser;

function parseString(text, filename, row) {
    if (filename == undefined)
        filename = '<input>';
    if (row == undefined)
        row = 1;
    return new Parser(new Toker(text, filename, row)).parse();
}

exports.parseString = parseString;

function print(ctx) {
    for (let i = 0; i < ctx.args.length; ++i)
        console.log(ctx.args[i]);
}

class CompileContext {
    constructor() {
        this.defs = [];
    }

    resolve(name) {
        return this.defs[name]
    }
}

exports.CompileContext = CompileContext;

// This code assumes a very simple virtual machine build on javascript
// functions.
// Every expression is a function that accepts a single argument which is the
// evaluation context.  Lists of expressions (see the "List" ast nodes above)
// are simply lists of these functions.

class EvalContext {
    constructor(parent, args) {
        this.parent = parent;
        this.args = args;
    }
}

exports.EvalContext = EvalContext;

// Execute a list, returns the result of the last expression.
function evalList(ctx, list) {
    let result = null;
    for (let i = 0; i < list.length; ++i)
        result = list[i](ctx);
    return result;
}

// Evaluate an argument list to a list of values.  Returns the list of values.
function evalArgs(ctx, list) {
    let args = [];
    for (let i = 0; i < list.length; ++i)
        args.push(list[i](ctx));
    return args;
}

// Convert a list of Expr to a list of functions.
function convertList(cctx, list) {
    let result = [];
    for (let i = 0; i < list.length; ++i)
        result.push(convert(cctx, list[i]));
    return result;
}

function convert(cctx, node) {
    if (node instanceof StringLiteral) {
        return (ctx) => node.contents;
    } else if (node instanceof FloatLiteral || node instanceof IntegerLiteral) {
        return (ctx) => node.val;
    } else if (node instanceof FuncCall) {
        let f = cctx.resolve(node.func.text);

        // Convert the arguments.
        let argExprs = convertList(cctx, node.args);

        return (ctx) => {
            // create a new context for the function.
            ctx = new EvalContext(ctx, evalArgs(ctx, argExprs));
            return f.call(null, ctx);
        };
    } else if (node instanceof StaticList) {
        let funcList = convertList(cctx, node.contents);

        // We want this to be a function that returns a function that
        // evaluates the list.
        return (ctx) => (ctx) => evalList(ctx, funcList);
    } else if (node instanceof List) {
        let funcList = convertList(cctx, node.contents);
        return (ctx) => evalList(ctx, funcList);
    } else if (node instanceof IfStmt) {
        let condFunc = convert(cctx, node.cond);
        let onTrueFunc = convert(cctx, node.onTrue)(null);
        if (node.onFalse) {
            let onFalseFunc = convert(cctx, node.onFalse)(null);
            return (ctx) => condFunc(ctx) ? onTrueFunc(ctx) : onFalseFunc(ctx);
        } else {
            return (ctx) => condFunc(ctx) ? onTrueFunc(ctx) : null;
        }
    } else {
        throw Error('bad node type');
    }
}

exports.convert = convert;