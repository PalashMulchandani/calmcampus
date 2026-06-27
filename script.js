// ── STATE ──────────────────────────────────────────────────────────
let user={name:'',uni:'',initials:'?'};
let xp=0,streak=1,moodLog=[],sleepLog=[],exams=[],subjects=[],habitDone={},selectedMood=null,pomoCycles=0;
let breathRunning=false,breathTmr=null,breathElapsed=0,breathPhaseIdx=0,breathMode='box';
let pomoRunning=false,pomoTmr=null,pomoSecs=25*60,pomoBreak=false,pomoTotal=25*60;
const breathModes={
  box:{phases:['Inhale','Hold','Exhale','Hold'],times:[4,4,4,4]},
  '478':{phases:['Inhale','Hold','Exhale'],times:[4,7,8]},
  deep:{phases:['Inhale','Exhale'],times:[5,5]},
  calm:{phases:['Inhale','Hold','Exhale'],times:[6,2,7]}
};
const habits=[{id:'water',icon:'💧',label:'8 Glasses Water'},{id:'exercise',icon:'🏃',label:'Exercise 30 min'},{id:'meditate',icon:'🧘',label:'Meditate'},{id:'nophone',icon:'📵',label:'Phone-free Hour'},{id:'journal',icon:'📓',label:'Journal'},{id:'sleep',icon:'💤',label:'Sleep 8 hrs'},{id:'gratitude',icon:'🙏',label:'Gratitude'},{id:'read',icon:'📖',label:'Read 15 min'}];
const badgesDef=[
  {id:'first_login',icon:'🌱',name:'First Step',desc:'Logged in',unlocked:true,gold:false},
  {id:'streak3',icon:'🔥',name:'3-Day Streak',desc:'3 days in a row',unlocked:false,gold:false},
  {id:'streak7',icon:'💫',name:'Week Warrior',desc:'7-day streak',unlocked:false,gold:true},
  {id:'mood5',icon:'😊',name:'Mood Master',desc:'Log mood 5 times',unlocked:false,gold:false},
  {id:'breather',icon:'🫁',name:'Deep Breather',desc:'Complete a breathing session',unlocked:false,gold:false},
  {id:'planner',icon:'🤖',name:'AI Planner',desc:'Generate a study plan',unlocked:false,gold:false},
  {id:'counselled',icon:'💬',name:'Open Up',desc:'Chat with CalmBot',unlocked:false,gold:false},
  {id:'sleep5',icon:'💤',name:'Sleep Tracker',desc:'Log sleep 5 times',unlocked:false,gold:false},
  {id:'pomo3',icon:'🍅',name:'Pomodoro Pro',desc:'Complete 3 sessions',unlocked:false,gold:true},
  {id:'xp100',icon:'⭐',name:'XP Hunter',desc:'Earn 100 XP',unlocked:false,gold:false},
  {id:'habitall',icon:'🏅',name:'Habit Champion',desc:'Complete all habits in a day',unlocked:false,gold:true}
];
let unlockedBadges=['first_login'];
const levelTitles=['Beginner Breather','Calm Seeker','Mindful Student','Zen Scholar','Wellness Guru','Campus Sage','Stress Master'];

// ── CURSOR ────────────────────────────────────────────────────────
const dot=document.getElementById('cur-dot');
const ring=document.getElementById('cur-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{
  mx=e.clientX;my=e.clientY;
  dot.style.left=mx+'px';dot.style.top=my+'px';
  // Trail
  const t=document.createElement('div');t.className='cur-trail';
  t.style.left=mx+'px';t.style.top=my+'px';
  const s=Math.random()*5+2;t.style.width=s+'px';t.style.height=s+'px';
  document.body.appendChild(t);setTimeout(()=>t.remove(),600);
});
(function animRing(){rx+=(mx-rx)*.1;ry+=(my-ry)*.1;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(animRing)})();
document.addEventListener('mousedown',()=>{dot.style.width='12px';dot.style.height='12px';ring.style.width='20px';ring.style.height='20px';ring.style.borderColor='rgba(0,201,177,.9)'});
document.addEventListener('mouseup',()=>{dot.style.width='8px';dot.style.height='8px';ring.style.width='34px';ring.style.height='34px';ring.style.borderColor='rgba(0,201,177,.45)'});
document.querySelectorAll('button,a,.dash-card,.habit-card,.feat-card,.scard,.auth-card').forEach(el=>{
  el.addEventListener('mouseenter',()=>{ring.style.width='50px';ring.style.height='50px';ring.style.borderColor='rgba(0,201,177,.9)'});
  el.addEventListener('mouseleave',()=>{ring.style.width='34px';ring.style.height='34px';ring.style.borderColor='rgba(0,201,177,.45)'});
});
if('ontouchstart' in window){dot.style.display='none';ring.style.display='none'}

