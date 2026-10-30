// Invite-only games on smaisle.app. Family&Friends opens invite.html; each game has its own codes,
// kept in Firestore (invite_codes/{CODE} -> {game}) and made on the stats page.
// This only hides links: anyone with a game's URL can still play it.
var Invite=(function(){
  var FAMILY=['FAMILY&FRIENDS','FAMILYANDFRIENDS','FAMILY+FRIENDS'], KEY='d15_unlocked', GKEY='smaisle_games';
  var DOC='https://firestore.googleapis.com/v1/projects/aislerun-88e79/databases/(default)/documents/invite_codes/';
  var API='AIzaSyAlbSCTpAiK-1tojkyWrY3QuJsSzILHSfs';
  var URLS={daily15:'https://smaisle.github.io/DailyGrid/today.html',shuffleblast:'https://smaisle.github.io/ShuffleBlast/',abcdeal:'https://smaisle.github.io/abcdeal/'};
  function get(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
  function set(k,v){ try{ localStorage.setItem(k,v); }catch(e){} }
  function owned(){ try{ return JSON.parse(get(GKEY)||'[]'); }catch(e){ return []; } }
  return {
    owned:owned,
    family:function(){ return get(KEY)==='1'; },
    // Resolves to 'family', a game key, or null.
    check:function(raw){
      var code=String(raw||'').replace(/\s+/g,'').toUpperCase();
      if(FAMILY.indexOf(code)>=0){ set(KEY,'1'); return Promise.resolve('family'); }
      if(!/^[A-Z0-9]{3,20}$/.test(code)) return Promise.resolve(null);
      return fetch(DOC+code+'?key='+API).then(function(r){ return r.ok?r.json():null; })
        .then(function(d){ var g=d&&d.fields&&d.fields.game?d.fields.game.stringValue:null; return URLS[g]?g:null; })
        .catch(function(){ return null; });
    },
    // Remembers the game on this device and opens it.
    go:function(g){
      var list=owned(); if(list.indexOf(g)<0){ list.push(g); set(GKEY,JSON.stringify(list)); }
      location.href=URLS[g];
    },
    show:function(card){
      var a=card.querySelector('.play'); a.href=a.getAttribute('data-href'); a.hidden=false;
      card.querySelector('.gunlock').hidden=true; card.querySelector('.gbad').hidden=true;
    }
  };
})();
