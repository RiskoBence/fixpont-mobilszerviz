(function(){
  'use strict';
  var $=function(s,c){return (c||document).querySelector(s)};
  var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};

  // mobil menü
  var btn=$('.menu-btn'),nav=$('#nav');
  function setMenu(open){nav.classList.toggle('open',open);btn.setAttribute('aria-expanded',open);btn.setAttribute('aria-label',open?'Menü bezárása':'Menü megnyitása')}
  btn.addEventListener('click',function(){setMenu(!nav.classList.contains('open'))});
  $$('a',nav).forEach(function(a){a.addEventListener('click',function(){setMenu(false)})});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')setMenu(false)});

  // megjelenés görgetéskor
  $$('.section .sec-head, .card, .steps li, .kpi, .timeline li, .values li').forEach(function(el){el.classList.add('reveal')});
  var targets=$$('.reveal').concat($$('.bars'),$$('.hbars'));
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.05});
    targets.forEach(function(t){io.observe(t)});
  }else{targets.forEach(function(t){t.classList.add('in')})}

  // aktív menüpont
  var links=$$('a',nav).filter(function(a){return a.getAttribute('href').charAt(0)==='#'&&!a.classList.contains('cta')});
  if('IntersectionObserver' in window){
    var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(a){a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id)})}})},{rootMargin:'-45% 0px -50% 0px'});
    $$('main section[id]').forEach(function(s){so.observe(s)});
  }

  // árbecslő
  var sel=$('#est-sel');
  function est(){var o=sel.options[sel.selectedIndex];$('#est-price').textContent=o.dataset.p;$('#est-time').textContent=o.dataset.t;}
  sel.addEventListener('change',est);est();
  $('#est-cta').addEventListener('click',function(){var f=$('#f-service');if(f)f.value=sel.value});

  // nyitvatartás (budapesti idő)
  function budapest(){
    var p=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Budapest',weekday:'short',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(new Date());
    var o={};p.forEach(function(x){o[x.type]=x.value});
    var days={Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6};
    return {d:days[o.weekday],m:(+o.hour%24)*60+(+o.minute)};
  }
  try{
    var n=budapest(),open=false,txt;
    var h={1:[540,1080],2:[540,1080],3:[540,1080],4:[540,1080],5:[540,1080],6:[540,780]}[n.d];
    if(h&&n.m>=h[0]&&n.m<h[1]){open=true;txt='Most nyitva · zárás '+Math.floor(h[1]/60)+':00-kor'}else{txt='Most zárva · nyitás: hétfő–péntek 9:00, szombat 9:00'}
    $('#open-state').textContent=txt;
    $('.eyebrow .dot').classList.toggle('open',open);
    $$('.hours tr').forEach(function(r){if(r.dataset.d.split(',').indexOf(String(n.d))>-1)r.classList.add('today')});
  }catch(e){}

  // árajánlatkérő űrlap -> mailto
  var form=$('#quote-form');
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var ok=true;
    $$('.field',form).forEach(function(f){
      var i=$('input[required]',f);if(!i)return;
      var bad=!i.value.trim();f.classList.toggle('invalid',bad);
      var er=$('.err',f);if(er)er.remove();
      if(bad){ok=false;var s=document.createElement('div');s.className='err';s.textContent='Kérjük, töltsd ki ezt a mezőt.';f.appendChild(s)}
    });
    if(!ok){var first=$('.field.invalid input',form);if(first)first.focus();return}
    var v=function(id){return $(id).value.trim()};
    var body='Név: '+v('#f-name')+'\nElérhetőség: '+v('#f-contact')+'\nKészülék: '+v('#f-device')+'\nHiba: '+v('#f-service')+'\n\n'+v('#f-msg');
    location.href='mailto:info@fixpont.example?subject='+encodeURIComponent('Árajánlatkérés – '+v('#f-device'))+'&body='+encodeURIComponent(body);
    $('#form-note').textContent='Megnyitottuk az e-mail programodat. Ha nem nyílt meg, írj a info@fixpont.example címre.';
  });
})();
