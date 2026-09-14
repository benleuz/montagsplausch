(function(){
  var q=document.getElementById('q'), grid=document.getElementById('grid'), cnt=document.getElementById('count'),
      cats=document.querySelectorAll('.cats button'), dice=document.getElementById('dice'), empty=document.getElementById('empty');
  var cards=Array.prototype.slice.call(grid.querySelectorAll('.card')), byId={};
  cards.forEach(function(c){byId[c.dataset.id]=c;});
  var idx=window.MP_INDEX||{}, cat='', veg=false;
  function norm(s){return (s||'').toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/é|è|ê/g,'e');}
  function run(){
    var terms=norm(q.value.trim()).split(/\s+/).filter(Boolean), n=0;
    cards.forEach(function(c){
      var ok=true;
      if(cat && (' '+c.dataset.c+' ').indexOf(' '+cat+' ')<0) ok=false;
      if(ok && veg && c.dataset.v!=='1') ok=false;
      if(ok && terms.length){var h=norm(c.dataset.t)+' '+norm(idx[c.dataset.id]||'');ok=terms.every(function(t){return h.indexOf(t)>=0;});}
      c.classList.toggle('hide',!ok); if(ok)n++;
    });
    cnt.innerHTML=(terms.length||cat||veg)?n+' von '+cards.length+' Rezepten <a href="#" id="reset">alle zeigen</a>':cards.length+' Rezepte';
    empty.style.display=n?'none':'';
    var r=document.getElementById('reset'); if(r)r.addEventListener('click',function(e){e.preventDefault();q.value='';cat='';veg=false;cats.forEach(function(b){b.setAttribute('aria-pressed',b.dataset.c===''?'true':'false');});run();});
    var u=new URL(location.href); if(cat)u.searchParams.set('k',cat);else u.searchParams.delete('k');
    if(veg)u.searchParams.set('vegi','1');else u.searchParams.delete('vegi');
    if(q.value.trim())u.searchParams.set('q',q.value.trim());else u.searchParams.delete('q');
    history.replaceState(null,'',u.pathname+(u.search||''));
  }
  cats.forEach(function(b){b.addEventListener('click',function(){
    if(b.classList.contains('veg')){veg=!veg;b.setAttribute('aria-pressed',veg?'true':'false');}
    else{cat=b.dataset.c;cats.forEach(function(x){if(!x.classList.contains('veg'))x.setAttribute('aria-pressed',x===b?'true':'false');});}
    run();
  });});
  q.addEventListener('input',run);
  dice.addEventListener('click',function(){var vis=cards.filter(function(c){return !c.classList.contains('hide');});if(vis.length)location.href=vis[Math.floor(Math.random()*vis.length)].getAttribute('href');});
  var u=new URL(location.href);
  if(u.searchParams.get('q'))q.value=u.searchParams.get('q');
  if(u.searchParams.get('k')){cat=u.searchParams.get('k');cats.forEach(function(x){if(!x.classList.contains('veg'))x.setAttribute('aria-pressed',x.dataset.c===cat?'true':'false');});}
  if(u.searchParams.get('vegi')){veg=true;document.querySelector('.cats .veg').setAttribute('aria-pressed','true');}
  run();
})();