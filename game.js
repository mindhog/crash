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

function registerGame(cctx, ectx) {

    function print(ctx, args) {
        let text = '';
        for (let i = 0; i < args.length; ++i)
            text += args[i];
        let pre = document.createElement('pre');
        pre.innerText = text;
        $('div').append(pre);
    }
    ectx.defs['print'] = cctx.defs['print'] = print;

    function header(ctx, args) {
        let hdr = document.createElement('h1');
        hdr.innerText = args[0];
        $('div').append(hdr);
    }
    ectx.defs['header'] = cctx.defs['header'] = header;

    function evaljs(ctx, args) {
        return eval(args[0]);
    }
    ectx.defs['evaljs'] = cctx.defs['evaljs'] = evaljs;

    header(null, ['Zulang']);
    print(null, ['Welcome to the world of Zulang!\nAdventure awaits.']);
}