// ── PARTICLES ─────────────────────────────────────────────────────
(()=>{const w=document.getElementById('particles');for(let i=0;i<20;i++){const p=document.createElement('div');p.className='pt';const s=Math.random()*8+3;p.style.cssText=`width:${s}px;height:${s}px;left:${Math.random()*100}%;animation-duration:${Math.random()*18+12}s;animation-delay:${Math.random()*15}s`;w.appendChild(p)}})();

// ── QUOTE CAROUSEL ────────────────────────────────────────────────
let qIdx=0;
const qslides=document.querySelectorAll('.qslide');
const qnav=document.getElementById('quoteNav');
qslides.forEach((_,i)=>{const b=document.createElement('button');b.className='qnav'+(i===0?' active':'');b.onclick=()=>goQ(i);qnav.appendChild(b)});
function goQ(n){qslides[qIdx].classList.remove('active');qnav.children[qIdx].classList.remove('active');qIdx=n;qslides[qIdx].classList.add('active');qnav.children[qIdx].classList.add('active')}
setInterval(()=>goQ((qIdx+1)%qslides.length),4500);

// ── SCROLL HELPERS ────────────────────────────────────────────────
function scrollToAuth(){document.getElementById('authSection').scrollIntoView({behavior:'smooth'})}
function scrollToAbout(){document.getElementById('aboutSection').scrollIntoView({behavior:'smooth'})}
function scrollToDemo(){document.getElementById('demoSection').scrollIntoView({behavior:'smooth'})}
function scrollToFeats(){document.getElementById('featSection').scrollIntoView({behavior:'smooth'})}

// ── AUTH ──────────────────────────────────────────────────────────
function switchAuth(t){
  document.getElementById('auth-login').style.display=t==='login'?'block':'none';
  document.getElementById('auth-signup').style.display=t==='signup'?'block':'none';
  document.querySelectorAll('.auth-tab').forEach((b,i)=>b.classList.toggle('active',(t==='login'&&i===0)||(t==='signup'&&i===1)));
}
function doLogin(){const n=document.getElementById('li-nick').value.trim()||'Anonymous';user={name:n,uni:'',initials:n[0].toUpperCase()};enterApp()}
function doSignup(){const n=document.getElementById('su-nick').value.trim()||'Anonymous';const uni=document.getElementById('su-uni').value.trim();user={name:n,uni,initials:n[0].toUpperCase()};enterApp()}
function enterApp(){
  document.getElementById('page-auth').style.display='none';
  document.getElementById('landNav').style.display='none';
  document.getElementById('mainNav').style.display='flex';
  document.getElementById('navAvatar').textContent=user.initials;
  document.getElementById('profAvatar').textContent=user.initials;
  document.getElementById('profName').textContent=user.name;
  document.getElementById('profUni').textContent=user.uni||'Anonymous User · No data stored';
  showPage('dashboard');addXP(10,'Welcome to CalmCampus! 🌊');
  renderHabits();renderBadges();renderExams();renderSounds();updateDash();
}
function doLogout(){if(confirm('Sign out?'))location.reload()}

// ── PAGES ─────────────────────────────────────────────────────────
function showPage(id){
  document.querySelectorAll('.page:not(#page-auth)').forEach(p=>{p.style.display='none';p.classList.remove('active')});
  const el=document.getElementById('page-'+id);
  el.style.display='block';requestAnimationFrame(()=>el.classList.add('active'));
  document.querySelectorAll('#mainNav .nav-btn').forEach(b=>b.classList.toggle('active',b.getAttribute('onclick')?.includes("'"+id+"'")));
  if(id==='dashboard')updateDash();
  if(id==='badges')renderBadges();
}
function toggleTheme(){const d=!document.body.classList.contains('light');document.body.classList.toggle('light',!d);document.querySelector('#mainNav .theme-btn').textContent=d?'🌙':'☀️'}
function toggleMobile(){document.getElementById('mobileMenu').classList.toggle('open')}
function closeMobile(){document.getElementById('mobileMenu').classList.remove('open')}

