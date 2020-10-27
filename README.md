
Crash - A Minimalistic Command Language
=======================================

Crash is a minimalistic command language for [Crack](https://crack-lang.org)
programs.  It is inspired by TCL, but diverges from the TCL language in some
respects.

This repository also includes several somewhat unrelated variations on the
Crash concept, including the second-generation parser and the javascript
implementation of something vaguely similar.

Installation
------------

You'll need to [build and install Crack
first.](https://github.com/crack-lang/crack/blob/master/INSTALL)

After doing so, you can build the minimal command-line interface as follows:

    $ crackc crash

This will create a `crash.bin` file that can be run directly.  You may also
simply run the `crash` script itself, it will JIT compile itself using
`crack`.

Brief Tutorial
--------------

Hello world:

    $ print 'hello world\n'  # Text after a pound sign is a comment.
    hello world
    null

The trailing "null" is the return value from the print command, printed by the
command line evaluator.

Strings are single-quote delimited, all C escape sequences are supported.
Curly-bracket enclosed text is also treated as a string, but newline escape
sequences are ignored:

    $ print {hello world\n}
    hello world\nnull

Curly bracketed strings also allow nested (but balanced) curly brackets:

    $ print {hello {world}}
    hello {world}null

Other commands can be used as sub-expressions by enclosing them in square
brackets:

    $ print [+ 1 2]
    3null

Variables are declared in a given context using the `var` command and accessed
with the dollar-sign prefix:

    $ var three 'help comment for the three variable' [+ 1 2]
    $ var x [+ 1]
    $ print $three
    3null

The value of a variable declared in the current context or a nested context
may be changed with the `set` command:

    $ set x [+ $x 1]  # increment x.

You can get help on all of the commands and variables in a context with the
help command from "stdlib":

    $ import [stdlib] help
    $ help
    ... this would show all commands ...
    $ help stdlib
    ... shows the help of the standard library comand ...

Arrays and fancy iteration are supported in the `collections` package:

    $ import [collections] array arrayOf
    $ var numbers [array 1 2 3 4]  # These are actually strings.

You can then use an iterator, the `map` command and the `arrayOf` command to
convert them to an array of integers:

    $ set numbers [arrayOf [[numbers iter] map x {+ $x}]]

We can also use `filter` and `each` methods to print only the odd values:

    $ [[numbers iter] filter x {% $x 2}] each x { print $x '\n' }

See the tests and the output of the `help` command for more information.  The
javascript implementation is undocumented, if you're interested in it see
`crash_test.js`.

Disclaimer
----------

This is not an officially supported Google product.
