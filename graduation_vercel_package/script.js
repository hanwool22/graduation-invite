(function(){
  var envelopeWrap = document.getElementById('envelopeWrap');
  var envelope = document.getElementById('envelope');
  var seal = document.getElementById('seal');
  var openHint = document.getElementById('openHint');
  var logoSmall = document.getElementById('logoSmall');
  var mainContent = document.getElementById('mainContent');
  var panels = document.querySelectorAll('.panel');
  var petals = document.getElementById('petals');

  var qname = document.getElementById('qname');
  var qphoto = document.getElementById('qphoto');
  var guestPreview = document.getElementById('guestPreview');
  var inviteText = document.getElementById('inviteText');
  var bgAudio = document.getElementById('bgAudio');
  var createLink = document.getElementById('createLink');
  var previewGuest = document.getElementById('previewGuest');

  function escapeHtml(s){ return String(s || '').replace(/[&<>"']/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c]; }); }

  function buildInviteContent(name, photoData){
    var safe = escapeHtml(name || 'Anh');
    var html = '';
    if(photoData){
      html += '<div style="width:100%;height:260px;border-radius:12px;background-image:url(' + photoData + ');background-size:cover;background-position:center"></div>';
    }
    html += '<p style="margin-top:14px">Anh <strong>' + safe + '</strong> thân mến,</p>';
    html += '<p>Vào sáng <span class="highlight">thứ Sáu, ngày 31/10/2025</span>, em sẽ chính thức tốt nghiệp Cử nhân Xét nghiệm Y học tại <span class="highlight">Trường Đại học Y tế Công cộng</span>.</p>';
    html += '<p>Sau buổi lễ, lúc <span class="highlight">11h-12h</span>, em sẽ đợi anh ở vườn trước cửa Nhà C hoặc ở sân bóng gần đó.</p>';
    html += '<p>Có anh ở đó sẽ vui hơn nhiều 🤍</p>';
    inviteText.innerHTML = html;
  }

  // url params
  function getParams(){
    var p = {};
    var s = location.search.replace(/^\?/, '');
    if(!s) return p;
    s.split('&').forEach(function(pair){
      var kv = pair.split('=');
      p[decodeURIComponent(kv[0])] = kv[1] ? decodeURIComponent(kv[1]) : '';
    });
    return p;
  }
  var params = getParams();
  if(params.name){ qname.value = params.name; }
  if(params.img){ guestPreview.style.backgroundImage = 'url(' + params.img + ')'; buildInviteContent(params.name || 'Anh', params.img); }
  else { buildInviteContent(qname.value, ''); }

  // envelope open
  var opened = false;
  envelopeWrap.addEventListener('click', function(){
    if(opened) return;
    opened = true;
    envelope.style.transform = 'translateY(-10px) rotateX(12deg) scale(.98)';
    seal.style.opacity = '0';
    openHint.style.opacity = '0';
    logoSmall.style.display = 'block';
    setTimeout(function(){
      mainContent.classList.remove('hidden');
      panels.forEach(function(p, i){ setTimeout(function(){ p.classList.add('visible'); }, 400 + i*450); });
      try{ bgAudio.play(); }catch(e){ console.log('audio play blocked', e); }
    }, 700);
  });

  qphoto.addEventListener('change', function(ev){ var f = ev.target.files[0]; if(!f) return; var r = new FileReader(); r.onload = function(){ guestPreview.style.backgroundImage = 'url(' + r.result + ')'; buildInviteContent(qname.value, r.result); }; r.readAsDataURL(f); });
  qname.addEventListener('input', function(){ buildInviteContent(qname.value, (guestPreview.style.backgroundImage||'').replace(/^url\(("|')?/, '').replace(/("|')?\)$/, '')); });

  createLink.addEventListener('click', function(){
    var name = qname.value || 'Anh';
    var photo = (guestPreview.style.backgroundImage || '').replace(/^url\(("|')?/, '').replace(/("|')?\)$/, '');
    var recip = '<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Thiệp mời - ' + escapeHtml(name) + '</title><style>body{font-family:Inter,Arial;background:#fff6ee;margin:0;padding:20px;color:#111}main{max-width:780px;margin:0 auto;background:#fff;border-radius:12px;padding:18px;box-shadow:0 8px 24px rgba(0,0,0,.06)}h1{color:#0b6b4a}mark{background:linear-gradient(90deg,#fff7a6,#ffdca6);padding:2px 6px;border-radius:6px}</style></head><body><main><h1>Thiệp mời</h1>';
    if(photo) recip += '<div style="width:100%;height:240px;border-radius:12px;background-image:url(' + photo + ');background-size:cover;background-position:center"></div>';
    recip += '<p>Anh <strong>' + escapeHtml(name) + '</strong> thân mến,</p><p>Vào sáng <mark>thứ Sáu, ngày 31/10/2025</mark>, em sẽ chính thức tốt nghiệp Cử nhân Xét nghiệm Y học tại <mark>Trường Đại học Y tế Công cộng</mark>.</p><p>Sau buổi lễ, lúc <mark>11h-12h</mark>, em sẽ đợi anh ở vườn trước cửa Nhà C hoặc ở sân bóng gần đó.</p><p>Có anh ở đó sẽ vui hơn nhiều 🤍</p><audio controls autoplay loop src="/assets/walking_home.mp3" style="width:100%"></audio></main></body></html>';
    try{ var b = btoa(unescape(encodeURIComponent(recip))); var dataUrl = 'data:text/html;base64,' + b; navigator.clipboard.writeText(dataUrl).then(function(){ alert('Đã tạo và sao chép data-URL.'); }, function(){ alert('Không thể sao chép data-URL tự động.'); }); }
    catch(e){ navigator.clipboard.writeText(recip); alert('Đã sao chép HTML thay thế.'); }
  });

  previewGuest.addEventListener('click', function(){ var name = qname.value || 'Anh'; var photo = (guestPreview.style.backgroundImage || '').replace(/^url\(("|')?/, '').replace(/("|')?\)$/, ''); var recip = '<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Thiệp mời - ' + escapeHtml(name) + '</title><style>body{font-family:Inter,Arial;background:#fff6ee;margin:0;padding:20px;color:#111}main{max-width:780px;margin:0 auto;background:#fff;border-radius:12px;padding:18px;box-shadow:0 8px 24px rgba(0,0,0,.06)}h1{color:#0b6b4a}mark{background:linear-gradient(90deg,#fff7a6,#ffdca6);padding:2px 6px;border-radius:6}</style></head><body><main><h1>Thiệp mời</h1>'; if(photo) recip += '<div style="width:100%;height:240px;border-radius:12px;background-image:url(' + photo + ');background-size:cover;background-position:center"></div>'; recip += '<p>Anh <strong>' + escapeHtml(name) + '</strong> thân mến,</p><p>Vào sáng <mark>thứ Sáu, ngày 31/10/2025</mark>, em sẽ chính thức tốt nghiệp Cử nhân Xét nghiệm Y học tại <mark>Trường Đại học Y tế Công cộng</mark>.</p><p>Sau buổi lễ, lúc <mark>11h-12h</mark>, em sẽ đợi anh ở vườn trước cửa Nhà C hoặc ở sân bóng gần đó.</p><p>Có anh ở đó sẽ vui hơn nhiều 🤍</p><audio controls autoplay loop src="/assets/walking_home.mp3" style="width:100%"></audio></main></body></html>'; var w = window.open(); w.document.open(); w.document.write(recip); w.document.close(); });

  var obs = new IntersectionObserver(function(entries){ entries.forEach(function(e){ if(e.isIntersecting) e.target.classList.add('visible'); else e.target.classList.remove('visible'); }); }, {threshold:0.12});
  panels.forEach(function(p){ obs.observe(p); });

  function makePetal(){ var el = document.createElement('div'); el.className = 'petal'; var size = 10 + Math.random()*28; el.style.width = size + 'px'; el.style.height = (size*0.7) + 'px'; el.style.left = Math.random()*100 + '%'; el.style.top = '-8%'; el.style.background = 'linear-gradient(120deg, #ffd6e6 0%, #ffcce0 60%)'; el.style.borderRadius = (20 + Math.random()*50) + '%'; petals.appendChild(el); var duration = 7000 + Math.random()*9000; el.animate([{transform:'translateY(0) rotate(0deg)', opacity:1}, {transform:'translateY(' + (window.innerHeight+200) + 'px) rotate(' + (180 + Math.random()*720) + 'deg)', opacity:0.15}], {duration: duration, easing: 'linear'}); setTimeout(function(){ el.remove(); }, duration+50); } setInterval(makePetal, 500);

})();