// ── XP ────────────────────────────────────────────────────────────
function addXP(n,msg){
  xp+=n;const pct=((xp%100)/100*100);
  ['xpBar','xpBar2'].forEach(id=>{const el=document.getElementById(id);if(el)el.style.width=pct+'%'});
  if(document.getElementById('xpLabel'))document.getElementById('xpLabel').textContent=xp+' XP';
  if(document.getElementById('xpStat'))document.getElementById('xpStat').textContent=xp;
  const lvl=Math.floor(xp/100)+1;
  if(document.getElementById('levelNum'))document.getElementById('levelNum').textContent=lvl;
  if(document.getElementById('levelTitle'))document.getElementById('levelTitle').textContent=levelTitles[Math.min(lvl-1,levelTitles.length-1)];
  if(document.getElementById('levelXP'))document.getElementById('levelXP').textContent=xp+' / '+(Math.ceil((xp+1)/100)*100)+' XP';
  if(document.getElementById('xpNext'))document.getElementById('xpNext').textContent=(Math.ceil((xp+1)/100)*100-xp)+' XP to Level '+(lvl+1);
  if(msg)showToast('⭐ +'+n+' XP — '+msg);
  if(xp>=100)unlockBadge('xp100');
}

// ── DASHBOARD ─────────────────────────────────────────────────────
function updateDash(){
  const $=id=>document.getElementById(id);
  if($('dashName'))$('dashName').textContent=user.name;
  if($('streakStat'))$('streakStat').textContent=streak;
  if($('badgeStat'))$('badgeStat').textContent=unlockedBadges.length;
  if($('moodStat'))$('moodStat').textContent=moodLog[0]?.emoji||'—';
  if($('sleepStat'))$('sleepStat').textContent=sleepLog[0]?sleepLog[0].hrs+'h':'—';
  const h=new Date().getHours();
  if($('dashGreet'))$('dashGreet').textContent=h<12?'Good morning! Start with a breathing session 🌅':h<17?'Good afternoon! Stay hydrated and take breaks ☀️':'Good evening! Wind down and rest well 🌙';
  const br=$('dashBadgeRow');
  if(br)br.innerHTML=unlockedBadges.slice(-4).map(id=>{const b=badgesDef.find(x=>x.id===id);return b?`<span class="badge-pill ${b.gold?'gold':''}">${b.icon} ${b.name}</span>`:''}).join('');
}

// ── BREATHE ───────────────────────────────────────────────────────
function setBType(m,el){breathMode=m;resetBreath();document.querySelectorAll('.btype').forEach(b=>b.classList.remove('active'));el.classList.add('active')}
function toggleBreath(){breathRunning=!breathRunning;document.getElementById('breathBtn').textContent=breathRunning?'⏸ Pause':'▶ Start';if(breathRunning)runBreathPhase();else clearTimeout(breathTmr)}
function runBreathPhase(){
  if(!breathRunning)return;
  const m=breathModes[breathMode],phase=m.phases[breathPhaseIdx],dur=m.times[breathPhaseIdx];
  document.getElementById('breathWord').textContent=phase;
  const i={Inhale:'Breathe in slowly through your nose…',Hold:'Hold gently…',Exhale:'Breathe out slowly through your mouth…'};
  document.getElementById('breathInstr').textContent=i[phase]||'';
  const ring2=document.getElementById('breathRing');
  ring2.style.transform=phase==='Inhale'?'scale(1.3)':phase==='Exhale'?'scale(0.85)':'scale(1.1)';
  ring2.style.boxShadow=phase==='Inhale'?'0 0 60px rgba(0,201,177,.3)':'0 0 20px rgba(0,201,177,.08)';
  let t=dur;document.getElementById('breathSec').textContent=t+'s';
  const tick=()=>{if(!breathRunning)return;t--;breathElapsed++;document.getElementById('breathElapsed').textContent=Math.floor(breathElapsed/60)+':'+String(breathElapsed%60).padStart(2,'0');document.getElementById('breathSec').textContent=t>0?t+'s':'';if(t<=0){breathPhaseIdx=(breathPhaseIdx+1)%m.phases.length;runBreathPhase()}else breathTmr=setTimeout(tick,1000)};
  breathTmr=setTimeout(tick,1000);
  if(breathElapsed>=30&&!unlockedBadges.includes('breather')){unlockBadge('breather');addXP(15,'Breathing badge 🫁')}
}
function resetBreath(){breathRunning=false;clearTimeout(breathTmr);breathPhaseIdx=0;breathElapsed=0;document.getElementById('breathBtn').textContent='▶ Start';document.getElementById('breathWord').textContent='Ready';document.getElementById('breathSec').textContent='';document.getElementById('breathInstr').textContent='Choose a technique and press Start';document.getElementById('breathElapsed').textContent='0:00';document.getElementById('breathRing').style.cssText=''}

