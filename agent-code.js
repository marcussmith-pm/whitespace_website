(() => {
    'use strict';
    const hero = document.querySelector('.hero');
    const content = document.querySelector('.hero-content');
    const canvas = document.querySelector('#agent-code');
    if (!hero || !content || !canvas) return;
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const faceImage = new Image();
    const symbols = '01{}[]<>/=+;:abcdefABCDEF23456789';
    // Each introduction belongs to one portrait, including across shuffle cycles.
    const agents = [
        ['Alex', 'Hi, I am Alex.', 'Your AI planning agent.'],
        ['Trinity', 'Hi, I am Trinity.', 'Your AI research agent.'],
        ['Nova', 'Hello, I am Nova.', 'I am an AI creative agent.'],
        ['Anna', 'Hello, my name is Anna.', 'Your AI workflow agent.'],
        ['Evelyn', 'Hi, I am Evelyn.', 'Your AI strategy agent.'],
        ['Leo', 'Hello, I am Leo.', 'I am an AI coding agent.'],
        ['Maya', 'Hi, my name is Maya.', 'Your AI insights agent.'],
        ['Zara', 'Hello, I am Zara.', 'Your AI support agent.'],
        ['Kai', 'Hi, I am Kai.', 'Your AI operations agent.'],
        ['Isla', 'Hello, my name is Isla.', 'I am an AI design agent.'],
        ['Atlas', 'Hi, I am Atlas.', 'Your AI knowledge agent.'],
        ['Robin', 'Hello, I am Robin.', 'Your AI coordination agent.'],
    ];
    const columns = 128, rows = 144;
    let width = 0, height = 0, copyBox;
    // One character scale for falling code, portraits and agent introductions.
    const codeFontSize = 9, columnGap = 6.75, rowGap = 9;
    const atlas = document.createElement('canvas');
    const glyphWidth = 12, glyphHeight = 14, atlasScale = 2;
    atlas.width = symbols.length*glyphWidth*atlasScale;
    atlas.height = glyphHeight*atlasScale*2;
    const atlasContext = atlas.getContext('2d');
    atlasContext.scale(atlasScale,atlasScale);
    atlasContext.textBaseline = 'middle';
    atlasContext.fillStyle = '#171717';
    for (let weight=0;weight<2;weight++) {
        atlasContext.font = `${weight ? 700 : 500} ${codeFontSize}px ui-monospace, 'SFMono-Regular', Consolas, monospace`;
        for (let i=0;i<symbols.length;i++) atlasContext.fillText(symbols[i],i*glyphWidth+2,glyphHeight*(weight+.5));
    }
    let streams = [], portraits = [], faces = [];
    let portraitBag = [], lastPortrait = -1;
    let paused = reduced.matches, visible = true;
    let frame = 0, lastTime = 0, lastDraw = 0, rainTime = 0;
    let pointer = null, lastSpawn = -1000, sequence = 0, spawnTimer = 0;

    function hash(value) {
        const x = Math.sin(value * 127.1 + 311.7) * 43758.5453;
        return x - Math.floor(x);
    }
    function smooth(value) { const t = Math.max(0,Math.min(1,value)); return t*t*(3-2*t); }
    function quietZone(x,y) {
        const dx = Math.max(copyBox.left-x,0,x-copyBox.right);
        const dy = Math.max(copyBox.top-y,0,y-copyBox.bottom);
        // Keep 80% of the code visible beneath the copy (20% white veil).
        return .8 + .2 * smooth(Math.hypot(dx,dy)/85);
    }
    function glyph(index,x,y,alpha,bold=false) {
        if (alpha < .008) return;
        context.globalAlpha = Math.min(1,alpha);
        context.drawImage(atlas,index*glyphWidth*atlasScale,bold ? glyphHeight*atlasScale : 0,glyphWidth*atlasScale,glyphHeight*atlasScale,
            x-2,y-glyphHeight/2,glyphWidth,glyphHeight);
    }
    function resize() {
        const bounds = hero.getBoundingClientRect();
        const copy = content.getBoundingClientRect();
        width = bounds.width; height = bounds.height;
        copyBox = {left:copy.left-bounds.left-20, right:copy.right-bounds.left+20,
            top:copy.top-bounds.top-25, bottom:copy.bottom-bounds.top+25};
        const ratio = Math.min(devicePixelRatio || 1,1.5);
        canvas.width = Math.round(width*ratio); canvas.height = Math.round(height*ratio);
        context.setTransform(ratio,0,0,ratio,0,0);
        context.fillStyle = '#171717';
        streams = Array.from({length:Math.ceil(width/columnGap)},(_,i) => ({
            x:i*columnGap+1,
            speed:24+hash(i+8)*27,
            trail:.35+hash(i+17)*.6,
            start:hash(i+11)*height, seed:i*73,
        }));
        clearTimeout(spawnTimer); spawnTimer=0;
        faces = []; pointer = null;
        lastTime = 0; requestDraw();
    }
    function retire() { for (const face of faces) face.target = 0; }
    function nextPortrait() {
        if (!portraitBag.length) {
            portraitBag = portraits.map((_,index)=>index);
            for (let i=portraitBag.length-1;i>0;i--) {
                const j=Math.floor(Math.random()*(i+1));
                [portraitBag[i],portraitBag[j]]=[portraitBag[j],portraitBag[i]];
            }
            if (portraitBag[portraitBag.length-1]===lastPortrait && portraitBag.length>1) {
                [portraitBag[0],portraitBag[portraitBag.length-1]]=[portraitBag[portraitBag.length-1],portraitBag[0]];
            }
        }
        lastPortrait=portraitBag.pop();
        return portraits[lastPortrait];
    }
    function spawn(x,y,now,touch = false) {
        if (!portraits.length) return;
        const faceWidth = Math.min(width<600 ? Math.min(225,Math.max(120,(height-copyBox.bottom-155)*columns/rows)) : 300,width*.68);
        const faceHeight = faceWidth * rows/columns;
        const mask=nextPortrait();
        const face = {
            x:width<600 ? width/2 : Math.max(faceWidth/2+15,Math.min(width-faceWidth/2-15,x)),
            y:width<600 ? height-faceHeight/2-125 : Math.max(faceHeight/2+90,Math.min(height-faceHeight/2-100,y)),
            width:faceWidth,height:faceHeight,progress:0,target:1,
            id:++sequence,mask,agent:agents[lastPortrait],age:0,mirror:Math.random()<.5,
            eyeSpread:(Math.random()-.5)*.12,jawShape:(Math.random()-.5)*.18,mouthHeight:(Math.random()-.5)*.016,expires:touch ? now+4200 : Infinity,
        };
        retire();
        // Keep only one dissolving face and one new face during a handoff.
        faces = [...faces.slice(-1),face];
        lastSpawn = now;
        if (touch) setTimeout(() => { face.target=0; requestDraw(); },4200);
    }
    function interact(event) {
        const bounds = hero.getBoundingClientRect();
        const x = event.clientX-bounds.left, y = event.clientY-bounds.top;
        const blocked = !!event.target.closest('a,button,.hero-content');
        pointer = blocked ? null : {x,y};
        clearTimeout(spawnTimer); spawnTimer=0;
        if (blocked) { retire(); requestDraw(); return; }
        const now = performance.now();
        const active = faces.find(face => face.target === 1);
        const near = active && Math.hypot((x-active.x)/(active.width*.64),(y-active.y)/(active.height*.64))<1;
        if (!near) {
            retire();
            if (now-lastSpawn>=300) spawn(x,y,now,event.pointerType==='touch');
            else spawnTimer=setTimeout(() => {
                if (pointer) { spawn(pointer.x,pointer.y,performance.now(),event.pointerType==='touch'); requestDraw(); }
                spawnTimer=0;
            },300-(now-lastSpawn));
        }
        requestDraw();
    }
    function sampleFace(face,x,y) {
        const v=(y-face.y+face.height/2)/face.height;
        if (v<0 || v>1 || Math.abs(x-face.x)>face.width*.58) return 0;
        const eyeBand=Math.exp(-(((v-.42)/.09)**2));
        const jawBand=Math.exp(-(((v-.72)/.12)**2));
        const mouthBand=Math.exp(-(((v-.65)/.075)**2));
        let u=(x-face.x)/(face.width*(1+face.eyeSpread*eyeBand+face.jawShape*jawBand))+.5;
        const sourceV=v-face.mouthHeight*mouthBand;
        if (face.mirror) u=1-u;
        if (u<0 || u>1 || sourceV<0 || sourceV>1) return 0;
        const px=u*(columns-1), py=sourceV*(rows-1);
        const x0=Math.floor(px), y0=Math.floor(py);
        const x1=Math.min(columns-1,x0+1), y1=Math.min(rows-1,y0+1);
        const dx=px-x0, dy=py-y0;
        const a=face.mask[y0*columns+x0]*(1-dx)+face.mask[y0*columns+x1]*dx;
        const b=face.mask[y1*columns+x0]*(1-dx)+face.mask[y1*columns+x1]*dx;
        return (a*(1-dy)+b*dy)*smooth(face.progress);
    }
    function drawRain() {
        const count=Math.ceil(height/rowGap)+1;
        const cycle=count*rowGap;
        for (const stream of streams) {
            const offset=(stream.start+rainTime*stream.speed)%cycle;
            const head=(stream.start*1.37+rainTime*stream.speed)%cycle;
            const trail=cycle*stream.trail;
            for (let row=0;row<count;row++) {
                // The exact same glyphs keep descending through the face.
                // Portrait luminance only modulates this one live code field.
                const y=(row*rowGap+offset)%cycle;
                if (y>height) continue;
                const quiet=quietZone(stream.x,y);
                if (quiet<.07) continue;
                const distance=(head-y+cycle)%cycle;
                const pulse=distance<trail ? Math.pow(1-distance/trail,1.4) : 0;
                let ink=0;
                for (const face of faces) ink=Math.max(ink,sampleFace(face,stream.x,y));
                const alpha=(.045+.18*pulse+ink*(.98+.12*pulse))*quiet;
                const index=Math.floor(hash(stream.seed+row*11+Math.floor(rainTime*1.3))*symbols.length);
                glyph(index,stream.x,y,alpha,ink>.3);
            }
        }
    }
    function drawIntroduction(face,still) {
        const progress=smooth(face.progress);
        const baseline=face.y+face.height/2+15;
        context.textAlign='center';
        context.textBaseline='middle';
        for (let line=0;line<2;line++) {
            const text=face.agent[line+1];
            const step=columnGap;
            context.font=`${line ? 500 : 600} ${codeFontSize}px ui-monospace, 'SFMono-Regular', Consolas, monospace`;
            for (let i=0;i<text.length;i++) {
                if (text[i]===' ') continue;
                const x=face.x+(i-(text.length-1)/2)*step;
                const settled=still ? 1 : smooth((face.age-.18-line*.14-i*.014)/.35);
                // Letters descend out of the same code vocabulary, settle long
                // enough to read, then release downward with their portrait.
                const dropping=(1-settled)*-18+(1-progress)*28;
                const flicker=line===1 && !still && settled===1 && face.target && hash(i+line*53+Math.floor(rainTime*7)+face.id*19)>.9975;
                const character=settled<.8 || flicker ? symbols[Math.floor(hash(i+face.id+Math.floor(rainTime*18))*symbols.length)] : text[i];
                const y=baseline+line*21+dropping;
                context.globalAlpha=progress*(line ? .72 : .95)*quietZone(x,y);
                context.fillText(character,x,y);
            }
        }
        context.textAlign='start';
    }
    function draw(now) {
        frame = 0;
        const delta = lastTime ? Math.min((now-lastTime)/1000,.05) : 1/30;
        lastTime = now;
        const still = paused || reduced.matches;
        if (!still) rainTime += delta;
        for (const face of faces) {
            if (!still) face.age+=delta;
            if (now>face.expires) face.target = 0;
            const ease = 1-Math.exp(-delta/(face.target ? .18 : .30));
            face.progress = still ? face.target : face.progress+(face.target-face.progress)*ease;
        }
        faces = faces.filter(face => face.target || face.progress>.008);
        if (still || now-lastDraw>=1000/30) {
            context.globalAlpha = 1; context.fillStyle = '#fff'; context.fillRect(0,0,width,height);
            context.fillStyle = '#171717';
            drawRain();
            for (const face of faces) drawIntroduction(face,still);
            context.globalAlpha = 1;
            canvas.dataset.faceState = !faces.length ? 'hidden' : faces.some(face=>face.target===1) ? 'revealing' : 'dissolving';
            canvas.dataset.agentName = faces.find(face=>face.target)?.agent[0] || '';
            lastDraw = now;
        }
        if (!still) requestDraw();
        else lastTime = 0;
    }
    function requestDraw() {
        if (!frame && visible && !document.hidden && width) frame = requestAnimationFrame(draw);
    }
    hero.addEventListener('pointermove', event => { if (event.pointerType!=='touch') interact(event); },{passive:true});
    hero.addEventListener('pointerdown', event => { if (event.pointerType==='touch') interact(event); },{passive:true});
    hero.addEventListener('pointerleave',event => { pointer=null; if(event.pointerType!=='touch') retire(); requestDraw(); });
    hero.addEventListener('pointercancel',() => { pointer=null; retire(); requestDraw(); });
    reduced.addEventListener('change',event => { paused=event.matches; lastTime=0; requestDraw(); });
    new ResizeObserver(resize).observe(hero);
    new IntersectionObserver(entries => {
        visible=entries[0].isIntersecting;
        cancelAnimationFrame(frame); frame=0; lastTime=0;
        if (visible) requestDraw();
        else { faces=[]; pointer=null; }
    }).observe(hero);
    document.addEventListener('visibilitychange',() => {
        cancelAnimationFrame(frame); frame=0; lastTime=0;
        if (!document.hidden) requestDraw();
    });
    faceImage.src='assets/agent-portraits.jpg';
    faceImage.decode().then(() => {
        const sampler=document.createElement('canvas'); sampler.width=columns; sampler.height=rows;
        const pixels=sampler.getContext('2d',{willReadFrequently:true});
        const tileWidth=faceImage.naturalWidth/4, tileHeight=faceImage.naturalHeight/3;
        for (let identity=0;identity<12;identity++) {
            pixels.clearRect(0,0,columns,rows);
            pixels.drawImage(faceImage,(identity%4)*tileWidth+3,Math.floor(identity/4)*tileHeight+3,
                tileWidth-6,tileHeight-6,0,0,columns,rows);
            const data=pixels.getImageData(0,0,columns,rows).data;
            const luminanceMap=new Float32Array(columns*rows);
            const features=[];
            for (let row=0;row<rows;row++) for (let col=0;col<columns;col++) {
                const i=(row*columns+col)*4;
                const value=(data[i]*.2126+data[i+1]*.7152+data[i+2]*.0722)/255;
                luminanceMap[row*columns+col]=value;
                if (col>columns*.25 && col<columns*.75 && row>rows*.28 && row<rows*.73) features.push(value);
            }
            // Normalize each identity independently: eyes and lips should read
            // equally well across different skin tones and lighting.
            features.sort((a,b)=>a-b);
            const dark=features[Math.floor(features.length*.10)];
            const light=features[Math.floor(features.length*.90)];
            const range=Math.max(.25,light-dark);
            const mask=new Float32Array(columns*rows);
            for (let row=0;row<rows;row++) for (let col=0;col<columns;col++) {
                // Local contrast preserves the actual eyelids, nostrils and lip
                // edges instead of turning the whole portrait uniformly dark.
                let nearby=0;
                for (const dy of [-4,0,4]) for (const dx of [-4,0,4]) {
                    const sx=Math.max(0,Math.min(columns-1,col+dx));
                    const sy=Math.max(0,Math.min(rows-1,row+dy));
                    nearby+=luminanceMap[sy*columns+sx]/9;
                }
                const original=luminanceMap[row*columns+col];
                const sharpened=original+(original-nearby)*1.8;
                const value=Math.max(0,Math.min(1,(light-sharpened)/range));
                const fade=1-smooth((row/rows-.82)/.18);
                mask[row*columns+col]=Math.pow(smooth((value-.025)/.95),.65)*fade;
            }
            portraits.push(mask);
        }
        if (pointer) spawn(pointer.x,pointer.y,performance.now());
        requestDraw();
    }).catch(() => { /* Code rain remains usable if the portrait map cannot load. */ });
    document.fonts?.ready.then(resize);
    resize();
})();
