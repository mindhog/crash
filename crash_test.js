// Copyright 2020 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const crash = require('crash');

function assert(condition) {
    if (!condition) {
        throw Error('assertion failed');
    }
}

function print(val) {
    console.log(val);
}

var s = new crash.SrcLoc('foo', 1, 2);
assert(s.filename == 'foo');
assert(s.row == 1);
assert(s.col == 2);
assert(s + '' == 'foo:1:2');


var id = new crash.Ident(s, 'foo');
assert(id.loc == s);
assert(id + '' == 'foo');

var str = new crash.StringLiteral(s, 'some text');
assert(str.loc == s);
assert(str.contents == 'some text');
assert(str.toString() == "'some text'");

var args = [str];
var f = new crash.FuncCall(s, id, args);
assert(f.loc == s);
assert(f.func == id);
assert(f.args == args);
assert(f.toString() == "foo 'some text'");

var contents = [f];
var l = new crash.List(s, contents);
assert(l.loc == s);
assert(l.contents == contents);
assert(l.toString() == "foo 'some text';");

var int = new crash.IntegerLiteral(s, 100);
assert(int.loc == s);
assert(int.val == 100);
assert(int.toString() == '100');

var float = new crash.FloatLiteral(s, 1.5);
assert(float.loc == s);
assert(float.val == 1.5);
assert(float.toString() == '1.5');

var slist = new crash.StaticList(s, contents);
assert(slist.loc == s);
assert(slist.contents == contents);
assert(slist.toString() == "{foo 'some text';}");

var dlist = new crash.DynamicList(s, contents);
assert(dlist.loc == s);
assert(dlist.contents == contents);
assert(dlist.toString() == "(foo 'some text';)");

var ifstmt = new crash.IfStmt(s, int, slist, null);
assert(ifstmt.loc == s);
assert(ifstmt.cond == int);
assert(ifstmt.onTrue == slist);
assert(ifstmt.onFalse == null);
assert(ifstmt.toString() == "if 100 {foo 'some text';}");

var forstmt = new crash.ForStmt(s, int, str, float, slist);
assert(forstmt.loc == s);
assert(forstmt.initializer == int);
assert(forstmt.cond == str);
assert(forstmt.doAfter == float);
assert(forstmt.block == slist);
assert(forstmt.toString() == "for 100 'some text' 1.5 {foo 'some text';}");
assert(new crash.ForStmt(s, null, str, float, slist).toString() ==
       "for 'some text' 1.5 {foo 'some text';}"
       );
assert(new crash.ForStmt(s, int, null, float, slist).toString() ==
       "for 100 1.5 {foo 'some text';}"
       );
assert(new crash.ForStmt(s, int, null, float, slist).toString() ==
       "for 100 1.5 {foo 'some text';}"
       );
assert(new crash.ForStmt(s, int, str, null, slist).toString() ==
       "for 100 'some text' {foo 'some text';}"
       );
assert(new crash.ForStmt(s, int, str, float, null).toString() ==
       "for 100 'some text' 1.5"
       );
assert(new crash.VarDef(s, id, id, null).toString() == 'foo : foo');
assert(new crash.VarDef(s, id, null, int).toString() == 'foo := 100');
assert(new crash.VarDef(s, id, id, int).toString() == 'foo : foo = 100');

var toker = new crash.Toker('first\nsecond', 'file', 1);
var temp = toker.consume(9);
assert(temp == 'first\nsec')
assert(toker.row == 2);
assert(toker.col = 3);
toker = new crash.Toker('bogus\nvalue', 'file', 1);
temp = toker.consume(3);
assert(temp == 'bog');
assert(toker.row == 1);
assert(toker.col == 3);

toker = new crash.Toker('   first word\n' +
                        'second third word\n' +
                        '   # Comment\n' +
                        'end\n',
                        'file',
                        1
                        );
function checkToken(tok, row, col, type, text) {
    assert(tok.loc.row == row);
    assert(tok.loc.col == col);
    assert(tok.type == type);
    assert(tok.text == text);
}