// ── MOOD ──────────────────────────────────────────────────────────
function selMood(e,n,el){selectedMood={emoji:e,name:n};document.querySelectorAll('.mood-pill').forEach(b=>b.classList.remove('sel'));el.classList.add('sel')}
function saveMood(){if(!selectedMood){showToast('⚠️ Select a mood first');return}moodLog.unshift({...selectedMood,note:document.getElementById('moodNote').value,date:new Date().toLocaleDateString('en-IN',{weekday:'short',month:'short',day:'numeric'})});document.getElementById('moodNote').value='';selectedMood=null;document.querySelectorAll('.mood-pill').forEach(b=>b.classList.remove('sel'));renderMoodHistory();addXP(10,'Mood logged 😊');if(moodLog.length>=5)unlockBadge('mood5');updateDash()}
function renderMoodHistory(){const h=document.getElementById('moodHistory');if(!moodLog.length){h.innerHTML='';return}h.innerHTML='<h3 style="font-size:.86rem;font-weight:700;margin-bottom:.6rem;color:var(--p)">Recent Entries</h3>'+moodLog.slice(0,7).map(e=>`<div class="card2" style="margin-bottom:.5rem;display:flex;gap:.75rem;align-items:flex-start"><div style="font-size:1.35rem">${e.emoji}</div><div><div style="font-size:.73rem;color:var(--muted)">${e.date} · ${e.name}</div>${e.note?`<div style="font-size:.83rem;margin-top:.2rem">${e.note}</div>`:''}</div></div>`).join('')}

// ── POMODORO ──────────────────────────────────────────────────────
function togglePomo(){pomoRunning=!pomoRunning;document.getElementById('pomoBtn').textContent=pomoRunning?'⏸ Pause':'▶ Start';if(pomoRunning){pomoTmr=setInterval(()=>{if(pomoSecs<=0){clearInterval(pomoTmr);pomoRunning=false;document.getElementById('pomoBtn').textContent='▶ Start';if(!pomoBreak){pomoCycles++;document.getElementById('pomoCycles').textContent='Sessions today: '+pomoCycles;addXP(20,'Pomodoro done 🍅');if(pomoCycles>=3)unlockBadge('pomo3')}showToast(pomoBreak?'☕ Break over!':'🍅 Session done! Take a break');return}pomoSecs--;updatePomo()},1000)}else clearInterval(pomoTmr)}
function updatePomo(){const m=Math.floor(pomoSecs/60),s=pomoSecs%60;document.getElementById('pomoTimeText').textContent=String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');const c=document.getElementById('pomoCircle');if(c)c.style.strokeDashoffset=396*(1-(pomoTotal-pomoSecs)/pomoTotal)}
function resetPomo(){clearInterval(pomoTmr);pomoRunning=false;pomoSecs=pomoBreak?5*60:25*60;pomoTotal=pomoSecs;updatePomo();document.getElementById('pomoBtn').textContent='▶ Start'}
function switchPomo(){pomoBreak=!pomoBreak;document.getElementById('pomoModeLabel').textContent=pomoBreak?'Break Mode · 5 min':'Focus Session · 25 min';document.getElementById('pomoModeSmall').textContent=pomoBreak?'Break':'Focus';resetPomo()}

// ── AI PLANNER ────────────────────────────────────────────────────
function addSubject(){const inp=document.getElementById('subjectInput'),v=inp.value.trim();if(!v)return;subjects.push(v);inp.value='';renderChips()}
function renderChips(){document.getElementById('subjectChips').innerHTML=subjects.map((s,i)=>`<span class="chip">${s}<button onclick="subjects.splice(${i},1);renderChips()">×</button></span>`).join('')}
async function generatePlan(){
  if(!subjects.length){showToast('⚠️ Add at least one subject');return}
  const out=document.getElementById('planOutput'),days=document.getElementById('planDays');
  out.style.display='block';days.innerHTML='<div style="text-align:center;padding:2rem;color:var(--muted)">🤖 Building your plan…</div>';
  try{
    const res=await fetch('/api/chat',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        max_tokens:1000,
        system:'You are a study planner. Return ONLY valid JSON, no markdown, no extra text. Format: {"days":[{"day":"Monday","tasks":[{"subject":"Math","task":"Solve 10 derivatives","duration":"45 min"}]}]}',
        messages:[{role:'user',content:`Create a 5-day study plan for: ${subjects.join(', ')}. Available: ${document.getElementById('hoursSlider').value} hours/day. Return JSON only.`}]
      })
    });
    const d=await res.json();
    if(d.error)throw new Error(d.error.message);
    const plan=JSON.parse(d.content[0].text.replace(/```json|```/g,'').trim());
    days.innerHTML=plan.days.map(day=>`<div class="plan-day"><h4>📅 ${day.day}</h4>${day.tasks.map((t,i)=>`<div class="plan-task" id="pt-${day.day}-${i}"><input type="checkbox" onchange="this.closest('.plan-task').classList.toggle('done-task',this.checked);if(this.checked)addXP(5,'Task done ✅')"><label>${t.subject} — ${t.task} <span style="color:var(--muted);font-size:.76rem">(${t.duration})</span></label></div>`).join('')}</div>`).join('');
    unlockBadge('planner');addXP(25,'AI plan generated 🤖');
  }catch(e){days.innerHTML=`<p style="color:var(--muted);font-size:.85rem">⚠️ AI error: ${e.message}. Make sure ANTHROPIC_API_KEY is set on the server.</p>`}
}

