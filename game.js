

function registerGame(cctx) {

    function print(ctx, args) {
        let text = '';
        for (let i = 0; i < args.length; ++i)
            text += args[i];
        let pre = document.createElement('pre');
        pre.innerText = text;
        $('div').append(pre);
    }
    cctx.defs['print'] = print;

    function header(ctx, args) {
        let hdr = document.createElement('h1');
        hdr.innerText = args[0];
        $('div').append(hdr);
    }
    cctx.defs['header'] = header;

    function evaljs(ctx, args) {
        return eval(args[0]);
    }
    cctx.defs['evaljs'] = evaljs;

    header(null, ['Zulang']);
    print(null, ['Welcome to the world of Zulang!\nAdventure awaits.']);
}