checkToken(toker.getToken(), 1, 3, crash.TOK_IDENT, 'first');
checkToken(toker.getToken(), 1, 9, crash.TOK_IDENT, 'word');
checkToken(toker.getToken(), 2, 0, crash.TOK_IDENT, 'second');
checkToken(toker.getToken(), 2, 7, crash.TOK_IDENT, 'third');
checkToken(toker.getToken(), 2, 13, crash.TOK_IDENT, 'word');
checkToken(toker.getToken(), 4, 0, crash.TOK_IDENT, 'end');
checkToken(toker.getToken(), 5, 0, crash.TOK_EOF, '');

toker = new crash.Toker('foo;', 'file', 1);
checkToken(toker.getToken(), 1, 0, crash.TOK_IDENT, 'foo');
checkToken(toker.getToken(), 1, 3, crash.TOK_SEMI, ';');

toker = new crash.Toker(';{}():=', 'file', 1);
checkToken(toker.getToken(), 1, 0, crash.TOK_SEMI, ';');
checkToken(toker.getToken(), 1, 1, crash.TOK_LCURLY, '{');
checkToken(toker.getToken(), 1, 2, crash.TOK_RCURLY, '}');
checkToken(toker.getToken(), 1, 3, crash.TOK_LPAREN, '(');
checkToken(toker.getToken(), 1, 4, crash.TOK_RPAREN, ')');
checkToken(toker.getToken(), 1, 5, crash.TOK_COLON, ':');
checkToken(toker.getToken(), 1, 6, crash.TOK_ASSIGN, '=');

toker = new crash.Toker('1.2 1e+5 1E+5 12.34e56 100 1e-4', 'file', 1);
checkToken(toker.getToken(), 1, 0, crash.TOK_FLOAT, '1.2');
checkToken(toker.getToken(), 1, 4, crash.TOK_FLOAT, '1e+5');
checkToken(toker.getToken(), 1, 9, crash.TOK_FLOAT, '1E+5');
checkToken(toker.getToken(), 1, 14, crash.TOK_FLOAT, '12.34e56');
checkToken(toker.getToken(), 1, 23, crash.TOK_INT, '100');
checkToken(toker.getToken(), 1, 27, crash.TOK_FLOAT, '1e-4');

toker = new crash.Toker('0x1F 0o177 0b1011011', 'file', 1);
checkToken(toker.getToken(), 1, 0, crash.TOK_INT, '0x1F');
checkToken(toker.getToken(), 1, 5, crash.TOK_INT, '0o177');
checkToken(toker.getToken(), 1, 11, crash.TOK_INT, '0b1011011');

toker = new crash.Toker("'first string' 'can\\'t parse this'", 'file', 1);
checkToken(toker.getToken(), 1, 0, crash.TOK_STRLIT, "'first string'");
checkToken(toker.getToken(), 1, 15, crash.TOK_STRLIT, "'can\\'t parse this'");

let ast = crash.parseString("print 'this is some text' { x := 100 }");
assert(ast.toString() == "print 'this is some text' {x := 100;};");

// Assert that 'code' (string) evaluates to 'val'.
function assertEvalsTo(code, val) {
    let cctx = new crash.CompileContext();
    let func = crash.convert(cctx, crash.parseString(code));
    let actual = func(new crash.EvalContext(null, [], [func]));
    if (actual != val)
        throw Error('assertion failed');
}

assertEvalsTo("'string val'", 'string val');
assertEvalsTo("'foo'; 'bar'", 'bar');
assertEvalsTo("if 1 { 'true' }", 'true');
assertEvalsTo("if 0 { 'true' }", null);
assertEvalsTo("if 1 { 'true' } else { 'false' }", 'true');
assertEvalsTo("if 0 { 'true' } else { 'false' }", 'false');
assertEvalsTo("x := 100; x", 100);

// Test concurrency.
let cctx = new crash.CompileContext();
try {
    let code = crash.parseString('1; yield; 2');
    let func = crash.convert(cctx, code);
    func(new crash.EvalContext(null, [], [func]));
    assert(false); // Should have thrown
} catch (e) {
    if (!(e instanceof crash.Yielded))
        throw e;
    assert(e.ctx.resume() == 2);
}

console.log('ok');