// ── HABITS ────────────────────────────────────────────────────────
function renderHabits(){document.getElementById('habitGrid').innerHTML=habits.map(h=>`<div class="habit-card ${habitDone[h.id]?'done':''}" onclick="toggleHabit('${h.id}')"><div class="h-icon">${h.icon}</div><h4>${h.label}</h4><div class="h-streak">${habitDone[h.id]?'✅ Done today':'Tap to complete'}</div></div>`).join('')}
function toggleHabit(id){habitDone[id]=!habitDone[id];if(habitDone[id])addXP(8,'Habit: '+habits.find(h=>h.id===id).label);renderHabits();if(Object.values(habitDone).filter(Boolean).length>=8)unlockBadge('habitall')}

// ── SLEEP ─────────────────────────────────────────────────────────
function selSleep(q,el){document.querySelectorAll('.sq').forEach(b=>b.classList.remove('sel'));el.classList.add('sel')}
function saveSleep(){const hrs=parseFloat(document.getElementById('sleepHrs').value);if(!hrs){showToast('⚠️ Enter hours slept');return}const q=document.querySelector('.sq.sel')?.textContent||'—';sleepLog.unshift({hrs,quality:q,date:new Date().toLocaleDateString('en-IN',{weekday:'short',month:'short',day:'numeric'})});document.getElementById('sleepHrs').value='';document.querySelectorAll('.sq').forEach(b=>b.classList.remove('sel'));renderSleepHistory();addXP(10,'Sleep logged 💤');if(sleepLog.length>=5)unlockBadge('sleep5');updateDash()}
function renderSleepHistory(){const h=document.getElementById('sleepHistory');if(!sleepLog.length){h.innerHTML='';return}h.innerHTML='<h3 style="font-size:.86rem;font-weight:700;margin-bottom:.6rem;color:var(--p)">Sleep Log</h3>'+sleepLog.slice(0,7).map(e=>`<div class="sleep-bar-row"><div class="day" style="font-size:.73rem;color:var(--muted);min-width:28px">${e.date.split(',')[0]}</div><div class="sleep-bar" style="width:${Math.min(e.hrs/10*100,100)*3}px"></div><span style="font-size:.73rem;color:var(--muted);margin-left:.5rem">${e.hrs}h · ${e.quality}</span></div>`).join('')}

