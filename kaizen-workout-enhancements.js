/* Kaizen workout-log improvements. Loaded through the app's service worker. */
(function () {
  'use strict';
  const splitOptions = ['Push Day','Pull Day','Leg Day','Upper Body','Lower Body','Full Body','Push / Pull / Legs','Chest Day','Back Day','Shoulder Day','Arm Day','Glute Day','Core Day','Strength Day','Hypertrophy','Powerlifting','Olympic Weightlifting','Cardio Day','Active Recovery','Mobility'];
  const moves = ['Bench Press','Incline Bench Press','Decline Bench Press','Dumbbell Bench Press','Chest Fly','Cable Fly','Push-Up','Shoulder Press','Arnold Press','Lateral Raise','Front Raise','Rear Delt Fly','Triceps Pushdown','Overhead Triceps Extension','Skull Crusher','Pull-Up','Chin-Up','Lat Pulldown','Seated Cable Row','Bent-Over Row','Dumbbell Row','Chest-Supported Row','Face Pull','Barbell Curl','Dumbbell Curl','Hammer Curl','Preacher Curl','Squat','Front Squat','Goblet Squat','Leg Press','Hack Squat','Lunge','Bulgarian Split Squat','Romanian Deadlift','Deadlift','Hip Thrust','Glute Bridge','Leg Extension','Leg Curl','Calf Raise','Hip Abduction','Hip Adduction','Plank','Side Plank','Crunch','Cable Crunch','Hanging Leg Raise','Russian Twist','Back Extension',"Farmer's Carry",'Treadmill','Incline Walk','Outdoor Run','Stationary Bike','Cycling','Elliptical','Rowing Machine','Stair Climber','Jump Rope','Swimming'];
  const equipment = ['Barbell','Dumbbells','Smith Machine','Cable Machine','Resistance Bands','Bodyweight','Weight Machine','Leg Press Machine','Hack Squat Machine','Chest Press Machine','Lat Pulldown Machine','Seated Row Machine','Leg Extension Machine','Leg Curl Machine','Cable Crossover','Kettlebell','EZ Curl Bar','Trap Bar','Bench','Pull-Up Bar','Dip Bars','Medicine Ball','Ab Wheel','Treadmill','Stationary Bike','Elliptical','Rowing Machine','Stair Climber','Jump Rope','Cable Attachment','Other'];
  const variations = {
    'bench press':['Flat Bench','Paused Bench','Close-Grip Bench','Touch-and-Go','Tempo Bench'],
    'incline bench press':['Incline Barbell','Incline Dumbbell','Low-Incline','Smith Machine Incline'],
    'decline bench press':['Decline Barbell','Decline Dumbbell','Decline Machine'],
    'dumbbell bench press':['Flat Dumbbell','Incline Dumbbell','Decline Dumbbell','Neutral-Grip'],
    'chest fly':['Dumbbell Fly','Incline Fly','Machine Fly','Pec Deck'],
    'cable fly':['High-to-Low','Low-to-High','Mid Cable Fly','Single-Arm Cable Fly'],
    'push-up':['Standard','Wide-Grip','Close-Grip','Incline','Decline','Knee Push-Up','Weighted'],
    'shoulder press':['Seated','Standing','Dumbbell','Barbell','Machine','Arnold Press'],
    'lateral raise':['Dumbbell','Cable','Machine','Leaning Cable','Partial Reps'],
    'rear delt fly':['Bent-Over Dumbbell','Reverse Pec Deck','Cable','Chest-Supported'],
    'triceps pushdown':['Rope','Straight Bar','V-Bar','Single-Arm'],
    'overhead triceps extension':['Dumbbell','Cable Rope','EZ Bar','Single-Arm'],
    'pull-up':['Overhand','Wide-Grip','Neutral-Grip','Assisted','Weighted'],
    'chin-up':['Underhand','Assisted','Weighted'],
    'lat pulldown':['Wide-Grip','Close-Grip','Neutral-Grip','Reverse-Grip','Single-Arm'],
    'seated cable row':['Close-Grip','Wide-Grip','Neutral-Grip','Underhand','Single-Arm'],
    'bent-over row':['Barbell','Underhand','Overhand','Pendlay Row'],
    'dumbbell row':['Single-Arm','Chest-Supported','Incline Bench'],
    'barbell curl':['Straight Bar','EZ Bar','Reverse Curl'],
    'dumbbell curl':['Alternating','Seated','Incline','Concentration'],
    'hammer curl':['Dumbbell','Cross-Body','Rope Cable'],
    'squat':['Back Squat','High-Bar','Low-Bar','Box Squat','Tempo Squat','Pause Squat'],
    'front squat':['Barbell','Cross-Arm','Strap-Assisted'],
    'goblet squat':['Dumbbell','Kettlebell','Heels Elevated'],
    'leg press':['45-Degree','Horizontal','Single-Leg','High Foot Placement','Low Foot Placement'],
    'hack squat':['Machine','Reverse Hack Squat','Feet High'],
    'lunge':['Forward','Reverse','Walking','Lateral'],
    'bulgarian split squat':['Dumbbell','Barbell','Bodyweight'],
    'romanian deadlift':['Barbell','Dumbbell','Single-Leg'],
    'deadlift':['Conventional','Sumo','Trap Bar','Deficit'],
    'hip thrust':['Barbell','Dumbbell','Machine','Single-Leg'],
    'glute bridge':['Bodyweight','Barbell','Single-Leg'],
    'leg extension':['Machine','Single-Leg'],
    'leg curl':['Seated','Lying','Standing','Single-Leg'],
    'calf raise':['Standing','Seated','Leg Press'],
    'hip abduction':['Machine','Cable','Banded'],
    'hip adduction':['Machine','Cable'],
    'plank':['Forearm','High Plank','Weighted','RKC'],
    'crunch':['Standard','Reverse','Weighted'],
    'cable crunch':['Kneeling','Standing'],
    'hanging leg raise':['Bent-Knee','Straight-Leg','Toes-to-Bar'],
    'back extension':['Bodyweight','Weighted','45-Degree'],
    'treadmill':['Walk','Incline Walk','Jog','Run','Intervals'],
    'incline walk':['Treadmill','Steep Incline','Intervals'],
    'stationary bike':['Upright','Recumbent','Intervals','Steady State'],
    'cycling':['Road','Indoor','Intervals','Steady State'],
    'elliptical':['Forward','Reverse','Intervals'],
    'rowing machine':['Steady State','Intervals','Sprint'],
    'stair climber':['Steady State','Intervals'],
    'jump rope':['Basic Bounce','Alternate Foot','Double Under']
  };
  function options(id, values) {
    let list = document.getElementById(id);
    if (!list) { list = document.createElement('datalist'); list.id = id; document.body.appendChild(list); }
    list.innerHTML = values.map(v => '<option value="' + String(v).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;') + '"></option>').join('');
  }
  function variationList(row) {
    const name = (row.querySelector('[data-f="name"]')?.value || '').trim().toLowerCase();
    const list = row.querySelector('[data-f="variation"]');
    if (!list) return;
    const id = 'kaizen-variations-' + row.getAttribute('data-w-ex');
    list.setAttribute('list', id);
    options(id, variations[name] || ['Standard','Alternating','Single-Arm','Single-Leg','Seated','Standing','Incline','Decline','Wide-Grip','Close-Grip','Neutral-Grip','Underhand','Overhand','Machine','Cable','Dumbbell','Barbell','Bodyweight','Paused','Tempo','Weighted']);
  }
  function applySuggestions() {
    options('kaizen-splits', splitOptions);
    options('kaizen-moves', moves);
    options('kaizen-equipment', equipment);
    const split = document.getElementById('w-type');
    if (split && split.tagName === 'SELECT') {
      const input = document.createElement('input');
      input.id = 'w-type'; input.type = 'text'; input.maxLength = 80;
      input.setAttribute('list','kaizen-splits'); input.placeholder = 'e.g. Push Day'; input.autocomplete = 'off';
      input.value = view?.gymType === 'cardio' ? 'Cardio Day' : 'Push Day';
      split.replaceWith(input);
      const label = input.closest('.gym-field')?.querySelector('label');
      if (label) label.textContent = 'Workout Split / Type';
      const hint = document.createElement('div'); hint.className = 'gym-muted'; hint.textContent = 'Choose a suggestion or enter your own split.';
      input.after(hint);
    } else if (split) {
      split.setAttribute('list','kaizen-splits'); split.placeholder = 'e.g. Push Day'; split.autocomplete = 'off';
    }
    document.querySelectorAll('[data-w-ex]').forEach(row => {
      const name = row.querySelector('[data-f="name"]'), equip = row.querySelector('[data-f="equipment"]'), weightLabel = row.querySelector('[data-f="sides"]')?.closest('.gym-field')?.querySelector('label');
      if (name) { name.setAttribute('list','kaizen-moves'); name.placeholder = 'Start typing a move…'; name.autocomplete = 'off'; if (!name.dataset.kaizenSuggest) { name.dataset.kaizenSuggest='1'; name.addEventListener('input',()=>variationList(row)); } }
      if (equip) { equip.setAttribute('list','kaizen-equipment'); equip.placeholder = 'Start typing equipment…'; equip.autocomplete = 'off'; }
      if (weightLabel) weightLabel.textContent = 'Weight measurement';
      const side = row.querySelector('[data-f="sides"]');
      if (side && side.options.length >= 2) { side.options[0].textContent='Total weight (combined)'; side.options[1].textContent='Weight per side (×2)'; }
      variationList(row);
    });
    const title = document.querySelector('#w-cardio label[for="w-cardio-activity"]');
    if (title) title.textContent = 'Cardio Activity';
  }
  function observe() {
    applySuggestions();
    const root = document.getElementById('app') || document.body;
    new MutationObserver(() => applySuggestions()).observe(root,{childList:true,subtree:true});
  }
  function install() {
    if (!window.Ascent || !view || !state) { setTimeout(install,50); return; }
    const originalAdd = window.Ascent.addGymExercise.bind(window.Ascent);
    window.Ascent.chooseGymType = function(type) {
      if (type !== 'strength' && type !== 'cardio') return;
      view.gymType = type;
      view.screen = 'gym';
      render();
      this.gymTypeChanged();
      applySuggestions();
    };
    window.Ascent.gymTypeChanged = function() {
      const mode = view.gymType === 'cardio' ? 'cardio' : 'strength';
      const strength = document.getElementById('w-strength'), cardio = document.getElementById('w-cardio');
      if (strength) strength.style.display = mode === 'cardio' ? 'none' : 'block';
      if (cardio) cardio.style.display = mode === 'strength' ? 'none' : 'block';
      applySuggestions();
    };
    window.Ascent.addGymExercise = function() { originalAdd(); applySuggestions(); };
    window.Ascent.saveGymWorkout = async function() {
      if (!state.user || !window.Ascent) return;
      const err = document.getElementById('w-error'), btn = document.getElementById('w-save');
      if (!err || !btn) return;
      err.textContent = '';
      const date = document.getElementById('w-date')?.value;
      const mode = view.gymType === 'cardio' ? 'cardio' : 'strength';
      const split = document.getElementById('w-type')?.value.trim() || (mode === 'cardio' ? 'Cardio Day' : 'Strength Day');
      const start = document.getElementById('w-start')?.value || null, end = document.getElementById('w-end')?.value || null;
      if (!date) { err.textContent = 'Choose a workout date.'; return; }
      if (start && end && end < start) { err.textContent = 'End time cannot be earlier than start time.'; return; }
      const ex = [...document.querySelectorAll('[data-w-ex]')].map((el,i) => {
        const v = k => el.querySelector('[data-f="'+k+'"]')?.value?.trim() || '';
        return {i,name:v('name'),equipment:v('equipment'),variation:v('variation'),weight:v('weight'),sides:v('sides')||'1',reps:v('reps'),seconds:v('seconds')};
      }).filter(x=>x.name);
      if (mode !== 'cardio' && !ex.length) { err.textContent = 'Add an exercise or choose Cardio.'; return; }
      const cm = Number(document.getElementById('w-cardio-min')?.value || 0);
      let duration = null;
      if (start && end) { const [sh,sm]=start.split(':').map(Number),[eh,em]=end.split(':').map(Number); duration=eh*60+em-sh*60-sm; if(duration<0)duration+=1440; }
      if (mode === 'cardio' && cm > 0) duration = cm;
      btn.disabled = true; btn.textContent = 'SAVING…';
      try {
        const comments = (document.getElementById('w-cardio-activity')?.value.trim() ? 'Cardio activity: '+document.getElementById('w-cardio-activity').value.trim()+'\n' : '') + (document.getElementById('w-comments')?.value.trim() || '');
        const row = {
          user_id:state.user.id, workout_date:date, workout_type:split, start_time:start, end_time:end, duration_minutes:duration,
          exercises:ex.map(x=>({name:x.name,equipment:x.equipment,variation:x.variation,weight:x.weight===''?null:Number(x.weight),weight_sides:Number(x.sides),reps:x.reps===''?null:Number(x.reps),duration_seconds:x.seconds===''?null:Number(x.seconds)})),
          knee_pain:document.getElementById('w-knee')?.value || 'Not at all', other_pain:document.getElementById('w-pain')?.value.trim() || '', comments,
          cardio_duration_seconds:mode!=='cardio'||cm<=0?null:Math.round(cm*60),
          cardio_speed:document.getElementById('w-speed')?.value?Number(document.getElementById('w-speed').value):null,
          cardio_level:document.getElementById('w-level')?.value?Number(document.getElementById('w-level').value):null,
          cardio_incline:document.getElementById('w-incline')?.value?Number(document.getElementById('w-incline').value):null
        };
        const {data:session,error} = await sb.from('workout_sessions').insert(row).select('id').single();
        if (error) throw error;
        if (ex.length) {
          const rows = ex.map(x=>({workout_session_id:session.id,user_id:state.user.id,exercise_order:x.i,exercise_name:x.name,equipment:x.equipment||null,variation:x.variation||null,weight:x.weight===''?null:Number(x.weight),weight_sides:Number(x.sides),reps:x.reps===''?null:Number(x.reps),duration_seconds:x.seconds===''?null:Number(x.seconds)}));
          const {error:e} = await sb.from('workout_exercises').insert(rows);
          if (e) { await sb.from('workout_sessions').delete().eq('id',session.id).eq('user_id',state.user.id); throw e; }
        }
        view.screen = 'gym-history'; render();
      } catch (e) {
        err.textContent = 'Workout was not saved: ' + (e.message || 'Unknown error');
        btn.disabled = false; btn.textContent = 'SAVE WORKOUT';
      }
    };
    observe();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',install,{once:true}); else install();
})();