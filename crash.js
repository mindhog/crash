
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

class VarDef extends Expr {
    // loc: SrcLoc
    // name: Ident
    // type: Ident or null
    // initializer: Expr or null
    constructor(loc, name, type, initializer) {
        super(loc);
        this.name = name;
        this.type = type;
        this.initializer = initializer;
    }

    toString() {
        let result = this.name.toString() + ' :';
        if (this.type)
            result += ' ' + this.type + (this.initializer ? ' ' : '');
        if (this.initializer)
            result += '= ' + this.initializer;
        return result;
    }
}

exports.VarDef = VarDef;

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
const TOK_COLON = 9;
exports.TOK_COLON = TOK_COLON;
const TOK_ASSIGN = 10;
exports.TOK_ASSIGN = TOK_ASSIGN;

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

    isAssign() { return this.type == TOK_ASSIGN; }
    isColon() { return this.type == TOK_COLON; }
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

        return result;
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
        while (m = this.match(/^(\s+|(#[^\n]*))+/)) {

            console.log('comsuming ' + m[0].length + ' from ' + this.contents);
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
        m = this.match(/^[;\{\}\(\):=]/);
        if (m)
            return this.makeToken(m,
                                  ({';': TOK_SEMI,
                                    '{': TOK_LCURLY, '}': TOK_RCURLY,
                                    '(': TOK_LPAREN, ')': TOK_RPAREN,
                                    ':': TOK_COLON,
                                    '=': TOK_ASSIGN,
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
        throw new ParseError('Unknown token: ' +
                             JSON.stringify(this.contents)
                             );
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
            // Check for a variable definition.
            let tok2 = this.getToken();
            if (tok2.isColon()) {
                return this.parseVarDef(tok);
            }
            this.putBack(tok2);

            if (longFuncCalls) {
                this.putBack(tok);
                return this.parseFuncCall(tok);
            } else {
                return new FuncCall(tok.loc, new Ident(tok.loc, tok.text),
                                    []
                                    );
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

    parseVarDef(ident) {
        let tok = this.getToken();
        let name = new Ident(ident.loc, ident.text);
        let type = null;
        if (tok.isIdent()) {
            type = new Ident(tok.loc, tok.text);
            tok = this.getToken();
        }
        let initializer = null;
        if (tok.isAssign())
            initializer = this.parseExpr(true);
        else
            this.putBack(tok);
        return new VarDef(ident.loc, name, type, initializer);
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

function print(ctx, args) {
    for (let i = 0; i < args.length; ++i)
        console.log(args[i]);
}

function yield_(ctx, args) {
    throw new Yielded(ctx);
}

class CompileContext {
    constructor() {
        this.defs = {
            yield: yield_,
            print: print,
        };
    }

    resolve(name) {
        return this.defs[name]
    }
}

exports.CompileContext = CompileContext;

// A special exception raised whenever we do a "yield."
class Yielded extends Error {
    // ctx: the EvalContext to be resumed.
    constructor(ctx) {
        super();
        this.ctx = ctx;
    }
}

exports.Yielded = Yielded;

// This code assumes a very simple virtual machine build on javascript
// functions.
// Every expression is a function that accepts a single argument which is the
// evaluation context.  Lists of expressions (see the "List" ast nodes above)
// are simply lists of these functions.

class EvalContext {
    constructor(parent, args, block) {
        this.parent = parent;
        this.args = args;
        this.defs = [];

//        // If this flag is set to true, execution stops.
//        this.yield = false;

        // The current block (array of function(EvalContext)) and the
        // "instruction pointer," which is just an index into that block.
        this.block = block;
        this.ip = 0;
    }

    lookUp(name) {
        let val = this.defs[name];
        if (val != undefined)
            return val;
        else
            return this.parent ? this.parent.lookUp(name) : null;
    }

    // Resume execution after a "yield".  Returns the final result.
    resume() {
        let ctx = this;
        let result = null;

        // Continue executing and popping the parent context for as long as
        // there is a context.
        while (ctx) {
            this.ip += 1;
            for (; this.ip < ctx.block.length; ++this.ip)
                // TODO: we need to deal with argument list contexts a little
                // differently and store each result.
                result = ctx.block[ctx.ip](ctx);
            ctx = ctx.parent;
        }

        return result;
    }
}

class ArgsContext extends EvalContext {
    // func: the function to be after the block.
    constructor(parent, func, block) {
        super(parent, [], block);
        this.func = func;
    }

    resume() {
        let ctx = this;

        for (; this.ip < ctx.block.length; ++this.ip)
            // TODO: we need to deal with argument list contexts a little
            // differently and store each result.
            this.args.push(ctx.block[ctx.ip](ctx));


        let result = this.func(ctx);
    }
}

exports.EvalContext = EvalContext;

// Execute a list, returns the result of the last expression.
function evalList(ctx, list) {
    let result = null;
    let localCtx = new EvalContext(ctx, [], list);
    for (; localCtx.ip < list.length; ++localCtx.ip)
        result = list[localCtx.ip](localCtx);
    return result;
}

// Evaluate an argument list to a list of values.  Returns the list of values.
function evalArgs(ctx, list) {
    let args = [];
    // XXX I think what has to happen here is that an EvalContext can start
    // out as an argument context and then gets converted to a function call
    // context.  We may need to resume argument contexts at multiple levels,
    // too, so perhaps a list context can simply subsume its args context?
    let localCtx = new ArgsContext(ctx, [], list);
    for (; localCtx.ip < list.length; ++localCtx.ip)
        args.push(list[localCtx.ip](localCtx));
    return args;
}

// Convert a list of Expr to a list of functions.
function convertList(cctx, list) {
    let result = [];
    for (let i = 0; i < list.length; ++i)
        result.push(convert(cctx, list[i]));
    return result;
}

// Converts an AST node to a javascript function.
// cctx: CompileContext
// node: Node
// returns function(ctx: EvalContext) -> object
function convert(cctx, node) {
    if (node instanceof StringLiteral) {
        return (ctx) => node.contents;
    } else if (node instanceof FloatLiteral || node instanceof IntegerLiteral) {
        return (ctx) => node.val;
    } else if (node instanceof FuncCall) {
        let f = cctx.resolve(node.func.text);
        if (f == undefined)
            throw Error('Undefined name ' + node.func.text);

        // Convert the arguments.
        let argExprs = convertList(cctx, node.args);

        return (ctx) => {
            // Need to eval args and populate the args list in an intermediate
            // context
            return f.call(null, ctx, evalArgs(ctx, argExprs));
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
    } else if (node instanceof VarDef) {
        cctx.defs[node.name.text] = (ctx) => ctx.lookUp(node.name.text);
        if (node.initializer) {
            let init = convert(cctx, node.initializer);
            return (ctx) => {
                let val = ctx.defs[node.name.text] = init(ctx);
                return val;
            };
        } else {
            return (ctx) => {
                ctx.defs[node.name.text] = null;
                return null;
            };
        }
    } else {
        throw Error('bad node type: ' + node);
    }
}

exports.convert = convert;