// ── SOUNDS ────────────────────────────────────────────────────────
const soundDefs=[{id:'rain',icon:'🌧️',label:'Rain'},{id:'forest',icon:'🌲',label:'Forest'},{id:'waves',icon:'🌊',label:'Waves'},{id:'white',icon:'⬜',label:'White Noise'},{id:'fire',icon:'🔥',label:'Fireplace'},{id:'birds',icon:'🐦',label:'Birds'},{id:'cafe',icon:'☕',label:'Café'},{id:'wind',icon:'🍃',label:'Wind'}];
const AC=new(window.AudioContext||window.webkitAudioContext)();
const soundNodes={};const soundVols={};soundDefs.forEach(s=>soundVols[s.id]=.5);
function renderSounds(){document.getElementById('soundGrid').innerHTML=soundDefs.map(s=>`<div class="scard" id="sc-${s.id}" onclick="toggleSound('${s.id}')"><div style="font-size:1.8rem;margin-bottom:.3rem">${s.icon}</div><h4 style="font-size:.8rem;font-weight:600;margin-bottom:.15rem">${s.label}</h4><div id="ss-${s.id}" style="font-size:.7rem;color:var(--muted)">Tap to play</div><div class="visualizer" id="viz-${s.id}">${Array(8).fill('<div class="vbar"></div>').join('')}</div><div onclick="event.stopPropagation()" style="display:flex;align-items:center;gap:.5rem;margin-top:.5rem"><label style="font-size:.68rem;color:var(--muted)">Vol</label><input type="range" min="0" max="1" step=".05" value="0.5" oninput="setVol('${s.id}',this.value)" style="flex:1;accent-color:var(--p)"/></div></div>`).join('')}
function makeNoise(type){AC.resume();const buf=AC.createBuffer(1,AC.sampleRate*2,AC.sampleRate),d=buf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;const src=AC.createBufferSource();src.buffer=buf;src.loop=true;const g=AC.createGain();g.gain.value=soundVols[type];const f=AC.createBiquadFilter();const fm={rain:1000,forest:400,waves:200,white:5000,fire:100,birds:2500,cafe:700,wind:280};const tm={rain:'bandpass',forest:'lowpass',waves:'lowpass',white:'highpass',fire:'lowpass',birds:'bandpass',cafe:'bandpass',wind:'lowpass'};f.type=tm[type];f.frequency.value=fm[type];if(['rain','birds'].includes(type))f.Q.value=2;src.connect(f);f.connect(g);g.connect(AC.destination);src.start();return{src,gain:g}}
function toggleSound(id){if(soundNodes[id]){soundNodes[id].src.stop();delete soundNodes[id];document.getElementById('sc-'+id).classList.remove('playing');document.getElementById('ss-'+id).textContent='Tap to play';clearViz(id)}else{soundNodes[id]=makeNoise(id);document.getElementById('sc-'+id).classList.add('playing');document.getElementById('ss-'+id).textContent='♪ Playing';animViz(id)}}
function setVol(id,v){soundVols[id]=parseFloat(v);if(soundNodes[id])soundNodes[id].gain.gain.value=parseFloat(v)}
function stopAll(){Object.keys(soundNodes).forEach(id=>toggleSound(id))}
function animViz(id){const bars=document.querySelectorAll(`#viz-${id} .vbar`);const tick=()=>{if(!soundNodes[id])return;bars.forEach(b=>b.style.height=(Math.random()*22+3)+'px');setTimeout(tick,130)};tick()}
function clearViz(id){document.querySelectorAll(`#viz-${id} .vbar`).forEach(b=>b.style.height='3px')}

// ── AI COUNSEL ────────────────────────────────────────────────────
const SYS=`You are CalmBot, a compassionate AI counsellor for students. Be warm, empathetic, concise (3-4 sentences max). Focus on stress, anxiety, burnout, study pressure, loneliness. If crisis, recommend Vandrevala: 1860-2662-345. Never pretend to be a licensed therapist.`;
let chatHistory=[];
function sendQuick(msg){document.getElementById('chatInput').value=msg;sendChat()}
async function sendChat(){
  const inp=document.getElementById('chatInput'),msg=inp.value.trim();if(!msg)return;
  inp.value='';addMsg(msg,'user');document.getElementById('quickReplies').style.display='none';
  chatHistory.push({role:'user',content:msg});
  const typingEl=addMsg('','bot');typingEl.innerHTML='<div class="typing-dots"><span></span><span></span><span></span></div>';
  try{
    const res=await fetch('/api/chat',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({max_tokens:1000,system:SYS,messages:chatHistory})
    });
    const d=await res.json();
    if(d.error)throw new Error(d.error.message);
    const reply=d.content[0].text;
    typingEl.textContent=reply;chatHistory.push({role:'assistant',content:reply});
    unlockBadge('counselled');
  }catch(e){typingEl.textContent="I'm having a moment 💙 Try again shortly. iCall is also here: 9152987821"}
  document.getElementById('chatMsgs').scrollTop=9999;
}
function addMsg(text,role){const d=document.createElement('div');d.className='msg '+role;d.textContent=text;document.getElementById('chatMsgs').appendChild(d);document.getElementById('chatMsgs').scrollTop=9999;return d}

// ── EXAMS ─────────────────────────────────────────────────────────
function addExam(){const n=document.getElementById('examName').value.trim(),dt=document.getElementById('examDate').value;if(!n||!dt){showToast('⚠️ Enter name and date');return}exams.push({name:n,date:dt,id:Date.now()});document.getElementById('examName').value='';document.getElementById('examDate').value='';renderExams()}
function renderExams(){const list=document.getElementById('examList');if(!list)return;if(!exams.length){list.innerHTML='<p style="color:var(--muted);font-size:.86rem;text-align:center;padding:2rem">No exams added yet.</p>';return}const today=new Date();today.setHours(0,0,0,0);list.innerHTML=exams.sort((a,b)=>new Date(a.date)-new Date(b.date)).map(e=>{const diff=Math.ceil((new Date(e.date)-today)/86400000);return`<div class="exam-item"><div><div style="font-weight:700;font-size:.9rem">${e.name}</div><div style="font-size:.76rem;color:var(--muted);margin-top:.15rem">📅 ${new Date(e.date).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</div></div><div style="text-align:right"><div class="exam-days ${diff<=3?'urgent':''}">${diff<0?'Past':diff===0?'Today!':diff}</div><div style="font-size:.7rem;color:var(--muted)">${diff<0?'passed':diff===0?'🔥 Today!':diff===1?'day left':'days left'}</div></div><button class="btn btn-danger btn-sm" onclick="exams=exams.filter(x=>x.id!==${e.id});renderExams()">✕</button></div>`}).join('')}

// ── BADGES ────────────────────────────────────────────────────────
function unlockBadge(id){if(unlockedBadges.includes(id))return;unlockedBadges.push(id);const b=badgesDef.find(x=>x.id===id);if(b)showToast(`🏅 ${b.icon} ${b.name} unlocked!`);renderBadges();updateDash()}
function renderBadges(){
  const g=document.getElementById('badgesGrid');if(!g)return;
  g.innerHTML=badgesDef.map(b=>{const un=unlockedBadges.includes(b.id);return`<div class="badge-card ${un?(b.gold?'gold-card':'unlocked'):''}"><div class="b-icon">${b.icon}</div><h4 style="font-size:.8rem;font-weight:700;margin-bottom:.15rem">${b.name}</h4><p style="font-size:.72rem;color:var(--muted)">${b.desc}</p>${un?`<span class="badge-pill ${b.gold?'gold':''}" style="margin-top:.4rem;font-size:.7rem">✓ Earned</span>`:'<span style="font-size:.7rem;color:var(--muted);opacity:.5;margin-top:.4rem;display:inline-block">Locked</span>'}</div>`}).join('');
  const pb=document.getElementById('profBadges');if(pb)pb.innerHTML=unlockedBadges.slice(-4).map(id=>{const b=badgesDef.find(x=>x.id===id);return b?`<span class="badge-pill ${b.gold?'gold':''}" style="font-size:.7rem">${b.icon} ${b.name}</span>`:''}).join('');
}

// ── TOAST ─────────────────────────────────────────────────────────
function showToast(msg){const t=document.createElement('div');t.className='toast';t.innerHTML=msg;document.body.appendChild(t);setTimeout(()=>{t.style.opacity='0';t.style.transform='translateY(12px)';t.style.transition='all .3s';setTimeout(()=>t.remove(),300)},3000)}

// ── EXPORT ────────────────────────────────────────────────────────
function exportData(){const a=document.createElement('a');a.href='data:text/json,'+encodeURIComponent(JSON.stringify({user,xp,streak,moodLog,sleepLog,exams,unlockedBadges},null,2));a.download='calmcampus-data.json';a.click();showToast('📤 Data exported!')}

// ── INIT ──────────────────────────────────────────────────────────
document.getElementById('examDate').min=new Date().toISOString().split('T')[0];
