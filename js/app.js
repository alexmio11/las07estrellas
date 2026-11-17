
    // =========================================================
    // SOUND ENGINE: CHRISTMAS MUSIC BOX (W1) + TRAIN & CLOCK (W2)
    // =========================================================
    let audioCtx = null;
    let isMuted = false;
    let bgmEnabled = true;
    let bgmStarted = false;
    let bgmTimer = null;
    let bgmStepIndex = 0;

    // World 1 Melody: "Noche de Paz"
    const christmasMelody = [
      [392.00, 130.81, 750], [440.00, 0, 280], [392.00, 196.00, 520], [329.63, 130.81, 1350],
      [392.00, 130.81, 750], [440.00, 0, 280], [392.00, 196.00, 520], [329.63, 130.81, 1350],
      [587.33, 196.00, 950], [587.33, 246.94, 500], [493.88, 196.00, 1350],
      [523.25, 130.81, 950], [523.25, 196.00, 500], [392.00, 130.81, 1350]
    ];

    // World 7 Melody: Romantic Caribbean Sunset Yacht (Warm Piano & Strings in F Major)
    const caribbeanSunsetMelody = [
      [523.25, 174.61, 460], [587.33, 174.61, 420], [698.46, 220.00, 520],
      [659.25, 220.00, 460], [587.33, 146.83, 420], [523.25, 146.83, 520],
      [440.00, 116.54, 460], [523.25, 116.54, 420], [587.33, 130.81, 520],
      [523.25, 130.81, 460], [440.00, 174.61, 420], [349.23, 174.61, 620]
    ];

    function playCaribbeanSunsetNote(freq, bassFreq, durMs) {
      if (isMuted || !bgmEnabled || !audioCtx) return;
      const now = audioCtx.currentTime;
      const durSec = (durMs / 1000) * 1.3;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + durSec);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + durSec + 0.02);

      const bass = audioCtx.createOscillator();
      const bGain = audioCtx.createGain();
      bass.type = 'triangle';
      bass.frequency.setValueAtTime(bassFreq, now);
      bGain.gain.setValueAtTime(0.001, now);
      bGain.gain.linearRampToValueAtTime(0.032, now + 0.03);
      bGain.gain.exponentialRampToValueAtTime(0.0008, now + durSec * 1.1);
      bass.connect(bGain);
      bGain.connect(audioCtx.destination);
      bass.start(now);
      bass.stop(now + durSec * 1.15);
    }

    // World 6 Melody: Traditional Russian Grand Ballroom Waltz (Shostakovich Waltz No. 2 / Imperial C-Minor 3/4 Waltz: Beat 1 Deep Cello, Beats 2 & 3 Ballroom Strings & Harp)
    const imperialRussianWaltz = [
      // Measure 1 (Cm: Eb5 held over Oom-pah-pah)
      [622.25, 130.81, 360], [0, 196.00, 340], [0, 196.00, 340],
      // Measure 2 (Cm: D5 - C5 - Bb4)
      [587.33, 98.00, 360], [523.25, 196.00, 340], [466.16, 196.00, 340],
      // Measure 3 (Fm: Ab4 - G4 - F4)
      [415.30, 174.61, 360], [392.00, 261.63, 340], [349.23, 261.63, 340],
      // Measure 4 (G7: G4 held with dominant tension)
      [392.00, 146.83, 360], [493.88, 246.94, 340], [587.33, 246.94, 340],
      // Measure 5 (G7 -> Cm: F5 held over G bass)
      [698.46, 196.00, 360], [0, 246.94, 340], [0, 246.94, 340],
      // Measure 6 (G7: Eb5 - D5 - C5)
      [622.25, 146.83, 360], [587.33, 246.94, 340], [523.25, 246.94, 340],
      // Measure 7 (Cm: B4 - C5 - D5)
      [493.88, 130.81, 360], [523.25, 196.00, 340], [587.33, 196.00, 340],
      // Measure 8 (Cm cadence: Eb5 - C5)
      [622.25, 130.81, 360], [523.25, 196.00, 340], [0, 130.81, 360]
    ];

    // Synthesize Rich Russian Imperial Ballroom Waltz (3/4 "Oom-Pah-Pah" Orchestra: Bowed Violin Lead + Deep Cello Beat 1 + Ballroom Chords on Beats 2 & 3)
    function playRussianImperialWaltzNote(freq, bassFreq, durationMs, stepIdx) {
      if (isMuted || !bgmEnabled || !audioCtx) return;
      const now = audioCtx.currentTime;
      const beatInBar = stepIdx % 3; // 0 = Beat 1 (Strong Downbeat), 1 = Beat 2, 2 = Beat 3
      const durSec = Math.max(0.32, (durationMs / 1000) * 1.25);

      // 1. Lead Imperial Violin & Crystal Chandelier Harmonics
      if (freq > 0) {
        const violinOsc = audioCtx.createOscillator();
        const violinGain = audioCtx.createGain();
        violinOsc.type = 'sawtooth';
        violinOsc.frequency.setValueAtTime(freq, now);
        // Smooth bowed string attack
        violinGain.gain.setValueAtTime(0.001, now);
        violinGain.gain.linearRampToValueAtTime(0.028, now + 0.045);
        violinGain.gain.exponentialRampToValueAtTime(0.0008, now + durSec * 1.15);
        violinOsc.connect(violinGain);
        violinGain.connect(audioCtx.destination);
        violinOsc.start(now);
        violinOsc.stop(now + durSec * 1.18);

        // Warm symphonic body (sine fundamental)
        const bodyOsc = audioCtx.createOscillator();
        const bodyGain = audioCtx.createGain();
        bodyOsc.type = 'sine';
        bodyOsc.frequency.setValueAtTime(freq, now);
        bodyGain.gain.setValueAtTime(0.001, now);
        bodyGain.gain.linearRampToValueAtTime(0.048, now + 0.03);
        bodyGain.gain.exponentialRampToValueAtTime(0.001, now + durSec * 1.2);
        bodyOsc.connect(bodyGain);
        bodyGain.connect(audioCtx.destination);
        bodyOsc.start(now);
        bodyOsc.stop(now + durSec * 1.22);
      }

      // 2. Characteristic 3/4 Waltz Accompaniment ("Un - dos - tres")
      if (bassFreq > 0) {
        if (beatInBar === 0) {
          // BEAT 1 ("OOM"): Deep resonant Russian Cello & Contrabass downbeat
          const celloOsc = audioCtx.createOscillator();
          const celloGain = audioCtx.createGain();
          celloOsc.type = 'triangle';
          celloOsc.frequency.setValueAtTime(bassFreq, now);
          celloGain.gain.setValueAtTime(0.001, now);
          celloGain.gain.linearRampToValueAtTime(0.065, now + 0.02);
          celloGain.gain.exponentialRampToValueAtTime(0.001, now + 0.34);
          celloOsc.connect(celloGain);
          celloGain.connect(audioCtx.destination);
          celloOsc.start(now);
          celloOsc.stop(now + 0.36);
        } else {
          // BEATS 2 & 3 ("PAH - PAH"): Crisp Ballroom Piano/Harp staccato chords
          [bassFreq, bassFreq * 1.2, bassFreq * 1.5].forEach(cFreq => {
            const chordOsc = audioCtx.createOscillator();
            const chordGain = audioCtx.createGain();
            chordOsc.type = 'sine';
            chordOsc.frequency.setValueAtTime(cFreq, now);
            chordGain.gain.setValueAtTime(0.022, now);
            chordGain.gain.exponentialRampToValueAtTime(0.0008, now + 0.18);
            chordOsc.connect(chordGain);
            chordGain.connect(audioCtx.destination);
            chordOsc.start(now);
            chordOsc.stop(now + 0.20);
          });
        }
      }
    }

    // World 5 Melody: Traditional Japanese Koto & Shakuhachi Lantern Night Theme (In-Sen / Hirajoshi Pentatonic Scale for La Casa de los Faroles)
    const lanternHouseJapaneseMelody = [
      [329.63, 164.81, 460], [349.23, 0, 320], [440.00, 220.00, 520], [493.88, 0, 320],
      [659.25, 164.81, 640], [493.88, 0, 320], [440.00, 220.00, 480], [349.23, 164.81, 640],
      [329.63, 164.81, 460], [440.00, 0, 320], [493.88, 246.94, 480], [440.00, 0, 320],
      [349.23, 174.61, 460], [329.63, 0, 320], [246.94, 123.47, 480], [329.63, 164.81, 820]
    ];

    function playJapaneseKotoNote(freq, bassFreq, durationMs, stepIdx) {
      if (isMuted || !bgmEnabled || !audioCtx) return;
      const now = audioCtx.currentTime;
      const durSec = Math.max(0.32, (durationMs / 1000) * 1.15);

      if (freq > 0) {
        const kotoOsc = audioCtx.createOscillator();
        const kotoGain = audioCtx.createGain();
        kotoOsc.type = 'triangle';
        kotoOsc.frequency.setValueAtTime(freq, now);
        kotoGain.gain.setValueAtTime(0.001, now);
        kotoGain.gain.linearRampToValueAtTime(0.055, now + 0.012);
        kotoGain.gain.exponentialRampToValueAtTime(0.0008, now + durSec);
        kotoOsc.connect(kotoGain);
        kotoGain.connect(audioCtx.destination);
        kotoOsc.start(now);
        kotoOsc.stop(now + durSec);

        const octOsc = audioCtx.createOscillator();
        const octGain = audioCtx.createGain();
        octOsc.type = 'sine';
        octOsc.frequency.setValueAtTime(freq * 2, now);
        octGain.gain.setValueAtTime(0.015, now);
        octGain.gain.exponentialRampToValueAtTime(0.0005, now + durSec * 0.45);
        octOsc.connect(octGain);
        octGain.connect(audioCtx.destination);
        octOsc.start(now);
        octOsc.stop(now + durSec * 0.45);
      }

      if (bassFreq > 0) {
        const shamisenBass = audioCtx.createOscillator();
        const bassGain = audioCtx.createGain();
        shamisenBass.type = 'sine';
        shamisenBass.frequency.setValueAtTime(bassFreq, now);
        bassGain.gain.setValueAtTime(0.03, now);
        bassGain.gain.exponentialRampToValueAtTime(0.0008, now + durSec * 1.1);
        shamisenBass.connect(bassGain);
        bassGain.connect(audioCtx.destination);
        shamisenBass.start(now);
        shamisenBass.stop(now + durSec * 1.1);
      }

      if (stepIdx % 8 === 0) {
        const bambooOsc = audioCtx.createOscillator();
        const bambooGain = audioCtx.createGain();
        bambooOsc.type = 'sine';
        bambooOsc.frequency.setValueAtTime(1318.5, now);
        bambooGain.gain.setValueAtTime(0.012, now);
        bambooGain.gain.exponentialRampToValueAtTime(0.0005, now + 0.18);
        bambooOsc.connect(bambooGain);
        bambooGain.connect(audioCtx.destination);
        bambooOsc.start(now);
        bambooOsc.stop(now + 0.19);
      }
    }

    // World 4 Melody: High-Tension Psychological Countdown Ostinato (Fast D-Minor Staccato + Heartbeat + Urgent Stopwatch Tick)
    const chamberCardsMelody = [
      [293.66, 73.42, 220], [349.23, 0, 220], [440.00, 146.83, 220], [349.23, 0, 220],
      [311.13, 77.78, 220], [349.23, 0, 220], [466.16, 155.56, 220], [349.23, 0, 220],
      [293.66, 73.42, 210], [369.99, 0, 210], [440.00, 146.83, 210], [523.25, 0, 210],
      [493.88, 82.41, 200], [440.00, 0, 200], [392.00, 164.81, 200], [329.63, 0, 200]
    ];

    // Synthesize Urgent Psychological Pressure: Double-time Stopwatch Tick-Tock + Deep Heartbeat ("Thump-Thump")
    function playWorld4TensionPulse(stepIdx) {
      if (isMuted || !bgmEnabled || !audioCtx) return;
      const now = audioCtx.currentTime;

      // 1. Sharp metallic stopwatch tick on every step to create rush & time pressure
      const tickOsc = audioCtx.createOscillator();
      const tickGain = audioCtx.createGain();
      tickOsc.type = 'square';
      const pitchBoost = (state.currentCardIndex || 0) * 14;
      tickOsc.frequency.setValueAtTime((stepIdx % 2 === 0 ? 1580 : 1180) + pitchBoost, now);
      tickGain.gain.setValueAtTime(0.022, now);
      tickGain.gain.exponentialRampToValueAtTime(0.0005, now + 0.028);
      tickOsc.connect(tickGain);
      tickGain.connect(audioCtx.destination);
      tickOsc.start(now);
      tickOsc.stop(now + 0.032);

      // 2. Deep chest heartbeat ("Lub-Dub") every 4 steps
      if (stepIdx % 4 === 0 || stepIdx % 4 === 1) {
        const hbOsc = audioCtx.createOscillator();
        const hbGain = audioCtx.createGain();
        hbOsc.type = 'sine';
        const hbFreq = stepIdx % 4 === 0 ? 62 : 52;
        hbOsc.frequency.setValueAtTime(hbFreq, now);
        hbOsc.frequency.exponentialRampToValueAtTime(28, now + 0.14);
        hbGain.gain.setValueAtTime(stepIdx % 4 === 0 ? 0.09 : 0.065, now);
        hbGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        hbOsc.connect(hbGain);
        hbGain.connect(audioCtx.destination);
        hbOsc.start(now);
        hbOsc.stop(now + 0.16);
      }
    }

    function sfxCardFlip() {
      playTone(320, 'triangle', 0.08, 0, 0.09);
      playTone(480, 'sine', 0.11, 0.05, 0.09);
      playTone(640, 'sine', 0.14, 0.10, 0.07);
    }

    function sfxGuardianDeepVoice() {
      playTone(110, 'sawtooth', 0.22, 0, 0.08);
      playTone(138.59, 'triangle', 0.28, 0.08, 0.08);
    }

    function sfxTimePenalty() {
      playTone(164.81, 'sawtooth', 0.25, 0, 0.14);
      playTone(130.81, 'sawtooth', 0.35, 0.15, 0.16);
    }

    // World 3 Melody: Romantic Sunset Waltz over the Miraflores Pier (La Rosa Náutica)
    const mirafloresSunsetWaltz = [
      [523.25, 130.81, 550], [659.25, 196.00, 420], [783.99, 196.00, 420],
      [698.46, 174.61, 550], [587.33, 220.00, 420], [698.46, 220.00, 420],
      [659.25, 130.81, 550], [523.25, 196.00, 420], [493.88, 196.00, 420],
      [440.00, 146.83, 550], [523.25, 220.00, 420], [659.25, 220.00, 650]
    ];

    // World 2 Melody: Romantic Hurry & Train Rhythm (Warm Acoustic Arpeggio + Clock Tick)
    const trainRomanticMelody = [
      [440.00, 220.00, 320], [523.25, 0, 320], [659.25, 329.63, 320], [523.25, 0, 320],
      [349.23, 174.61, 320], [440.00, 0, 320], [523.25, 261.63, 320], [440.00, 0, 320],
      [392.00, 196.00, 320], [493.88, 0, 320], [587.33, 293.66, 320], [493.88, 0, 320],
      [329.63, 164.81, 320], [392.00, 0, 320], [493.88, 246.94, 320], [659.25, 0, 320]
    ];

    function initAudio() {
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) audioCtx = new AudioContextClass();
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      if (!bgmStarted && bgmEnabled && !isMuted) {
        startWorldBGM();
      }
    }

    // Synthesize rhythmic train chug + pocket watch tick-tock for World 2
    function playTrainChugAndClockTick(stepIdx) {
      if (isMuted || !bgmEnabled || !audioCtx) return;
      const now = audioCtx.currentTime;

      // Crisp pocket-watch tick-tock every beat
      const tickOsc = audioCtx.createOscillator();
      const tickGain = audioCtx.createGain();
      tickOsc.type = 'triangle';
      tickOsc.frequency.setValueAtTime(stepIdx % 2 === 0 ? 1200 : 950, now);
      tickGain.gain.setValueAtTime(0.025, now);
      tickGain.gain.exponentialRampToValueAtTime(0.0008, now + 0.035);
      tickOsc.connect(tickGain);
      tickGain.connect(audioCtx.destination);
      tickOsc.start(now);
      tickOsc.stop(now + 0.04);

      // Soft steam-train rhythmic low pulse ("chucu-chucu")
      const chugOsc = audioCtx.createOscillator();
      const chugGain = audioCtx.createGain();
      chugOsc.type = 'sawtooth';
      const accent = (stepIdx % 4 === 0) ? 92 : 68;
      chugOsc.frequency.setValueAtTime(accent, now);
      chugGain.gain.setValueAtTime(0.015, now);
      chugGain.gain.exponentialRampToValueAtTime(0.0008, now + 0.11);
      chugOsc.connect(chugGain);
      chugGain.connect(audioCtx.destination);
      chugOsc.start(now);
      chugOsc.stop(now + 0.12);
    }

    function playTrainWhistle() {
      if (isMuted) return;
      initAudio();
      if (!audioCtx) return;
      const now = audioCtx.currentTime;
      // Classic nostalgic chord train whistle (G4 + B4 + D5)
      [392.00, 493.88, 587.33].forEach(freq => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.06, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.9);
      });
    }

    function playMusicBoxNote(freq, bassFreq, durationMs) {
      if (isMuted || !bgmEnabled || !audioCtx) return;
      const now = audioCtx.currentTime;
      const durSec = Math.max(0.28, (durationMs / 1000) * 1.25);

      if (freq > 0) {
        const osc1 = audioCtx.createOscillator();
        const gain1 = audioCtx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(freq, now);
        gain1.gain.setValueAtTime(0.001, now);
        gain1.gain.linearRampToValueAtTime(0.042, now + 0.02);
        gain1.gain.exponentialRampToValueAtTime(0.0008, now + durSec);
        osc1.connect(gain1);
        gain1.connect(audioCtx.destination);
        osc1.start(now);
        osc1.stop(now + durSec);
      }

      if (bassFreq > 0) {
        const oscBass = audioCtx.createOscillator();
        const gainBass = audioCtx.createGain();
        oscBass.type = 'triangle';
        oscBass.frequency.setValueAtTime(bassFreq, now);
        gainBass.gain.setValueAtTime(0.001, now);
        gainBass.gain.linearRampToValueAtTime(0.025, now + 0.03);
        gainBass.gain.exponentialRampToValueAtTime(0.0008, now + durSec * 1.1);
        oscBass.connect(gainBass);
        gainBass.connect(audioCtx.destination);
        oscBass.start(now);
        oscBass.stop(now + durSec * 1.1);
      }
    }

    function scheduleNextBGMNote() {
      if (bgmTimer) clearTimeout(bgmTimer);
      if (!bgmEnabled || isMuted) return;

      const activeList = state.currentWorld === 7
        ? caribbeanSunsetMelody
        : (state.currentWorld === 6
        ? imperialRussianWaltz
        : (state.currentWorld === 5
            ? lanternHouseJapaneseMelody
        : (state.currentWorld === 4
            ? chamberCardsMelody
            : (state.currentWorld === 3
                ? mirafloresSunsetWaltz
                : (state.currentWorld === 2 ? trainRomanticMelody : christmasMelody)))));
      const [melodyFreq, bassFreq, waitMs] = activeList[bgmStepIndex % activeList.length];

      // En el Mundo 4, el ritmo acelera conforme la Princesa avanza por las 21 cartas para generar más prisa y presión
      const effectiveWaitMs = state.currentWorld === 4
        ? Math.max(145, waitMs - (state.currentCardIndex || 0) * 3)
        : waitMs;

      if (state.currentWorld === 7) {
        playCaribbeanSunsetNote(melodyFreq, bassFreq, effectiveWaitMs);
      } else if (state.currentWorld === 7) {
        document.getElementById('items-count').textContent = state.star7Earned ? '7/7' : 'Final';
        grid.innerHTML = `
          <div class="col-span-2 p-2.5 rounded-lg bg-amber-500/15 border border-amber-400/50 text-amber-200 text-xs font-medium text-center">
            🛥️ Nivel Final: La Confesión en el Caribe
          </div>`;
        checklistEl.innerHTML = '<div class="text-xs font-semibold text-amber-300 uppercase tracking-wider">Objetivos Mundo 7:</div>' +
          `<div class="flex items-center gap-2 text-xs ${state.w7ConfessionStarted ? 'text-emerald-300 font-medium' : 'text-slate-300'}"><span class="w-4 h-4 rounded ${state.w7ConfessionStarted ? 'bg-emerald-500 text-slate-950 font-bold' : 'border border-slate-600'} flex items-center justify-center text-[10px]">${state.w7ConfessionStarted ? '✓' : '1'}</span><span>Subir a la cubierta superior blanca con el Duque</span></div>` +
          `<div class="flex items-center gap-2 text-xs ${state.star7Earned ? 'text-emerald-300 font-medium' : 'text-slate-300'}"><span class="w-4 h-4 rounded ${state.star7Earned ? 'bg-emerald-500 text-slate-950 font-bold' : 'border border-slate-600'} flex items-center justify-center text-[10px]">${state.star7Earned ? '✓' : '2'}</span><span>Escuchar "La Confesión" y tomar la decisión final</span></div>`;
        statusEl.textContent = state.star7Earned
          ? '★★★★★★★ ¡7/7 Estrellas! La historia ha llegado a su cierre.'
          : 'Mundo 7: Camina hacia el Duque en la cubierta superior blanca para iniciar "La Confesión".';
      } else if (state.currentWorld === 6) {
        playRussianImperialWaltzNote(melodyFreq, bassFreq, effectiveWaitMs, bgmStepIndex);
      } else if (state.currentWorld === 5) {
        playJapaneseKotoNote(melodyFreq, bassFreq, effectiveWaitMs, bgmStepIndex);
      } else {
        playMusicBoxNote(melodyFreq, bassFreq, effectiveWaitMs);
      }
      if (state.currentWorld === 2) {
        playTrainChugAndClockTick(bgmStepIndex);
      } else if (state.currentWorld === 4 && !state.star4Earned) {
        playWorld4TensionPulse(bgmStepIndex);
      }

      bgmStepIndex = (bgmStepIndex + 1) % activeList.length;
      bgmTimer = setTimeout(scheduleNextBGMNote, effectiveWaitMs);
    }

    function startWorldBGM() {
      bgmStarted = true;
      if (bgmTimer) clearTimeout(bgmTimer);
      scheduleNextBGMNote();
    }

    function stopChristmasBGM() {
      bgmStarted = false;
      if (bgmTimer) {
        clearTimeout(bgmTimer);
        bgmTimer = null;
      }
    }

    function playTone(freq, type = 'sine', duration = 0.18, delay = 0, vol = 0.12) {
      if (isMuted) return;
      initAudio();
      if (!audioCtx) return;
      const now = audioCtx.currentTime + delay;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + duration);
    }

    function sfxStep() { playTone(190, 'triangle', 0.05, 0, 0.04); }
    function sfxDialogueBlip(isDuke = true) {
      playTone(isDuke ? 280 : 420, 'sine', 0.09, 0, 0.08);
    }
    function sfxPickup() {
      playTone(523.25, 'sine', 0.12, 0, 0.12);
      playTone(659.25, 'sine', 0.16, 0.08, 0.12);
      playTone(783.99, 'sine', 0.22, 0.16, 0.14);
    }
    function sfxFlashback() {
      [440, 554.37, 659.25, 880].forEach((f, i) => playTone(f, 'sine', 0.35, i * 0.12, 0.1));
    }
    function sfxStarVictory() {
      const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5];
      notes.forEach((f, i) => playTone(f, 'triangle', 0.38, i * 0.14, 0.15));
    }

    // =========================================================
    // PROLOGUE SCRIPTS FOR WORLD 1 AND WORLD 2
    // =========================================================
    const prologueScriptWorld1 = [
      {
        tag: 'Escena 1 / 6: La Caída en el Túnel',
        avatar: '👑',
        speaker: 'EL DUQUE (DESPERTANDO ATURDIDO)',
        text: '«¿Princesa?... ¡Princesa, despierta! Abre los ojos, por favor... ¿Estás herida? Todo se volvió negro después de que resbalamos en aquel túnel...»',
        context: 'Hace apenas unos minutos, las palabras hirientes de una discusión tonta los habían distanciado... hasta que el suelo cedió bajo sus pies en aquel túnel sin fondo.',
        choices: [
          { label: '👸 Princesa: "¿Dónde estamos? Mi cabeza da vueltas..."', next: 1 },
          { label: '👸 Princesa: "¡Te tengo! Pensé que te había perdido en la caída..."', next: 1 }
        ]
      },
      {
        tag: 'Escena 2 / 6: Confusión en el Salón Desconocido',
        avatar: '👸',
        speaker: 'LA PRINCESA (MIRANDO ALREDEDOR CONFUNDIDA)',
        text: '«Estoy bien... aún me tiemblan las manos. Hace un segundo estábamos discutiendo bajo la lluvia, caímos por ese túnel interminable y ahora... ¿qué es este lugar? ¿Por qué hay nieve y adornos de Navidad si no sabemos ni cómo llegamos aquí?»',
        context: 'A su alrededor no hay salida: solo un salón iluminado con guirnaldas cálidas, un altar de madera vacío y el murmullo distante de recuerdos borrosos.',
        choices: [
          { label: '👑 Duque: "Intentemos recordar qué nos pasó antes de caer..."', next: 2 },
          { label: '👑 Duque: "Mira arriba, acaba de encenderse una pantalla en el aire."', next: 2 }
        ]
      },
      {
        tag: 'Escena 3 / 6: La Laguna en la Memoria',
        avatar: '👑',
        speaker: 'EL DUQUE (FRUNCIENDO EL CEÑO)',
        text: '«Es rarísimo... Sé quién eres para mí, sé que vivimos juntos, que salimos y fuimos tan felices... pero cuando intento recordar nuestra historia completa o por qué peleábamos en ese túnel, ¡hay un vacío! Como si alguien hubiera arrancado páginas de nuestra vida.»',
        context: 'El impacto del túnel no solo los transportó de dimensión; bloqueó los 7 momentos más sagrados que los unieron como pareja.',
        choices: [
          { label: '⚡ Escuchar la voz que resuena en el cielo del salón', next: 3 }
        ]
      },
      {
        tag: 'Escena 4 / 6: El Veredicto del Sistema (24 Horas)',
        avatar: '⏳',
        speaker: 'SISTEMA CENTRAL [RELOJ: 24:00:00]',
        text: '«ATENCIÓN, DUQUE Y PRINCESA. Han ingresado al Sistema de Recuerdos Olvidados. Tienen exactamente 24 HORAS para atravesar los 7 Mundos y reunir las 7 Estrellas. Cada estrella es un recuerdo que olvidaron. Si el reloj llega a cero, el vínculo quedará en el olvido.»',
        context: 'Un contador gigante de 24:00:00 comienza a descender segundo a segundo sobre el salón.',
        choices: [
          { label: '👸 Princesa: "¡¿24 horas?! ¡Mira el letrero del fondo: 21 de diciembre de 2025!"', next: 4 }
        ]
      },
      {
        tag: 'Escena 5 / 6: Reconociendo el Primer Mundo',
        avatar: '👸',
        speaker: 'LA PRINCESA (CON UN CHISPAZO DE ILUSIÓN)',
        text: '«¡Espera un momento! "21 de diciembre de 2025"... ¡Duque, mira ese perchero de allá! ¿No es el salón de nuestro grupo del trabajo en Navidad? ¡Cuando nos eligieron a los dos para ser José y María en el nacimiento!»',
        context: 'Aunque el recuerdo aún está incompleto, el corazón de ambos reconoce el lugar exacto donde el destino los juntó por primera vez.',
        choices: [
          { label: '👑 Duque: "¡Es verdad! Ahí empezó todo entre nosotros..."', next: 5 }
        ]
      },
      {
        tag: 'Escena 6 / 6: El Pacto del Duque y la Princesa',
        avatar: '👑',
        speaker: 'EL DUQUE (TOMANDO SU MANO CON FIRMEZA)',
        text: '«No me importa qué pelea tonta nos hizo caer en ese túnel, Princesa. No voy a dejar que este Sistema nos quite lo que vivimos. Vamos a ponernos esos trajes de José y María, armemos el pesebre con todos sus detalles y ganemos nuestra primera estrella.»',
        context: 'Misión del Mundo 1 activada: Vistan los trajes en el perchero, revivan el flashback del 21 de diciembre de 2025 y recreen el nacimiento del Niño Jesús.',
        choices: [
          { label: '✨ Comenzar a Jugar el Mundo 1 Juntos', next: -1 }
        ]
      }
    ];

    const prologueScriptWorld2 = [
      {
        tag: 'Mundo 2 — Escena 1 / 6: Del Portal a una Tarde Soleada',
        avatar: '👸',
        speaker: 'LA PRINCESA (PARPADEANDO CONFUNDIDA)',
        text: '«¿Duque?... Hace un segundo estábamos frente al pesebre de Navidad y al cruzar el portal aparecimos en este parque... Sigo sin entender cómo aquel túnel nos lleva de un recuerdo a otro, pero... ¡mira cómo estamos vestidos!»',
        context: 'La nieve desapareció. Ahora están rodeados de árboles dorados de atardecer, faroles románticos y el murmullo de una ciudad lejana.',
        choices: [
          { label: '👑 Duque: "¡Es el día que salimos a pasear para conocernos!"', next: 1 },
          { label: '👑 Duque: "¡Mira tu sonrisa! Es exactamente la de nuestra primera salida..."', next: 1 }
        ]
      },
      {
        tag: 'Mundo 2 — Escena 2 / 6: La Tarde tan Bonita',
        avatar: '👑',
        speaker: 'EL DUQUE (SONRIENDO AL RECORDAR)',
        text: '«¡Sí! ¿Te acuerdas de esta tarde? Salimos a pasear para conocernos mejor, caminamos hablando de mil cosas, nos reímos tanto que el tiempo se nos pasó volando... Estar contigo hacía que todo alrededor dejara de existir.»',
        context: 'El recuerdo de aquella conversación en la banca del parque y la primera foto en el mirador empieza a brillar a lo lejos.',
        choices: [
          { label: '👸 Princesa: "¡Fue una tarde mágica! No queríamos que terminara nunca..."', next: 2 },
          { label: '👸 Princesa: "Y justo por estar tan embobados platicando nos pasó algo..."', next: 2 }
        ]
      },
      {
        tag: 'Mundo 2 — Escena 3 / 6: El Silbato a lo Lejos',
        avatar: '👸',
        speaker: 'LA PRINCESA (DETENIÉNDOSE DE GOLPE)',
        text: '«¡Espera, Duque! ¿Escuchas esa campana y el silbato de locomotora a lo lejos?... ¡En ese paseo teníamos que regresar en tren a nuestra ciudad!»',
        context: 'El sonido de un silbato de locomotora y las campanadas de la torre de la estación interrumpen la calma del paseo.',
        choices: [
          { label: '👑 Duque: "¡¿Qué hora es?! ¡Mira el reloj de la estación!"', next: 3 },
          { label: '👸 Princesa: "¡Corre a ver la hora en la torre!"', next: 3 }
        ]
      },
      {
        tag: 'Mundo 2 — Escena 4 / 6: ¡El Tren de las 02:30 PM!',
        avatar: '👸',
        speaker: 'LA PRINCESA (CON LOS OJOS ABIERTOS DE SORPRESA)',
        text: '«¡¡SON LAS 02:25 PM!! ¡Duque, nos entretuvimos tanto pasando una tarde tan bonita que olvidamos por completo que nuestro tren de regreso a la ciudad sale exactamente a las 02:30 PM!»',
        context: 'En aquel recuerdo real, la magia de estar juntos les hizo olvidar el reloj hasta que faltaban apenas 5 minutos para perder el tren.',
        choices: [
          { label: '⏳ Escuchar la alerta del Sistema Central', next: 4 },
          { label: '👑 Duque: "¡Solo tenemos 5 minutos para cruzar todo el bulevar!"', next: 4 }
        ]
      },
      {
        tag: 'Mundo 2 — Escena 5 / 6: El Cronómetro de 5 Minutos y Obstáculos',
        avatar: '🚂',
        speaker: 'SISTEMA CENTRAL [CRONÓMETRO: 05:00]',
        text: '«SEGUNDO RECUERDO DETECTADO. El tren hacia su ciudad parte a las 02:30 PM. Tienen 5 MINUTOS en el cronómetro secundario para recoger los 3 recuerdos de su cita, sortear los 6 obstáculos móviles de la avenida (cada choque resta 20 minutos al reloj global) y llegar al andén.»',
        context: 'El bulevar hacia la estación está lleno de carritos de flores, pasajeros apurados, ciclistas, maleteros y músicos callejeros.',
        choices: [
          { label: '👑 Duque: "¡Dame la mano, Princesa! ¡Corramos juntos!"', next: 5 },
          { label: '👸 Princesa: "¡No me sueltes por nada del mundo, Duque!"', next: 5 }
        ]
      },
      {
        tag: 'Mundo 2 — Escena 6 / 6: Tomados de la Mano contra el Reloj',
        avatar: '👑',
        speaker: 'EL DUQUE (SUJETANDO SU MANO CON FUERZA)',
        text: '«No sueltes mi mano ni un segundo. Recojamos nuestros boletos de las 02:30 PM, la rosa que te di en la banca y nuestra foto del paseo, esquivemos todo y subamos a ese tren a tiempo. ¡Vamos!»',
        context: 'Tip de juego: Usa [Shift] o el botón "⚡ Correr de la Mano" para ir más rápido, esquiva los obstáculos móviles y llega al Andén 02:30 PM arriba a la derecha.',
        choices: [
          { label: '🚂 ¡Empezar la Carrera Romántica hacia el Tren!', next: -1 }
        ]
      }
    ];

    // =========================================================
    // BANTER CONVERSATIONS FOR WORLD 1 AND WORLD 2
    // =========================================================
    const banterWorld1 = [
      {
        speaker: 'LA PRINCESA',
        avatar: '👸',
        stepLabel: 'Conversando en el salón (1/4)',
        text: '«Todavía siento el vértigo de cuando caímos por el túnel... Qué loco pensar que hace unas horas estábamos discutiendo sin sentido, y ahora el destino nos regresa al día exacto en que nos fijamos el uno en el otro en el trabajo.»',
        replyLabel: '👑 Responder como el Duque',
        replySpeaker: 'EL DUQUE',
        replyAvatar: '👑',
        replyText: '«Tal vez necesitábamos caer en este túnel para frenar y recordar cómo empezó todo, Princesa. Ese 21 de diciembre de 2025 yo estaba nerviosísimo cuando nos nombraron juntos.»'
      },
      {
        speaker: 'EL DUQUE',
        avatar: '👑',
        stepLabel: 'Conversando en el salón (2/4)',
        text: '«¿Te acuerdas de la cara de todos en el grupo del trabajo cuando dijeron: "Que ellos dos hagan de José y María"? Parecía que todos habían planeado juntarnos menos nosotros.»',
        replyLabel: '👸 Responder como la Princesa',
        replySpeaker: 'LA PRINCESA',
        replyAvatar: '👸',
        replyText: '«¡Sí! Yo intentaba disimular mis nervios acomodándome el velo de María, pero por dentro me encantó que te eligieran a ti como José.»'
      },
      {
        speaker: 'LA PRINCESA',
        avatar: '👸',
        stepLabel: 'Conversando en el salón (3/4)',
        text: '«Mira el reloj del Sistema... Nos dieron 24 horas para juntar las 7 estrellas. Cada vez que tocamos algo de este pesebre siento que vuelven más recuerdos de cuando salíamos y vivíamos juntos.»',
        replyLabel: '👑 Responder como el Duque',
        replySpeaker: 'EL DUQUE',
        replyAvatar: '👑',
        replyText: '«Vamos a recuperar las 7 estrellas antes de la hora 24. Ningún sistema va a borrar lo linda pareja que fuimos y seguimos siendo.»'
      },
      {
        speaker: 'EL DUQUE',
        avatar: '👑',
        stepLabel: 'Conversando en el salón (4/4)',
        text: '«Fíjate en todos los detalles del nacimiento: la cuna con paja, el buey y la mula, la estrella luminosa y el Niño Jesús. Tiene que quedar igualito a como lo armamos aquel 21 de diciembre de 2025.»',
        replyLabel: '👸 Responder como la Princesa',
        replySpeaker: 'LA PRINCESA',
        replyAvatar: '👸',
        replyText: '«¡Exacto! Y cuando estén los 4 detalles en el altar, nos paramos juntos ahí para hacer nuestra interpretación y reclamar la primera estrella.»'
      }
    ];

    const banterWorld2 = [
      {
        speaker: 'LA PRINCESA',
        avatar: '👸',
        stepLabel: 'Corriendo hacia la Estación (1/3)',
        text: '«¡Jajaja, aún no entiendo cómo pasamos del túnel a esta tarde, pero me acuerdo perfecto de cómo corríamos muertos de risa y de nervios porque nos dejaba el tren de las 02:30 PM!»',
        replyLabel: '👑 Responder como el Duque',
        replySpeaker: 'EL DUQUE',
        replyAvatar: '👑',
        replyText: '«¡Es que quién se iba a acordar del reloj de las 02:30 PM teniéndote frente a mí toda la tarde! Tú sigue corriendo de mi mano, que a ese tren llegamos sí o sí.»'
      },
      {
        speaker: 'EL DUQUE',
        avatar: '👑',
        stepLabel: 'Corriendo hacia la Estación (2/3)',
        text: '«Cuidado con los carritos y la gente cruzando la avenida... Cada vez que te miro correr a mi lado siento que recupero un pedazo más de todo lo que vivimos antes de caer en aquel túnel.»',
        replyLabel: '👸 Responder como la Princesa',
        replySpeaker: 'LA PRINCESA',
        replyAvatar: '👸',
        replyText: '«Yo también, Duque... Aunque hayamos discutido antes del túnel, recordar lo bonito que fue conocernos en este paseo me hace sentir segura contigo.»'
      },
      {
        speaker: 'LA PRINCESA',
        avatar: '👸',
        stepLabel: 'Mirando el Reloj de las 02:30 PM (3/3)',
        text: '«¡Ya se escucha la locomotora en el andén! Apenas tengamos los 3 recuerdos de nuestra cita, subamos corriendo a la plataforma del tren.»',
        replyLabel: '👑 Responder como el Duque',
        replySpeaker: 'EL DUQUE',
        replyAvatar: '👑',
        replyText: '«No te preocupes mi princesa, jamás dejaría que algo malo te pasara. ¡Vamos directo al andén!»'
      }
    ];

    const prologueScriptWorld3 = [
      {
        tag: 'Mundo 3 — Escena 1 / 6: Bajando del Tren frente al Mar',
        avatar: '👸',
        speaker: 'LA PRINCESA (MIRANDO EL OCÉANO AL ATARDECER)',
        text: '«¿Duque?... El tren de las 02:30 PM se detuvo y las vías se transformaron en este puente de madera sobre las olas... ¡Mira ese muelle iluminado bajo el atardecer! ¿Recuerdas cuando vinimos a cenar sobre el mar?»',
        context: 'El sol cae lentamente sobre el océano tiñendo el espigón de madera de tonos ámbar, violeta y oro.',
        choices: [
          { label: '👑 Duque: "¡Sí! Y mira cómo me puso el Sistema: ¡de terno negro!"', next: 1 },
          { label: '👑 Duque: "¡Cómo olvidar el sonido de las olas debajo de nuestra mesa!"', next: 1 }
        ]
      },
      {
        tag: 'Mundo 3 — Escena 2 / 6: Terno Negro y Ropa Cómoda',
        avatar: '👑',
        speaker: 'EL DUQUE (ACOMODÁNDOSE LA CORBATA DE SU TERNO NEGRO)',
        text: '«¡Jajaja, no lo puedo creer! Yo de terno negro super formal para impresionarte en esta cita frente al mar, y tú tan hermosa y auténtica con tu ropa cómoda favorita. Aunque sigamos confundidos por cómo caímos en ese túnel, este atardecer contigo jamás se me podría borrar del corazón.»',
        context: 'El contraste entre el terno negro elegante del Duque y el estilo relajado y cómodo de la Princesa hace que ambos sonrían con complicidad.',
        choices: [
          { label: '👸 Princesa: "¡Así me sentía más libre para disfrutar nuestro paseo frente al mar!"', next: 2 },
          { label: '👸 Princesa: "¡Te veías guapísimo de terno negro aunque yo fuera súper cómoda!"', next: 2 }
        ]
      },
      {
        tag: 'Mundo 3 — Escena 3 / 6: La Confusión del Túnel y la Brisa',
        avatar: '👸',
        speaker: 'LA PRINCESA (APOYÁNDOSE EN LA BARANDA DEL MUELLE)',
        text: '«Es curioso, Duque... Antes de caer en aquel túnel sentía que estábamos tan lejos el uno del otro por esa discusión, y ahora cada vez que el Sistema reconstruye un escenario siento que vuelvo a enamorarme de cada detalle que vivimos.»',
        context: 'Las farolas victorianas del puente se encienden una por una mientras las olas rompen contra los pilares de madera.',
        choices: [
          { label: '👑 Duque: "Porque lo que construimos juntos es mucho más fuerte que una pelea..."', next: 3 },
          { label: '👑 Duque: "Ven, abrázame un segundo antes de cruzar el espigón."', next: 3 }
        ]
      },
      {
        tag: 'Mundo 3 — Escena 4 / 6: El Recuerdo del Postre',
        avatar: '👑',
        speaker: 'EL DUQUE (SEÑALANDO EL SALÓN SOBRE LAS OLAS)',
        text: '«Allá al fondo está nuestra mesa junto al ventanal del océano. ¿Te acuerdas que al final de esa velada el maître nos trajo la carta de postres y elegimos uno muy especial para cerrar la cita?»',
        context: 'El aroma del mar se mezcla con el recuerdo de los cinco postres clásicos de aquella carta dorada.',
        choices: [
          { label: '👸 Princesa: "¡Claro que me acuerdo! Fue nuestro favorito indiscutible..."', next: 4 },
          { label: '⚡ Escuchar las reglas del Sistema Central para este Mundo 3', next: 4 }
        ]
      },
      {
        tag: 'Mundo 3 — Escena 5 / 6: Los Obstáculos del Espigón y la Carta',
        avatar: '🌊',
        speaker: 'SISTEMA CENTRAL [TERCER RECUERDO: CITA SOBRE EL MAR]',
        text: '«MUNDO 3 ACTIVADO. Para desbloquear la tercera estrella deben cruzar el puente del espigón hacia su mesa frente al mar, recoger los 2 detalles de su velada, esquivar las brisas de las olas, las gaviotas traviesas y los mozos con bandejas, y recordar exactamente QUÉ POSTRE eligieron.»',
        context: 'Entre las opciones de la carta están: Torta de chocolate, Crema volteada, Helado de lúcuma, Pie de limón y Suspiro limeño.',
        choices: [
          { label: '👸 Princesa: "¡Recojamos el farol y la vela de nuestra reserva!"', next: 5 },
          { label: '👑 Duque: "¡Yo te cubro de la brisa con mi terno negro!"', next: 5 }
        ]
      },
      {
        tag: 'Mundo 3 — Escena 6 / 6: Caminando Juntos hacia el Mirador',
        avatar: '👑',
        speaker: 'EL DUQUE (OFRECIÉNDOLE EL BRAZO CON ELEGANCIA)',
        text: '«Toma mi brazo, mi Princesa. Crucemos este muelle sobre las olas, elijamos nuestro postre frente al atardecer y ganemos juntos nuestra tercera estrella.»',
        context: 'Recoge los 2 recuerdos brillantes en el espigón y luego interactúa con la Mesa Frente al Mar a la derecha.',
        choices: [
          { label: '🌊 ¡Comenzar a Jugar el Mundo 3 Frente al Mar!', next: -1 }
        ]
      }
    ];

    const banterWorld3 = [
      {
        speaker: 'LA PRINCESA',
        avatar: '👸',
        stepLabel: 'Caminando por el Espigón de Miraflores (1/3)',
        text: '«Todavía me da ternura verte tan elegante de terno negro mientras yo vine con mi ropa cómoda... Lo mejor de todo es que cuando estamos juntos no importa la etiqueta, solo las ganas de reírnos frente al mar.»',
        replyLabel: '👑 Responder como el Duque',
        replySpeaker: 'EL DUQUE (DE TERNO NEGRO)',
        replyAvatar: '🤵',
        replyText: '«Para mí tú siempre eres la Princesa más hermosa del mundo, vengas de gala o con tu ropa más cómoda. Ven, cuidado con las olas que rompen en la baranda del muelle.»'
      },
      {
        speaker: 'EL DUQUE (DE TERNO NEGRO)',
        avatar: '🤵',
        stepLabel: 'Mirando el Atardecer en La Rosa Náutica (2/3)',
        text: '«Mira cómo brillan los faroles victorianos del puente sobre el mar de Miraflores... Poco a poco empiezo a entender por qué el Sistema nos trajo aquí después de caer en aquel túnel: quería que recordáramos cada lugar donde fuimos inmensamente felices.»',
        replyLabel: '👸 Responder como la Princesa',
        replySpeaker: 'LA PRINCESA',
        replyAvatar: '👸',
        replyText: '«Y cada estrella nos devuelve esa paz. ¿Ya te acordaste cuál de los cinco postres de la carta pedimos al final de la cena?»'
      },
      {
        speaker: 'LA PRINCESA',
        avatar: '👸',
        stepLabel: 'Frente a la Mesa del Mirador (3/3)',
        text: '«En la carta hay Torta de chocolate, Crema volteada, Helado de lúcuma, Pie de limón y Suspiro limeño... ¡Pero yo sé perfectamente cuál fue nuestro favorito!»',
        replyLabel: '👑 Responder como el Duque',
        replySpeaker: 'EL DUQUE (DE TERNO NEGRO)',
        replyAvatar: '🤵',
        replyText: '«¡El Helado de lúcuma! Recojamos la reserva y la vela del mirador y vayamos a nuestra mesa frente al mar para pedirlo.»'
      }
    ];

    const prologueScriptWorld4 = [
      {
        tag: 'Mundo 4 — Escena 1 / 6: El Salón de la Gran Puerta',
        avatar: '👑',
        speaker: 'EL DUQUE (CAMINANDO JUNTO A LA PRINCESA)',
        text: '«El bramido del mar se apagó y ahora estamos en este salón de piedra frente a una puerta gigantesca con 21 cerrojos de luz... Mira el reloj del Sistema arriba: sigue descontando exactamente desde el tiempo que nos quedó en el nivel anterior.»',
        context: 'El contador de 24 horas conserva el saldo acumulado sin reiniciarse jamás entre mundos.',
        choices: [
          { label: '👸 Princesa: "¡Y mira quién está sentado detrás de esa mesa en el centro!"', next: 1 },
          { label: '👸 Princesa: "Hay 21 cartas doradas brillando sobre el terciopelo..."', next: 1 }
        ]
      },
      {
        tag: 'Mundo 4 — Escena 2 / 6: El Guardián del Umbral',
        avatar: '👸',
        speaker: 'LA PRINCESA (OBSERVANDO LAS CARTAS CON CURIOSIDAD)',
        text: '«Cada una de esas 21 cartas parece guardar un pedacito de todo lo que vivimos desde que nos conocimos... Pero ¿por qué ese Guardián nos mira con tanta seriedad?»',
        context: 'Las antorchas púrpuras del salón parpadean cuando el Guardián levanta la mano y hace resonar su voz.',
        choices: [
          { label: '👁️ Escuchar la voz misteriosa y grave del Guardián', next: 2 },
          { label: '👑 Duque: "Demos un paso al frente juntos, Princesa."', next: 2 }
        ]
      },
      {
        tag: 'Mundo 4 — Escena 3 / 6: El Hechizo de Silencio sobre el Duque',
        avatar: '👁️',
        speaker: 'EL GUARDIÁN DE LA PUERTA (VOZ PROFUNDA Y MISTERIOSA)',
        text: '«Deténganse, viajeros del túnel. Esta puerta conduce al quinto recuerdo, donde empezarán a comprender por qué discutieron antes de caer aquí. Sobre mi mesa reposan 21 CARTAS: cada carta es una prueba de su historia. Pero en este mundo... EL DUQUE NO PODRÁ HABLAR NI RESPONDER.»',
        context: 'Un sello de luz azul rodea al Duque al instante, impidiéndole pronunciar palabra o soplar las respuestas.',
        choices: [
          { label: '👑 Duque: "¡¿Qué?! ¡¿Por qué me silencian a mí en este nivel?!"', next: 3 },
          { label: '👸 Princesa: "¡¿Quieres decir que tendré que responder las 21 cartas yo sola?!"', next: 3 }
        ]
      },
      {
        tag: 'Mundo 4 — Escena 4 / 6: El Giro — La Prueba de la Princesa',
        avatar: '👁️',
        speaker: 'EL GUARDIÁN DE LA PUERTA (MIRANDO FIJAMENTE A LA PRINCESA)',
        text: '«Tú, Duque, ya demostraste tu entrega en los mundos anteriores. Ahora es LA PRINCESA quien deberá demostrar bajo presión que guarda cada fecha, cada rincón y cada secreto en su corazón. Por cada carta incorrecta, restaré 30 MINUTOS al reloj general de las 24 horas que les quedan.»',
        context: 'Regla del Nivel 4: La Princesa debe acertar las 21 cartas (con 4 opciones tramposas cada una). Cada error descuenta -00:30:00 del reloj global.',
        choices: [
          { label: '👸 Princesa: "¡Acepto el desafío! No he olvidado nada de lo nuestro."', next: 4 },
          { label: '👑 Duque (en silencio): "(Le aprieta la mano dándole toda su confianza)"', next: 4 }
        ]
      },
      {
        tag: 'Mundo 4 — Escena 5 / 6: Miradas que Hablan sin Palabras',
        avatar: '👸',
        speaker: 'LA PRINCESA (MIRANDO AL DUQUE A LOS OJOS)',
        text: '«Tranquilo, mi Duque... Aunque el Guardián te haya puesto ese sello de silencio y el reloj suene rápido para ponerme nerviosa, me basta con tenerte a mi lado para acordarme de cada cita, cada desayuno y cada sueño que tenemos.»',
        context: 'El Duque asiente sonriendo en silencio (🤐) y señala la mesa central donde la primera carta ya empieza a levitar.',
        choices: [
          { label: '👸 Princesa: "¡Vamos directo a la mesa del Guardián!"', next: 5 }
        ]
      },
      {
        tag: 'Mundo 4 — Escena 6 / 6: Frente a las 21 Cartas',
        avatar: '👁️',
        speaker: 'EL GUARDIÁN DE LA PUERTA (VOLTEANDO EL MAZO DORADO)',
        text: '«Que comience el juicio de la memoria, Princesa. Camina hacia mi mesa en el centro del salón; apenas llegues frente a mí, la Carta #1 se revelará ante tus ojos.»',
        context: 'La Princesa caminará automáticamente hacia la mesa central y se abrirá la primera pregunta con sonido de tensión.',
        choices: [
          { label: '🃏 Caminar a la Mesa Central y Revelar la Carta 1 / 21', next: -1 }
        ]
      }
    ];

    const banterWorld4 = [
      {
        speaker: 'LA PRINCESA (LÍDER EN ESTE NIVEL)',
        avatar: '👸',
        stepLabel: 'Frente a la Mesa del Guardián (1/2)',
        text: '«El Guardián te puso un hechizo de silencio para que yo responda sola las 21 cartas, pero basta con ver cómo me miras para acordarme de cada salida por Miraflores, San Miguel y toda Lima.»',
        replyLabel: '👑 Ver gesto cómplice del Duque',
        replySpeaker: 'EL DUQUE (EN SILENCIO, SONRIENDO)',
        replyAvatar: '👑',
        replyText: '«(El Duque te aprieta la mano con ternura y señala las 21 cartas doradas sobre la mesa, confiando plenamente en tu memoria.)»'
      },
      {
        speaker: 'EL GUARDIÁN DE LA PUERTA',
        avatar: '👁️',
        stepLabel: 'Advertencia del Umbral (2/2)',
        text: '«El reloj de 24 horas no se detiene, Princesa. Acércate a mi mesa y supera las 21 cartas si desean cruzar hacia el quinto mundo.»',
        replyLabel: '👸 Responder al Guardián',
        replySpeaker: 'LA PRINCESA',
        replyAvatar: '👸',
        replyText: '«No perderemos ni un minuto más. ¡Vamos a voltear las 21 cartas!»'
      }
    ];

    // LAS 21 CARTAS DE "NUESTRA HISTORIA EN UNA CARTA" (Mezcladas en 3 Actos Emocionales con distractores reales de Lima, Perú)
    const cardsDeckWorld4 = [
      // ACTO I: EL ORIGEN, LAS FECHAS SAGRADAS Y LOS PRIMEROS PASOS (Cartas 1 a 7 — 4 alternativas tramposas por carta)
      {
        num: 1,
        act: 'Acto I: El Origen de Nuestro Destino (Bajo Presión)',
        category: '📜 Carta I • El Inicio de Todo',
        q: 'Una noche la princesa decidió quedarse... Y entonces empezó su historia... ¿Quién se acercó primero?',
        options: ['La Princesa dio el primer paso', 'El Duque', 'Los dos al mismo tiempo por casualidad', 'Ninguno, los presentaron en la mesa'],
        correct: 1,
        note: '👑 ¡El Duque! Aunque el tic-tac apure tus latidos, recuerdas perfectamente quién se acercó primero aquella noche.'
      },
      {
        num: 2,
        act: 'Acto I: El Origen de Nuestro Destino (Bajo Presión)',
        category: '📅 Carta II • Nuestro Día Sagrado',
        q: 'Nuestra fecha de aniversario...',
        options: ['22 de Diciembre', '21 de Diciembre', '19 de Diciembre', '24 de Diciembre'],
        correct: 1,
        note: '🎄 ¡21 de Diciembre! Cuidado con las fechas parecidas que pone el Guardián para confundirte.'
      },
      {
        num: 3,
        act: 'Acto I: El Origen de Nuestro Destino (Bajo Presión)',
        category: '🥐 Carta III • Miraflores, Lima',
        q: 'En su primer desayuno juntos, en aquella "ocasión especial" ¿Cuál era el nombre del lugar?',
        options: ['La Tiendecita Blanca', 'La Bodega de la Trattoria (Miraflores)', 'Pastelería San Antonio (Miraflores)', 'El Pan de la Chola (Miraflores)'],
        correct: 0,
        note: '☕ ¡La Tiendecita Blanca en Miraflores! Su primer desayuno juntos en aquella ocasión especial.'
      },
      {
        num: 4,
        act: 'Acto I: El Origen de Nuestro Destino (Bajo Presión)',
        category: '👑 Carta IV • Celebración Real',
        q: '¿Cuándo es el cumpleaños de la princesa?',
        options: ['21 de julio', '22 de junio', '22 de julio', '23 de julio'],
        correct: 2,
        note: '🎂 ¡22 de julio! Ni el sonido del reloj pudo hacerte dudar de tu propio día.'
      },
      {
        num: 5,
        act: 'Acto I: El Origen de Nuestro Destino (Bajo Presión)',
        category: '⭐ Carta V • El Secreto del Sistema',
        q: '¿Por qué son 7 estrellas las que deben reunir en este mundo?',
        options: ['Por el día 7 de su primer mes saliendo', 'Su mes de cumpleaños 22/07', 'Por las 7 promesas que hicieron en Lima', 'Por los 7 meses antes de viajar'],
        correct: 1,
        note: '🌟 ¡Su mes de cumpleaños 22/07! El número 7 de julio dio origen a las 7 estrellas.'
      },
      {
        num: 6,
        act: 'Acto I: El Origen de Nuestro Destino (Bajo Presión)',
        category: '🤺 Carta VI • Celebración del Duque',
        q: '¿Cuándo es el cumpleaños del Duque?',
        options: ['21 de abril', '22 de marzo', '22 de abril', '24 de abril'],
        correct: 2,
        note: '🎉 ¡22 de abril! Ambos comparten el número 22 en su fecha de nacimiento.'
      },
      {
        num: 7,
        act: 'Acto I: El Origen de Nuestro Destino (Bajo Presión)',
        category: '💋 Carta VII • Cafetería e Ilusión',
        q: '«En una cafetería pude besarte de verdad por primera vez sin nada que temer y muchos sentimientos en que creer...»',
        options: ['Cafetería Paku Paku', 'Cafetería Puku Puku', 'Cafetería Puku Paku (Miraflores)', 'Tostaduría Puku Café'],
        correct: 1,
        note: '☕💋 ¡Cafetería Puku Puku! Esquivaste la trampa de "Paku Paku" bajo la presión del reloj.'
      },

      // ACTO II: NUESTRAS CITAS, SABORES Y LUGARES EN LIMA (Cartas 8 a 14 — 4 alternativas tramposas por carta)
      {
        num: 8,
        act: 'Acto II: Citas y Rincones en Lima (El Ritmo Acelera)',
        category: '💖 Carta VIII • Fecha Inolvidable',
        q: 'Nuestro primer beso fue...',
        options: ['18 de agosto del 2026', '19 de julio del 2026', '19 de agosto del 2026', '29 de agosto del 2026'],
        correct: 2,
        note: '✨ ¡19 de agosto del 2026! Una fecha exacta que ningún tic-tac puede borrar.'
      },
      {
        num: 9,
        act: 'Acto II: Citas y Rincones en Lima (El Ritmo Acelera)',
        category: '🥞 Carta IX • Av. Angamos, Lima',
        q: 'Un desayuno para la princesa en un lugar de Panqueques y miel...',
        options: ['Mõ Café ☕', 'Mía Café (Av. Angamos)', 'María Almenara (Av. Angamos)', 'Armónica Café (Miraflores)'],
        correct: 0,
        note: '🥞☕ ¡Mõ Café! El rincón de panqueques y miel para engreír a la Princesa.'
      },
      {
        num: 10,
        act: 'Acto II: Citas y Rincones en Lima (El Ritmo Acelera)',
        category: '🦆 Carta X • Un Misterio Gastronómico',
        q: 'No era ganso, tampoco un pez del mar, pero ese lugar tenía un ritual...',
        options: ['El ritual del pato imperial', 'El ritual del pato', 'El corte del pato pekinés', 'La ceremonia del pato dorado'],
        correct: 1,
        note: '🦆 ¡El ritual del pato! Exacto y sin caer en las variantes parecidas.'
      },
      {
        num: 11,
        act: 'Acto II: Citas y Rincones en Lima (El Ritmo Acelera)',
        category: '🥢 Carta XI • El Lugar del Ritual',
        q: 'Y de ese ritual... Solo lo vieron en un solo lugar... ¿Cuál será?',
        options: ['Restaurante Madam Tusan', 'Restaurante Chifa Titi', 'Restaurante Song', 'Restaurante Hou Wha'],
        correct: 2,
        note: '🏮 ¡Restaurante Song! El único lugar de Lima donde presenciaron ese ritual juntos.'
      },
      {
        num: 12,
        act: 'Acto II: Citas y Rincones en Lima (El Ritmo Acelera)',
        category: '🍜 Carta XII • Tradición Japonesa',
        q: 'La frase "Arigato Gozaimasu" del japonés al español... Tiene un plato delicioso que se volvió habitual...',
        options: ['Shoyu Ramen + Acevichado Maki', 'Soyu Ramen + Makis Furai', 'Tonkotsu Ramen + Makis Furai', 'Miso Ramen + Ebi Furai'],
        correct: 1,
        note: '🍜🍣 ¡Soyu Ramen + Makis Furai! La combinación exacta que se volvió su favorita.'
      },
      {
        num: 13,
        act: 'Acto II: Citas y Rincones en Lima (El Ritmo Acelera)',
        category: '💎 Carta XIII • Una Cita de Lujo',
        q: 'Fueron a un lugar PRIME... ¿Cuándo fue?',
        options: ['29 de Julio', '30 de Julio', '31 de Julio', '1 de Agosto'],
        correct: 2,
        note: '🥂 ¡El 31 de Julio! Justo en el cierre de julio en aquel lugar PRIME.'
      },
      {
        num: 14,
        act: 'Acto II: Citas y Rincones en Lima (El Ritmo Acelera)',
        category: '🎡 Carta XIV • Feria y Juegos',
        q: 'En aquel día pasamos por una feria y compramos un juego de cartas... ¿Dónde fue?',
        options: ['Jockey Plaza (Surco)', 'Real Plaza Salaverry (Jesús María)', 'Plaza San Miguel', 'Larcomar (Miraflores)'],
        correct: 2,
        note: '🃏🎡 ¡Plaza San Miguel! Donde compraron aquel juego de cartas pasando por la feria.'
      },

      // ACTO III: CONFIDENCIAS, SECRETOS Y EL FUTURO JUNTOS (Cartas 15 a 21 — Máxima Presión)
      {
        num: 15,
        act: 'Acto III: Confidencias y Futuro (Máxima Presión del Reloj)',
        category: '🎬 Carta XV • Tarde de Cine',
        q: '¿Cómo se llamaba la película que fueron a disfrutar juntos?',
        options: ['Spiderman: Un nuevo comienzo', 'Spiderman: Un nuevo día', 'Spiderman: Sin camino a casa', 'Spiderman: Lejos de casa'],
        correct: 1,
        note: '🕷️🍿 ¡Spiderman: Un nuevo día! No caíste en los títulos parecidos.'
      },
      {
        num: 16,
        act: 'Acto III: Confidencias y Futuro (Máxima Presión del Reloj)',
        category: '🎮 Carta XVI • Pasión Gamer',
        q: 'Un juego favorito de la princesa...',
        options: ['Valorant', 'League of Legends', 'Dota 2', 'Teamfight Tactics'],
        correct: 1,
        note: '⚔️✨ ¡League of Legends! Tu favorito indiscutible.'
      },
      {
        num: 17,
        act: 'Acto III: Confidencias y Futuro (Máxima Presión del Reloj)',
        category: '⏳ Carta XVII • Viajero del Tiempo',
        q: 'El mejor personaje de ficción del Duque...',
        options: ['Doctor Strange', 'Doctor Who', 'Sherlock Holmes', 'Marty McFly'],
        correct: 1,
        note: '🛸⏱️ ¡Doctor Who! El viajero del tiempo favorito del Duque.'
      },
      {
        num: 18,
        act: 'Acto III: Confidencias y Futuro (Máxima Presión del Reloj)',
        category: '😱 Carta XVIII • Punto Débil Real',
        q: '¿El mayor miedo del Duque?',
        options: ['Los insectos voladores', 'Las serpientes', 'Los roedores 🐁', 'Los lugares cerrados'],
        correct: 2,
        note: '🐁😂 ¡Los roedores! El único temor capaz de hacer saltar al Duque.'
      },
      {
        num: 19,
        act: 'Acto III: Confidencias y Futuro (Máxima Presión del Reloj)',
        category: '💓 Carta XIX • Susurro al Oído',
        q: '¿Cuál es la frase favorita del Duque para la Princesa?',
        options: ['«😮‍💨 Qué linda te ves hoy...»', '«😮‍💨 Qué rico hueles...»', '«😮‍💨 Cómo me encantas, Princesa...»', '«😮‍💨 Qué bien hueles siempre...»'],
        correct: 1,
        note: '😮‍💨💞 ¡«😮‍💨 Qué rico hueles...»! Exacta palabra por palabra.'
      },
      {
        num: 20,
        act: 'Acto III: Confidencias y Futuro (Máxima Presión del Reloj)',
        category: '👶 Carta XX • Sueños del Mañana (I)',
        q: '«Si un día tenemos un niño se llamará...»',
        options: ['Little Boy', 'Big Boy', 'Golden Boy', 'Star Boy'],
        correct: 1,
        note: '👶💙 ¡Big Boy! Queda solo una carta para romper el sello de la Gran Puerta.'
      },
      {
        num: 21,
        act: 'Acto III: Confidencias y Futuro (Máxima Presión del Reloj)',
        category: '👧 Carta XXI • El Último Sello de la Puerta',
        q: '«Si un día tenemos una niña se llamará...»',
        options: ['Shimaya', 'Shiomara', 'Samaya', 'Soraya'],
        correct: 0,
        note: '👧💖 ¡Shimaya! ¡Superaste las 21 cartas bajo presión y la Gran Puerta se abre hacia el Mundo 5!'
      }
    ];

    const prologueScriptWorld5 = [
      {
        tag: 'Mundo 5 — Escena 1 / 6: Llegada a La Casa de los Faroles',
        avatar: '👸',
        speaker: 'LA PRINCESA (MIRANDO LOS FAROLES ROJOS EN LA ENTRADA)',
        text: '«¿Duque, ves esos faroles japoneses y el cartel de madera?... Siento que a este lugar ya hemos venido. Lo recuerdo mucho más después de todas esas preguntas que tuvimos que responder en el nivel anterior... ¡Es aquel lugar de nuestra primera cena japonesa!»',
        context: 'El aroma a caldo caliente, jengibre y ajonjolí tostado envuelve la entrada de La Casa de los Faroles.',
        choices: [
          { label: '👑 Duque: "¡Por fin puedo volver a hablar! ¡Sí, es nuestro rincón japonés!"', next: 1 },
          { label: '👑 Duque: "¡Aquí fue donde nos despidieron gritando Arigato Gozaimasu!"', next: 1 }
        ]
      },
      {
        tag: 'Mundo 5 — Escena 2 / 6: La Alegría de Volver a Escucharse',
        avatar: '👑',
        speaker: 'EL DUQUE (ABRAZANDO A LA PRINCESA BAJO LOS FAROLES)',
        text: '«¡No sabes qué desesperación fue estar mudo en el salón anterior viendo cómo el Guardián te presionaba con el reloj! Estuviste increíble respondiendo las 21 cartas, mi Princesa. Y mira qué calidez hay aquí adentro con todas las mesas llenas.»',
        context: 'A través de las cortinas rojas Noren se ven varias mesas con comensales riendo y cenando tazones humeantes.',
        choices: [
          { label: '👸 Princesa: "Y en este nivel sigo llevando el mando yo, ¿verdad?"', next: 2 },
          { label: '👸 Princesa: "¡Mira quién nos espera en la puerta antes de pasar a la mesa!"', next: 2 }
        ]
      },
      {
        tag: 'Mundo 5 — Escena 3 / 6: El Guardián de la Entrada y el Sistema',
        avatar: '🏮',
        speaker: 'SISTEMA CENTRAL & GUARDIÁN DE LOS FAROLES',
        text: '«Bienvenidos, sus realezas, a este nivel: el Mundo 5 — La Casa de los Faroles. Antes de dejarlos pasar, aquí ustedes tendrán que apoyarse el uno al otro y recordar juntos su primer platillo en aquella noche de comida japonesa.»',
        context: 'En la entrada del restaurante, el Guardián de los Faroles les presenta el reto: "El Pedido de Aquella Noche".',
        choices: [
          { label: '👸 Princesa: "¿En qué consiste el desafío de las 4 cartas del menú?"', next: 3 },
          { label: '👑 Duque: "¡Pregúntanos lo que quieras de aquella primera cena!"', next: 3 }
        ]
      },
      {
        tag: 'Mundo 5 — Escena 4 / 6: La Regla de las 2 Horas por Error',
        avatar: '🏮',
        speaker: 'GUARDIÁN DE LA ENTRADA (ADVERTENCIA DEL RELOJ DE 24 HORAS)',
        text: '«En su mesa encontrarán 4 CARTAS DE MENÚ independientes: 1. Makis, 2. Ramens, 3. Bebidas y 4. Postres. Su reloj global continúa con el tiempo que han logrado conservar de los niveles anteriores, y CADA RESPUESTA INCORRECTA DESCONTARÁ 2 HORAS COMPLETAS (-02:00:00) que no se recuperarán jamás.»',
        context: 'Por ejemplo, si llegan con 18 horas y se equivocan en dos categorías, terminarán el desafío con 14 horas.',
        choices: [
          { label: '👸 Princesa: "¡¿Dos horas menos por error?! ¡Tendremos muchísimo cuidado!"', next: 4 },
          { label: '👑 Duque: "¿Y cómo podemos apoyarnos para no fallar ninguna carta?"', next: 4 }
        ]
      },
      {
        tag: 'Mundo 5 — Escena 5 / 6: Las Habilidades de Complicidad',
        avatar: '👑',
        speaker: 'EL DUQUE (SONRIENDO CON COMPLICIDAD)',
        text: '«Aquí ya no estoy silenciado, Princesa. En cada una de las 4 cartas podremos usar tu habilidad de RECUERDO para revivir las pistas de esa noche o mi habilidad de INVENTIVA para descartar opciones tramposas, sobre todo si alguna carta tiene trampa.»',
        context: 'La cuarta carta (Postres) guarda una pregunta engañosa donde sus habilidades serán clave para no perder 2 horas.',
        choices: [
          { label: '👸 Princesa: "¡Somos un equipo! Vamos hacia nuestra mesa bajo los faroles."', next: 5 }
        ]
      },
      {
        tag: 'Mundo 5 — Escena 6 / 6: Entrando al Salón de los Faroles',
        avatar: '👸',
        speaker: 'LA PRINCESA (TOMANDO LA MANO DEL DUQUE)',
        text: '«Pasemos entre las mesas del restaurante hasta la nuestra, Duque. Vamos a reconstruir el pedido exacto de aquella primera visita y ganar nuestra quinta estrella: la Estrella de la Complicidad.»',
        context: 'Al cerrarse esta ventana, la Princesa y el Duque avanzarán hacia su mesa y se abrirá la Primera Carta (Makis).',
        choices: [
          { label: '🏮 Entrar al Salón y Reconstruir el Pedido de Aquella Noche', next: -1 }
        ]
      }
    ];

    const banterWorld5 = [
      {
        speaker: 'LA PRINCESA',
        avatar: '👸',
        stepLabel: 'Bajo los Faroles Cálidos (1/2)',
        text: '«Qué lindo se siente que aquí ya puedas hablar conmigo de nuevo, Duque. Mira las otras mesas disfrutando su ramen... ¿Te acuerdas de la emoción que teníamos la primera vez que vinimos a este lugar?»',
        replyLabel: '👑 Responder como el Duque',
        replySpeaker: 'EL DUQUE',
        replyAvatar: '👑',
        replyText: '«¡Cómo olvidarlo! Me acuerdo perfecto de cómo los cocineros saludaron en japonés desde la barra cuando entramos y tú te quedaste mirando toda la carta con una sonrisa.»'
      },
      {
        speaker: 'EL DUQUE',
        avatar: '👑',
        stepLabel: 'Preparando las Habilidades (2/2)',
        text: '«Recuerda que cada error aquí nos cuesta 2 horas del reloj general. Si dudas en alguna de las 4 cartas del menú, usa tu habilidad de Recuerdo o pídeme que use mi Inventiva.»',
        replyLabel: '👸 Responder como la Princesa',
        replySpeaker: 'LA PRINCESA',
        replyAvatar: '👸',
        replyText: '«¡Hecho! Vamos a nuestra mesa a reconstruir el pedido de aquella noche.»'
      }
    ];

    // LAS 4 CARTAS GASTRONÓMICAS DE "LA CASA DE LOS FAROLES"
    const menuCardsWorld5 = [
      {
        step: 0,
        badge: '🍣 PRIMERA CARTA (1 / 4) — CATEGORÍA: MAKIS',
        categoryShort: '1. Makis',
        title: 'PRIMERA CARTA — MAKIS: ¿Qué variedad de makis pidieron en aquella primera visita?',
        prompt: '👸 La Princesa mira la lista de variedades del restaurante: «Había tantas opciones ricas en la carta... Duque, ¿recuerdas cuál fue el que elegimos para compartir aquella noche?»',
        options: [
          'California Maki (Kanikama, palta y ajonjolí)',
          'Acevichado Maki (Pescado empanizado y salsa acevichada)',
          'Makis Furai (Empanizados crocantes al panko con queso crema y palta)',
          'Kuroi Maki (Arroz especial y langostino al panko)',
          'Inka Maki (Lámina dorada y salsa dulce tare)',
          'Avocado Maki (Cubierto en palta cremosa y ajonjolí)'
        ],
        correct: 2,
        selectedLabel: 'Makis Furai',
        recuerdoClue: '✨ Habilidad RECUERDO (Princesa): «¡Cierro los ojos y recuerdo que llegaron súper calentitos y crocantes por fuera, empanizados al panko! Siempre han sido nuestros favoritos.»',
        inventivaClue: '💡 Habilidad INVENTIVA (Duque): El Duque observa la barra japonesa y descarta los rolls fríos: «No fue ni California, ni Kuroi, ni Inka... ¡Tiene que ser el empanizado crocante: Makis Furai!»',
        successNote: '🍣 ¡Exacto: MAKIS FURAI! Crocantes, doraditos y el inicio perfecto de aquella primera visita.'
      },
      {
        step: 1,
        badge: '🍜 SEGUNDA CARTA (2 / 4) — CATEGORÍA: RAMENS',
        categoryShort: '2. Ramen',
        title: 'SEGUNDA CARTA — RAMENS: ¿Cuál de los diferentes tipos de ramen pidieron aquella vez?',
        prompt: '👑 El Duque sonríe sintiendo el aroma del caldo humeante: «Aquí viene el plato principal de aquella noche... ¿Cuál fue el ramen que pedimos?»',
        options: [
          'Tonkotsu Ramen (Caldo concentrado de cerdo cocinado a fuego lento)',
          'Miso Ramen (Base de pasta de soya fermentada y verduras)',
          'Shoyu Ramen (Caldo tradicional a base de sillao japonés, chashu y ajitama)',
          'Tan Tan Ramen (Caldo especiado con pasta de ajonjolí)',
          'Shio Ramen (Caldo claro a la sal marina y bambú)',
          'Yasai Ramen (Caldo de vegetales con hongos shiitake)'
        ],
        correct: 2,
        selectedLabel: 'Shoyu Ramen',
        recuerdoClue: '✨ Habilidad RECUERDO (Princesa): «¡Acuérdate de la pregunta del nivel anterior! Nuestro clásico infaltable junto a los Makis Furai siempre ha sido el de caldo tradicional de sillao japonés: ¡Shoyu Ramen!»',
        inventivaClue: '💡 Habilidad INVENTIVA (Duque): El Duque señala el cucharón de madera y descarta las variedades picantes y de miso: «Nada de Tan Tan ni Miso aquella primera vez; pedimos el clásico: ¡Shoyu Ramen!»',
        successNote: '🍜 ¡Correcto: SHOYU RAMEN! El humeante tazón que se volvió tradición de ustedes dos.'
      },
      {
        step: 2,
        badge: '🍹 TERCERA CARTA (3 / 4) — CATEGORÍA: BEBIDAS',
        categoryShort: '3. Bebida',
        title: 'TERCERA CARTA — BEBIDAS: ¿Qué bebida eligieron para acompañar su pedido aquella noche?',
        prompt: '👸 La Princesa abre la tercera carta del menú: «Entre los diferentes Frozen, gaseosas y otras alternativas... ¿qué tomamos esa primera vez?»',
        options: [
          'Limonada Frozen con hierbaluisa',
          'Chicha Morada artesanal de la casa',
          'Maracuyá Frozen',
          'Fresa Frozen al hielo frappé',
          'Gaseosa tradicional bien helada',
          'Té Verde Helado (Ocha japonés)'
        ],
        correct: 2,
        selectedLabel: 'Maracuyá Frozen',
        recuerdoClue: '✨ Habilidad RECUERDO (Princesa): «¡Recuerdo el color amarillo intenso y ese toque cítrico y heladito tipo frappé para contrastar con lo caliente del ramen!»',
        inventivaClue: '💡 Habilidad INVENTIVA (Duque): El Duque usa su ingenio recordando el contraste dulce-ácido que tanto les gusta: «No fue gaseosa ni té... Fue un Frozen tropical bien helado: ¡Maracuyá Frozen!»',
        successNote: '🍹 ¡Exacto: MARACUYÁ FROZEN! El toque refrescante que acompañó su primera cena.'
      },
      {
        step: 3,
        badge: '🍡 CUARTA CARTA (4 / 4) — CATEGORÍA: POSTRES',
        categoryShort: '4. Postre',
        title: 'CUARTA CARTA — POSTRES: Para terminar aquella primera visita... ¿qué postre eligieron?',
        prompt: '🏮 En la carta aparecen mochis, dorayakis y helados japoneses... Piensa bien en lo que realmente ocurrió aquella noche al terminar el ramen y los makis:',
        options: [
          'Mochi japonés relleno de helado artesanal',
          'Dorayaki tradicional relleno de crema dulce',
          'Helado japonés de té verde y sésamo',
          'Helado frito Tempura con miel',
          'Taiyaki caliente relleno de chocolate',
          'Sin postre (Aquella primera visita no pidieron ningún postre)'
        ],
        correct: 5,
        selectedLabel: 'Sin postre',
        recuerdoClue: '✨ Habilidad RECUERDO (Princesa): «¡Espera, Duque! ¡Esta carta es una trampa! ¿Te acuerdas que con los Makis Furai, el tazón enorme de Shoyu Ramen y el Maracuyá Frozen quedamos tan llenos que no nos entraba nada más? ¡Aquella noche NO pedimos postre!»',
        inventivaClue: '💡 Habilidad INVENTIVA (Duque): El Duque sonríe al ver la jugada del Guardián: «¡Nos pusieron todos esos postres ricos para tentarnos y quitarnos 2 horas! La respuesta real es SIN POSTRE.»',
        successNote: '🚫🍰 ¡Sorpresa superada: SIN POSTRE! No caíste en la trampa de la cuarta carta: aquella primera visita no pidieron ningún postre.'
      }
    ];

    // CONVERSACIÓN NATURAL Y CÓMPLICE EN LA MESA DESPUÉS DE SERVIR EL PEDIDO
    const tableConversationWorld5 = [
      {
        badge: '💬 Conversación en la Mesa de los Faroles (1 / 3)',
        html: `
          <p class="text-amber-300/95 italic text-xs">
            Desde la cocina abierta preparan y traen el pedido a la mesa: los <b>Makis Furai</b> recién salidos, el tazón humeante de <b>Shoyu Ramen</b> y el <b>Maracuyá Frozen</b>.
          </p>
          <div class="p-3 rounded-lg bg-rose-950/60 border-l-4 border-rose-400 text-slate-100">
            <b>👸 La Princesa (riendo mientras sostiene los palillos):</b> «¡Jajaja, sabía que la carta de los postres tenía trampa! ¿Te acuerdas de la cara que pusimos aquella primera vez cuando vimos el tamaño del plato de Shoyu Ramen después de habernos comido los Makis Furai?»
          </div>
          <div class="p-3 rounded-lg bg-indigo-950/60 border-l-4 border-indigo-400 text-slate-100">
            <b>👑 El Duque (sonriendo con complicidad):</b> «¡Y encima se acercaron súper amables a ofrecernos mochis y dorayakis y nosotros apenas podíamos movernos de la silla! Nos dio un ataque de risa tratando de decir "sin postre, por favor" con el Maracuyá Frozen todavía en la mesa.»
          </div>
        `
      },
      {
        badge: '💬 Conversación en la Mesa de los Faroles (2 / 3)',
        html: `
          <div class="p-3 rounded-lg bg-indigo-950/60 border-l-4 border-indigo-400 text-slate-100">
            <b>👑 El Duque (mirándola con ternura bajo la luz cálida de los faroles):</b> «¿Sabes qué es lo más bonito de recordar esto, Princesa? Que aquella noche no estábamos haciendo nada ostentoso... Solo éramos tú y yo cenando en una mesa sencilla rodeados de faroles, pero yo sentía que tenía todo lo que quería en la vida.»
          </div>
          <div class="p-3 rounded-lg bg-rose-950/60 border-l-4 border-rose-400 text-slate-100">
            <b>👸 La Princesa (apoyando su mano sobre la de él en la mesa):</b> «Es verdad... Cuando peleamos antes de caer en aquel túnel, dejamos que el orgullo tapara estos momentos. Lo importante nunca fue qué comida pedimos, sino la complicidad que teníamos para hacernos felices con cosas tan simples.»
          </div>
        `
      },
      {
        badge: '💬 Conversación en la Mesa de los Faroles (3 / 3) — Estrella de la Complicidad',
        html: `
          <div class="p-3.5 rounded-lg bg-amber-500/15 border-l-4 border-amber-400 text-slate-100">
            <b>👑 El Duque y 👸 La Princesa:</b> «Porque cada vez que nos miramos así, sin importar el lugar ni el tiempo que marque el reloj, sabemos que somos el equipo perfecto.»
          </div>
          <p class="text-emerald-300 font-semibold text-xs text-center pt-1">
            ✨ El quinto recuerdo brilla sobre la mesa: han comprendido que el verdadero tesoro de aquella noche fue el momento compartido juntos.
          </p>
        `
      }
    ];

    const prologueScriptWorld6 = [
      {
        tag: 'Mundo 6 — Escena 1 / 6: Sola en el Gran Salón Rojo Imperial',
        avatar: '👸',
        speaker: 'LA PRINCESA (APARECIENDO COMPLETAMENTE SOLA EN EL SALÓN)',
        text: '«¿Duque?... ¡¿Duque, dónde estás?!... Cruzamos juntos el portal de La Casa de los Faroles tomados de la mano, pero... ¡¿por qué estoy sola en este salón gigante de terciopelo rojo?! ¡¡DUQUE!! ¡¡RESPÓNDEME!!»',
        context: 'El eco de la voz de la Princesa rebota entre las altas columnas carmesí, las arañas de cristal y los cortinajes dorados estilo aristocracia rusa. Nadie responde.',
        choices: [
          { label: '👸 Princesa: "¡¡DUQUE!! ¡¿Dónde estás?! ¡No me dejes sola aquí!"', next: 1 },
          { label: '👸 Princesa: "Buscar entre las columnas rojas llamándolo de nuevo..."', next: 1 }
        ]
      },
      {
        tag: 'Mundo 6 — Escena 2 / 6: El Eco sin Respuesta y el Reloj Implacable',
        avatar: '👸',
        speaker: 'LA PRINCESA (LLAMÁNDOLO CON ANGUSTIA)',
        text: '«¡¡DUQUEEE!!... No puede ser, hace un segundo estábamos riéndonos en nuestra mesa y ahora no está por ningún lado... Y el reloj de las 24 horas arriba sigue corriendo sin detenerse ni un segundo.»',
        context: 'Mientras ella lo busca por el salón imperial ruso, el marcador global continúa descontando segundo a segundo.',
        choices: [
          { label: '⚡ Una voz fría se manifiesta desde la cúpula roja del salón', next: 2 }
        ]
      },
      {
        tag: 'Mundo 6 — Escena 3 / 6: La Pregunta del Sistema',
        avatar: '👁️',
        speaker: 'SISTEMA CENTRAL [SALÓN DE LA ARISTOCRACIA ROJA]',
        text: '«Bienvenida Princesa, has llegado hasta aquí junto a tu acompañante, atravesando los retos y mostrando recordar los momentos felices... Pero... ¿Ya lo conoces bien a tu pareja?»',
        context: 'Cinco imponentes armarios imperiales de caoba y oro se iluminan alrededor de la alfombra roja.',
        choices: [
          { label: '👸 Princesa (molesta): "¡¿Qué le hiciste al Duque?! ¡¿Dónde está?!"', next: 3 },
          { label: '👸 Princesa (indignada): "¡Deja tus acertijos y dime adónde te lo llevaste!"', next: 3 }
        ]
      },
      {
        tag: 'Mundo 6 — Escena 4 / 6: El Reclamo de la Princesa y la Cárcel del Silencio',
        avatar: '👸',
        speaker: 'LA PRINCESA (CON MOLESTIA Y FIRMEZA)',
        text: '«¡No me vengas con juegos ahora! ¡Hemos superado cada uno de tus mundos juntos! ¡Dime ahora mismo dónde está el Duque o qué le hiciste!»',
        context: 'La Princesa encara al Sistema en medio del salón imperial mientras el reloj general sigue corriendo.',
        choices: [
          { label: '⏳ Escuchar la revelación del Sistema sobre el paradero del Duque', next: 4 }
        ]
      },
      {
        tag: 'Mundo 6 — Escena 5 / 6: Prisionero en el Último Nivel',
        avatar: '⛓️',
        speaker: 'SISTEMA CENTRAL [REVELACIÓN DEL NIVEL FINAL]',
        text: '«Tu Duque ha sido llevado a LA CÁRCEL DEL SILENCIO, que se encuentra en el último nivel de este juego: el Mundo 7. Si deseas abrir el portal para ir a rescatarlo antes de que el reloj de 24 horas llegue a cero, tendrás que superar sola la prueba de los 5 Armarios.»',
        context: 'Cada armario está separado por clases: 1. Solo Vestidos, 2. Solo Zapatos (Princesa), 3. Pulseras y Relojes, 4. Ternos para el Duque y 5. Zapatos para el Duque.',
        choices: [
          { label: '👸 Princesa: "¿Qué debo elegir en esos 5 armarios para ir por él?"', next: 5 }
        ]
      },
      {
        tag: 'Mundo 6 — Escena 6 / 6: El Recuerdo de la Imagen con IA en la Playa',
        avatar: '👗',
        speaker: 'SISTEMA CENTRAL & LA PRINCESA',
        text: '«Un día el Duque te mostró una versión editada con IA de cómo se veían ustedes dos juntos en la playa vestidos de gala y traje. Pasa por cada uno de los 5 armarios y elige las prendas exactas de aquella imagen para ganar la Sexta Estrella e ir a la Cárcel del Silencio.»',
        context: 'Camina con la Princesa hacia cada uno de los 5 Armarios Imperiales en orden (del 1 al 5) mientras el reloj global sigue corriendo.',
        choices: [
          { label: '👗 Ir al Armario 1 (Vestidos) y Rescatar al Duque', next: -1 }
        ]
      }
    ];

    // LOS 5 ARMARIOS DEL MUNDO 6 (Extraídos fielmente de la foto en la playa juntos editada con IA)
    const wardrobesWorld6 = [
      {
        num: 1,
        id: 'wardrobe_1_dress',
        name: 'Armario 1: Solo Vestidos',
        shortTitle: '1. Vestidos',
        icon: '👗',
        x: 155,
        y: 205,
        r: 34,
        completed: false,
        badge: '👗 ARMARIO 1 DE 5 — CLASE: SOLO VESTIDOS (PRINCESA)',
        question: 'ARMARIO 1 (SOLO VESTIDOS): ¿Qué vestido llevaba la Princesa en aquella imagen en la playa juntos que el Duque le mostró editada con IA?',
        prompt: '👸 La Princesa abre el primer armario imperial: «Recuerdo perfectamente cómo nos veíamos frente al mar junto a la baranda celeste al atardecer... ¿Cuál de estos vestidos era el mío?»',
        options: [
          'Vestido largo de gala color azul noche con mangas largas de encaje y falda cerrada',
          'Vestido largo de gala color vino / borgoña con corsé bordado sin tirantes (strapless), abertura en la pierna y chal en los brazos',
          'Vestido corto color esmeralda brillante con tirantes dorados y vuelo plisado',
          'Vestido largo blanco perla de cuello alto con capa transparente en los hombros'
        ],
        correct: 1,
        note: '👗 ¡Exacto! El vestido largo color vino/borgoña con corsé bordado, abertura en la pierna izquierda y el chal sobre tus brazos.'
      },
      {
        num: 2,
        id: 'wardrobe_2_shoes_her',
        name: 'Armario 2: Solo Zapatos (Princesa)',
        shortTitle: '2. Zapatos (Ella)',
        icon: '👠',
        x: 315,
        y: 165,
        r: 34,
        completed: false,
        badge: '👠 ARMARIO 2 DE 5 — CLASE: SOLO ZAPATOS (PRINCESA)',
        question: 'ARMARIO 2 (SOLO ZAPATOS): ¿Qué zapatos llevaba la Princesa haciendo juego con su vestido en aquella foto en la playa?',
        prompt: '👸 La Princesa observa el segundo armario lleno de calzado real: «A través de la abertura del vestido se veía claramente mi calzado... ¿Cuál era?»',
        options: [
          'Zapatos cerrados de charol negro con hebilla plateada cuadrada',
          'Botines blancos de tacón aguja con cordones cruzados',
          'Sandalias de tacón color vino / guinda con correa en el tobillo y tira frontal sobre los dedos',
          'Stilettos dorados cerrados en punta con pedrería brillante'
        ],
        correct: 2,
        note: '👠 ¡Correcto! Las sandalias de tacón color vino/guinda con correa fina en el tobillo y tira frontal.'
      },
      {
        num: 3,
        id: 'wardrobe_3_accessories',
        name: 'Armario 3: Pulseras y Relojes',
        shortTitle: '3. Pulseras/Reloj',
        icon: '⌚',
        x: 485,
        y: 165,
        r: 34,
        completed: false,
        badge: '⌚ ARMARIO 3 DE 5 — CLASE: PULSERAS Y RELOJES',
        question: 'ARMARIO 3 (PULSERAS Y RELOJES): ¿Qué llevaban en las muñecas y manos en aquella imagen frente al mar?',
        prompt: '👸 La Princesa abre la vitrina de joyas y relojes: «Fíjate muy bien en nuestras manos y muñecas en esa foto...»',
        options: [
          'Reloj dorado grande en la muñeca de la Princesa y pulsera roja en el Duque',
          'Pulsera fina plateada en la muñeca izquierda de la Princesa (con collar de corazón y bolso clutch negro) y guantes de cuero negro en el Duque sin reloj visible',
          'Dos relojes inteligentes deportivos iguales y ningún bolso ni guantes',
          'Brazalete grueso de perlas blancas en ambas muñecas y reloj plateado a la vista en el Duque'
        ],
        correct: 1,
        note: '⌚✨ ¡Qué nivel de detalle! Tu pulsera fina plateada en la muñeca izquierda sosteniendo el clutch negro, y el Duque con sus elegantes guantes de cuero negro.'
      },
      {
        num: 4,
        id: 'wardrobe_4_suit_duke',
        name: 'Armario 4: Ternos para el Duque',
        shortTitle: '4. Terno Duque',
        icon: '🤵',
        x: 645,
        y: 205,
        r: 34,
        completed: false,
        badge: '🤵 ARMARIO 4 DE 5 — CLASE: TERNOS PARA EL DUQUE',
        question: 'ARMARIO 4 (TERNOS PARA EL DUQUE): ¿Cómo era el traje / terno que vestía el Duque abrazándote en aquella imagen frente al mar?',
        prompt: '👸 La Princesa acaricia las telas pensando en el Duque encerrado en la Cárcel del Silencio: «Él se veía tan apuesto a mi lado combinando conmigo... ¿Qué terno llevaba puesto?»',
        options: [
          'Esmoquin blanco marfil con camisa celeste y michi (corbatín) dorado',
          'Terno azul marino clásico con camisa blanca y corbata de rayas rojas',
          'Terno de chaleco y pantalón negro carbón con camisa color vino / guinda y abrigo largo (sobretodo) color borgoña',
          'Terno gris claro de lino playero con camiseta blanca sin chaleco ni abrigo'
        ],
        correct: 2,
        note: '🤵🍷 ¡Exacto! El terno de chaleco y pantalón negro carbón con camisa color vino/guinda y aquel abrigo largo color borgoña haciendo juego con tu vestido.'
      },
      {
        num: 5,
        id: 'wardrobe_5_shoes_duke',
        name: 'Armario 5: Zapatos del Duque',
        shortTitle: '5. Zapatos Duque',
        icon: '👞',
        x: 400,
        y: 355,
        r: 36,
        completed: false,
        badge: '👞 ARMARIO 5 DE 5 — CLASE: SOLO ZAPATOS (EL DUQUE)',
        question: 'ARMARIO 5 (ZAPATOS DEL DUQUE): Por último, Princesa... ¿qué zapatos llevaba el Duque en esa imagen en la playa?',
        prompt: '👸 Solo falta este último armario para conseguir la Sexta Estrella y abrir el portal hacia la Cárcel del Silencio:',
        options: [
          'Zapatillas blancas urbanas de suela alta',
          'Mocasines marrones de gamuza clara sin pasadores',
          'Zapatos de vestir clásicos tipo Derby / Oxford de cuero negro brillante con pasadores',
          'Sandalias de cuero marrón abiertas para la arena'
        ],
        correct: 2,
        note: '👞🔓 ¡Sexta Estrella Desbloqueada! Los zapatos de vestir clásicos de cuero negro brillante con pasadores. ¡La imagen completa se proyecta en el Salón Imperial!'
      }
    ];

    const confessionScriptW7 = [
      {
        tag: 'Escena 1 / 8 — Reencuentro en el Yate Blanco',
        avatar: '👑',
        speaker: 'EL DUQUE (EN LA CUBIERTA SUPERIOR DECORADA DE BLANCO)',
        text: '«Bienvenida a este último nivel, mi Princesa, mi vida... Carolina.»',
        context: 'El sol del Caribe tiñe el horizonte de oro y rosa. Todo el yate está adornado con flores blancas y luces cálidas. Ambos llevan los mismos trajes de gala color vino y negro del Nivel 6.',
        choices: [
          { label: '👸 Carolina: "¿Duque?... ¡¿Qué es todo esto?! Pensé que estabas en la Cárcel del Silencio..."', next: 1 }
        ]
      },
      {
        tag: 'Escena 2 / 8 — La Confusión de la Princesa',
        avatar: '👸',
        speaker: 'LA PRINCESA CAROLINA (MIRANDO EL YATE Y SUS TRAJES)',
        text: '«No entiendo nada, Duque... El Sistema me dijo que te habían llevado a la Cárcel del Silencio. ¿Por qué razón está todo este yate gigante decorado de blanco frente al mar? ¿Y por qué seguimos vestidos exactamente con los mismos trajes de gala que acabo de elegir en el nivel 6?»',
        context: 'La brisa marina mueve suavemente su vestido color borgoña mientras ella observa las rosas blancas en la cubierta superior.',
        choices: [
          { label: '👑 Escuchar la respuesta del Duque', next: 2 }
        ]
      },
      {
        tag: 'Escena 3 / 8 — El Motivo de las Pruebas',
        avatar: '👑',
        speaker: 'EL DUQUE (CON VOZ SINCERA Y PROFUNDA)',
        text: '«Recuerdo muy bien cuando estábamos en el mundo real, amor mío. Nuestras constantes peleas me hicieron pensar que te perdería, y esta era mi manera de unirnos otra vez... o quizás de reforzar nuestro amor. Y hoy me has demostrado, así como yo a ti, que nuestros recuerdos son nuestra principal manera de volvernos a unir más y no separarnos.»',
        context: 'El Duque la mira con ternura mientras las olas suaves reflejan el atardecer dorado.',
        choices: [
          { label: '👸 Princesa (desconfiada): "No era necesario hacer todo esto... ¿Dónde estamos exactamente?"', next: 3 }
        ]
      },
      {
        tag: 'Escena 4 / 8 — La Verdad del Túnel y la Simulación',
        avatar: '👑',
        speaker: 'EL DUQUE (REVELANDO EL SECRETO DEL JUEGO)',
        text: '«Nuestra última pelea fue cerca de un túnel, ¿recuerdas? En ese túnel en realidad no caímos... estábamos dormidos, y ese recuerdo se creó para darle sentido a cómo llegamos. Estamos en este momento dormidos en el mundo real, con nuestros cerebros conectados a una computadora, donde al despertar podremos recordar no solo estos niveles, sino nuestros recuerdos verdaderos que fueron la base en la que me inspiré para crear todo esto.»',
        context: 'Todo encaja de golpe: la Navidad del trabajo, el tren de las 02:30 PM, La Rosa Náutica, las 21 cartas, La Casa de los Faroles y la foto en la playa.',
        choices: [
          { label: '👸 Princesa (molesta y asombrada): "¡Realmente estás loco! ¡Literalmente era un sueño!"', next: 4 }
        ]
      },
      {
        tag: 'Escena 5 / 8 — "Literalmente un Sueño" y la Disculpa',
        avatar: '👸',
        speaker: 'LA PRINCESA CAROLINA (ENTRE MOLESTA Y CONMOVIDA)',
        text: '«¡Tú realmente estás loco, Duque! ¡Qué idea tan descabellada! Todo este tiempo sentí que esto parecía un sueño... y vaya que, en términos técnicos, ¡literalmente era un sueño!»',
        context: 'El Duque da un paso al frente con humildad, tomando las manos de Carolina.',
        choices: [
          { label: '👑 Escuchar la disculpa del Duque', next: 5 }
        ]
      },
      {
        tag: 'Escena 6 / 8 — Las Intenciones del Corazón del Duque',
        avatar: '👑',
        speaker: 'EL DUQUE (SOSTENIENDO SUS MANOS CON TERNURA)',
        text: '«Oh, amada mía... Mis métodos, aunque extraños, y mis acciones, aunque confusas, son realizados con las mejores intenciones, pues temía perderte debido a nuestras últimas y muy constantes peleas y conflictos. Por favor, no pienses ideas que no son acordes al propósito y menos hacia mí, ya que sabes cuánto te amo.»',
        context: 'Carolina lo mira a los ojos en silencio. Sabe en su corazón que es verdad: jamás le dio motivos reales para desconfiar, nunca hubo infidelidades, secretos ni preferencias hacia nadie más.',
        choices: [
          { label: '👸 Asentir y exigirle una promesa solemne', next: 6 }
        ]
      },
      {
        tag: 'Escena 7 / 8 — El Perdón y la Promesa Eterna',
        avatar: '👸',
        speaker: 'LA PRINCESA CAROLINA (ASINTIENDO CON FIRMEZA Y AMOR)',
        text: '«Está bien, sé que nunca me diste motivos para desconfiar ni nada que nos separara... Pero escúchame bien: Duque, amado mío, prométeme dentro de todo tu ser que NO VOLVERÁS A HACER TAL LOCURA O SIMILAR A ESTA EN TODA TU EXISTENCIA, TANTO TANGIBLE COMO INTANGIBLE.»',
        context: 'El cielo del Caribe brilla en su punto más dorado. El Duque sonríe aliviado y feliz por el perdón de su Princesa.',
        choices: [
          { label: '💍 Escuchar la promesa y la pregunta del Duque', next: 7 }
        ]
      },
      {
        tag: 'Escena 8 / 8 — La Gran Propuesta en el Atardecer',
        avatar: '💍',
        speaker: 'EL DUQUE (ARRODILLÁNDOSE EN LA CUBIERTA BLANCA)',
        text: '«He de prometerte, mi Princesa, que ni en esta vida ni después de ella haré tal cosa o similar a esta... Y la manera en que estarás segura de que no volverá a suceder es si tú... Mi amada Carolina, mi Princesa... ¿Aceptarías ser mi Esposa?»',
        context: 'El yate entero guarda silencio frente al atardecer. Todo el viaje a través de los 7 mundos culmina en esta decisión.',
        isFinalProposal: true
      }
    ];

    // =========================================================
    // GLOBAL GAME STATE (SUPPORTS WORLDS 1 TO 7)
    // =========================================================
    const state = {
      currentWorld: 1, // Empieza en Mundo 1 y conecta directo al Mundo 2
      activeTab: 'game',
      activeChar: 'duke',
      remainingSeconds: 23 * 3600 + 48 * 60 + 15,
      trainRemainingSeconds: 300, // 5 minutes (300 seconds) for the 02:30 PM train
      sprintBoostTimer: 0,
      obstacleHitCooldown: 0,
      prologueStep: 0,
      talkedInRoom: false,
      banterIndex: 0,
      // World 1 flags
      costumesEquipped: false,
      flashbackSeen: false,
      star1Earned: false,
      // World 2 & World 3 flags
      star2Earned: false,
      star3Earned: false,
      star4Earned: false,
      star5Earned: false,
      star6Earned: false,
      star7Earned: false,
      w7ConfessionStarted: false,
      w7ConfessionStep: 0,
      w7NoCountdownTimer: null,
      w6CurrentWardrobeStep: 0,
      w6PenaltiesCount: 0,
      exitPortalWorld7: { x: 400, y: 120, r: 38, active: false },
      currentCardIndex: 0,
      world4PenaltiesCount: 0,
      w5CurrentMenuStep: 0,
      w5PenaltiesHoursCount: 0,
      w5ComplicityScore: 100,
      w5ConvIndex: 0,
      w5TalkedToGuardian: false,
      w5AutoOpenedTable: false,
      guardianTableWorld4: { x: 400, y: 245, w: 170, h: 90 },
      greatDoorWorld4: { x: 400, y: 110, w: 190, h: 70 },
      lanternGuardianW5: { x: 255, y: 315, r: 32 },
      lanternTableW5: { x: 545, y: 245, w: 175, h: 95 },
      exitPortalWorld6: { x: 705, y: 365, r: 35, active: false },
      itemsWorld3: [
        {
          id: 'pier_lantern',
          title: 'Brisa y Farol del Espigón',
          subtitle: 'Recuerdo en el Muelle 1/2',
          x: 245,
          y: 265,
          r: 28,
          collected: false,
          icon: '🏮',
          color: '#f59e0b',
          dukeLine: '«Aquí nos detuvimos a mitad del puente de madera de La Rosa Náutica a escuchar las olas romper debajo de nosotros.»',
          princessLine: '«El viento del mar de Miraflores soplaba fuerte y tú te pusiste de mi lado con tu terno negro para cortarme el frío.»'
        },
        {
          id: 'menu_candle',
          title: 'Vela y Reserva Frente al Mar',
          subtitle: 'Recuerdo del Salón 2/2',
          x: 495,
          y: 365,
          r: 28,
          collected: false,
          icon: '🕯️',
          color: '#38bdf8',
          dukeLine: '«Nuestra reserva junto al gran ventanal sobre el océano Pacífico. Ya podemos acercarnos a la Mesa del Mirador para elegir nuestro postre.»',
          princessLine: '«¡Sí! Vamos a la mesa de arriba a la derecha y pidamos nuestro Helado de lúcuma.»'
        }
      ],
      obstaclesWorld3: [
        {
          id: 'obs_wave',
          name: 'la Brisa y Salpicadura de la Ola Alta en el Muelle',
          icon: '🌊💦',
          x: 210,
          y: 190,
          minY: 140,
          maxY: 425,
          vy: 2.0,
          r: 25,
          color: '#38bdf8'
        },
        {
          id: 'obs_seagull',
          name: 'la Bandada de Gaviotas Traviesas de Miraflores',
          icon: '🕊️🌊',
          x: 375,
          y: 340,
          minY: 135,
          maxY: 430,
          vy: -2.45,
          r: 24,
          color: '#facc15'
        },
        {
          id: 'obs_waiter',
          name: 'el Mozo Apurado con Bandejas de Champagne',
          icon: '🤵🍾',
          x: 545,
          y: 230,
          minY: 145,
          maxY: 425,
          vy: 2.35,
          r: 25,
          color: '#f43f5e'
        }
      ],
      seaTableWorld3: {
        x: 695,
        y: 185,
        w: 150,
        h: 110
      },
      exitPortalWorld4: {
        x: 695,
        y: 365,
        r: 36,
        active: false
      },
      particles: [],
      floatingTexts: [],
      keys: {},
      targetPoint: null,
      duke: { x: 115, y: 410, r: 17, speed: 3.3, name: 'El Duque', bubble: '¡Sale a las 02:30 PM!' },
      princess: { x: 165, y: 420, r: 17, speed: 3.3, name: 'La Princesa', bubble: '¡Faltan 5 minutos!' },

      // World 1 Items (Con diálogos completos entre el Duque y la Princesa)
      itemsWorld1: [
        {
          id: 'costumes',
          title: 'Trajes de José y María',
          subtitle: 'Perchero del Trabajo',
          x: 130,
          y: 175,
          r: 34,
          collected: false,
          placed: false,
          type: 'costume',
          icon: '👘',
          color: '#38bdf8',
          dukeLine: '«Aquí están la túnica de José y el bastón que usé aquel 21 de diciembre de 2025...»',
          princessLine: '«¡Y mi manto azul de María! Al ponérnoslos siento que el recuerdo vuelve de golpe.»'
        },
        {
          id: 'crib',
          title: 'Cuna de Madera y Paja',
          subtitle: 'Detalle del Pesebre 1/4',
          x: 145,
          y: 395,
          r: 30,
          collected: false,
          placed: false,
          type: 'prop',
          icon: '🧺',
          color: '#f59e0b',
          dukeLine: '«Llevemos la cuna de madera al altar. ¿Recuerdas cómo acomodamos la paja entre los dos para que no se cayera?»',
          princessLine: '«¡Sí! Nos agachamos al mismo tiempo y chocamos las manos acomodando el pesebre.»'
        },
        {
          id: 'animals',
          title: 'El Buey y la Mula',
          subtitle: 'Detalle del Pesebre 2/4',
          x: 645,
          y: 390,
          r: 30,
          collected: false,
          placed: false,
          type: 'prop',
          icon: '🫏',
          color: '#a855f7',
          dukeLine: '«Aquí están el buey y la mula del nacimiento. Ese día uno de los animalitos se tambaleaba en el escenario.»',
          princessLine: '«Y tú lo sostuviste con el pie disimuladamente para que nadie del trabajo se diera cuenta. ¡Qué risa!»'
        },
        {
          id: 'lights',
          title: 'Estrella de Belén y Guirnaldas',
          subtitle: 'Detalle del Pesebre 3/4',
          x: 640,
          y: 175,
          r: 30,
          collected: false,
          placed: false,
          type: 'prop',
          icon: '🌟',
          color: '#facc15',
          dukeLine: '«La Estrella de Belén para coronar el portal. Cuando se encendieron las luces del salón, tú brillabas más que todo el escenario.»',
          princessLine: '«Calla, que me ponía aún más roja frente a todo el grupo del trabajo...»'
        },
        {
          id: 'baby_jesus',
          title: 'Figura del Niño Jesús',
          subtitle: 'Detalle Central 4/4',
          x: 400,
          y: 425,
          r: 30,
          collected: false,
          placed: false,
          type: 'prop',
          icon: '👶',
          color: '#fb7185',
          dukeLine: '«El Niño Jesús... el corazón del pesebre. Cuando lo pusimos en el centro aquel 21 de diciembre, sentí una paz increíble a tu lado.»',
          princessLine: '«Porque fue el momento exacto en que el destino nos unió como pareja, aunque todavía no lo sabíamos.»'
        }
      ],
      mangerAltar: { x: 400, y: 155, w: 175, h: 95 },
      exitPortalWorld2: { x: 685, y: 280, r: 36, active: false },

      // World 2 Romantic Collectibles along the obstacle path
      itemsWorld2: [
        {
          id: 'rose_bench',
          title: 'Rosa y Café del Paseo',
          subtitle: 'Recuerdo de la Cita 1/3',
          x: 215,
          y: 235,
          r: 28,
          collected: false,
          icon: '🌹',
          color: '#fb7185',
          dukeLine: '«¡En esta banca nos sentamos a platicar horas enteras! No podíamos dejar olvidada la rosa que te di mientras nos conocíamos.»',
          princessLine: '«Estábamos tan embobados hablando de nosotros que ni vimos pasar las horas... ¡Corre, que el reloj marca casi las 02:30 PM!»'
        },
        {
          id: 'photo_plaza',
          title: 'Foto Instantánea en el Mirador',
          subtitle: 'Recuerdo de la Cita 2/3',
          x: 455,
          y: 375,
          r: 28,
          collected: false,
          icon: '📸',
          color: '#38bdf8',
          dukeLine: '«¡Nuestra primera foto juntos en la plaza! Mira cómo sonreíamos sin imaginar todo lo que vendría después.»',
          princessLine: '«¡Y justo un segundo después de tomarla miramos la hora y vimos que el tren salía a las 02:30 PM! ¡No sueltes mi mano!»'
        },
        {
          id: 'train_tickets',
          title: 'Dos Boletos (Salida 02:30 PM)',
          subtitle: 'Recuerdo de la Cita 3/3',
          x: 525,
          y: 175,
          r: 28,
          collected: false,
          icon: '🎟️',
          color: '#facc15',
          dukeLine: '«¡Tengo los dos boletos de las 02:30 PM! Ya tenemos todo, Princesa, ahora crucemos el último tramo directo hacia el Andén del Tren.»',
          princessLine: '«¡El tren ya está tocando el silbato en la estación! ¡Corramos juntos al andén de arriba a la derecha!»'
        }
      ],

      // World 1 Moving Obstacles (Christmas Hall — Each collision deducts 20 minutes from the 24h Global Clock)
      obstaclesWorld1: [
        {
          id: 'obs_w1_gifts',
          name: 'el Carrito de Regalos y Cajas Navideñas',
          icon: '🎁🛒',
          x: 255,
          y: 230,
          minX: 255,
          maxX: 255,
          minY: 135,
          maxY: 430,
          vx: 0,
          vy: 2.15,
          r: 23,
          color: '#f43f5e'
        },
        {
          id: 'obs_w1_rehearsal',
          name: 'los Compañeros Ensayando el Coro',
          icon: '🎶🕺',
          x: 525,
          y: 340,
          minX: 525,
          maxX: 525,
          minY: 135,
          maxY: 430,
          vx: 0,
          vy: -2.35,
          r: 23,
          color: '#fb923c'
        },
        {
          id: 'obs_w1_cables',
          name: 'el Técnico Moviendo Luces y Guirnaldas',
          icon: '🎄⚡',
          x: 390,
          y: 225,
          minX: 220,
          maxX: 560,
          minY: 225,
          maxY: 225,
          vx: 2.25,
          vy: 0,
          r: 22,
          color: '#38bdf8'
        },
        {
          id: 'obs_w1_table',
          name: 'el Mozo con Bandejas de Chocolate Caliente',
          icon: '☕🧁',
          x: 400,
          y: 360,
          minX: 210,
          maxX: 580,
          minY: 360,
          maxY: 360,
          vx: -2.10,
          vy: 0,
          r: 22,
          color: '#a855f7'
        }
      ],

      // World 2 Dynamic Obstacles (Patrolling between café park and train station — Each collision deducts 20 minutes from the 24h Global Clock)
      obstaclesWorld2: [
        {
          id: 'obs_cart',
          name: 'el Carrito de Flores y Equipaje',
          icon: '💐🛒',
          x: 275,
          y: 280,
          minX: 275,
          maxX: 275,
          minY: 135,
          maxY: 430,
          vx: 0,
          vy: 2.25,
          r: 24,
          color: '#f43f5e'
        },
        {
          id: 'obs_crowd',
          name: 'los Pasajeros Apurados',
          icon: '🧳🏃',
          x: 390,
          y: 220,
          minX: 390,
          maxX: 390,
          minY: 130,
          maxY: 435,
          vx: 0,
          vy: -2.65,
          r: 24,
          color: '#fb923c'
        },
        {
          id: 'obs_musician',
          name: 'los Músicos Bohemios de la Plaza',
          icon: '🎻🎷',
          x: 565,
          y: 310,
          minX: 565,
          maxX: 565,
          minY: 155,
          maxY: 435,
          vx: 0,
          vy: 2.45,
          r: 25,
          color: '#a855f7'
        },
        {
          id: 'obs_cyclist',
          name: 'el Repartidor en Bicicleta del Bulevar',
          icon: '🚲📦',
          x: 340,
          y: 205,
          minX: 190,
          maxX: 540,
          minY: 205,
          maxY: 205,
          vx: 2.55,
          vy: 0,
          r: 23,
          color: '#facc15'
        },
        {
          id: 'obs_porters',
          name: 'el Maletero del Expreso de las 02:30 PM',
          icon: '🛎️🧳',
          x: 480,
          y: 330,
          minX: 240,
          maxX: 620,
          minY: 330,
          maxY: 330,
          vx: -2.40,
          vy: 0,
          r: 23,
          color: '#ec4899'
        },
        {
          id: 'obs_puddle',
          name: 'el Fotógrafo Turístico en la Fuente',
          icon: '📷⛲',
          x: 350,
          y: 395,
          minX: 220,
          maxX: 510,
          minY: 395,
          maxY: 395,
          vx: 1.95,
          vy: 0,
          r: 23,
          color: '#38bdf8'
        }
      ],

      // World 2 Train Station Platform (Top Right)
      trainPlatform: {
        x: 695,
        y: 165,
        w: 145,
        h: 110
      },

      worldsList: [
        {
          num: 1,
          title: 'Mundo 1: Navidad — José y María',
          date: '21 de Diciembre, 2025',
          status: 'Jugable (Estrella 1)',
          desc: 'Despiertan tras caer al túnel en la Navidad de su grupo de trabajo. Visten de José y María, arman el pesebre y ganan la Estrella 1.'
        },
        {
          num: 2,
          title: 'Mundo 2: El Tren de las 02:30 PM',
          date: 'Tarde de Paseo (5 Minutos)',
          status: 'Jugable Ahora (Estrella 2)',
          desc: 'Pasan una tarde hermosa conociéndose y olvidan que el tren a su ciudad sale a las 02:30 PM. Corren sorteando obstáculos y sellan su promesa: "Yo lo puedo todo, y lo que no sé, me lo invento para ti".'
        },
        {
          num: 3,
          title: 'Mundo 3: La Rosa Náutica (Miraflores)',
          date: 'Atardecer Frente al Mar',
          status: 'Jugable Ahora (Estrella 3)',
          desc: 'El Duque de terno negro y la Princesa en ropa cómoda cruzan el espigón de Miraflores al atardecer, recuerdan el Helado de lúcuma y sellan la promesa: "Quiero descubrir cada lugar, cada espacio, cada mundo pero a tu lado".'
        },
        {
          num: 4,
          title: 'Mundo 4: Nuestra historia en una carta',
          date: 'Las 21 Cartas en Lima',
          status: 'Jugable Ahora (Estrella 4)',
          desc: 'El Guardián de la Gran Puerta silencia al Duque y pone a prueba a la Princesa con 21 cartas animadas sobre su historia en Lima. Cada error resta 30 minutos al reloj global de 24 horas.'
        },
        {
          num: 5,
          title: 'Mundo 5: La Casa de los Faroles',
          date: 'Estrella 5 • La Complicidad',
          status: 'Jugable Ahora (Estrella 5)',
          desc: 'El Guardián de la entrada les pide reconstruir mediante 4 cartas el pedido de su primera visita (Makis Furai, Shoyu Ramen, Maracuyá Frozen y Sin postre). Cada error resta 2 horas al reloj global.'
        },
        {
          num: 6,
          title: 'Mundo 6: El Salón Imperial y los 5 Armarios',
          date: 'La Foto con IA en la Playa',
          status: 'Jugable Ahora (Estrella 6)',
          desc: 'La Princesa despierta sola en un gran salón rojo estilo aristocracia rusa. El Duque fue llevado a la Cárcel del Silencio (Mundo 7), y ella debe superar los 5 Armarios recordando su foto con IA en la playa.'
        },
        {
          num: 7,
          title: 'Mundo 7: La Confesión (Nivel Final)',
          date: 'Megayate en el Caribe • 7 / 7',
          status: 'Jugable Ahora (Estrella 7)',
          desc: 'La Princesa cruza el portal pensando en la Cárcel del Silencio, pero aparece en el yate más grande del Caribe al atardecer decorado de blanco donde el Duque revela la verdad del sueño y le hace la gran pregunta.'
        }
      ]
    };

    // Initialize ambient particles (snow in W1, golden sunset petals in W2)
    for (let i = 0; i < 40; i++) {
      state.particles.push({
        x: Math.random() * 800,
        y: Math.random() * 500,
        r: Math.random() * 2.3 + 1.2,
        vy: Math.random() * 0.65 + 0.3,
        vx: (Math.random() - 0.3) * 0.5
      });
    }

    // =========================================================
    // WORLD SWITCHER (SEAMLESS TRANSITION WORLD 1 <-> WORLD 2)
    // =========================================================
    function syncMinimumRemainingTime() {
      try {
        const raw = localStorage.getItem('cronicas_tunel_7estrellas_state');
        if (raw) {
          const saved = JSON.parse(raw);
          if (typeof saved.remainingSeconds === 'number' && saved.remainingSeconds > 0) {
            state.remainingSeconds = Math.min(state.remainingSeconds, saved.remainingSeconds);
          }
        }
      } catch (e) {}
    }

    function loadWorld(worldNum, showIntro = true) {
      syncMinimumRemainingTime(); // Mantiene intacto el mínimo tiempo restante de las 24h entre todos los niveles

      // FIX INPUT-TRANSITION: evita que una tecla mantenida durante el cambio
      // de mundo quede registrada y bloquee/contamine el siguiente control.
      state.keys = {};
      state.targetPoint = null;
      state.currentWorld = worldNum;
      state.talkedInRoom = false;
      state.banterIndex = 0;
      bgmStepIndex = 0;

      const subEl = document.getElementById('header-world-subtitle');
      const trainClockBox = document.getElementById('hud-train-clock-box');
      const btnW1 = document.getElementById('btn-select-world1');
      const btnW2 = document.getElementById('btn-select-world2');
      const worldBadge = document.getElementById('world-badge');
      const sideTitle = document.getElementById('sidebar-world-title');
      const sideDesc = document.getElementById('sidebar-world-desc');
      const invLabel = document.getElementById('inventory-title-label');
      const bgmIcon = document.getElementById('bgm-icon');
      const bgmLabel = document.getElementById('bgm-label');

      if (worldNum !== 4 && worldNum !== 5 && worldNum !== 6 && worldNum !== 7) {
        state.activeChar = 'duke';
        const switchBtn = document.getElementById('btn-switch-char');
        if (switchBtn) switchBtn.textContent = '👑 Duque (Cambiar a Princesa [Tab])';
      }

      if (worldNum === 1) {
        subEl.textContent = 'Mundo 1: El Destino en Navidad (21 de Diciembre, 2025)';
        trainClockBox.classList.add('hidden');
        btnW1.className = 'px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 text-slate-950 shadow transition flex items-center gap-1';
        btnW2.className = 'px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition flex items-center gap-1';
        worldBadge.textContent = 'Mundo 1 / 7';
        sideTitle.textContent = 'El Nacimiento que nos Unió (21 Dic 2025)';
        sideDesc.innerHTML = 'La caída por el túnel fracturó sus recuerdos. Para ganar la <b>Estrella 1</b>, deben revivir cómo el destino los unió como <b>José y María</b> en su grupo de trabajo.';
        invLabel.textContent = 'Detalles del Pesebre Reunidos';
        bgmIcon.textContent = '🎄';
        bgmLabel.textContent = bgmEnabled ? 'Melodía: Noche de Paz' : 'Melodía: Pausada';

        state.duke.x = 350; state.duke.y = 295;
        state.princess.x = 435; state.princess.y = 295;
        state.duke.bubble = '¿Dónde estamos?';
        state.princess.bubble = '¡21 Dic 2025!';
      } else {
        subEl.textContent = 'Mundo 2: El Tren de las 02:30 PM (Carrera Romántica contra el Tiempo)';
        trainClockBox.classList.remove('hidden');
        btnW2.className = 'px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-500 text-slate-950 shadow transition flex items-center gap-1';
        btnW1.className = 'px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition flex items-center gap-1';
        worldBadge.textContent = 'Mundo 2 / 7';
        sideTitle.textContent = 'El Tren de las 02:30 PM y Nuestra Promesa';
        sideDesc.innerHTML = 'Siguen medio confundidos por cómo llegaron a estos mundos, pero recuerdan esa tarde tan bonita paseando para conocerse... ¡hasta que vieron que el tren a su ciudad salía a las <b>02:30 PM</b>! Tienen <b>5 minutos</b> para esquivar los obstáculos y subir al tren.';
        invLabel.textContent = 'Recuerdos del Paseo Reunidos';
        bgmIcon.textContent = '🚂';
        bgmLabel.textContent = bgmEnabled ? 'Música: Tren y Reloj' : 'Música: Pausada';

        state.duke.x = 110; state.duke.y = 405;
        state.princess.x = 155; state.princess.y = 420;
        state.duke.bubble = '¡El tren sale 02:30 PM!';
        state.princess.bubble = '¡Corramos de la mano!';
        document.getElementById('btn-flashback-manual').classList.add('hidden');
      }

      const btnW3 = document.getElementById('btn-select-world3');
      if (worldNum === 3) {
        subEl.textContent = 'Mundo 3: La Rosa Náutica, Miraflores — Lima (Atardecer Romántico sobre el Mar)';
        trainClockBox.classList.add('hidden');
        btnW1.className = 'px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition flex items-center gap-1';
        btnW2.className = 'px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition flex items-center gap-1';
        if (btnW3) btnW3.className = 'px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-400 text-slate-950 shadow transition flex items-center gap-1';
        worldBadge.textContent = 'Mundo 3 / 7';
        sideTitle.textContent = 'La Rosa Náutica (Miraflores) y Nuestro Postre';
        sideDesc.innerHTML = 'Al bajar del tren llegan a un atardecer mágico sobre el mar de Miraflores. El <b>Duque viste de terno negro</b> y la <b>Princesa lleva su ropa cómoda</b>. Deben cruzar el muelle esquivando las olas, gaviotas y mozos, llegar a su mesa frente al mar y elegir el postre correcto: <b>Helado de lúcuma</b>.';
        invLabel.textContent = 'Detalles de la Velada Reunidos';
        bgmIcon.textContent = '🌊';

        state.duke.x = 95; state.duke.y = 285;
        state.princess.x = 140; state.princess.y = 305;
        state.duke.bubble = '🤵 De terno negro por ti';
        state.princess.bubble = '🌅 ¡Mira el mar de Miraflores!';
        document.getElementById('btn-flashback-manual').classList.add('hidden');
      } else if (btnW3) {
        btnW3.className = 'px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/25 text-amber-200 border border-amber-400/50 hover:bg-amber-500/35 transition flex items-center gap-1';
      }

      const canvasCol = document.getElementById('game-canvas-column');
      const sidebarCol = document.getElementById('game-sidebar-column');
      if (canvasCol && sidebarCol) {
        if (worldNum === 4 || worldNum === 5 || worldNum === 6 || worldNum === 7) {
          canvasCol.className = 'lg:col-span-12 max-w-4xl mx-auto w-full flex flex-col gap-3';
          sidebarCol.className = 'lg:col-span-12 max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-3';
        } else {
          canvasCol.className = 'lg:col-span-8 flex flex-col gap-3';
          sidebarCol.className = 'lg:col-span-4 flex flex-col gap-3';
        }
      }

      const btnW4 = document.getElementById('btn-select-world4');
      if (worldNum === 4) {
        state.autoOpenedCardsAtTable = false;
        // Giro del Nivel 4: La Princesa toma el control principal para responder las 21 cartas
        state.activeChar = 'princess';
        const switchBtn = document.getElementById('btn-switch-char');
        if (switchBtn) switchBtn.textContent = '👸 Princesa (Protagonista Activa en Mundo 4)';

        subEl.textContent = 'Mundo 4: "Nuestra historia en una carta" (Las 21 Preguntas del Guardián)';
        trainClockBox.classList.add('hidden');
        btnW1.className = 'px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition flex items-center gap-1';
        btnW2.className = 'px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition flex items-center gap-1';
        if (btnW3) btnW3.className = 'px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition flex items-center gap-1';
        if (btnW4) btnW4.className = 'px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-purple-400 text-slate-950 shadow transition flex items-center gap-1';

        worldBadge.textContent = 'Mundo 4 / 7';
        sideTitle.textContent = 'Nuestra historia en una carta (21 Cartas)';
        sideDesc.innerHTML = 'El Guardián de la Gran Puerta con voz grave y misteriosa ordena que <b>solo la Princesa</b> responda las <b>21 cartas</b> sobre su historia en Lima. El reloj de 24 horas continúa sin reiniciarse y cada error resta <b>30 minutos (-00:30:00)</b>.';
        invLabel.textContent = 'Cartas Respondidas por la Princesa';
        bgmIcon.textContent = '🃏';

        state.princess.x = 400; state.princess.y = 415;
        state.duke.x = 340; state.duke.y = 425;
        state.princess.bubble = '👸 ¡Yo responderé las 21 cartas!';
        state.duke.bubble = '🤐 (En silencio confiando en ti)';
        document.getElementById('btn-flashback-manual').classList.add('hidden');
      } else if (btnW4) {
        btnW4.className = 'px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-purple-500/25 text-purple-200 border border-purple-400/50 hover:bg-purple-500/35 transition flex items-center gap-1';
      }

      const btnW5 = document.getElementById('btn-select-world5');
      if (worldNum === 5) {
        state.activeChar = 'princess';
        state.w5AutoOpenedTable = false;
        const switchBtn = document.getElementById('btn-switch-char');
        if (switchBtn) switchBtn.textContent = '👸 Princesa + 👑 Duque (En La Casa de los Faroles)';

        subEl.textContent = 'Mundo 5: "La Casa de los Faroles" — Estrella 5: La Estrella de la Complicidad';
        trainClockBox.classList.add('hidden');
        btnW1.className = 'px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition flex items-center gap-1';
        btnW2.className = 'px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition flex items-center gap-1';
        if (btnW3) btnW3.className = 'px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition flex items-center gap-1';
        if (btnW4) btnW4.className = 'px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition flex items-center gap-1';
        if (btnW5) btnW5.className = 'px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-red-400 text-slate-950 shadow transition flex items-center gap-1';

        worldBadge.textContent = 'Mundo 5 / 7';
        sideTitle.textContent = 'La Casa de los Faroles (Estrella de la Complicidad)';
        sideDesc.innerHTML = 'Reconstruyan el pedido exacto de aquella primera visita mediante <b>4 Cartas de Menú</b> (Makis, Ramens, Bebidas y Postres). <b>Cada error descuenta 2 HORAS (-02:00:00)</b> del reloj global que no se recuperan. Apóyense con sus habilidades <b>Recuerdo</b> e <b>Inventiva</b>.';
        invLabel.textContent = 'Pedido Reconstruido en la Mesa';
        bgmIcon.textContent = '🏮';

        state.princess.x = 120; state.princess.y = 335;
        state.duke.x = 80; state.duke.y = 350;
        state.princess.bubble = '🏮 ¡Recuerdo aquella noche!';
        state.duke.bubble = '🍜 ¡Reconstruyamos nuestro pedido!';
        document.getElementById('btn-flashback-manual').classList.add('hidden');
      } else if (btnW5) {
        btnW5.className = 'px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-red-500/25 text-red-200 border border-red-400/50 hover:bg-red-500/35 transition flex items-center gap-1';
      }

      const btnW6 = document.getElementById('btn-select-world6');
      if (worldNum === 6) {
        state.activeChar = 'princess';
        const switchBtn = document.getElementById('btn-switch-char');
        if (switchBtn) switchBtn.textContent = '👸 Princesa Sola (Duque en la Cárcel del Silencio)';

        subEl.textContent = 'Mundo 6: Gran Salón Rojo Imperial — Los 5 Armarios y la Foto con IA en la Playa';
        trainClockBox.classList.add('hidden');
        btnW1.className = 'px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition flex items-center gap-1';
        btnW2.className = 'px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition flex items-center gap-1';
        if (btnW3) btnW3.className = 'px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition flex items-center gap-1';
        if (btnW4) btnW4.className = 'px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition flex items-center gap-1';
        if (btnW5) btnW5.className = 'px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition flex items-center gap-1';
        if (btnW6) btnW6.className = 'px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-400 text-slate-950 shadow transition flex items-center gap-1';

        worldBadge.textContent = 'Mundo 6 / 7';
        sideTitle.textContent = 'El Salón Rojo Imperial y los 5 Armarios';
        sideDesc.innerHTML = 'La Princesa ha aparecido <b>sola</b> en este gran salón rojo estilo aristocracia rusa mientras el Duque está prisionero en la <b>Cárcel del Silencio (Mundo 7)</b>. Pasa por los <b>5 Armarios</b> y reconstruye cómo se veían juntos en la playa en aquella imagen editada con IA.';
        invLabel.textContent = 'Armarios Reales Completados';
        bgmIcon.textContent = '👗';

        state.princess.x = 400; state.princess.y = 430;
        state.princess.bubble = '👸 ¡¿Duque, dónde estás?! ¡Iré por ti!';
        document.getElementById('btn-flashback-manual').classList.add('hidden');
      } else if (btnW6) {
        btnW6.className = 'px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/25 text-rose-200 border border-rose-400/50 hover:bg-rose-500/35 transition flex items-center gap-1';
      }

      const btnW7 = document.getElementById('btn-select-world7');
      if (worldNum === 7) {
        // En el nivel final la Princesa es siempre el personaje controlable.
        // Se reafirma aquí para que ningún estado heredado del Mundo 6 la sustituya.
        state.activeChar = 'princess';
        state.keys = {};
        state.targetPoint = null;
        const switchBtn = document.getElementById('btn-switch-char');
        if (switchBtn) switchBtn.textContent = '👸 Carolina (En el Yate Blanco del Caribe)';

        subEl.textContent = 'Mundo 7 (Nivel Final): La Confesión — El Megayate Blanco en el Caribe al Atardecer';
        trainClockBox.classList.add('hidden');
        btnW1.className = 'px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition flex items-center gap-1';
        btnW2.className = 'px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition flex items-center gap-1';
        if (btnW3) btnW3.className = 'px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition flex items-center gap-1';
        if (btnW4) btnW4.className = 'px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition flex items-center gap-1';
        if (btnW5) btnW5.className = 'px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition flex items-center gap-1';
        if (btnW6) btnW6.className = 'px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition flex items-center gap-1';
        if (btnW7) btnW7.className = 'px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-400 text-slate-950 shadow transition flex items-center gap-1';

        worldBadge.textContent = 'Mundo 7 / 7';
        sideTitle.textContent = 'La Confesión (Nivel Final)';
        sideDesc.innerHTML = 'Al cruzar el portal esperando ver la Cárcel del Silencio, <b>Carolina</b> aparece en el yate más grande del Caribe al atardecer, decorado todo de blanco. En la cubierta superior la espera el Duque con el mismo traje que ella eligió en el Nivel 6.';
        invLabel.textContent = 'Destino Final';
        bgmIcon.textContent = '🛥️';

        state.princess.x = 400; state.princess.y = 415;
        state.princess.bubble = '👸 ¡¿Duque?! ¡¿Dónde está la Cárcel del Silencio?!';
        state.duke.x = 400; state.duke.y = 155;
        state.duke.bubble = '👑 Ven conmigo, Carolina...';
        state.w7ConfessionStarted = false;
        state.w7ConfessionStep = 0;
        document.getElementById('btn-flashback-manual').classList.add('hidden');
      } else if (btnW7) {
        btnW7.className = 'px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/25 text-amber-200 border border-amber-400/50 hover:bg-amber-500/35 transition flex items-center gap-1';
      }

      const currentBgmMeta = getWorldBgmMeta();
      bgmIcon.textContent = bgmEnabled ? currentBgmMeta.icon : '🔕';
      bgmLabel.textContent = bgmEnabled ? currentBgmMeta.label : 'Música: Pausada';

      if (bgmEnabled && !isMuted && audioCtx) {
        startWorldBGM();
      }

      renderStarsBar();
      renderInventoryAndChecklist();
      renderWorldsView();

      if (showIntro && worldNum !== 7) {
        openPrologueModal();
      } else if (worldNum === 7) {
        setDialogue(
          'CUBIERTA DEL MEGAYATE EN EL CARIBE',
          '🛥️',
          'Nivel 7: La Confesión',
          '«Carolina, sube por la escalinata blanca hacia la cubierta superior donde te espera el Duque al atardecer.»',
          [{
            label: '💍 Caminar hacia el Duque Ahora',
            action: () => {
              state.keys = {};
              state.activeChar = 'princess';
              state.targetPoint = { x: 400, y: 190 };
              const switchBtn = document.getElementById('btn-switch-char');
              if (switchBtn) switchBtn.textContent = '👸 Carolina (Personaje controlable)';
            }
          }]
        );
      }

      // FIX RENDER SYNC: fuerza el repintado inmediato del escenario después
      // de cambiar el estado del mundo y actualizar la interfaz.
      if (typeof drawGame === 'function') {
        drawGame();
      }
    }

    // =========================================================
    // PROLOGUE MODAL CONTROLLER
    // =========================================================
    function getActivePrologueScript() {
      return state.currentWorld === 6 ? prologueScriptWorld6 : (state.currentWorld === 5 ? prologueScriptWorld5 : (state.currentWorld === 4 ? prologueScriptWorld4 : (state.currentWorld === 3 ? prologueScriptWorld3 : (state.currentWorld === 2 ? prologueScriptWorld2 : prologueScriptWorld1))));
    }

    function renderPrologueStep(index) {
      const script = getActivePrologueScript();
      if (index < 0 || index >= script.length) {
        closePrologueModal();
        return;
      }
      state.prologueStep = index;
      const step = script[index];
      sfxDialogueBlip(step.avatar === '👑');

      document.getElementById('prologue-badge').textContent =
        state.currentWorld === 6 ? '🏛️ MUNDO 6: SALÓN ROJO IMPERIAL (5 ARMARIOS)' : (state.currentWorld === 5 ? '🏮 MUNDO 5: LA CASA DE LOS FAROLES' : (state.currentWorld === 4 ? '🃏 MUNDO 4: NUESTRA HISTORIA EN UNA CARTA' : (state.currentWorld === 3 ? '🌊 MUNDO 3: LA ROSA NÁUTICA (MIRAFLORES)' : (state.currentWorld === 2 ? '🚂 MUNDO 2: EL TREN DE LAS 02:30 PM' : '🎄 MUNDO 1: NAVIDAD 21 DIC 2025'))));
      document.getElementById('prologue-scene-tag').textContent = step.tag;
      document.getElementById('prologue-avatar').textContent = step.avatar;
      document.getElementById('prologue-speaker').textContent = step.speaker;
      document.getElementById('prologue-text').textContent = step.text;
      document.getElementById('prologue-context-note').textContent = step.context;

      const choicesContainer = document.getElementById('prologue-choices');
      choicesContainer.innerHTML = '';
      step.choices.forEach(ch => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition text-left sm:text-center';
        btn.textContent = ch.label;
        btn.addEventListener('click', () => {
          initAudio();
          renderPrologueStep(ch.next);
        });
        choicesContainer.appendChild(btn);
      });
    }

    function openPrologueModal() {
      document.getElementById('modal-prologue').classList.remove('hidden');
      renderPrologueStep(0);
    }

    function closePrologueModal() {
      document.getElementById('modal-prologue').classList.add('hidden');
      state.talkedInRoom = true;
      renderInventoryAndChecklist();

      if (state.currentWorld === 6) {
        const nextW = wardrobesWorld6[state.w6CurrentWardrobeStep];
        if (nextW) {
          state.targetPoint = { x: nextW.x, y: nextW.y + 42 };
        }
        setDialogue(
          'SISTEMA CENTRAL [EL RELOJ NO SE DETIENE]',
          '🏛️',
          `Armarios Superados: ${state.w6CurrentWardrobeStep} / 5 • Duque en la Cárcel del Silencio`,
          '«El reloj global sigue corriendo, Princesa. Camina hacia cada uno de los <b>5 Armarios</b> en orden (o pulsa el botón de abajo) y elige las prendas exactas de aquella imagen con IA en la playa.»',
          [
            { label: '👗 Abrir el Armario Actual Ahora', action: () => openWorld6WardrobeModal(state.w6CurrentWardrobeStep) },
            { label: '👣 Caminar hacia el Siguiente Armario', action: () => autoGuideToNextObjective() }
          ]
        );
        return;
      }

      if (state.currentWorld === 5) {
        state.w5TalkedToGuardian = true;
        state.w5AutoOpenedTable = false;
        state.targetPoint = { x: state.lanternTableW5.x - 15, y: state.lanternTableW5.y + 42 };
        setDialogue(
          'GUARDIÁN DE LA CASA DE LOS FAROLES',
          '🏮',
          'El Pedido de Aquella Noche • Regla: -2 Horas por Error',
          '«Adelante, Princesa y Duque. En su mesa central los esperan las 4 Cartas del Menú. Al llegar a la mesa se abrirá automáticamente la Primera Carta (Makis).»',
          [
            { label: '🍣 Abrir las 4 Cartas del Pedido Ahora', action: () => openWorld5MenuModal() }
          ]
        );
        return;
      }

      if (state.currentWorld === 4) {
        sfxGuardianDeepVoice();
        // La Princesa avanza automáticamente por el centro hacia la mesa del Guardián y al llegar se abre sola la Carta 1 en el centro
        state.autoOpenedCardsAtTable = false;
        state.targetPoint = { x: state.guardianTableWorld4.x, y: state.guardianTableWorld4.y + 42 };
        setDialogue(
          'EL GUARDIÁN DE LA PUERTA (VOZ GRAVE)',
          '👁️',
          `Cartas Superadas: ${state.currentCardIndex} / 21`,
          '«Avanza hacia mi mesa en el centro del salón, Princesa. Al llegar frente a mí, la primera carta se revelará automáticamente ante tus ojos.»',
          [
            { label: '🃏 Abrir la Mesa de las 21 Cartas Ahora', action: () => openWorld4CardsModal() }
          ]
        );
        return;
      }

      if (state.currentWorld === 3) {
        setDialogue(
          'EL DUQUE (DE TERNO NEGRO)',
          '🤵',
          'Espigón de La Rosa Náutica — Atardecer en Miraflores',
          '«Mira qué preciosidad de atardecer sobre el mar de Miraflores, Princesa. Esquivemos las olas del espigón, las gaviotas y los mozos con bandejas, recojamos los 2 recuerdos de nuestra velada y sentémonos en la mesa frente al océano para pedir nuestro postre.»',
          [
            { label: '🏮 Ir por el Recuerdo 1 en el Muelle', action: () => autoGuideToNextObjective() },
            { label: '💬 Conversar mientras caminan sobre el mar', action: () => triggerCoupleBanter() }
          ]
        );
        return;
      }

      if (state.currentWorld === 2) {
        playTrainWhistle();
        setDialogue(
          'EL DUQUE (TOMANDO SU MANO)',
          '👑',
          'Reloj de la Estación: 02:25 PM (Faltan 05:00)',
          '«¡Escucha el silbato del tren, Princesa! Aún estamos medio confundidos por cómo aparecimos aquí tras el túnel, pero no podemos perder ese tren de las <b>02:30 PM</b>. ¡Recojamos los 3 recuerdos del paseo esquivando los obstáculos y corramos al andén!»',
          [
            {
              label: '🌹 Ir por el Recuerdo 1 (Rosa del Paseo)',
              action: () => autoGuideToNextObjective()
            },
            {
              label: '⚡ Impulso: Correr de la Mano',
              action: () => activateRomanticSprint()
            }
          ]
        );
      } else {
        setDialogue(
          'LA PRINCESA',
          '👸',
          'Salón Navideño (21 Dic 2025)',
          '«Todavía no puedo creer que ese túnel nos trajera a la Navidad del trabajo... Ven, Duque, acerquémonos al perchero de la izquierda para vestirnos de José y María.»',
          [
            {
              label: '👘 Caminar hacia los trajes de José y María',
              action: () => { state.targetPoint = { x: 130, y: 185 }; }
            }
          ]
        );
      }
    }

    // =========================================================
    // UI RENDERING & HUD HELPERS
    // =========================================================
    function renderStarsBar() {
      const container = document.getElementById('stars-bar');
      container.innerHTML = '';
      for (let i = 1; i <= 7; i++) {
        const earned = (i === 1 && state.star1Earned) || (i === 2 && state.star2Earned) || (i === 3 && state.star3Earned) || (i === 4 && state.star4Earned) || (i === 5 && state.star5Earned) || (i === 6 && state.star6Earned) || (i === 7 && state.star7Earned);
        const span = document.createElement('span');
        span.className = earned
          ? 'w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-xs font-bold shadow star-glow transition-all scale-110'
          : 'w-5 h-5 rounded-full bg-slate-800 text-slate-600 border border-slate-700 flex items-center justify-center text-[10px]';
        span.textContent = '★';
        span.title = `Estrella ${i}`;
        container.appendChild(span);
      }
    }

    function renderInventoryAndChecklist() {
      const checklistEl = document.getElementById('checklist-container');
      const grid = document.getElementById('inventory-grid');
      const statusEl = document.getElementById('mission-status-text');

      if (state.currentWorld === 1) {
        const propItems = state.itemsWorld1.filter(it => it.type === 'prop');
        const collectedCount = propItems.filter(it => it.collected).length;
        document.getElementById('items-count').textContent = `${collectedCount}/${propItems.length}`;

        grid.innerHTML = '';
        propItems.forEach(item => {
          const div = document.createElement('div');
          div.className = item.collected
            ? 'p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 flex items-center gap-1.5 font-medium'
            : 'p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-500 flex items-center gap-1.5';
          div.innerHTML = `<span>${item.icon}</span><span class="truncate">${item.title}</span>`;
          grid.appendChild(div);
        });

        const stepsW1 = [
          { done: state.talkedInRoom, text: 'Despertar tras el túnel y hablar entre ustedes' },
          { done: state.costumesEquipped, text: 'Vestir los trajes de <b>José y María</b> (Perchero)' },
          { done: state.flashbackSeen, text: 'Vivir el <b>Flashback del 21 de dic. 2025</b>' },
          { done: collectedCount === propItems.length, text: 'Armar el Pesebre con sus 4 detalles' },
          { done: state.star1Earned && state.exitPortalWorld2.active, text: 'Interpretar la escena y abrir el Portal al Mundo 2' }
        ];
        checklistEl.innerHTML = '<div class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Objetivos Mundo 1:</div>';
        stepsW1.forEach((st, idx) => {
          checklistEl.innerHTML += `
            <div id="check-step-${idx}" class="flex items-center gap-2 text-xs ${st.done ? 'text-emerald-300 font-medium' : 'text-slate-400'}">
              <span class="w-4 h-4 rounded ${st.done ? 'bg-emerald-500 text-slate-950 font-bold' : 'border border-slate-600'} flex items-center justify-center text-[10px]">${st.done ? '✓' : idx + 1}</span>
              <span>${st.text}</span>
            </div>`;
        });

        if (!state.costumesEquipped) {
          statusEl.textContent = 'Mundo 1: Ve al Perchero Real (izquierda) y presiona [Espacio] para vestir de José y María.';
        } else if (collectedCount < propItems.length) {
          statusEl.textContent = `Mundo 1: Reúne los 4 detalles del pesebre (${collectedCount}/4 colocados en el altar).`;
        } else if (!state.exitPortalWorld2.active) {
          statusEl.textContent = '¡Pesebre completo! Ve al Altar Central y presiona [Espacio] para interpretar la escena.';
        } else {
          statusEl.textContent = '★ ¡Estrella 1 lista! Cruza el Portal Estelar (derecha) hacia el Mundo 2 (Tren 02:30 PM).';
        }
      } else if (state.currentWorld === 7) {
        document.getElementById('items-count').textContent = state.star7Earned ? '7/7' : 'Final';
        grid.innerHTML = `
          <div class="col-span-2 p-2.5 rounded-lg bg-amber-500/15 border border-amber-400/50 text-amber-200 text-xs font-medium text-center">
            🛥️ Nivel Final: La Confesión en el Caribe
          </div>`;
        checklistEl.innerHTML = '<div class="text-xs font-semibold text-amber-300 uppercase tracking-wider">Objetivos Mundo 7:</div>' +
          `<div class="flex items-center gap-2 text-xs ${state.w7ConfessionStarted ? 'text-emerald-300 font-medium' : 'text-slate-300'}"><span class="w-4 h-4 rounded ${state.w7ConfessionStarted ? 'bg-emerald-500 text-slate-950 font-bold' : 'border border-slate-600'} flex items-center justify-center text-[10px]">${state.w7ConfessionStarted ? '✓' : '1'}</span><span>Subir a la cubierta superior blanca con el Duque</span></div>` +
          `<div class="flex items-center gap-2 text-xs ${state.star7Earned ? 'text-emerald-300 font-medium' : 'text-slate-300'}"><span class="w-4 h-4 rounded ${state.star7Earned ? 'bg-emerald-500 text-slate-950 font-bold' : 'border border-slate-600'} flex items-center justify-center text-[10px]">${state.star7Earned ? '✓' : '2'}</span><span>Escuchar "La Confesión" y tomar la decisión final</span></div>`;
        statusEl.textContent = state.star7Earned
          ? '★★★★★★★ ¡7/7 Estrellas! La historia ha llegado a su cierre.'
          : 'Mundo 7: Camina hacia el Duque en la cubierta superior blanca para iniciar "La Confesión".';
      } else if (state.currentWorld === 6) {
        document.getElementById('items-count').textContent = `${state.w6CurrentWardrobeStep}/5`;

        grid.innerHTML = '';
        wardrobesWorld6.forEach((w, idx) => {
          const done = idx < state.w6CurrentWardrobeStep;
          const div = document.createElement('div');
          div.className = done
            ? 'p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 flex items-center gap-1.5 font-medium'
            : 'p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-500 flex items-center gap-1.5';
          div.innerHTML = `<span>${done ? '✓' : w.icon}</span><span class="truncate">${w.shortTitle}</span>`;
          grid.appendChild(div);
        });

        const stepsW6 = [
          { done: state.w6CurrentWardrobeStep >= 1, text: '<b>Armario 1 (Vestidos):</b> Vestido largo color vino con corsé y abertura' },
          { done: state.w6CurrentWardrobeStep >= 2, text: '<b>Armario 2 (Zapatos Princesa):</b> Sandalias de tacón color vino con correa' },
          { done: state.w6CurrentWardrobeStep >= 3, text: '<b>Armario 3 (Pulseras y Relojes):</b> Pulsera fina plateada + guantes negros del Duque' },
          { done: state.w6CurrentWardrobeStep >= 4, text: '<b>Armario 4 (Ternos del Duque):</b> Terno negro con chaleco, camisa vino y abrigo borgoña' },
          { done: state.star6Earned, text: '<b>Armario 5 (Zapatos Duque):</b> Zapatos negros Oxford/Derby y abrir portal al Mundo 7' }
        ];
        checklistEl.innerHTML = '<div class="text-xs font-semibold text-rose-300 uppercase tracking-wider">Objetivos Mundo 6 (5 Armarios):</div>';
        stepsW6.forEach((st, idx) => {
          checklistEl.innerHTML += `
            <div id="check-step-${idx}" class="flex items-center gap-2 text-xs ${st.done ? 'text-emerald-300 font-medium' : 'text-slate-300'}">
              <span class="w-4 h-4 rounded ${st.done ? 'bg-emerald-500 text-slate-950 font-bold' : 'border border-slate-600'} flex items-center justify-center text-[10px]">${st.done ? '✓' : idx + 1}</span>
              <span>${st.text}</span>
            </div>`;
        });

        if (!state.star6Earned) {
          const curW = wardrobesWorld6[state.w6CurrentWardrobeStep];
          statusEl.textContent = `Mundo 6 (Salón Imperial Rojo): Dirígete al ${curW ? curW.name : 'Armario'} (${state.w6CurrentWardrobeStep}/5) para rescatar al Duque.`;
        } else {
          statusEl.textContent = '★★★★★★ ¡Foto en la playa reconstruida! Cruza el portal hacia la Cárcel del Silencio (Mundo 7).';
        }

      } else if (state.currentWorld === 5) {
        document.getElementById('items-count').textContent = `${state.w5CurrentMenuStep}/4`;

        const orderNames = ['1. Makis Furai', '2. Shoyu Ramen', '3. Maracuyá Frozen', '4. Sin postre'];
        grid.innerHTML = '';
        orderNames.forEach((name, idx) => {
          const done = idx < state.w5CurrentMenuStep;
          const div = document.createElement('div');
          div.className = done
            ? 'p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 flex items-center gap-1.5 font-medium'
            : 'p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-500 flex items-center gap-1.5';
          div.innerHTML = `<span>${done ? '✓' : '🏮'}</span><span class="truncate">${done ? name : `Carta ${idx + 1} pendiente`}</span>`;
          grid.appendChild(div);
        });

        const stepsW5 = [
          { done: state.w5TalkedToGuardian || state.talkedInRoom, text: 'Escuchar al Guardián en la entrada de <b>La Casa de los Faroles</b>' },
          { done: state.w5CurrentMenuStep >= 1, text: 'Primera Carta (Makis): Elegir <b>Makis Furai</b>' },
          { done: state.w5CurrentMenuStep >= 2, text: 'Segunda Carta (Ramens): Elegir <b>Shoyu Ramen</b>' },
          { done: state.w5CurrentMenuStep >= 3, text: 'Tercera Carta (Bebidas): Elegir <b>Maracuyá Frozen</b>' },
          { done: state.star5Earned, text: 'Cuarta Carta Capciosa (<b>Sin postre</b>) y ganar la <b>Estrella de la Complicidad</b>' }
        ];
        checklistEl.innerHTML = '<div class="text-xs font-semibold text-red-300 uppercase tracking-wider">Objetivos Mundo 5 (4 Cartas):</div>';
        stepsW5.forEach((st, idx) => {
          checklistEl.innerHTML += `
            <div id="check-step-${idx}" class="flex items-center gap-2 text-xs ${st.done ? 'text-emerald-300 font-medium' : 'text-slate-300'}">
              <span class="w-4 h-4 rounded ${st.done ? 'bg-emerald-500 text-slate-950 font-bold' : 'border border-slate-600'} flex items-center justify-center text-[10px]">${st.done ? '✓' : idx + 1}</span>
              <span>${st.text}</span>
            </div>`;
        });

        if (!state.star5Earned) {
          statusEl.textContent = `Mundo 5 (La Casa de los Faroles): Reconstruye el pedido en las 4 cartas (${state.w5CurrentMenuStep}/4). Error = -2 Horas.`;
        } else {
          statusEl.textContent = '★★★★★ ¡Estrella de la Complicidad obtenida! Pedido servido en la mesa.';
        }
      } else if (state.currentWorld === 4) {
        document.getElementById('items-count').textContent = `${state.currentCardIndex}/21`;

        grid.innerHTML = `
          <div class="col-span-2 p-2.5 rounded-lg bg-purple-950/50 border border-purple-500/40 text-purple-200 flex items-center justify-between">
            <span>🃏 Cartas superadas: <b>${state.currentCardIndex} / 21</b></span>
            <span class="text-rose-300 font-mono-sys">Penalizaciones: -${state.world4PenaltiesCount * 30} min</span>
          </div>
        `;

        const stepsW4 = [
          { done: state.talkedInRoom, text: 'Escuchar el giro del Guardián: <b>solo responde la Princesa</b>' },
          { done: state.currentCardIndex >= 7, text: 'Superar el <b>Acto I</b> (Cartas 1 a 7: El Origen y Fechas)' },
          { done: state.currentCardIndex >= 14, text: 'Superar el <b>Acto II</b> (Cartas 8 a 14: Citas en Lima)' },
          { done: state.currentCardIndex >= 21, text: 'Superar el <b>Acto III</b> (Cartas 15 a 21: Secretos y Futuro)' },
          { done: state.star4Earned, text: 'Abrir la Gran Puerta y cruzar hacia el <b>Mundo 5</b>' }
        ];
        checklistEl.innerHTML = '<div class="text-xs font-semibold text-purple-300 uppercase tracking-wider">Objetivos Mundo 4 (21 Cartas):</div>';
        stepsW4.forEach((st, idx) => {
          checklistEl.innerHTML += `
            <div id="check-step-${idx}" class="flex items-center gap-2 text-xs ${st.done ? 'text-emerald-300 font-medium' : 'text-slate-300'}">
              <span class="w-4 h-4 rounded ${st.done ? 'bg-emerald-500 text-slate-950 font-bold' : 'border border-slate-600'} flex items-center justify-center text-[10px]">${st.done ? '✓' : idx + 1}</span>
              <span>${st.text}</span>
            </div>`;
        });

        if (!state.star4Earned) {
          statusEl.textContent = `Mundo 4: Acércate a la Mesa del Guardián y responde las 21 cartas con la Princesa (${state.currentCardIndex}/21).`;
        } else {
          statusEl.textContent = '★★★★ ¡Las 21 Cartas fueron respondidas! La Gran Puerta hacia el Mundo 5 está abierta.';
        }


      } else if (state.currentWorld === 3) {
        const collectedW3 = state.itemsWorld3.filter(it => it.collected).length;
        document.getElementById('items-count').textContent = `${collectedW3}/${state.itemsWorld3.length}`;

        grid.innerHTML = '';
        state.itemsWorld3.forEach(item => {
          const div = document.createElement('div');
          div.className = item.collected
            ? 'p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 flex items-center gap-1.5 font-medium'
            : 'p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-500 flex items-center gap-1.5';
          div.innerHTML = `<span>${item.icon}</span><span class="truncate">${item.title}</span>`;
          grid.appendChild(div);
        });

        const stepsW3 = [
          { done: state.talkedInRoom, text: 'Llegar al espigón de <b>La Rosa Náutica</b> al atardecer' },
          { done: collectedW3 >= 1, text: 'Recoger el recuerdo del <b>Farol del Espigón</b> sobre las olas' },
          { done: collectedW3 === 2, text: 'Recoger la <b>Vela y Reserva Frente al Mar</b> esquivando mozos' },
          { done: state.star3Earned, text: 'Llegar a la Mesa del Mirador y elegir el postre: <b>Helado de lúcuma</b>' },
          { done: state.star3Earned, text: 'Desbloquear la Estrella 3 y la promesa frente al mar' }
        ];
        checklistEl.innerHTML = '<div class="text-xs font-semibold text-amber-300 uppercase tracking-wider">Objetivos Mundo 3 (La Rosa Náutica):</div>';
        stepsW3.forEach((st, idx) => {
          checklistEl.innerHTML += `
            <div id="check-step-${idx}" class="flex items-center gap-2 text-xs ${st.done ? 'text-emerald-300 font-medium' : 'text-slate-300'}">
              <span class="w-4 h-4 rounded ${st.done ? 'bg-emerald-500 text-slate-950 font-bold' : 'border border-slate-600'} flex items-center justify-center text-[10px]">${st.done ? '✓' : idx + 1}</span>
              <span>${st.text}</span>
            </div>`;
        });

        if (collectedW3 < state.itemsWorld3.length) {
          statusEl.textContent = `Mundo 3 (Miraflores): Cruza el espigón esquivando olas, gaviotas y mozos (${collectedW3}/2 recuerdos).`;
        } else if (!state.star3Earned) {
          statusEl.textContent = '¡Mesa lista frente al mar! Ve a la Mesa del Mirador (derecha) y presiona [Espacio] para elegir el postre.';
        } else {
          statusEl.textContent = '★★★ ¡Helado de lúcuma elegido! Estrella 3 recuperada en La Rosa Náutica.';
        }
      } else {
        // WORLD 2 INVENTORY & CHECKLIST
        const collectedW2 = state.itemsWorld2.filter(it => it.collected).length;
        document.getElementById('items-count').textContent = `${collectedW2}/${state.itemsWorld2.length}`;

        grid.innerHTML = '';
        state.itemsWorld2.forEach(item => {
          const div = document.createElement('div');
          div.className = item.collected
            ? 'p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 flex items-center gap-1.5 font-medium'
            : 'p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-500 flex items-center gap-1.5';
          div.innerHTML = `<span>${item.icon}</span><span class="truncate">${item.title}</span>`;
          grid.appendChild(div);
        });

        const stepsW2 = [
          { done: state.talkedInRoom, text: 'Recordar la tarde de paseo y el tren de las <b>02:30 PM</b>' },
          { done: collectedW2 >= 1, text: 'Recoger la <b>Rosa del Paseo</b> en la banca del parque' },
          { done: collectedW2 >= 2, text: 'Recuperar la <b>Foto Instantánea</b> esquivando obstáculos' },
          { done: collectedW2 === 3, text: 'Recoger los <b>2 Boletos (02:30 PM)</b> antes de que acabe el reloj' },
          { done: state.star2Earned, text: 'Llegar al Andén, decir su promesa y <b>subir al Tren al Mundo 3</b>' }
        ];
        checklistEl.innerHTML = '<div class="text-xs font-semibold text-rose-300 uppercase tracking-wider">Objetivos Mundo 2 (Reloj 5 Minutos):</div>';
        stepsW2.forEach((st, idx) => {
          checklistEl.innerHTML += `
            <div id="check-step-${idx}" class="flex items-center gap-2 text-xs ${st.done ? 'text-emerald-300 font-medium' : 'text-slate-300'}">
              <span class="w-4 h-4 rounded ${st.done ? 'bg-emerald-500 text-slate-950 font-bold' : 'border border-slate-600'} flex items-center justify-center text-[10px]">${st.done ? '✓' : idx + 1}</span>
              <span>${st.text}</span>
            </div>`;
        });

        if (collectedW2 < state.itemsWorld2.length) {
          statusEl.textContent = `¡Faltan pocos minutos para las 02:30 PM! Esquiva los obstáculos y reúne los recuerdos del paseo (${collectedW2}/3).`;
        } else if (!state.star2Earned) {
          statusEl.textContent = '¡Tienen los boletos de las 02:30 PM! Corran juntos al Andén del Tren (arriba a la derecha) y presionen [Espacio].';
        } else {
          statusEl.textContent = '★★ ¡Llegaron a tiempo al Tren de las 02:30 PM! Estrella 2 recuperada rumbo al Mundo 3.';
        }
      }
    }

    function setDialogue(speaker, avatar, stepLabel, text, choices = []) {
      document.getElementById('speaker-badge').textContent = speaker;
      document.getElementById('speaker-avatar').textContent = avatar;
      document.getElementById('dialogue-step-indicator').textContent = stepLabel;
      document.getElementById('dialogue-box-text').innerHTML = text;
      const choicesEl = document.getElementById('dialogue-choices');
      choicesEl.innerHTML = '';
      choices.forEach(ch => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 text-xs font-medium transition';
        btn.textContent = ch.label;
        btn.addEventListener('click', ch.action);
        choicesEl.appendChild(btn);
      });
    }

    function triggerCoupleBanter() {
      state.talkedInRoom = true;
      if (state.currentWorld === 6) {
        sfxGuardianDeepVoice();
        setDialogue(
          'LA PRINCESA (LLAMANDO AL DUQUE EN EL SALÓN ROJO)',
          '👸',
          'Sin respuesta del Duque • Reloj Corriendo',
          '<b>👸 Princesa:</b> «¡¡Duque!! ¿Me escuchas?... Qué vacío se siente este salón sin ti a mi lado.»<br><br><b>👁️ Sistema Central:</b> «Él no puede oírte desde la <b>Cárcel del Silencio</b> en el Mundo 7. Completa los 5 Armarios si quieres volver a verlo.»',
          [
            { label: '👗 Abrir el Siguiente Armario Ahora', action: () => openWorld6WardrobeModal(state.w6CurrentWardrobeStep) }
          ]
        );
        return;
      }
      renderInventoryAndChecklist();
      const activeBanterList = state.currentWorld === 5 ? banterWorld5 : (state.currentWorld === 4 ? banterWorld4 : (state.currentWorld === 3 ? banterWorld3 : (state.currentWorld === 2 ? banterWorld2 : banterWorld1)));
      const b = activeBanterList[state.banterIndex % activeBanterList.length];
      state.banterIndex++;
      sfxDialogueBlip(b.avatar === '👑');

      setDialogue(
        b.speaker,
        b.avatar,
        b.stepLabel,
        b.text,
        [
          {
            label: b.replyLabel,
            action: () => {
              sfxDialogueBlip(b.replyAvatar === '👑');
              setDialogue(
                b.replySpeaker,
                b.replyAvatar,
                b.stepLabel + ' — Respuesta',
                b.replyText,
                [
                  {
                    label: '💬 Seguir conversando entre ellos',
                    action: () => triggerCoupleBanter()
                  },
                  {
                    label: '✨ Ir al siguiente objetivo',
                    action: () => autoGuideToNextObjective()
                  }
                ]
              );
            }
          }
        ]
      );
    }

    function renderWorldsView() {
      const grid = document.getElementById('worlds-grid');
      grid.innerHTML = '';
      state.worldsList.forEach(w => {
        const isPlayable = w.num >= 1 && w.num <= 7;
        const earned = (w.num === 1 && state.star1Earned) || (w.num === 2 && state.star2Earned) || (w.num === 3 && state.star3Earned) || (w.num === 4 && state.star4Earned) || (w.num === 5 && state.star5Earned) || (w.num === 6 && state.star6Earned) || (w.num === 7 && state.star7Earned);
        const card = document.createElement('div');
        card.className = `rounded-xl p-4 border transition ${
          w.num === state.currentWorld
            ? 'bg-amber-500/15 border-amber-400'
            : isPlayable
            ? 'bg-slate-900/90 border-cyan-500/40'
            : 'bg-slate-950/70 border-slate-800/90'
        }`;
        card.innerHTML = `
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-mono-sys px-2 py-0.5 rounded ${
              earned
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : isPlayable
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-800 text-slate-400'
            }">${earned ? '★ ESTRELLA RECUPERADA' : w.status}</span>
            <span class="text-xs text-slate-400 font-mono-sys">${w.date}</span>
          </div>
          <h3 class="font-serif-title font-bold text-sm sm:text-base text-slate-100 mb-1">${w.title}</h3>
          <p class="text-xs text-slate-300 leading-relaxed mb-3">${w.desc}</p>
          ${isPlayable ? `<button type="button" data-play-world="${w.num}" class="w-full py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/35 border border-amber-400/50 text-amber-200 text-xs font-bold transition">🎮 Jugar Mundo ${w.num}</button>` : ''}
        `;
        grid.appendChild(card);
      });

      grid.querySelectorAll('[data-play-world]').forEach(btn => {
        btn.addEventListener('click', () => {
          const targetW = parseInt(btn.getAttribute('data-play-world'), 10);
          switchTab('game');
          loadWorld(targetW, true);
        });
      });
    }

    // =========================================================
    // INTERACTION & GAMEPLAY LOGIC (WORLD 1 & WORLD 2)
    // =========================================================
    function isAnyModalOpen() {
      const modalIds = [
        'modal-prologue',
        'modal-flashback',
        'modal-victory',
        'modal-world-transition',
        'modal-world2-victory',
        'modal-train-journey-world3',
        'modal-world3-dessert',
        'modal-world3-victory',
        'modal-world4-cards',
        'modal-world4-victory',
        'modal-world5-menu',
        'modal-world5-victory',
        'modal-world6-wardrobe',
        'modal-world6-victory',
        'modal-world7-confession',
        'modal-world7-ending-yes',
        'modal-world7-ending-no'
      ];
      return modalIds.some(id => {
        const el = document.getElementById(id);
        return el && !el.classList.contains('hidden');
      });
    }

    function applyDirectionalPushback(player, companion, obs) {
      let pushX = player.x - obs.x;
      let pushY = player.y - obs.y;
      const len = Math.hypot(pushX, pushY) || 1;
      pushX = (pushX / len) * 38;
      pushY = (pushY / len) * 38;
      player.x = Math.max(50, Math.min(LOGICAL_W - 50, player.x + pushX));
      player.y = Math.max(108, Math.min(LOGICAL_H - 38, player.y + pushY));
      companion.x = Math.max(45, Math.min(LOGICAL_W - 45, companion.x + pushX));
      companion.y = Math.max(108, Math.min(LOGICAL_H - 38, companion.y + pushY));
    }

    function getControlledChar() {
      return state.activeChar === 'duke' ? state.duke : state.princess;
    }

    function getCompanionChar() {
      return state.activeChar === 'duke' ? state.princess : state.duke;
    }

    function addFloatingText(x, y, text, color = '#fde047') {
      state.floatingTexts.push({ x, y, text, color, alpha: 1.0, vy: -0.95 });
    }

    function activateRomanticSprint() {
      initAudio();
      state.sprintBoostTimer = 150;
      playTone(587.33, 'triangle', 0.12, 0, 0.1);
      playTone(880.00, 'triangle', 0.18, 0.08, 0.12);
      if (state.currentWorld === 6 || state.currentWorld === 7) {
        state.princess.bubble = state.currentWorld === 7 ? '⚡ ¡Voy hacia el Duque!' : '⚡ ¡Debo apresurarme por el Duque!';
        addFloatingText(state.princess.x, state.princess.y - 22, '⚡ ¡Paso veloz de la Princesa!', '#f472b6');
        return;
      }
      state.duke.bubble = '⚡ ¡De mi mano, Princesa!';
      state.princess.bubble = '⚡ ¡Corramos juntos!';
      addFloatingText(state.duke.x, state.duke.y - 22, '⚡ ¡Corriendo de la mano!', '#34d399');
    }

    function findNearbyInteractable() {
      const player = getControlledChar();

      if (state.currentWorld === 1) {
        for (const item of state.itemsWorld1) {
          if (!item.collected) {
            const dist = Math.hypot(player.x - item.x, player.y - item.y);
            if (dist < player.r + item.r + 18) return { kind: 'item_w1', data: item };
          }
        }
        const altar = state.mangerAltar;
        if (
          player.x > altar.x - altar.w / 2 - 28 &&
          player.x < altar.x + altar.w / 2 + 28 &&
          player.y > altar.y - altar.h / 2 - 28 &&
          player.y < altar.y + altar.h / 2 + 38
        ) {
          return { kind: 'altar_w1', data: altar };
        }
        if (state.exitPortalWorld2.active) {
          const pDist = Math.hypot(player.x - state.exitPortalWorld2.x, player.y - state.exitPortalWorld2.y);
          if (pDist < player.r + state.exitPortalWorld2.r + 18) {
            return { kind: 'portal_world2', data: state.exitPortalWorld2 };
          }
        }
      } else if (state.currentWorld === 2) {
        for (const item of state.itemsWorld2) {
          if (!item.collected) {
            const dist = Math.hypot(player.x - item.x, player.y - item.y);
            if (dist < player.r + item.r + 18) return { kind: 'item_w2', data: item };
          }
        }
        const plat = state.trainPlatform;
        if (
          player.x > plat.x - plat.w / 2 - 26 &&
          player.x < plat.x + plat.w / 2 + 26 &&
          player.y > plat.y - plat.h / 2 - 26 &&
          player.y < plat.y + plat.h / 2 + 36
        ) {
          return { kind: 'train_platform_w2', data: plat };
        }
      } else if (state.currentWorld === 3) {
        for (const item of state.itemsWorld3) {
          if (!item.collected) {
            const dist = Math.hypot(player.x - item.x, player.y - item.y);
            if (dist < player.r + item.r + 18) return { kind: 'item_w3', data: item };
          }
        }
        if (state.exitPortalWorld4.active) {
          const pDist4 = Math.hypot(player.x - state.exitPortalWorld4.x, player.y - state.exitPortalWorld4.y);
          if (pDist4 < player.r + state.exitPortalWorld4.r + 18) {
            return { kind: 'portal_world4', data: state.exitPortalWorld4 };
          }
        }
        const tbl = state.seaTableWorld3;
        if (
          player.x > tbl.x - tbl.w / 2 - 26 &&
          player.x < tbl.x + tbl.w / 2 + 26 &&
          player.y > tbl.y - tbl.h / 2 - 26 &&
          player.y < tbl.y + tbl.h / 2 + 36
        ) {
          return { kind: 'table_w3', data: tbl };
        }
      } else if (state.currentWorld === 4) {
        const gTbl = state.guardianTableWorld4;
        if (
          player.x > gTbl.x - gTbl.w / 2 - 28 &&
          player.x < gTbl.x + gTbl.w / 2 + 28 &&
          player.y > gTbl.y - gTbl.h / 2 - 28 &&
          player.y < gTbl.y + gTbl.h / 2 + 38
        ) {
          return { kind: 'guardian_table_w4', data: gTbl };
        }
        if (state.star4Earned) {
          const door = state.greatDoorWorld4;
          if (
            player.x > door.x - door.w / 2 - 25 &&
            player.x < door.x + door.w / 2 + 25 &&
            player.y > door.y - door.h / 2 - 25 &&
            player.y < door.y + door.h / 2 + 35
          ) {
            return { kind: 'door_w4', data: door };
          }
        }
      } else if (state.currentWorld === 5) {
        const sTbl = state.lanternTableW5;
        if (
          player.x > sTbl.x - sTbl.w / 2 - 28 &&
          player.x < sTbl.x + sTbl.w / 2 + 28 &&
          player.y > sTbl.y - sTbl.h / 2 - 28 &&
          player.y < sTbl.y + sTbl.h / 2 + 38
        ) {
          return { kind: 'lantern_table_w5', data: sTbl };
        }
        const gEnt = state.lanternGuardianW5;
        if (Math.hypot(player.x - gEnt.x, player.y - gEnt.y) < player.r + gEnt.r + 18) {
          return { kind: 'guardian_w5', data: gEnt };
        }
      } else if (state.currentWorld === 7) {
        document.getElementById('items-count').textContent = state.star7Earned ? '7/7' : 'Final';
        grid.innerHTML = `
          <div class="col-span-2 p-2.5 rounded-lg bg-amber-500/15 border border-amber-400/50 text-amber-200 text-xs font-medium text-center">
            🛥️ Nivel Final: La Confesión en el Caribe
          </div>`;
        checklistEl.innerHTML = '<div class="text-xs font-semibold text-amber-300 uppercase tracking-wider">Objetivos Mundo 7:</div>' +
          `<div class="flex items-center gap-2 text-xs ${state.w7ConfessionStarted ? 'text-emerald-300 font-medium' : 'text-slate-300'}"><span class="w-4 h-4 rounded ${state.w7ConfessionStarted ? 'bg-emerald-500 text-slate-950 font-bold' : 'border border-slate-600'} flex items-center justify-center text-[10px]">${state.w7ConfessionStarted ? '✓' : '1'}</span><span>Subir a la cubierta superior blanca con el Duque</span></div>` +
          `<div class="flex items-center gap-2 text-xs ${state.star7Earned ? 'text-emerald-300 font-medium' : 'text-slate-300'}"><span class="w-4 h-4 rounded ${state.star7Earned ? 'bg-emerald-500 text-slate-950 font-bold' : 'border border-slate-600'} flex items-center justify-center text-[10px]">${state.star7Earned ? '✓' : '2'}</span><span>Escuchar "La Confesión" y tomar la decisión final</span></div>`;
        statusEl.textContent = state.star7Earned
          ? '★★★★★★★ ¡7/7 Estrellas! La historia ha llegado a su cierre.'
          : 'Mundo 7: Camina hacia el Duque en la cubierta superior blanca para iniciar "La Confesión".';
      } else if (state.currentWorld === 7) {
        if (Math.hypot(player.x - state.duke.x, player.y - state.duke.y) < 75) {
          return { kind: 'duke_confession_w7', data: state.duke };
        }
      } else if (state.currentWorld === 6) {
        for (let i = 0; i < wardrobesWorld6.length; i++) {
          const w = wardrobesWorld6[i];
          if (!w.completed) {
            const dist = Math.hypot(player.x - w.x, player.y - w.y);
            if (dist < player.r + w.r + 22) {
              return { kind: 'wardrobe_w6', data: w, index: i };
            }
          }
        }
        if (state.exitPortalWorld7.active) {
          const pDist7 = Math.hypot(player.x - state.exitPortalWorld7.x, player.y - state.exitPortalWorld7.y);
          if (pDist7 < player.r + state.exitPortalWorld7.r + 22) {
            return { kind: 'portal_world7', data: state.exitPortalWorld7 };
          }
        }
      }

      if (state.currentWorld !== 6 && state.currentWorld !== 7) {
        const comp = getCompanionChar();
        if (Math.hypot(player.x - comp.x, player.y - comp.y) < 55) {
          return { kind: 'companion', data: comp };
        }
      }

      return null;
    }

    function triggerInteraction() {
      const target = findNearbyInteractable();
      if (!target) {
        triggerCoupleBanter();
        return;
      }

      // WORLD 1 INTERACTIONS (CON TODOS LOS DIÁLOGOS COMPLETOS ENTRE EL DUQUE Y LA PRINCESA)
      if (target.kind === 'item_w1') {
        const item = target.data;
        if (item.type === 'costume') {
          item.collected = true;
          state.costumesEquipped = true;
          state.duke.bubble = '¡Soy San José!';
          state.princess.bubble = '¡Y yo María!';
          sfxFlashback();
          addFloatingText(item.x, item.y - 15, '¡Trajes de José y María equipados!', '#38bdf8');
          document.getElementById('btn-flashback-manual').classList.remove('hidden');
          openFlashbackModal();
          setDialogue(
            'EL DUQUE Y LA PRINCESA',
            '👘',
            'Recuerdo del 21 de diciembre de 2025 activado',
            `<b>👑 Duque:</b> ${item.dukeLine}<br><br><b>👸 Princesa:</b> ${item.princessLine}`,
            [
              { label: '🧺 Ir por el primer detalle del Pesebre', action: () => autoGuideToNextObjective() },
              { label: '💬 Conversar sobre aquel día', action: () => triggerCoupleBanter() }
            ]
          );
          renderInventoryAndChecklist();
          return;
        }

        if (!state.costumesEquipped) {
          playTone(220, 'sawtooth', 0.2, 0, 0.1);
          addFloatingText(item.x, item.y - 15, '¡Primero vistan los trajes!', '#fb7185');
          setDialogue(
            'LA PRINCESA',
            '👸',
            'Falta el vestuario navideño',
            '«¡Espera, Duque! No podemos armar el nacimiento vestidos así. Primero vayamos al perchero de la izquierda a ponernos nuestros trajes de José y María como cuando el grupo del trabajo nos eligió.»',
            [
              { label: '👘 Caminar hacia el Perchero de Trajes', action: () => { state.targetPoint = { x: 130, y: 185 }; } }
            ]
          );
          return;
        }

        item.collected = true;
        item.placed = true;
        sfxPickup();
        addFloatingText(item.x, item.y - 15, `+ ${item.title}`, '#4ade80');

        const propItems = state.itemsWorld1.filter(it => it.type === 'prop');
        const doneCount = propItems.filter(it => it.collected).length;

        state.duke.bubble = `Detalle ${doneCount}/4 listo`;
        state.princess.bubble = doneCount === 4 ? '¡Vamos al Altar!' : '¡Qué lindo recuerdo!';

        if (doneCount < propItems.length) {
          setDialogue(
            'DIÁLOGO EN EL PESEBRE',
            item.icon,
            `Detalle ${doneCount} de ${propItems.length} colocado en el Altar`,
            `<b>👑 Duque (como José):</b> ${item.dukeLine}<br><br><b>👸 Princesa (como María):</b> ${item.princessLine}`,
            [
              { label: '✨ Buscar el siguiente detalle del pesebre', action: () => autoGuideToNextObjective() }
            ]
          );
        } else {
          setDialogue(
            'LA PRINCESA (COMO MARÍA)',
            '🌟',
            '¡Pesebre Completo (4/4)!',
            `<b>👑 Duque:</b> ${item.dukeLine}<br><br><b>👸 Princesa:</b> «¡Mira el altar, ya tiene todos los detalles! Vamos a pararnos juntos frente al pesebre para interpretar la escena y ganar nuestra primera estrella.»`,
            [
              { label: '⭐ Ir al Altar e Interpretar el Nacimiento', action: () => { state.targetPoint = { x: 400, y: 195 }; } }
            ]
          );
        }
        renderInventoryAndChecklist();
        return;
      }

      if (target.kind === 'altar_w1') {
        const propItems = state.itemsWorld1.filter(it => it.type === 'prop');
        const doneCount = propItems.filter(it => it.collected).length;
        if (!state.costumesEquipped) {
          setDialogue(
            'EL DUQUE',
            '👑',
            'Mirando el Altar Vacío',
            '«Este es el altar donde hicimos el nacimiento en el trabajo... pero primero tenemos que vestirnos de José y María en el perchero de la izquierda.»',
            [
              { label: '👘 Ir por los trajes de José y María', action: () => { state.targetPoint = { x: 130, y: 185 }; } }
            ]
          );
          return;
        }
        if (doneCount < propItems.length) {
          setDialogue(
            'LA PRINCESA (COMO MARÍA)',
            '👸',
            `Faltan detalles en el Pesebre (${doneCount}/4)`,
            `«Casi está listo, Duque, pero el Sistema pide recrear el pesebre con todos los detalles (${doneCount}/4 colocados). Terminemos de recoger las piezas que brillan en el salón.»`,
            [
              { label: '✨ Ir por el siguiente detalle faltante', action: () => autoGuideToNextObjective() }
            ]
          );
          return;
        }
        completeWorld1Victory();
        return;
      }

      if (target.kind === 'portal_world2') {
        startSeamlessTransitionToWorld2();
        return;
      }

      if (target.kind === 'portal_world4') {
        enterWorld4Directly();
        return;
      }

      // WORLD 2 INTERACTIONS (THE 02:30 PM TRAIN)
      if (target.kind === 'item_w2') {
        const item = target.data;
        item.collected = true;
        sfxPickup();
        addFloatingText(item.x, item.y - 15, `✓ ${item.title}`, '#fde047');

        const doneW2 = state.itemsWorld2.filter(it => it.collected).length;
        state.duke.bubble = doneW2 === 3 ? '¡Al Andén 02:30 PM!' : `Recuerdo ${doneW2}/3`;
        state.princess.bubble = doneW2 === 3 ? '¡Sube al tren conmigo!' : '¡Qué tarde tan linda!';

        setDialogue(
          'RECUERDO DEL PASEO RECUPERADO',
          item.icon,
          `Recuerdo ${doneW2} de 3 antes de las 02:30 PM`,
          `<b>👑 Duque:</b> ${item.dukeLine}<br><br><b>👸 Princesa:</b> ${item.princessLine}`,
          [
            {
              label: doneW2 < 3 ? '✨ Correr hacia el siguiente recuerdo' : '🚂 ¡Correr juntos al Andén del Tren 02:30 PM!',
              action: () => autoGuideToNextObjective()
            }
          ]
        );
        renderInventoryAndChecklist();
        return;
      }

      if (target.kind === 'train_platform_w2') {
        const doneW2 = state.itemsWorld2.filter(it => it.collected).length;
        if (doneW2 < state.itemsWorld2.length) {
          playTone(240, 'sawtooth', 0.2, 0, 0.1);
          setDialogue(
            'JEFE DE ESTACIÓN (ANDÉN 02:30 PM)',
            '🚂',
            `Faltan recuerdos y los boletos (${doneW2}/3)`,
            `<b>👑 Duque:</b> «¡Princesa, ya llegamos al andén pero todavía nos falta recoger ${state.itemsWorld2.length - doneW2} recuerdo(s) de nuestro paseo (incluidos los boletos de las 02:30 PM)! Regresemos rápido por ellos.»`,
            [
              {
                label: '🎟️ Ir corriendo por lo que falta',
                action: () => autoGuideToNextObjective()
              }
            ]
          );
          return;
        }
        completeWorld2TrainVictory();
        return;
      }

      if (target.kind === 'guardian_table_w4') {
        if (state.star4Earned) {
          document.getElementById('modal-world4-victory').classList.remove('hidden');
        } else {
          openWorld4CardsModal();
        }
        return;
      }

      if (target.kind === 'door_w4') {
        enterWorld5Directly();
        return;
      }

      if (target.kind === 'wardrobe_w6') {
        openWorld6WardrobeModal(target.index);
        return;
      }

      if (target.kind === 'portal_world7') {
        enterWorld7Directly();
        return;
      }

      if (target.kind === 'duke_confession_w7') {
        openWorld7ConfessionModal(0);
        return;
      }

      if (target.kind === 'lantern_table_w5') {
        if (state.star5Earned) {
          document.getElementById('modal-world5-victory').classList.remove('hidden');
        } else {
          openWorld5MenuModal();
        }
        return;
      }

      if (target.kind === 'guardian_w5') {
        sfxGuardianDeepVoice();
        setDialogue(
          'GUARDIÁN DE LA ENTRADA (LA CASA DE LOS FAROLES)',
          '🏮',
          'Reglas del Desafío Gastronómico',
          '«Para ganar la Estrella de la Complicidad deben reconstruir las 4 cartas de su primera visita: Makis, Ramens, Bebidas y Postres. Cada respuesta incorrecta les descontará <b>2 HORAS</b> del reloj de 24 horas y no se recuperarán.»',
          [
            { label: '🍣 Sentarnos en la Mesa y Ver las 4 Cartas', action: () => openWorld5MenuModal() }
          ]
        );
        return;
      }

      if (target.kind === 'item_w3') {
        const item = target.data;
        item.collected = true;
        sfxPickup();
        addFloatingText(item.x, item.y - 15, `✓ ${item.title}`, '#fde047');
        const doneW3 = state.itemsWorld3.filter(it => it.collected).length;
        state.duke.bubble = doneW3 === 2 ? '🍽️ ¡Vamos a nuestra mesa!' : '🤵 Qué lindo muelle';
        state.princess.bubble = doneW3 === 2 ? '🍨 ¡Pidamos el postre!' : '🌅 Me encanta este lugar';

        setDialogue(
          'RECUERDO EN LA ROSA NÁUTICA',
          item.icon,
          `Detalle ${doneW3} de 2 en Miraflores`,
          `<b>🤵 Duque (de terno negro):</b> ${item.dukeLine}<br><br><b>👸 Princesa (en ropa cómoda):</b> ${item.princessLine}`,
          [
            {
              label: doneW3 < 2 ? '🏮 Ir por el siguiente recuerdo del muelle' : '🍽️ Ir a la Mesa Frente al Mar y Abrir la Carta de Postres',
              action: () => autoGuideToNextObjective()
            }
          ]
        );
        renderInventoryAndChecklist();
        return;
      }

      if (target.kind === 'table_w3') {
        const doneW3 = state.itemsWorld3.filter(it => it.collected).length;
        if (doneW3 < state.itemsWorld3.length) {
          playTone(240, 'sawtooth', 0.2, 0, 0.1);
          setDialogue(
            'MAÎTRE DE LA ROSA NÁUTICA',
            '🍽️',
            `Faltan recuerdos del espigón (${doneW3}/2)`,
            '<b>🤵 Duque:</b> «Princesa, antes de sentarnos a elegir el postre en nuestra mesa frente al mar, recojamos el recuerdo que nos falta en el puente del muelle.»',
            [{ label: '🏮 Ir por el recuerdo faltante', action: () => autoGuideToNextObjective() }]
          );
          return;
        }
        openDessertMenuModal();
        return;
      }

      if (target.kind === 'companion') {
        triggerCoupleBanter();
      }
    }

    function autoGuideToNextObjective() {
      if (state.currentWorld === 1) {
        const costumeItem = state.itemsWorld1.find(it => it.id === 'costumes');
        if (!costumeItem.collected) {
          state.targetPoint = { x: costumeItem.x, y: costumeItem.y + 15 };
          return;
        }
        const nextProp = state.itemsWorld1.find(it => it.type === 'prop' && !it.collected);
        if (nextProp) {
          state.targetPoint = { x: nextProp.x, y: nextProp.y + 15 };
          return;
        }
        if (!state.exitPortalWorld2.active) {
          state.targetPoint = { x: state.mangerAltar.x, y: state.mangerAltar.y + 35 };
        } else {
          state.targetPoint = { x: state.exitPortalWorld2.x, y: state.exitPortalWorld2.y };
        }
      } else if (state.currentWorld === 2) {
        const nextW2 = state.itemsWorld2.find(it => !it.collected);
        if (nextW2) {
          state.targetPoint = { x: nextW2.x, y: nextW2.y };
          return;
        }
        state.targetPoint = { x: state.trainPlatform.x - 20, y: state.trainPlatform.y + 25 };
      } else if (state.currentWorld === 3) {
        const nextW3 = state.itemsWorld3.find(it => !it.collected);
        if (nextW3) {
          state.targetPoint = { x: nextW3.x, y: nextW3.y };
          return;
        }
        state.targetPoint = { x: state.seaTableWorld3.x - 22, y: state.seaTableWorld3.y + 20 };
      } else if (state.currentWorld === 4) {
        if (!state.star4Earned) {
          state.targetPoint = { x: state.guardianTableWorld4.x, y: state.guardianTableWorld4.y + 42 };
        } else {
          state.targetPoint = { x: state.greatDoorWorld4.x, y: state.greatDoorWorld4.y + 38 };
        }
      } else if (state.currentWorld === 5) {
        state.targetPoint = { x: state.lanternTableW5.x - 15, y: state.lanternTableW5.y + 42 };
      } else if (state.currentWorld === 7) {
        state.targetPoint = { x: state.duke.x, y: state.duke.y + 42 };
      } else if (state.currentWorld === 6) {
        const nextW = wardrobesWorld6.find(w => !w.completed);
        if (nextW) {
          state.targetPoint = { x: nextW.x, y: nextW.y + 42 };
        } else if (state.exitPortalWorld7.active) {
          state.targetPoint = { x: state.exitPortalWorld7.x, y: state.exitPortalWorld7.y + 35 };
        }
      }
    }

    function openFlashbackModal() {
      state.flashbackSeen = true;
      document.getElementById('flashback-overlay').classList.remove('hidden');
      document.getElementById('modal-flashback').classList.remove('hidden');
      renderInventoryAndChecklist();
    }

    function saveGameSessionForWorld2() {
      try {
        const sessionPayload = {
          currentWorld: state.currentWorld,
          remainingSeconds: state.remainingSeconds,
          trainRemainingSeconds: state.trainRemainingSeconds,
          starsEarned: [state.star1Earned, state.star2Earned, state.star3Earned, state.star4Earned, state.star5Earned, state.star6Earned, state.star7Earned],
          world4CardProgress: state.currentCardIndex
        };
        localStorage.setItem('cronicas_tunel_7estrellas_state', JSON.stringify(sessionPayload));
      } catch (e) {}
    }

    function openWorld2TransitionModal() {
      saveGameSessionForWorld2();
      sfxFlashback();
      const hrs = String(Math.floor(state.remainingSeconds / 3600)).padStart(2, '0');
      const mins = String(Math.floor((state.remainingSeconds % 3600) / 60)).padStart(2, '0');
      const secs = String(state.remainingSeconds % 60).padStart(2, '0');
      const timeEl = document.getElementById('transition-saved-time');
      if (timeEl) timeEl.textContent = `Reloj Persistente: ${hrs}:${mins}:${secs}`;
      document.getElementById('modal-victory').classList.add('hidden');
      document.getElementById('modal-world-transition').classList.remove('hidden');
    }

    function startSeamlessTransitionToWorld2() {
      saveGameSessionForWorld2();
      sfxFlashback();
      document.getElementById('modal-victory').classList.add('hidden');
      const hrs = String(Math.floor(state.remainingSeconds / 3600)).padStart(2, '0');
      const mins = String(Math.floor((state.remainingSeconds % 3600) / 60)).padStart(2, '0');
      const secs = String(state.remainingSeconds % 60).padStart(2, '0');
      const timeEl = document.getElementById('transition-saved-time');
      if (timeEl) timeEl.textContent = `Reloj Persistente: ${hrs}:${mins}:${secs}`;
      document.getElementById('modal-world-transition').classList.remove('hidden');
    }

    function enterWorld2Directly() {
      saveGameSessionForWorld2();
      document.getElementById('modal-victory').classList.add('hidden');
      document.getElementById('modal-world-transition').classList.add('hidden');
      switchTab('game');
      loadWorld(2, true);
    }

    function enterWorld3Directly() {
      saveGameSessionForWorld2();
      document.getElementById('modal-world2-victory').classList.add('hidden');
      document.getElementById('modal-train-journey-world3').classList.add('hidden');
      switchTab('game');
      loadWorld(3, true);
    }

    function enterWorld4Directly() {
      saveGameSessionForWorld2();
      document.getElementById('modal-world3-victory').classList.add('hidden');
      switchTab('game');
      loadWorld(4, true);
    }

    function completeWorld1Victory() {
      state.star1Earned = true;
      state.exitPortalWorld2.active = true;
      state.duke.x = state.mangerAltar.x - 48;
      state.duke.y = state.mangerAltar.y + 22;
      state.princess.x = state.mangerAltar.x + 48;
      state.princess.y = state.mangerAltar.y + 22;
      state.duke.bubble = '★ ¡Estrella 1 lista!';
      state.princess.bubble = '🌌 ¡Vamos al Mundo 2!';
      state.targetPoint = null;
      sfxStarVictory();
      renderStarsBar();
      renderInventoryAndChecklist();
      renderWorldsView();
      setDialogue(
        'SISTEMA CENTRAL — ESTRELLA 1 RECUPERADA',
        '⭐',
        'Portal al Mundo 2 Abierto',
        '<b>"Felicitaciones, han recuperado un recuerdo. Han ganado una estrella"</b><br><br>El Portal Estelar hacia el <b>Mundo 2 (El Tren de las 02:30 PM)</b> está abierto a la derecha del salón. Puedes cruzarlo caminando o pulsar el botón de abajo para viajar ahora mismo.',
        [
          {
            label: '🚂 Viajar Ahora Mismo al Mundo 2 (Tren 02:30 PM) ➔',
            action: () => enterWorld2Directly()
          },
          {
            label: '🌌 Ver Puente Estelar de Transición',
            action: () => startSeamlessTransitionToWorld2()
          }
        ]
      );
      document.getElementById('modal-victory').classList.remove('hidden');
    }

    function completeWorld2TrainVictory() {
      state.star2Earned = true;
      state.duke.x = state.trainPlatform.x - 32;
      state.duke.y = state.trainPlatform.y + 18;
      state.princess.x = state.trainPlatform.x + 12;
      state.princess.y = state.trainPlatform.y + 18;
      state.duke.bubble = '«Me lo invento para ti»';
      state.princess.bubble = '«¡Llegamos a las 02:30 PM!»';
      state.targetPoint = null;

      playTrainWhistle();
      sfxStarVictory();
      saveGameSessionForWorld2();
      addFloatingText(state.trainPlatform.x, state.trainPlatform.y - 35, '★★ ¡ESTRELLA 2 RECUPERADA! ★★', '#facc15');
      renderStarsBar();
      renderInventoryAndChecklist();
      renderWorldsView();

      setDialogue(
        'PROMESA EN EL ANDÉN DEL TREN (02:30 PM)',
        '🚂',
        'Estrella 2 / 7 Desbloqueada',
        '<b>👑 Duque:</b> «No te preocupes mi princesa, jamás dejaría que algo malo te pasara.»<br><b>👸 Princesa:</b> «¿Y qué pasa si un día no sabes qué hacer?»<br><b>👑 Duque:</b> <b>«Yo lo puedo todo, y lo que no sé, me lo invento para ti.»</b>',
        [
          {
            label: '🌊 Bajar del Tren en Miraflores y Jugar Mundo 3 Ahora ➔',
            action: () => enterWorld3Directly()
          },
          {
            label: '🚆 Ver Escena del Tren rumbo al Mundo 3',
            action: () => {
              document.getElementById('modal-world2-victory').classList.remove('hidden');
            }
          }
        ]
      );

      document.getElementById('modal-world2-victory').classList.remove('hidden');
    }

    let cardFlipLocked = false;
    let cardFlipTimer = null;
    let cardAdvanceTimer = null;

    function formatGlobalClock(sec) {
      const hrs = String(Math.floor(sec / 3600)).padStart(2, '0');
      const mins = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
      const secs = String(sec % 60).padStart(2, '0');
      return `${hrs}:${mins}:${secs}`;
    }

    function openWorld4CardsModal() {
      if (state.star4Earned) {
        document.getElementById('modal-world4-victory').classList.remove('hidden');
        return;
      }
      document.getElementById('modal-world4-cards').classList.remove('hidden');
      document.getElementById('modal-card-live-timer').textContent = formatGlobalClock(state.remainingSeconds);
      animateAndShowCard(state.currentCardIndex);
    }

    function animateAndShowCard(cardIdx) {
      if (cardFlipTimer) { clearTimeout(cardFlipTimer); cardFlipTimer = null; }
      if (cardAdvanceTimer) { clearTimeout(cardAdvanceTimer); cardAdvanceTimer = null; }
      if (cardIdx >= cardsDeckWorld4.length) {
        completeWorld4Victory();
        return;
      }
      cardFlipLocked = true;
      const cardData = cardsDeckWorld4[cardIdx];
      const backEl = document.getElementById('card-face-back');
      const frontEl = document.getElementById('card-face-front');
      const fbBanner = document.getElementById('card-feedback-banner');
      fbBanner.classList.add('hidden');

      // Step 1: Show the sealed back of the card with 3D rotation
      frontEl.classList.add('hidden');
      backEl.classList.remove('hidden');
      backEl.classList.add('flex');
      document.getElementById('card-back-number').textContent = `CARTA DEL RECUERDO #${cardData.num} DE 21`;
      document.getElementById('card-act-title').textContent = cardData.act;
      document.getElementById('card-counter-badge').textContent = `Carta ${cardData.num} / 21`;
      document.getElementById('card-progress-bar').style.width = `${((cardData.num - 1) / 21) * 100}%`;

      sfxCardFlip();

      // Step 2: After 320ms, flip to the front of the card with the 4 clickable options
      cardFlipTimer = setTimeout(() => {
        document.getElementById('card-front-category').textContent = cardData.category;
        document.getElementById('card-question-text').textContent = `${cardData.num}. ${cardData.q}`;
        document.getElementById('card-guardian-whisper').textContent =
          '👁️ Guardián: «Elige con cuidado, Princesa... Si fallas, restaré 30 minutos al reloj de 24 horas.»';

        const optsContainer = document.getElementById('card-options-container');
        optsContainer.innerHTML = '';
        cardData.options.forEach((optText, optIdx) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'w-full p-3 rounded-xl bg-slate-900 hover:bg-purple-500/30 active:scale-95 border border-slate-700 hover:border-amber-400 text-left text-xs sm:text-sm text-slate-100 font-medium transition flex items-center gap-2.5 shadow cursor-pointer';
          const letter = ['A', 'B', 'C', 'D'][optIdx] || '•';
          btn.innerHTML = `
            <span class="w-6 h-6 rounded-lg bg-purple-500/20 border border-purple-400/50 text-amber-300 font-mono-sys text-xs font-bold flex items-center justify-center shrink-0">${letter}</span>
            <span>${optText}</span>
          `;
          btn.addEventListener('click', (ev) => {
            ev.stopPropagation();
            initAudio();
            handleWorld4CardAnswer(optIdx, btn);
          });
          optsContainer.appendChild(btn);
        });

        backEl.classList.add('hidden');
        backEl.classList.remove('flex');
        frontEl.classList.remove('hidden');
        // Retrigger 3D flip-in animation on the front face
        frontEl.classList.remove('card-flip-anim');
        void frontEl.offsetWidth;
        frontEl.classList.add('card-flip-anim');
        cardFlipLocked = false;
      }, 320);
    }

    function handleWorld4CardAnswer(selectedIdx, btnElement) {
      if (cardFlipLocked) return;
      const cardData = cardsDeckWorld4[state.currentCardIndex];
      const fbBanner = document.getElementById('card-feedback-banner');
      const card3DEl = document.getElementById('card-3d-element');

      if (selectedIdx === cardData.correct) {
        // CORRECT ANSWER!
        cardFlipLocked = true;
        sfxPickup();
        btnElement.className = 'p-3 rounded-xl bg-emerald-500/30 border-2 border-emerald-400 text-left text-xs sm:text-sm text-emerald-100 font-bold transition flex items-center gap-2.5 shadow-lg';
        fbBanner.className = 'p-3 rounded-xl bg-emerald-950/90 border border-emerald-400/60 text-xs text-emerald-200 font-medium text-center';
        fbBanner.innerHTML = `✓ ¡Respuesta Correcta! ${cardData.note}`;
        fbBanner.classList.remove('hidden');

        state.currentCardIndex++;
        saveGameSessionForWorld2();
        renderInventoryAndChecklist();

        cardAdvanceTimer = setTimeout(() => {
          if (state.currentCardIndex >= cardsDeckWorld4.length) {
            completeWorld4Victory();
          } else {
            animateAndShowCard(state.currentCardIndex);
          }
        }, 1450);
      } else {
        // Prevent accidental double-click on the exact same wrong option from deducting twice
        if (btnElement.dataset.alreadyWrong === '1') return;
        btnElement.dataset.alreadyWrong = '1';

        // WRONG ANSWER: DEDUCT 30 MINUTES (1800 SECONDS) FROM THE GLOBAL 24-HOUR CLOCK WITHOUT RESETTING IT!
        sfxTimePenalty();
        state.world4PenaltiesCount++;
        state.remainingSeconds = Math.max(60, state.remainingSeconds - 1800);
        saveGameSessionForWorld2();

        // Update both HUD and Modal clocks immediately
        const formatted = formatGlobalClock(state.remainingSeconds);
        document.getElementById('hud-timer').textContent = formatted;
        document.getElementById('modal-card-live-timer').textContent = formatted;

        btnElement.className = 'p-3 rounded-xl bg-rose-950/80 border-2 border-rose-500 text-left text-xs sm:text-sm text-rose-200 font-medium transition flex items-center gap-2.5 opacity-75';
        card3DEl.classList.remove('shake-error');
        void card3DEl.offsetWidth;
        card3DEl.classList.add('shake-error');

        fbBanner.className = 'p-3 rounded-xl bg-rose-950/90 border border-rose-400 text-xs text-rose-200 font-bold text-center';
        fbBanner.innerHTML = `⏱️ ¡Respuesta Incorrecta! El Guardián ha descontado <b>-30:00 minutos</b> de su reloj de 24 horas (Quedan ${formatted}). ¡Intenta otra opción, Princesa!`;
        fbBanner.classList.remove('hidden');
      }
    }

    function completeWorld4Victory() {
      document.getElementById('modal-world4-cards').classList.add('hidden');
      state.star4Earned = true;
      state.princess.x = state.greatDoorWorld4.x - 28;
      state.princess.y = state.greatDoorWorld4.y + 42;
      state.duke.x = state.greatDoorWorld4.x + 28;
      state.duke.y = state.greatDoorWorld4.y + 42;
      state.princess.bubble = '★★★★ ¡Respondí las 21 cartas!';
      state.duke.bubble = '😮‍💨 ¡Qué rico hueles, mi Princesa!';
      state.targetPoint = null;

      sfxStarVictory();
      saveGameSessionForWorld2();
      addFloatingText(state.greatDoorWorld4.x, state.greatDoorWorld4.y - 20, '★★★★ ¡ESTRELLA 4 Y GRAN PUERTA ABIERTA! ★★★★', '#facc15');
      renderStarsBar();
      renderInventoryAndChecklist();
      renderWorldsView();

      setDialogue(
        'GRAN PUERTA DE LOS RECUERDOS ABIERTA',
        '🃏',
        'Estrella 4 / 7 Obtenida — Las 21 Cartas Superadas',
        '<b>👁️ Guardián:</b> «Has demostrado recordar cada instante en Lima, Princesa. La puerta hacia el Mundo 5 está abierta.»<br><br><b>👑 Duque (abrazándote):</b> <b>«😮‍💨 Qué rico hueles... Sabía que no olvidarías ni una sola carta de nuestra historia.»</b>',
        [
          {
            label: '🏮 Cruzar la Gran Puerta hacia el Mundo 5 (La Casa de los Faroles) ➔',
            action: () => enterWorld5Directly()
          },
          {
            label: '🌟 Ver Ceremonia de la Estrella 4',
            action: () => document.getElementById('modal-world4-victory').classList.remove('hidden')
          }
        ]
      );

      document.getElementById('modal-world4-victory').classList.remove('hidden');
    }

    let w6WardrobeLocked = false;
    let w6AdvanceTimer = null;
    let w6AutoOpenedIndex = -1;
    let w6ToW7TransitionTimer = null;

    function enterWorld7Directly() {
      if (w6ToW7TransitionTimer) {
        clearTimeout(w6ToW7TransitionTimer);
        w6ToW7TransitionTimer = null;
      }
      saveGameSessionForWorld2();
      document.getElementById('modal-world6-victory').classList.add('hidden');
      state.keys = {};
      state.targetPoint = null;
      state.activeChar = 'princess';
      switchTab('game');
      loadWorld(7, true);
      drawGame();
    }

    function openWorld7ConfessionModal(stepIdx = 0) {
      initAudio();
      state.w7ConfessionStarted = true;
      state.targetPoint = null;
      document.getElementById('modal-world7-confession').classList.remove('hidden');
      renderWorld7ConfessionStep(stepIdx);
    }

    function renderWorld7ConfessionStep(idx) {
      state.w7ConfessionStep = idx;
      const step = confessionScriptW7[idx];
      if (!step) return;

      sfxDialogueBlip(step.avatar === '👑' || step.avatar === '💍');

      document.getElementById('w7-conf-badge').textContent = `🛥️ NIVEL 7: LA CONFESIÓN • ${step.tag.split('—')[0].trim()}`;
      document.getElementById('w7-conf-avatar').textContent = step.avatar;
      document.getElementById('w7-conf-speaker').textContent = step.speaker;
      document.getElementById('w7-conf-step-label').textContent = `Escena ${idx + 1} / ${confessionScriptW7.length}`;
      document.getElementById('w7-conf-text').textContent = step.text;
      document.getElementById('w7-conf-context').textContent = step.context;

      const choicesEl = document.getElementById('w7-conf-choices');
      choicesEl.innerHTML = '';

      if (step.isFinalProposal) {
        const yesBtn = document.createElement('button');
        yesBtn.type = 'button';
        yesBtn.className = 'flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-bold text-sm shadow-xl transition cursor-pointer';
        yesBtn.textContent = '💍 SÍ, ACEPTO';
        yesBtn.addEventListener('click', triggerWorld7YesEnding);

        const noBtn = document.createElement('button');
        noBtn.type = 'button';
        noBtn.className = 'flex-1 py-3 px-4 rounded-xl bg-rose-950/90 hover:bg-rose-900 border border-rose-500/70 text-rose-200 font-bold text-sm shadow-xl transition cursor-pointer';
        noBtn.textContent = '💔 LO SIENTO, NO';
        noBtn.addEventListener('click', triggerWorld7NoEnding);

        choicesEl.appendChild(yesBtn);
        choicesEl.appendChild(noBtn);
      } else {
        step.choices.forEach(ch => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'w-full py-2.5 px-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/35 border border-amber-400/60 text-amber-200 text-xs sm:text-sm font-bold text-left transition cursor-pointer';
          btn.textContent = ch.label;
          btn.addEventListener('click', () => renderWorld7ConfessionStep(ch.next));
          choicesEl.appendChild(btn);
        });
      }
    }

    function triggerWorld7YesEnding() {
      state.star7Earned = true;
      renderStarsBar();
      renderInventoryAndChecklist();
      renderWorldsView();

      document.getElementById('modal-world7-confession').classList.add('hidden');
      document.getElementById('modal-world7-ending-yes').classList.remove('hidden');

      sfxStarVictory();
      const vid = document.getElementById('w7-ending-yes-video');
      if (vid) {
        vid.currentTime = 0;
        vid.play().catch(() => {});
      }
    }

    function triggerWorld7NoEnding() {
      stopChristmasBGM();
      document.getElementById('modal-world7-confession').classList.add('hidden');
      document.getElementById('modal-world7-ending-no').classList.remove('hidden');

      // El final negativo permanece en pantalla. No borra el progreso ni
      // reinicia el juego automáticamente; el reinicio queda como decisión manual.
      if (state.w7NoCountdownTimer) {
        clearInterval(state.w7NoCountdownTimer);
        state.w7NoCountdownTimer = null;
      }
      const countdown = document.getElementById('w7-no-countdown-sec');
      if (countdown) countdown.textContent = 'FIN';
    }

    function restartEntireGameFromZero() {
      if (state.w7NoCountdownTimer) clearInterval(state.w7NoCountdownTimer);
      const vid = document.getElementById('w7-ending-yes-video');
      if (vid) vid.pause();

      document.getElementById('modal-world7-confession').classList.add('hidden');
      document.getElementById('modal-world7-ending-yes').classList.add('hidden');
      document.getElementById('modal-world7-ending-no').classList.add('hidden');

      try { localStorage.removeItem('cronicas_tunel_7estrellas_state'); localStorage.removeItem('game_session_world2_v1'); } catch (e) {}

      // Full reset of all 7 stars, 24h clock, and all 7 worlds back to Level 01
      state.remainingSeconds = 24 * 3600;
      state.trainRemainingSeconds = 300;
      state.star1Earned = false;
      state.star2Earned = false;
      state.star3Earned = false;
      state.star4Earned = false;
      state.star5Earned = false;
      state.star6Earned = false;
      state.star7Earned = false;
      state.costumesEquipped = false;
      state.flashbackSeen = false;
      state.exitPortalWorld2.active = false;
      state.exitPortalWorld4.active = false;
      state.exitPortalWorld7.active = false;
      state.itemsWorld1.forEach(it => { it.collected = false; it.placed = false; });
      state.itemsWorld2.forEach(it => { it.collected = false; });
      state.itemsWorld3.forEach(it => { it.collected = false; });
      state.currentCardIndex = 0;
      state.world4PenaltiesCount = 0;
      state.w5CurrentMenuStep = 0;
      state.w5TalkedToGuardian = false;
      state.w6CurrentWardrobeStep = 0;
      state.w6PenaltiesCount = 0;
      wardrobesWorld6.forEach(w => { w.completed = false; });
      state.w7ConfessionStarted = false;
      state.w7ConfessionStep = 0;

      bgmEnabled = true;
      renderStarsBar();
      renderWorldsView();
      switchTab('game');
      loadWorld(1, true);
    }

    function enterWorld6Directly() {
      saveGameSessionForWorld2();
      document.getElementById('modal-world5-victory').classList.add('hidden');
      switchTab('game');
      loadWorld(6, true);
    }

    function updateWorld6SlotsUI(activeIdx) {
      for (let i = 0; i < 5; i++) {
        const slotEl = document.getElementById(`w6-slot-${i}`);
        if (!slotEl) continue;
        const done = wardrobesWorld6[i].completed;
        const isCurrent = i === activeIdx && !state.star6Earned;
        slotEl.className = done
          ? 'p-1.5 rounded-lg bg-emerald-500/20 border border-emerald-400/70'
          : (isCurrent
              ? 'p-1.5 rounded-lg bg-amber-500/25 border-2 border-amber-400'
              : 'p-1.5 rounded-lg bg-slate-900 border border-slate-700');
      }
    }

    function openWorld6WardrobeModal(wardrobeIdx) {
      if (state.star6Earned) {
        document.getElementById('modal-world6-victory').classList.remove('hidden');
        return;
      }
      // Enforce strict sequential order 1 -> 2 -> 3 -> 4 -> 5
      const nextRequiredIdx = wardrobesWorld6.findIndex(w => !w.completed);
      if (nextRequiredIdx < 0) {
        completeWorld6Victory();
        return;
      }
      if (typeof wardrobeIdx === 'number' && wardrobeIdx !== nextRequiredIdx) {
        const reqW = wardrobesWorld6[nextRequiredIdx];
        playTone(320, 'triangle', 0.16, 0, 0.09);
        addFloatingText(state.princess.x, state.princess.y - 25, `👗 Primero ve al ${reqW.shortTitle}`, '#facc15');
        state.targetPoint = { x: reqW.x, y: reqW.y + 42 };
        setDialogue(
          'ORDEN DE LOS 5 ARMARIOS REALES',
          reqW.icon,
          `Sigue el orden: Armario ${nextRequiredIdx + 1} de 5`,
          `«Princesa, debes abrir los armarios en orden. Primero dirígete al <b>${reqW.name}</b>.»`,
          [
            { label: `${reqW.icon} Abrir ${reqW.name} Ahora`, action: () => openWorld6WardrobeModal(nextRequiredIdx) }
          ]
        );
        return;
      }
      const targetIdx = nextRequiredIdx;

      if (targetIdx < 0) {
        completeWorld6Victory();
        return;
      }

      state.w6CurrentWardrobeStep = targetIdx;
      document.getElementById('modal-world6-wardrobe').classList.remove('hidden');
      document.getElementById('modal-w6-live-timer').textContent = formatGlobalClock(state.remainingSeconds);
      renderWorld6WardrobeCard(targetIdx);
    }

    function renderWorld6WardrobeCard(idx) {
      if (w6AdvanceTimer) { clearTimeout(w6AdvanceTimer); w6AdvanceTimer = null; }
      w6WardrobeLocked = false;

      const wData = wardrobesWorld6[idx];
      if (!wData) {
        completeWorld6Victory();
        return;
      }

      updateWorld6SlotsUI(idx);
      const cardEl = document.getElementById('w6-wardrobe-card');
      cardEl.classList.remove('card-flip-anim');
      void cardEl.offsetWidth;
      cardEl.classList.add('card-flip-anim');
      sfxCardFlip();

      document.getElementById('w6-wardrobe-badge').textContent = wData.badge;
      document.getElementById('w6-wardrobe-title').textContent = wData.question;
      document.getElementById('w6-wardrobe-prompt').textContent = wData.prompt;
      document.getElementById('w6-feedback-banner').classList.add('hidden');

      const grid = document.getElementById('w6-options-grid');
      grid.innerHTML = '';
      wData.options.forEach((optText, optIdx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'w-full p-3 rounded-xl bg-slate-900 hover:bg-rose-500/25 active:scale-95 border border-slate-700 hover:border-amber-400 text-left text-xs sm:text-sm text-slate-100 font-medium transition flex items-center gap-2.5 shadow cursor-pointer';
        const letter = ['A', 'B', 'C', 'D'][optIdx] || '•';
        btn.innerHTML = `
          <span class="w-6 h-6 rounded-lg bg-rose-500/20 border border-rose-400/50 text-amber-300 font-mono-sys text-xs font-bold flex items-center justify-center shrink-0">${letter}</span>
          <span>${optText}</span>
        `;
        btn.addEventListener('click', (ev) => {
          ev.stopPropagation();
          initAudio();
          handleWorld6WardrobeAnswer(idx, optIdx, btn);
        });
        grid.appendChild(btn);
      });
    }

    function handleWorld6WardrobeAnswer(wardrobeIdx, selectedOptIdx, btnElement) {
      if (w6WardrobeLocked) return;
      const wData = wardrobesWorld6[wardrobeIdx];
      if (!wData) return;

      const fbBanner = document.getElementById('w6-feedback-banner');
      const cardEl = document.getElementById('w6-wardrobe-card');

      if (selectedOptIdx === wData.correct) {
        w6WardrobeLocked = true;
        wData.completed = true;
        sfxPickup();

        btnElement.className = 'w-full p-3 rounded-xl bg-emerald-500/30 border-2 border-emerald-400 text-left text-xs sm:text-sm text-emerald-100 font-bold transition flex items-center gap-2.5 shadow-lg';
        fbBanner.className = 'p-3 rounded-xl bg-emerald-950/90 border border-emerald-400/60 text-xs text-emerald-200 font-medium text-center';
        fbBanner.innerHTML = `✓ ${wData.note}`;
        fbBanner.classList.remove('hidden');

        const nextIncomplete = wardrobesWorld6.findIndex(w => !w.completed);
        state.w6CurrentWardrobeStep = nextIncomplete === -1 ? 5 : nextIncomplete;
        updateWorld6SlotsUI(state.w6CurrentWardrobeStep);
        saveGameSessionForWorld2();
        renderInventoryAndChecklist();

        w6AdvanceTimer = setTimeout(() => {
          if (nextIncomplete === -1) {
            completeWorld6Victory();
          } else {
            // Close modal and automatically walk the Princess across the Russian Red Hall to the next Wardrobe!
            document.getElementById('modal-world6-wardrobe').classList.add('hidden');
            const nextW = wardrobesWorld6[nextIncomplete];
            w6AutoOpenedIndex = -1;
            state.targetPoint = { x: nextW.x, y: nextW.y + 42 };
            setDialogue(
              'LA PRINCESA (AVANZANDO AL SIGUIENTE ARMARIO)',
              wData.icon,
              `Armario ${wardrobeIdx + 1}/5 Superado • Rumbo al ${nextW.name}`,
              `«${wData.note} ¡Ahora vamos al <b>${nextW.name}</b>!»`,
              [
                { label: `🔓 Abrir ${nextW.name} Ahora`, action: () => openWorld6WardrobeModal(nextIncomplete) }
              ]
            );
          }
        }, 1400);
      } else {
        if (btnElement.dataset.alreadyWrong === '1') return;
        btnElement.dataset.alreadyWrong = '1';

        // WRONG CHOICE IN WARDROBE: DEDUCT 2 FULL HOURS (7200 SECONDS) FROM GLOBAL 24H CLOCK (SAME AS RAMEN LEVEL!)
        sfxTimePenalty();
        state.w6PenaltiesCount++;
        state.remainingSeconds = Math.max(60, state.remainingSeconds - 7200);
        saveGameSessionForWorld2();

        const formatted = formatGlobalClock(state.remainingSeconds);
        document.getElementById('hud-timer').textContent = formatted;
        document.getElementById('modal-w6-live-timer').textContent = formatted;

        btnElement.className = 'w-full p-3 rounded-xl bg-rose-950/80 border-2 border-rose-500 text-left text-xs sm:text-sm text-rose-200 font-medium transition flex items-center gap-2.5 opacity-75';
        cardEl.classList.remove('shake-error');
        void cardEl.offsetWidth;
        cardEl.classList.add('shake-error');

        fbBanner.className = 'p-3 rounded-xl bg-rose-950/95 border border-rose-400 text-xs text-rose-200 font-bold text-center';
        fbBanner.innerHTML = `⏱️ ¡Esa no era la prenda de la foto en la playa! El Sistema ha descontado <b>-02:00 HORAS</b> de su reloj global (Quedan ${formatted}). ¡Recuerda bien cómo se veían frente al mar!`;
        fbBanner.classList.remove('hidden');
      }
    }

    function completeWorld6Victory() {
      document.getElementById('modal-world6-wardrobe').classList.add('hidden');
      state.star6Earned = true;
      state.w6CurrentWardrobeStep = 5;
      state.exitPortalWorld7.active = true;

      state.activeChar = 'princess';
      state.keys = {};
      state.princess.x = 400;
      state.princess.y = 240;
      state.princess.bubble = '★★★★★★ ¡Voy por ti a la Cárcel del Silencio, Duque!';
      state.targetPoint = null;

      sfxStarVictory();
      saveGameSessionForWorld2();
      addFloatingText(400, 195, '★★★★★★ ¡ESTRELLA 6 Y RECUERDO EN LA PLAYA! ★★★★★★', '#facc15');
      renderStarsBar();
      renderInventoryAndChecklist();
      renderWorldsView();

      setDialogue(
        'RECUERDO DE LA IMAGEN CON IA EN LA PLAYA DESBLOQUEADO',
        '👑',
        'Estrella 6 / 7 Obtenida — Portal a la Cárcel del Silencio Abierto',
        '<b>👁️ Sistema Central:</b> «Has demostrado conocer cada prenda de aquella imagen frente al mar, Princesa. El portal hacia el último nivel —<b>La Cárcel del Silencio (Mundo 7)</b>— se ha abierto.»<br><br><b>👸 Princesa:</b> <b>«¡Espérame, mi Duque, ya voy a liberarte!»</b>',
        [
          {
            label: '🖼️ Ver nuestra Foto en la Playa y la Estrella 6',
            action: () => document.getElementById('modal-world6-victory').classList.remove('hidden')
          }
        ]
      );

      document.getElementById('modal-world6-victory').classList.remove('hidden');

      // DESPLAZAMIENTO AUTOMÁTICO: se muestra primero la celebración.
      // Después la Princesa camina hasta el portal y entra al tocarlo.
      if (w6ToW7TransitionTimer) clearTimeout(w6ToW7TransitionTimer);
      w6ToW7TransitionTimer = setTimeout(() => {
        w6ToW7TransitionTimer = null;
        if (state.currentWorld === 6 && state.star6Earned) {
          document.getElementById('modal-world6-victory').classList.add('hidden');
          state.activeChar = 'princess';
          state.keys = {};
          state.targetPoint = {
            x: state.exitPortalWorld7.x,
            y: state.exitPortalWorld7.y + 30
          };
          state.princess.bubble = '👸 ¡Voy por ti, Duque!';
        }
      }, 4000);
    }

    function enterWorld5Directly() {
      saveGameSessionForWorld2();
      document.getElementById('modal-world4-victory').classList.add('hidden');
      switchTab('game');
      loadWorld(5, true);
    }

    function updateWorld5TraySlots() {
      const labels = ['Makis Furai', 'Shoyu Ramen', 'Maracuyá Frozen', 'Sin postre'];
      for (let i = 0; i < 4; i++) {
        const slotEl = document.getElementById(`tray-slot-${i}`);
        if (!slotEl) continue;
        const done = i < state.w5CurrentMenuStep;
        const isCurrent = i === state.w5CurrentMenuStep && !state.star5Earned;
        slotEl.className = done
          ? 'p-2 rounded-lg bg-emerald-500/20 border border-emerald-400/60 text-center'
          : (isCurrent
              ? 'p-2 rounded-lg bg-amber-500/20 border-2 border-amber-400 text-center'
              : 'p-2 rounded-lg bg-slate-900/90 border border-slate-700 text-center');
        const valDiv = slotEl.querySelectorAll('div')[1];
        if (valDiv) {
          valDiv.className = done
            ? 'text-xs font-bold text-emerald-300 truncate mt-0.5'
            : (isCurrent ? 'text-xs font-bold text-amber-300 truncate mt-0.5' : 'text-xs font-bold text-slate-500 truncate mt-0.5');
          valDiv.textContent = done ? `✓ ${labels[i]}` : (isCurrent ? 'Eligiendo...' : 'Pendiente...');
        }
      }
    }

    let w5CardLocked = false;
    let w5AdvanceTimer = null;

    function openWorld5MenuModal() {
      if (state.star5Earned) {
        document.getElementById('modal-world5-victory').classList.remove('hidden');
        return;
      }
      document.getElementById('modal-world5-menu').classList.remove('hidden');
      document.getElementById('modal-w5-live-timer').textContent = formatGlobalClock(state.remainingSeconds);
      renderWorld5MenuCard(state.w5CurrentMenuStep);
    }

    function renderWorld5MenuCard(stepIdx) {
      if (w5AdvanceTimer) { clearTimeout(w5AdvanceTimer); w5AdvanceTimer = null; }
      w5CardLocked = false;
      if (stepIdx >= menuCardsWorld5.length) {
        completeWorld5OrderAndServe();
        return;
      }
      const cardData = menuCardsWorld5[stepIdx];
      updateWorld5TraySlots();

      const cardBox = document.getElementById('w5-card-container');
      cardBox.classList.remove('card-flip-anim');
      void cardBox.offsetWidth;
      cardBox.classList.add('card-flip-anim');
      sfxCardFlip();

      document.getElementById('w5-card-badge').textContent = cardData.badge;
      document.getElementById('w5-card-title').textContent = cardData.title;
      document.getElementById('w5-card-princess-prompt').textContent = cardData.prompt;
      document.getElementById('w5-skill-clue-box').classList.add('hidden');
      document.getElementById('w5-feedback-banner').classList.add('hidden');

      const grid = document.getElementById('w5-options-grid');
      grid.innerHTML = '';
      cardData.options.forEach((optText, optIdx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'w-full p-3 rounded-xl bg-slate-900 hover:bg-red-500/25 active:scale-95 border border-slate-700 hover:border-amber-400 text-left text-xs sm:text-sm text-slate-100 font-medium transition flex items-center gap-2.5 shadow cursor-pointer';
        const numTag = optIdx + 1;
        btn.innerHTML = `
          <span class="w-6 h-6 rounded-lg bg-red-500/20 border border-red-400/50 text-amber-300 font-mono-sys text-xs font-bold flex items-center justify-center shrink-0">${numTag}</span>
          <span>${optText}</span>
        `;
        btn.addEventListener('click', (ev) => {
          ev.stopPropagation();
          initAudio();
          handleWorld5MenuChoice(optIdx, btn);
        });
        grid.appendChild(btn);
      });
    }

    function activateWorld5Skill(skillType) {
      initAudio();
      const cardData = menuCardsWorld5[state.w5CurrentMenuStep];
      if (!cardData) return;
      const clueBox = document.getElementById('w5-skill-clue-box');
      sfxPickup();
      state.w5ComplicityScore += 15;

      if (skillType === 'recuerdo') {
        clueBox.className = 'p-3 rounded-xl bg-pink-950/85 border border-pink-400/70 text-xs text-pink-100 leading-relaxed shadow';
        clueBox.innerHTML = cardData.recuerdoClue;
      } else {
        clueBox.className = 'p-3 rounded-xl bg-indigo-950/85 border border-indigo-400/70 text-xs text-indigo-100 leading-relaxed shadow';
        clueBox.innerHTML = cardData.inventivaClue;
      }
      clueBox.classList.remove('hidden');
    }

    function handleWorld5MenuChoice(selectedIdx, btnElement) {
      if (w5CardLocked) return;
      const cardData = menuCardsWorld5[state.w5CurrentMenuStep];
      if (!cardData) return;
      const fbBanner = document.getElementById('w5-feedback-banner');
      const cardBox = document.getElementById('w5-card-container');

      if (selectedIdx === cardData.correct) {
        w5CardLocked = true;
        sfxPickup();
        btnElement.className = 'w-full p-3 rounded-xl bg-emerald-500/30 border-2 border-emerald-400 text-left text-xs sm:text-sm text-emerald-100 font-bold transition flex items-center gap-2.5 shadow-lg';
        fbBanner.className = 'p-3 rounded-xl bg-emerald-950/90 border border-emerald-400/60 text-xs text-emerald-200 font-medium text-center';
        fbBanner.innerHTML = `✓ ${cardData.successNote}`;
        fbBanner.classList.remove('hidden');

        state.w5CurrentMenuStep++;
        updateWorld5TraySlots();
        saveGameSessionForWorld2();
        renderInventoryAndChecklist();

        w5AdvanceTimer = setTimeout(() => {
          if (state.w5CurrentMenuStep >= menuCardsWorld5.length) {
            completeWorld5OrderAndServe();
          } else {
            renderWorld5MenuCard(state.w5CurrentMenuStep);
          }
        }, 1450);
      } else {
        if (btnElement.dataset.alreadyWrong === '1') return;
        btnElement.dataset.alreadyWrong = '1';

        // WRONG SELECTION: DEDUCT 2 FULL HOURS (7200 SECONDS) FROM THE GLOBAL 24H CLOCK (IRRECOVERABLE!)
        sfxTimePenalty();
        state.w5PenaltiesHoursCount += 2;
        state.remainingSeconds = Math.max(60, state.remainingSeconds - 7200);
        saveGameSessionForWorld2();

        const formatted = formatGlobalClock(state.remainingSeconds);
        document.getElementById('hud-timer').textContent = formatted;
        document.getElementById('modal-w5-live-timer').textContent = formatted;

        btnElement.className = 'w-full p-3 rounded-xl bg-rose-950/80 border-2 border-rose-500 text-left text-xs sm:text-sm text-rose-200 font-medium transition flex items-center gap-2.5 opacity-75';
        cardBox.classList.remove('shake-error');
        void cardBox.offsetWidth;
        cardBox.classList.add('shake-error');

        fbBanner.className = 'p-3 rounded-xl bg-rose-950/95 border border-rose-400 text-xs text-rose-200 font-bold text-center';
        fbBanner.innerHTML = `⏱️ ¡Elección Incorrecta! Se han descontado <b>-02:00 HORAS</b> de su reloj global (Quedan ${formatted}). Las horas perdidas no se recuperan. ¡Apóyense con sus habilidades Recuerdo o Inventiva!`;
        fbBanner.classList.remove('hidden');
      }
    }

    function renderWorld5ConversationStep() {
      const stepData = tableConversationWorld5[state.w5ConvIndex];
      if (!stepData) return;
      sfxDialogueBlip(state.w5ConvIndex % 2 === 0);
      document.getElementById('w5-conv-step-badge').textContent = stepData.badge;
      document.getElementById('w5-conv-body').innerHTML = stepData.html;

      const nextBtn = document.getElementById('btn-next-w5-conv');
      const starRewardCard = document.getElementById('w5-star-reward-card');
      if (state.w5ConvIndex >= tableConversationWorld5.length - 1) {
        nextBtn.classList.add('hidden');
        starRewardCard.classList.remove('hidden');
        sfxStarVictory();
      } else {
        nextBtn.classList.remove('hidden');
        starRewardCard.classList.add('hidden');
      }
    }

    function completeWorld5OrderAndServe() {
      document.getElementById('modal-world5-menu').classList.add('hidden');
      state.star5Earned = true;
      state.exitPortalWorld6.active = true;
      state.w5ConvIndex = 0;

      state.princess.x = state.lanternTableW5.x - 35;
      state.princess.y = state.lanternTableW5.y + 18;
      state.duke.x = state.lanternTableW5.x + 35;
      state.duke.y = state.lanternTableW5.y + 18;
      state.princess.bubble = '🍣 ¡Makis Furai y Shoyu Ramen!';
      state.duke.bubble = '★★★★★ ¡Estrella de la Complicidad!';
      state.targetPoint = null;

      saveGameSessionForWorld2();
      addFloatingText(state.lanternTableW5.x, state.lanternTableW5.y - 30, '★★★★★ ¡ESTRELLA DE LA COMPLICIDAD! ★★★★★', '#facc15');
      renderStarsBar();
      renderInventoryAndChecklist();
      renderWorldsView();

      setDialogue(
        'LA CASA DE LOS FAROLES — MESA SERVIDA',
        '🍜',
        'Estrella 5 / 7 — La Estrella de la Complicidad',
        '<b>Pedido servido en la mesa:</b> 1. Makis Furai • 2. Shoyu Ramen • 3. Maracuyá Frozen • 4. Sin postre.<br><br>El Duque y la Princesa conversan entre risas y complicidad recordando aquella primera visita.',
        [
          {
            label: '🏮 Ver Escena de la Cena y Estrella de la Complicidad',
            action: () => {
              document.getElementById('modal-world5-victory').classList.remove('hidden');
            }
          }
        ]
      );

      renderWorld5ConversationStep();
      document.getElementById('modal-world5-victory').classList.remove('hidden');
    }

    function openDessertMenuModal() {
      document.getElementById('dessert-feedback-box').classList.add('hidden');
      document.getElementById('modal-world3-dessert').classList.remove('hidden');
    }

    function handleDessertChoice(dessertKey) {
      const fb = document.getElementById('dessert-feedback-box');
      if (dessertKey !== 'helado_lucuma') {
        playTone(210, 'sawtooth', 0.25, 0, 0.12);
        const wrongMessages = {
          torta_chocolate: '🍫 La Princesa sonríe: «Mmm, la torta de chocolate se veía rica, ¡pero ese día frente al mar de Miraflores elegimos algo más fresco y bien peruano!»',
          crema_volteada: '🍮 El Duque se ríe: «Casi, mi Princesa, pero no fue crema volteada... ¡Acuérdate de ese sabor dulce y helado que tanto nos gustó!»',
          pie_limon: '🍋 La Princesa niega con ternura: «No fue pie de limón... ¡Pista: es un helado de nuestra fruta favorita!»',
          suspiro_limeno: '🥂 El Duque sonríe: «El suspiro limeño estaba en la carta de La Rosa Náutica, ¡pero nosotros pedimos un helado inolvidable!»'
        };
        fb.innerHTML = wrongMessages[dessertKey] || 'Ese no fue el postre que eligieron aquella tarde. ¡Intenta de nuevo!';
        fb.classList.remove('hidden');
        return;
      }

      // CORRECT ANSWER: HELADO DE LÚCUMA!
      document.getElementById('modal-world3-dessert').classList.add('hidden');
      state.star3Earned = true;
      state.exitPortalWorld4.active = true;
      state.duke.x = state.seaTableWorld3.x - 36;
      state.duke.y = state.seaTableWorld3.y + 15;
      state.princess.x = state.seaTableWorld3.x + 16;
      state.princess.y = state.seaTableWorld3.y + 15;
      state.duke.bubble = '🍨 ¡Helado de lúcuma!';
      state.princess.bubble = '💞 «...pero a tu lado»';
      state.targetPoint = null;

      sfxStarVictory();
      saveGameSessionForWorld2();
      addFloatingText(state.seaTableWorld3.x, state.seaTableWorld3.y - 35, '★★★ ¡ESTRELLA 3 RECUPERADA! ★★★', '#facc15');
      renderStarsBar();
      renderInventoryAndChecklist();
      renderWorldsView();

      setDialogue(
        'RECUERDO DESBLOQUEADO EN LA ROSA NÁUTICA',
        '🍨',
        'Estrella 3 / 7 Obtenida — Helado de Lúcuma al Atardecer',
        '<b>🤵 Duque (de terno negro):</b> «¡Exacto, fue el <b>Helado de lúcuma</b>! Cómo olvidar tu sonrisa frente al mar de Miraflores...»<br><br><b>👸👑 Juntos frente al atardecer:</b> <b>«Quiero descubrir cada lugar, cada espacio, cada mundo pero a tu lado»</b>',
        [
          {
            label: '🃏 Cruzar Ahora al Mundo 4 (Las 21 Cartas) ➔',
            action: () => enterWorld4Directly()
          },
          {
            label: '🌟 Ver Escena Completa de la Estrella 3',
            action: () => {
              document.getElementById('modal-world3-victory').classList.remove('hidden');
            }
          }
        ]
      );

      document.getElementById('modal-world3-victory').classList.remove('hidden');
    }

    function resetLevel() {
      if (state.currentWorld === 1) {
        state.costumesEquipped = false;
        state.flashbackSeen = false;
        state.exitPortalWorld2.active = false;
        state.itemsWorld1.forEach(it => { it.collected = false; it.placed = false; });
        loadWorld(1, true);
      } else if (state.currentWorld === 2) {
        state.star2Earned = false;
        state.trainRemainingSeconds = 300;
        state.itemsWorld2.forEach(it => { it.collected = false; });
        loadWorld(2, true);
      } else if (state.currentWorld === 3) {
        state.star3Earned = false;
        state.exitPortalWorld4.active = false;
        state.itemsWorld3.forEach(it => { it.collected = false; });
        loadWorld(3, true);
      } else if (state.currentWorld === 4) {
        if (cardFlipTimer) { clearTimeout(cardFlipTimer); cardFlipTimer = null; }
        if (cardAdvanceTimer) { clearTimeout(cardAdvanceTimer); cardAdvanceTimer = null; }
        cardFlipLocked = false;
        state.star4Earned = false;
        state.currentCardIndex = 0;
        state.autoOpenedCardsAtTable = false;
        document.getElementById('modal-world4-cards').classList.add('hidden');
        document.getElementById('modal-world4-victory').classList.add('hidden');
        // El reloj global de 24 horas (state.remainingSeconds) NUNCA se reinicia
        loadWorld(4, true);
      } else if (state.currentWorld === 5) {
        state.star5Earned = false;
        state.w5CurrentMenuStep = 0;
        state.w5AutoOpenedTable = false;
        document.getElementById('modal-world5-menu').classList.add('hidden');
        document.getElementById('modal-world5-victory').classList.add('hidden');
        // Las horas descontadas (-2h por error) NO se recuperan jamás al reintentar el desafío
        loadWorld(5, true);
      } else if (state.currentWorld === 7) {
        document.getElementById('items-count').textContent = state.star7Earned ? '7/7' : 'Final';
        grid.innerHTML = `
          <div class="col-span-2 p-2.5 rounded-lg bg-amber-500/15 border border-amber-400/50 text-amber-200 text-xs font-medium text-center">
            🛥️ Nivel Final: La Confesión en el Caribe
          </div>`;
        checklistEl.innerHTML = '<div class="text-xs font-semibold text-amber-300 uppercase tracking-wider">Objetivos Mundo 7:</div>' +
          `<div class="flex items-center gap-2 text-xs ${state.w7ConfessionStarted ? 'text-emerald-300 font-medium' : 'text-slate-300'}"><span class="w-4 h-4 rounded ${state.w7ConfessionStarted ? 'bg-emerald-500 text-slate-950 font-bold' : 'border border-slate-600'} flex items-center justify-center text-[10px]">${state.w7ConfessionStarted ? '✓' : '1'}</span><span>Subir a la cubierta superior blanca con el Duque</span></div>` +
          `<div class="flex items-center gap-2 text-xs ${state.star7Earned ? 'text-emerald-300 font-medium' : 'text-slate-300'}"><span class="w-4 h-4 rounded ${state.star7Earned ? 'bg-emerald-500 text-slate-950 font-bold' : 'border border-slate-600'} flex items-center justify-center text-[10px]">${state.star7Earned ? '✓' : '2'}</span><span>Escuchar "La Confesión" y tomar la decisión final</span></div>`;
        statusEl.textContent = state.star7Earned
          ? '★★★★★★★ ¡7/7 Estrellas! La historia ha llegado a su cierre.'
          : 'Mundo 7: Camina hacia el Duque en la cubierta superior blanca para iniciar "La Confesión".';
      } else if (state.currentWorld === 6) {
        if (w6AdvanceTimer) { clearTimeout(w6AdvanceTimer); w6AdvanceTimer = null; }
        w6WardrobeLocked = false;
        w6AutoOpenedIndex = -1;
        state.star6Earned = false;
        state.w6CurrentWardrobeStep = 0;
        state.exitPortalWorld7.active = false;
        wardrobesWorld6.forEach(w => { w.completed = false; });
        document.getElementById('modal-world6-wardrobe').classList.add('hidden');
        document.getElementById('modal-world6-victory').classList.add('hidden');
        // El reloj global de 24 horas NUNCA se reinicia ni se detiene
        loadWorld(6, true);
      } else if (state.currentWorld === 7) {
        if (state.w7NoCountdownTimer) clearInterval(state.w7NoCountdownTimer);
        const vid = document.getElementById('w7-ending-yes-video');
        if (vid) vid.pause();
        state.star7Earned = false;
        state.w7ConfessionStarted = false;
        state.w7ConfessionStep = 0;
        document.getElementById('modal-world7-confession').classList.add('hidden');
        document.getElementById('modal-world7-ending-yes').classList.add('hidden');
        document.getElementById('modal-world7-ending-no').classList.add('hidden');
        loadWorld(7, true);
      }
    }

    // =========================================================
    // CANVAS 2D RENDERING & UPDATE LOOP (WORLD 1 & WORLD 2)
    // =========================================================
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const LOGICAL_W = 800;
    const LOGICAL_H = 500;

    function resizeCanvas() {
      canvas.width = LOGICAL_W;
      canvas.height = LOGICAL_H;
    }

    let stepTick = 0;

    function updateGame() {
      // El Mundo 7 es una secuencia protagonizada por Carolina/Princesa.
      // Esta garantía evita heredar el control del Duque tras una transición.
      if (state.currentWorld === 7 && state.activeChar !== 'princess') {
        state.activeChar = 'princess';
      }
      const player = getControlledChar();
      const companion = getCompanionChar();

      if (state.sprintBoostTimer > 0) state.sprintBoostTimer--;
      if (state.obstacleHitCooldown > 0) state.obstacleHitCooldown--;

      const currentSpeed = state.sprintBoostTimer > 0 || state.keys['ShiftLeft'] || state.keys['ShiftRight']
        ? player.speed * 1.42
        : player.speed;

      let dx = 0;
      let dy = 0;
      if (state.keys['ArrowUp'] || state.keys['KeyW'] || state.keys['up']) dy -= 1;
      if (state.keys['ArrowDown'] || state.keys['KeyS'] || state.keys['down']) dy += 1;
      if (state.keys['ArrowLeft'] || state.keys['KeyA'] || state.keys['left']) dx -= 1;
      if (state.keys['ArrowRight'] || state.keys['KeyD'] || state.keys['right']) dx += 1;

      if (dx !== 0 || dy !== 0) {
        state.targetPoint = null;
        const len = Math.hypot(dx, dy);
        player.x += (dx / len) * currentSpeed;
        player.y += (dy / len) * currentSpeed;
        stepTick++;
        if (stepTick % 16 === 0) sfxStep();
      } else if (state.targetPoint) {
        const tdx = state.targetPoint.x - player.x;
        const tdy = state.targetPoint.y - player.y;
        const dist = Math.hypot(tdx, tdy);
        if (dist > 4) {
          player.x += (tdx / dist) * currentSpeed;
          player.y += (tdy / dist) * currentSpeed;
          stepTick++;
          if (stepTick % 16 === 0) sfxStep();
        } else {
          state.targetPoint = null;
        }
      }

      player.x = Math.max(45, Math.min(LOGICAL_W - 45, player.x));
      player.y = Math.max(105, Math.min(LOGICAL_H - 35, player.y));

      // El portal del Mundo 7 se activa por proximidad: no requiere clic ni [ESPACIO].
      if (
        state.currentWorld === 6 &&
        state.star6Earned &&
        state.exitPortalWorld7.active &&
        !isAnyModalOpen() &&
        Math.hypot(player.x - state.exitPortalWorld7.x, player.y - state.exitPortalWorld7.y) <
          player.r + state.exitPortalWorld7.r + 22
      ) {
        state.targetPoint = null;
        enterWorld7Directly();
        return;
      }

      // Companion smoothly follows holding hands
      const isVictoryPose = (state.currentWorld === 1 && state.exitPortalWorld2.active) || (state.currentWorld === 2 && state.star2Earned) || state.currentWorld === 6 || state.currentWorld === 7;
      if (!isVictoryPose) {
        const cdx = player.x - companion.x;
        const cdy = player.y - companion.y;
        const cdist = Math.hypot(cdx, cdy);
        if (cdist > 44) {
          companion.x += (cdx / cdist) * (currentSpeed * 0.95);
          companion.y += (cdy / cdist) * (currentSpeed * 0.95);
        }
      }

      // WORLD 3 OBSTACLE PATROL & COLLISION LOGIC (MIRAFLORES PIER & SALON)
      if (state.currentWorld === 3 && !state.star3Earned && !isAnyModalOpen()) {
        for (const obs of state.obstaclesWorld3) {
          if (obs.vy !== 0) {
            obs.y += obs.vy;
            if (obs.y < obs.minY || obs.y > obs.maxY) obs.vy *= -1;
          }
          const distToPlayer = Math.hypot(player.x - obs.x, player.y - obs.y);
          if (distToPlayer < player.r + obs.r - 4 && state.obstacleHitCooldown === 0) {
            state.obstacleHitCooldown = 65;
            playTone(185, 'sawtooth', 0.22, 0, 0.11);
            applyDirectionalPushback(player, companion, obs);
            state.targetPoint = null;
            addFloatingText(player.x, player.y - 25, '🌊 ¡Cuidado en el muelle!', '#38bdf8');
            state.duke.bubble = '🤵 ¡Yo te cubro, Princesa!';
            state.princess.bubble = '🌊 ¡Casi nos salpica!';
            setDialogue(
              'EL DUQUE (DE TERNO NEGRO)',
              '🤵',
              'Obstáculo en La Rosa Náutica',
              `«¡Cuidado con <b>${obs.name}</b>, mi Princesa! Ponte detrás de mí para que no te moje la brisa ni choquemos con las bandejas. ¡Crucemos por aquí!»`
            );
          }
        }
      }

      // WORLD 1 MOVING OBSTACLES PATROL & COLLISION LOGIC (-20 MINUTES FROM GLOBAL 24H CLOCK)
      if (state.currentWorld === 1 && !state.star1Earned && !isAnyModalOpen()) {
        for (const obs of state.obstaclesWorld1) {
          if (obs.vx !== 0) {
            obs.x += obs.vx;
            if (obs.x < obs.minX || obs.x > obs.maxX) obs.vx *= -1;
          }
          if (obs.vy !== 0) {
            obs.y += obs.vy;
            if (obs.y < obs.minY || obs.y > obs.maxY) obs.vy *= -1;
          }

          const distToPlayer = Math.hypot(player.x - obs.x, player.y - obs.y);
          if (distToPlayer < player.r + obs.r - 4 && state.obstacleHitCooldown === 0) {
            state.obstacleHitCooldown = 65;
            // Descuenta 20 minutos (1200 segundos) del reloj global de 24 horas
            state.remainingSeconds = Math.max(60, state.remainingSeconds - 1200);
            saveGameSessionForWorld2();
            document.getElementById('hud-timer').textContent = formatGlobalClock(state.remainingSeconds);

            sfxTimePenalty();
            applyDirectionalPushback(player, companion, obs);
            state.targetPoint = null;

            addFloatingText(player.x, player.y - 25, '⏱️ -20 MIN (Reloj 24h) ¡Cuidado!', '#fb7185');
            state.duke.bubble = '¡Cuidado en el salón!';
            state.princess.bubble = '⏱️ ¡Perdimos 20 min!';

            setDialogue(
              'EL DUQUE (CUIDANDO A LA PRINCESA)',
              '👑',
              'Obstáculo en el Salón Navideño (-20 Minutos al Reloj Total)',
              `«¡Cuidado con <b>${obs.name}</b>, Princesa! El choque nos acaba de descontar <b>20 minutos</b> del marcador total de 24 horas. ¡Camina conmigo con cuidado!»`
            );
          }
        }
      }

      // WORLD 2 OBSTACLE PATROL & COLLISION LOGIC (-20 MINUTES FROM GLOBAL 24H CLOCK)
      if (state.currentWorld === 2 && !state.star2Earned && !isAnyModalOpen()) {
        for (const obs of state.obstaclesWorld2) {
          if (obs.vx !== 0) {
            obs.x += obs.vx;
            if (obs.x < obs.minX || obs.x > obs.maxX) {
              obs.vx *= -1;
            }
          }
          if (obs.vy !== 0) {
            obs.y += obs.vy;
            if (obs.y < obs.minY || obs.y > obs.maxY) {
              obs.vy *= -1;
            }
          }

          // Check collision with player
          const distToPlayer = Math.hypot(player.x - obs.x, player.y - obs.y);
          if (distToPlayer < player.r + obs.r - 4 && state.obstacleHitCooldown === 0) {
            state.obstacleHitCooldown = 65; // ~1.1 sec immunity
            // Descuenta 20 minutos (1200s) del marcador global de 24h y 20 segundos (20s) del reloj de 5 minutos del tren
            state.remainingSeconds = Math.max(60, state.remainingSeconds - 1200);
            state.trainRemainingSeconds = Math.max(5, state.trainRemainingSeconds - 20);
            saveGameSessionForWorld2();
            document.getElementById('hud-timer').textContent = formatGlobalClock(state.remainingSeconds);
            const tMinsNow = String(Math.floor(state.trainRemainingSeconds / 60)).padStart(2, '0');
            const tSecsNow = String(state.trainRemainingSeconds % 60).padStart(2, '0');
            document.getElementById('hud-train-timer').textContent = `${tMinsNow}:${tSecsNow}`;

            sfxTimePenalty();

            // Directional pushback away from obstacle
            applyDirectionalPushback(player, companion, obs);
            state.targetPoint = null;

            addFloatingText(player.x, player.y - 25, '⏱️ -20s Tren / -20m Global ¡Obstáculo!', '#fb7185');
            state.duke.bubble = '¡No sueltes mi mano!';
            state.princess.bubble = '⏱️ ¡-20 min al reloj!';

            setDialogue(
              'EL DUQUE (PROTEGIENDO A LA PRINCESA)',
              '👑',
              'Obstáculo en el Bulevar (-20 Minutos al Reloj Total)',
              `«¡Cuidado con <b>${obs.name}</b>, Princesa! Casi nos cierra el paso y el choque descontó <b>20 minutos</b> de nuestro marcador total de 24 horas, pero yo te sostengo. ¡Ven por aquí, no te sueltes de mi mano!»`
            );
          }
        }
      }

      // Update floating interaction prompt
      const nearby = findNearbyInteractable();
      const promptEl = document.getElementById('interact-prompt');

      // AUTO-OPEN "LA CONFESIÓN" WHEN CAROLINA REACHES THE DUQUE ON THE YACHT IN WORLD 7
      if (
        state.currentWorld === 7 &&
        !state.w7ConfessionStarted &&
        !state.star7Earned &&
        nearby &&
        nearby.kind === 'duke_confession_w7' &&
        document.getElementById('modal-world7-confession').classList.contains('hidden')
      ) {
        state.targetPoint = null;
        openWorld7ConfessionModal(0);
      }

      // AUTO-OPEN WARDROBE MODAL WHEN THE PRINCESS REACHES A WARDROBE IN WORLD 6
      if (
        state.currentWorld === 6 &&
        !state.star6Earned &&
        nearby &&
        nearby.kind === 'wardrobe_w6' &&
        w6AutoOpenedIndex !== nearby.index &&
        document.getElementById('modal-prologue').classList.contains('hidden') &&
        document.getElementById('modal-world6-wardrobe').classList.contains('hidden')
      ) {
        w6AutoOpenedIndex = nearby.index;
        state.targetPoint = null;
        openWorld6WardrobeModal(nearby.index);
      }

      // AUTO-OPEN THE 4 MENU CARDS WHEN REACHING THE TABLE IN WORLD 5
      if (
        state.currentWorld === 5 &&
        !state.star5Earned &&
        !state.w5AutoOpenedTable &&
        nearby &&
        nearby.kind === 'lantern_table_w5' &&
        document.getElementById('modal-prologue').classList.contains('hidden') &&
        document.getElementById('modal-world5-menu').classList.contains('hidden')
      ) {
        state.w5AutoOpenedTable = true;
        state.targetPoint = null;
        openWorld5MenuModal();
      }

      // AUTO-OPEN FIRST CARD WHEN REACHING THE GUARDIAN'S TABLE IN WORLD 4 (Keeping 100% of attention in the center)
      if (
        state.currentWorld === 4 &&
        !state.star4Earned &&
        !state.autoOpenedCardsAtTable &&
        nearby &&
        nearby.kind === 'guardian_table_w4' &&
        document.getElementById('modal-prologue').classList.contains('hidden') &&
        document.getElementById('modal-world4-cards').classList.contains('hidden')
      ) {
        state.autoOpenedCardsAtTable = true;
        state.targetPoint = null;
        openWorld4CardsModal();
      }

      if (nearby) {
        promptEl.classList.remove('hidden');
        if (nearby.kind === 'item_w1' || nearby.kind === 'item_w2' || nearby.kind === 'item_w3') {
          promptEl.innerHTML = `<span>✨ [ESPACIO] Recoger: <b>${nearby.data.title}</b></span>`;
        } else if (nearby.kind === 'altar_w1') {
          promptEl.innerHTML = `<span>⭐ [ESPACIO] Interpretar Nacimiento en el Pesebre</span>`;
        } else if (nearby.kind === 'portal_world2') {
          promptEl.innerHTML = `<span>🌌 [ESPACIO] Cruzar Portal hacia el Mundo 2 (Tren 02:30 PM)</span>`;
        } else if (nearby.kind === 'train_platform_w2') {
          promptEl.innerHTML = `<span>🚂 [ESPACIO] Subir al Andén del Tren (02:30 PM)</span>`;
        } else if (nearby.kind === 'table_w3') {
          promptEl.innerHTML = `<span>🍨 [ESPACIO] Sentarse en la Mesa Frente al Mar y Elegir Postre</span>`;
        } else if (nearby.kind === 'portal_world4') {
          promptEl.innerHTML = `<span>🃏 [ESPACIO] Cruzar Portal hacia el Mundo 4 (Las 21 Cartas)</span>`;
        } else if (nearby.kind === 'guardian_table_w4') {
          promptEl.innerHTML = `<span>🃏 [ESPACIO] Responder las 21 Cartas ante el Guardián (${state.currentCardIndex}/21)</span>`;
        } else if (nearby.kind === 'door_w4') {
          promptEl.innerHTML = `<span>🔓 [ESPACIO] Cruzar la Gran Puerta hacia el Mundo 5</span>`;
        } else if (nearby.kind === 'lantern_table_w5') {
          promptEl.innerHTML = `<span>🍣 [ESPACIO] Reconstruir el Pedido en la Mesa (${state.w5CurrentMenuStep}/4 Cartas)</span>`;
        } else if (nearby.kind === 'guardian_w5') {
          promptEl.innerHTML = `<span>🏮 [ESPACIO] Hablar con el Guardián de La Casa de los Faroles</span>`;
        } else if (nearby.kind === 'wardrobe_w6') {
          promptEl.innerHTML = `<span>${nearby.data.icon} [ESPACIO] Abrir <b>${nearby.data.name}</b></span>`;
        } else if (nearby.kind === 'portal_world7') {
          promptEl.innerHTML = `<span>⛓️ [ESPACIO] Ir a la Cárcel del Silencio (Mundo 7)</span>`;
        } else if (nearby.kind === 'duke_confession_w7') {
          promptEl.innerHTML = `<span>💍 [ESPACIO] Hablar con el Duque en el Yate Blanco</span>`;
        } else if (nearby.kind === 'companion') {
          promptEl.innerHTML = `<span>💬 [ESPACIO] Conversar con ${nearby.data.name}</span>`;
        }
      } else {
        promptEl.classList.add('hidden');
      }

      if (state.currentWorld === 4 && state.autoOpenedCardsAtTable && (!nearby || nearby.kind !== 'guardian_table_w4')) {
        const distFromTable = Math.hypot(player.x - state.guardianTableWorld4.x, player.y - state.guardianTableWorld4.y);
        if (distFromTable > 110) {
          state.autoOpenedCardsAtTable = false;
        }
      }

      // Update ambient particles
      for (const p of state.particles) {
        p.y += p.vy;
        p.x += p.vx;
        if (p.y > LOGICAL_H) {
          p.y = -5;
          p.x = Math.random() * LOGICAL_W;
        }
      }

      // Update floating feedback texts
      for (let i = state.floatingTexts.length - 1; i >= 0; i--) {
        const ft = state.floatingTexts[i];
        ft.y += ft.vy;
        ft.alpha -= 0.016;
        if (ft.alpha <= 0) state.floatingTexts.splice(i, 1);
      }
    }

    function drawCharacter(charObj, isDuke, isControlled) {
      ctx.save();
      ctx.translate(charObj.x, charObj.y);

      if (isControlled) {
        ctx.beginPath();
        ctx.ellipse(0, 18, 22, 8, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(250, 204, 21, 0.28)';
        ctx.fill();
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.ellipse(0, 18, 18, 6, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.5)';
        ctx.fill();
      }

      // Body / Attire
      if (state.currentWorld === 7) {
        if (isDuke) {
          ctx.fillStyle = '#7f1d1d';
          ctx.beginPath();
          ctx.roundRect(-13, -6, 26, 24, 6);
          ctx.fill();
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(-6, -5, 12, 18);
        } else {
          ctx.fillStyle = '#881337';
          ctx.beginPath();
          ctx.moveTo(-11, -5);
          ctx.lineTo(11, -5);
          ctx.lineTo(16, 20);
          ctx.lineTo(-16, 20);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#fb7185';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
        ctx.beginPath();
      } else {
      ctx.beginPath();
      ctx.roundRect(-13, -6, 26, 24, 6);
      if (state.currentWorld === 1 && state.costumesEquipped) {
        ctx.fillStyle = isDuke ? '#92400e' : '#0284c7';
      } else if (state.currentWorld === 3) {
        // World 3: Duke in elegant Black Suit (#0f172a), Princess in cozy comfortable rose-lavender sweater (#f472b6)
        ctx.fillStyle = isDuke ? '#090d16' : '#f472b6';
      } else {
        ctx.fillStyle = isDuke ? '#3730a3' : '#be185d';
      }
      ctx.fill();
      }
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // World 3 Special Attire Details: White Shirt V-Lapel & Red Tie for Duke's Black Suit; Cozy Hoodie Strings for Princess
      if (state.currentWorld === 3) {
        if (isDuke) {
          // Crisp white dress shirt triangle
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.moveTo(-5, -5);
          ctx.lineTo(5, -5);
          ctx.lineTo(0, 7);
          ctx.closePath();
          ctx.fill();
          // Silk red tie
          ctx.fillStyle = '#e11d48';
          ctx.fillRect(-1.3, -3, 2.6, 11);
        } else {
          // Comfortable soft sweater collar & drawstrings
          ctx.strokeStyle = '#fdf2f8';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(-3, -4); ctx.lineTo(-3, 5);
          ctx.moveTo(3, -4); ctx.lineTo(3, 5);
          ctx.stroke();
        }
      }

      // Head
      ctx.beginPath();
      ctx.arc(0, -14, 10, 0, Math.PI * 2);
      ctx.fillStyle = '#fde68a';
      ctx.fill();
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Eyes
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(-3.5, -15, 1.5, 0, Math.PI * 2);
      ctx.arc(3.5, -15, 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Crown
      if (!(state.currentWorld === 1 && state.costumesEquipped)) {
        ctx.fillStyle = '#facc15';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('👑', 0, -26);
      }

      // Speech Bubble
      if (charObj.bubble) {
        ctx.font = '10px Inter, sans-serif';
        const textWidth = ctx.measureText(charObj.bubble).width;
        const bw = textWidth + 14;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.strokeStyle = isDuke ? '#818cf8' : '#f472b6';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(-bw / 2, -52, bw, 18, 6);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#f8fafc';
        ctx.textAlign = 'center';
        ctx.fillText(charObj.bubble, 0, -40);
      }

      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#f8fafc';
      const roleLabel = (state.currentWorld === 1 && state.costumesEquipped)
        ? (isDuke ? 'Duque (José)' : 'Princesa (María)')
        : (state.currentWorld === 3
            ? (isDuke ? 'Duque (Terno Negro)' : 'Princesa (Ropa Cómoda)')
            : charObj.name);
      ctx.fillText(roleLabel, 0, 32);

      ctx.restore();
    }

    function drawWorld1Scene() {
      const bgGrad = ctx.createLinearGradient(0, 0, 0, LOGICAL_H);
      bgGrad.addColorStop(0, '#090d16');
      bgGrad.addColorStop(0.25, '#131c31');
      bgGrad.addColorStop(1, '#1e1b2e');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, LOGICAL_W, LOGICAL_H);

      // Top Wall
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, LOGICAL_W, 82);
      ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(250, 16, 300, 46, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 13px Cinzel, serif';
      ctx.textAlign = 'center';
      ctx.fillText('MUNDO 1: NAVIDAD • 21 DIC 2025', 400, 36);
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '11px Inter, sans-serif';
      ctx.fillText('Escenario del Nacimiento: "José y María"', 400, 52);

      // Manger Altar
      const altar = state.mangerAltar;
      ctx.save();
      ctx.translate(altar.x, altar.y);
      ctx.fillStyle = 'rgba(120, 53, 15, 0.35)';
      ctx.strokeStyle = state.exitPortalWorld2.active ? '#facc15' : '#b45309';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-altar.w / 2, -altar.h / 2, altar.w, altar.h, 12);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#fde68a';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ALTAR DEL PESEBRE', 0, -altar.h / 2 + 16);

      const cribPlaced = state.itemsWorld1.find(i => i.id === 'crib').placed;
      const animalsPlaced = state.itemsWorld1.find(i => i.id === 'animals').placed;
      const lightsPlaced = state.itemsWorld1.find(i => i.id === 'lights').placed;
      const babyPlaced = state.itemsWorld1.find(i => i.id === 'baby_jesus').placed;

      if (lightsPlaced) { ctx.font = '24px sans-serif'; ctx.fillText('🌟', 0, -altar.h / 2 - 12); }
      if (cribPlaced) { ctx.font = '22px sans-serif'; ctx.fillText('🧺', 0, 8); }
      if (animalsPlaced) { ctx.font = '20px sans-serif'; ctx.fillText('🐂', -48, 8); ctx.fillText('🫏', 48, 8); }
      if (babyPlaced) { ctx.font = '22px sans-serif'; ctx.fillText('👶', 0, 4); }
      if (!cribPlaced && !animalsPlaced && !lightsPlaced && !babyPlaced) {
        ctx.fillStyle = 'rgba(203, 213, 225, 0.5)';
        ctx.font = '11px Inter, sans-serif';
        ctx.fillText('(Arma aquí los 4 detalles)', 0, 10);
      }
      ctx.restore();

      const pulse = Math.sin(Date.now() * 0.005) * 4;
      for (const item of state.itemsWorld1) {
        if (item.collected) continue;
        ctx.save();
        ctx.translate(item.x, item.y);
        ctx.beginPath();
        ctx.arc(0, 0, item.r + pulse, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(250, 204, 21, 0.12)';
        ctx.fill();
        ctx.strokeStyle = item.color;
        ctx.lineWidth = 1.8;
        ctx.stroke();
        ctx.font = '22px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.icon, 0, 0);
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.fillStyle = '#f8fafc';
        ctx.fillText(item.title, 0, item.r + 13);
        ctx.restore();
      }

        // Draw Highly Visible Moving Obstacles & Patrol Tracks in World 1
      if (!state.star1Earned) {
        const obsPulse = Math.sin(Date.now() * 0.008) * 4;
        for (const obs of state.obstaclesWorld1) {
          // 1. Draw dashed patrol route line so the player clearly sees where the obstacle moves
          ctx.save();
          ctx.strokeStyle = 'rgba(244, 63, 94, 0.28)';
          ctx.lineWidth = 2;
          ctx.setLineDash([6, 6]);
          ctx.beginPath();
          ctx.moveTo(obs.minX, obs.minY);
          ctx.lineTo(obs.maxX, obs.maxY);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.restore();

          // 2. Draw glowing obstacle body, outer danger aura, icon, and clear badge
          ctx.save();
          ctx.translate(obs.x, obs.y);

          const auraGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, obs.r + 14 + obsPulse);
          auraGrad.addColorStop(0, 'rgba(244, 63, 94, 0.45)');
          auraGrad.addColorStop(1, 'rgba(244, 63, 94, 0)');
          ctx.fillStyle = auraGrad;
          ctx.beginPath();
          ctx.arc(0, 0, obs.r + 14 + obsPulse, 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.arc(0, 0, obs.r + 2, 0, Math.PI * 2);
          ctx.fillStyle = '#1e1b4b';
          ctx.fill();
          ctx.strokeStyle = obs.color;
          ctx.lineWidth = 2.8;
          ctx.stroke();

          ctx.font = '20px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(obs.icon, 0, 0);

          // Badge pill below obstacle
          const labelTxt = '⚠️ OBSTÁCULO (-20m)';
          ctx.font = 'bold 9px JetBrains Mono, monospace';
          const tw = ctx.measureText(labelTxt).width + 10;
          ctx.fillStyle = 'rgba(136, 19, 55, 0.92)';
          ctx.strokeStyle = '#fb7185';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(-tw / 2, obs.r + 4, tw, 15, 5);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#ffe4e6';
          ctx.fillText(labelTxt, 0, obs.r + 12);
          ctx.restore();
        }
      }

      if (state.exitPortalWorld2.active) {
        const portal = state.exitPortalWorld2;
        ctx.save();
        ctx.translate(portal.x, portal.y);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, 0, portal.r + pulse, 0, Math.PI * 2);
        ctx.stroke();
        ctx.font = '24px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🌌', 0, 0);
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.fillStyle = '#7dd3fc';
        ctx.fillText('PORTAL AL MUNDO 2', 0, portal.r + 14);
        ctx.restore();
      }
    }

    function drawWorld2Scene() {
      // Sunset Romantic Park -> Bustling Boulevard -> Train Station 02:30 PM
      const bgGrad = ctx.createLinearGradient(0, 0, LOGICAL_W, LOGICAL_H);
      bgGrad.addColorStop(0, '#1e1b4b');   // Deep twilight violet
      bgGrad.addColorStop(0.5, '#31102f'); // Romantic rose-amber sunset
      bgGrad.addColorStop(1, '#0f172a');   // Station slate
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, LOGICAL_W, LOGICAL_H);

      // Decorative cobblestone boulevard path connecting Park (bottom-left) to Station (top-right)
      ctx.save();
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.18)';
      ctx.lineWidth = 85;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(110, 415);
      ctx.quadraticCurveTo(390, 320, 685, 175);
      ctx.stroke();
      ctx.restore();

      // Top Station Header & Railway Tracks
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, LOGICAL_W, 88);

      // Railway tracks across the top right
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(470, 52);
      ctx.lineTo(LOGICAL_W, 52);
      ctx.moveTo(470, 72);
      ctx.lineTo(LOGICAL_W, 72);
      ctx.stroke();
      for (let tx = 480; tx < LOGICAL_W; tx += 18) {
        ctx.beginPath();
        ctx.moveTo(tx, 48);
        ctx.lineTo(tx, 76);
        ctx.stroke();
      }

      // Express Train Waiting at the 02:30 PM Station!
      const trainBounce = Math.sin(Date.now() * 0.012) * 1.5;
      ctx.save();
      ctx.translate(615, 36 + trainBounce);
      ctx.fillStyle = '#b91c1c';
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(0, 0, 165, 38, 8);
      ctx.fill();
      ctx.stroke();
      // Illuminated windows
      ctx.fillStyle = '#fef08a';
      for (let wx = 16; wx < 145; wx += 32) {
        ctx.fillRect(wx, 8, 20, 14);
      }
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 10px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('EXPRESO CIUDAD • 02:30 PM', 82, 33);
      ctx.restore();

      // Station Clock Tower Banner (Top Left/Center)
      const mins = String(Math.floor(state.trainRemainingSeconds / 60)).padStart(2, '0');
      const secs = String(state.trainRemainingSeconds % 60).padStart(2, '0');
      ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
      ctx.strokeStyle = '#fb7185';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.roundRect(30, 14, 410, 58, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fda4af';
      ctx.font = 'bold 13px Cinzel, serif';
      ctx.textAlign = 'left';
      ctx.fillText('MUNDO 2: PASEO ROMÁNTICO • SALIDA 02:30 PM', 46, 36);
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 12px JetBrains Mono, monospace';
      ctx.fillText(`⏱️ CRONÓMETRO DEL TREN: ${mins}:${secs} restantes`, 46, 56);

      // Left Zone: Romantic Park Café where they started walking
      ctx.save();
      ctx.translate(125, 415);
      ctx.strokeStyle = 'rgba(244, 114, 182, 0.35)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.ellipse(0, 0, 75, 42, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(244, 114, 182, 0.75)';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🌸 Parque del Paseo (Punto de Partida)', 0, 52);
      ctx.restore();

      // Draw Train Station Boarding Platform (Goal at Top Right)
      const plat = state.trainPlatform;
      const doneW2 = state.itemsWorld2.filter(it => it.collected).length;
      ctx.save();
      ctx.translate(plat.x, plat.y);
      ctx.fillStyle = doneW2 === 3 ? 'rgba(16, 185, 129, 0.25)' : 'rgba(30, 41, 59, 0.65)';
      ctx.strokeStyle = doneW2 === 3 ? '#34d399' : '#facc15';
      ctx.lineWidth = doneW2 === 3 ? 3 : 2;
      ctx.beginPath();
      ctx.roundRect(-plat.w / 2, -plat.h / 2, plat.w, plat.h, 12);
      ctx.fill();
      ctx.stroke();

      ctx.font = '26px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🚉', 0, -8);
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText('ANDÉN TREN 02:30 PM', 0, 16);
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText(doneW2 === 3 ? '¡Listo para abordar!' : `(Reúne ${doneW2}/3 recuerdos)`, 0, 32);
      ctx.restore();

      // Draw Romantic Collectibles along the path
      const pulse = Math.sin(Date.now() * 0.006) * 4;
      for (const item of state.itemsWorld2) {
        if (item.collected) continue;
        ctx.save();
        ctx.translate(item.x, item.y);
        ctx.beginPath();
        ctx.arc(0, 0, item.r + pulse, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(250, 204, 21, 0.14)';
        ctx.fill();
        ctx.strokeStyle = item.color;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, item.r - 5, 0, Math.PI * 2);
        ctx.fillStyle = '#0f172a';
        ctx.fill();

        ctx.font = '21px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.icon, 0, 0);

        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.fillStyle = '#f8fafc';
        ctx.fillText(item.title, 0, item.r + 13);
        ctx.font = '10px Inter, sans-serif';
        ctx.fillStyle = '#fda4af';
        ctx.fillText(item.subtitle, 0, item.r + 25);
        ctx.restore();
      }

      // Draw Moving Obstacles in World 2
      for (const obs of state.obstaclesWorld2) {
        ctx.save();
        ctx.translate(obs.x, obs.y);
        ctx.beginPath();
        ctx.arc(0, 0, obs.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
        ctx.fill();
        ctx.strokeStyle = obs.color;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.font = '18px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(obs.icon, 0, 0);

        ctx.font = '10px Inter, sans-serif';
        ctx.fillStyle = '#fca5a5';
        ctx.fillText('Obstáculo (-20m)', 0, obs.r + 11);
        ctx.restore();
      }

      // Draw romantic golden connection line ("holding hands") when close
      const handDist = Math.hypot(state.duke.x - state.princess.x, state.duke.y - state.princess.y);
      if (handDist < 75) {
        ctx.save();
        ctx.strokeStyle = state.sprintBoostTimer > 0 ? '#34d399' : 'rgba(244, 114, 182, 0.65)';
        ctx.lineWidth = state.sprintBoostTimer > 0 ? 3 : 2;
        ctx.beginPath();
        ctx.moveTo(state.duke.x, state.duke.y + 4);
        ctx.lineTo(state.princess.x, state.princess.y + 4);
        ctx.stroke();
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('💞', (state.duke.x + state.princess.x) / 2, (state.duke.y + state.princess.y) / 2 - 4);
        ctx.restore();
      }
    }

    function drawWorld3Scene() {
      // Romantic Sunset over the Pacific Ocean in Miraflores, Lima (La Rosa Náutica Pier & Overwater Dining Room)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, LOGICAL_H);
      skyGrad.addColorStop(0, '#1e1b4b');    // Twilight zenith
      skyGrad.addColorStop(0.22, '#7c2d12'); // Deep crimson-amber horizon
      skyGrad.addColorStop(0.38, '#f59e0b'); // Golden Miraflores sunset glow
      skyGrad.addColorStop(0.42, '#0c4a6e'); // Pacific ocean horizon line
      skyGrad.addColorStop(1, '#082f49');    // Deep Pacific water around the pier
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, LOGICAL_W, LOGICAL_H);

      // Glowing Setting Sun on the Pacific Horizon
      ctx.save();
      const sunGrad = ctx.createRadialGradient(400, 165, 10, 400, 165, 85);
      sunGrad.addColorStop(0, 'rgba(254, 240, 138, 0.95)');
      sunGrad.addColorStop(0.45, 'rgba(251, 146, 60, 0.55)');
      sunGrad.addColorStop(1, 'rgba(251, 146, 60, 0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(400, 165, 85, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Animated Shimmering Ocean Waves below the sunset
      const waveTime = Date.now() * 0.002;
      ctx.strokeStyle = 'rgba(253, 224, 71, 0.22)';
      ctx.lineWidth = 2;
      for (let wy = 195; wy < LOGICAL_H; wy += 28) {
        ctx.beginPath();
        for (let wx = 20; wx < LOGICAL_W - 20; wx += 40) {
          const offset = Math.sin(waveTime + wx * 0.03 + wy * 0.05) * 4;
          if (wx === 20) ctx.moveTo(wx, wy + offset);
          else ctx.lineTo(wx, wy + offset);
        }
        ctx.stroke();
      }

      // Wooden Espigón Pier Bridge & Overwater Victorian Gazebo ("La Rosa Náutica")
      ctx.save();
      ctx.fillStyle = 'rgba(69, 26, 3, 0.88)';
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 3;
      // Pier walkway from left to right over the sea
      ctx.beginPath();
      ctx.roundRect(45, 215, 515, 185, 14);
      ctx.fill();
      ctx.stroke();

      // Main Overwater Restaurant Deck on the right
      ctx.beginPath();
      ctx.roundRect(535, 120, 235, 345, 18);
      ctx.fill();
      ctx.stroke();

      // Wooden planks texture on the pier
      ctx.strokeStyle = 'rgba(180, 83, 9, 0.35)';
      ctx.lineWidth = 1.5;
      for (let px = 65; px < 540; px += 22) {
        ctx.beginPath();
        ctx.moveTo(px, 218);
        ctx.lineTo(px, 397);
        ctx.stroke();
      }

      // Victorian warm golden lamps along the pier railings
      for (let lx = 90; lx <= 510; lx += 105) {
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(lx, 215, 6, 0, Math.PI * 2);
        ctx.arc(lx, 400, 6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Top Header Banner for Miraflores Sunset
      ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.roundRect(185, 14, 430, 56, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 13px Cinzel, serif';
      ctx.textAlign = 'center';
      ctx.fillText('MUNDO 3: LA ROSA NÁUTICA • MIRAFLORES, LIMA', 400, 35);
      ctx.fillStyle = '#fed7aa';
      ctx.font = '11px Inter, sans-serif';
      ctx.fillText('Duque (Terno Negro) & Princesa (Ropa Cómoda) • ¿Qué postre eligieron?', 400, 54);

      // Draw Oceanfront Romantic Table (Goal on the Right Overwater Deck)
      const tbl = state.seaTableWorld3;
      const doneW3 = state.itemsWorld3.filter(it => it.collected).length;
      ctx.save();
      ctx.translate(tbl.x, tbl.y);
      ctx.fillStyle = doneW3 === 2 ? 'rgba(16, 185, 129, 0.28)' : 'rgba(30, 41, 59, 0.78)';
      ctx.strokeStyle = doneW3 === 2 ? '#34d399' : '#facc15';
      ctx.lineWidth = doneW3 === 2 ? 3 : 2;
      ctx.beginPath();
      ctx.roundRect(-tbl.w / 2, -tbl.h / 2, tbl.w, tbl.h, 14);
      ctx.fill();
      ctx.stroke();

      ctx.font = '26px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(state.star3Earned ? '🍨' : '🍽️', 0, -10);
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText('MESA FRENTE AL MAR', 0, 15);
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText(doneW3 === 2 ? '¡Elegir el Postre!' : `(Reúne ${doneW3}/2 recuerdos)`, 0, 31);
      ctx.restore();

      // Draw World 3 Collectibles
      const pulse = Math.sin(Date.now() * 0.006) * 4;
      for (const item of state.itemsWorld3) {
        if (item.collected) continue;
        ctx.save();
        ctx.translate(item.x, item.y);
        ctx.beginPath();
        ctx.arc(0, 0, item.r + pulse, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(250, 204, 21, 0.16)';
        ctx.fill();
        ctx.strokeStyle = item.color;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, item.r - 5, 0, Math.PI * 2);
        ctx.fillStyle = '#0f172a';
        ctx.fill();

        ctx.font = '21px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.icon, 0, 0);

        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.fillStyle = '#f8fafc';
        ctx.fillText(item.title, 0, item.r + 13);
        ctx.restore();
      }

      if (state.exitPortalWorld4.active) {
        const p4 = state.exitPortalWorld4;
        ctx.save();
        ctx.translate(p4.x, p4.y);
        ctx.beginPath();
        ctx.arc(0, 0, p4.r + pulse, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(168, 85, 247, 0.28)';
        ctx.fill();
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.font = '24px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🃏', 0, 0);
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.fillStyle = '#e9d5ff';
        ctx.fillText('PORTAL AL MUNDO 4', 0, p4.r + 14);
        ctx.restore();
      }

      // Draw World 3 Obstacles (Ocean wave spray, Miraflores seagulls, bustling waiters)
      for (const obs of state.obstaclesWorld3) {
        ctx.save();
        ctx.translate(obs.x, obs.y);
        ctx.beginPath();
        ctx.arc(0, 0, obs.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
        ctx.fill();
        ctx.strokeStyle = obs.color;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.font = '18px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(obs.icon, 0, 0);

        ctx.font = '10px Inter, sans-serif';
        ctx.fillStyle = '#fed7aa';
        ctx.fillText('Obstáculo', 0, obs.r + 11);
        ctx.restore();
      }
    }

    function drawWorld4Scene() {
      // Grand Chamber of the 21 Cards: Velvet royal carpet, Great Sealed Door at top, Guardian at the Table of 21 Cards
      const bgGrad = ctx.createLinearGradient(0, 0, 0, LOGICAL_H);
      bgGrad.addColorStop(0, '#090714');
      bgGrad.addColorStop(0.45, '#1e1136');
      bgGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, LOGICAL_W, LOGICAL_H);

      // Royal velvet carpet leading from entrance up to the Guardian's Table and the Great Door
      ctx.save();
      ctx.fillStyle = 'rgba(131, 24, 67, 0.38)';
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.45)';
      ctx.lineWidth = 3;
      ctx.fillRect(310, 90, 180, LOGICAL_H - 90);
      ctx.strokeRect(310, 90, 180, LOGICAL_H - 90);
      ctx.restore();

      // Mystical Torch Pillars along the chamber walls
      for (let py = 150; py <= 410; py += 130) {
        [140, 660].forEach(px => {
          ctx.save();
          ctx.translate(px, py);
          const glow = ctx.createRadialGradient(0, 0, 4, 0, 0, 45);
          glow.addColorStop(0, 'rgba(192, 132, 252, 0.45)');
          glow.addColorStop(1, 'rgba(192, 132, 252, 0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(0, 0, 45, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#1e293b';
          ctx.strokeStyle = '#a855f7';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, 0, 14, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.font = '14px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('🕯️', 0, 0);
          ctx.restore();
        });
      }

      // THE GREAT DOOR TO WORLD 5 (Top Center) with 21 Illuminating Seals
      const door = state.greatDoorWorld4;
      ctx.save();
      ctx.translate(door.x, door.y);
      ctx.fillStyle = state.star4Earned ? 'rgba(16, 185, 129, 0.28)' : 'rgba(15, 23, 42, 0.95)';
      ctx.strokeStyle = state.star4Earned ? '#34d399' : '#facc15';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(-door.w / 2, -door.h / 2, door.w, door.h, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = state.star4Earned ? '#6ee7b7' : '#fde047';
      ctx.font = 'bold 12px Cinzel, serif';
      ctx.textAlign = 'center';
      ctx.fillText(state.star4Earned ? '🔓 GRAN PUERTA ABIERTA (MUNDO 5)' : '🔒 GRAN PUERTA AL MUNDO 5', 0, -8);

      // Draw 21 mini seal lights on the door frame showing exact progress
      for (let i = 0; i < 21; i++) {
        const sx = -80 + i * 8;
        const unlocked = i < state.currentCardIndex;
        ctx.fillStyle = unlocked ? '#facc15' : '#334155';
        ctx.beginPath();
        ctx.arc(sx, 14, 2.6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // THE MYSTERIOUS GUARDIAN & THE TABLE OF 21 CARDS (Center)
      const gTbl = state.guardianTableWorld4;
      ctx.save();
      ctx.translate(gTbl.x, gTbl.y);

      // Guardian Figure seated behind the table
      ctx.fillStyle = '#3b0764';
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, -48, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.font = '22px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('👁️', 0, -42);

      // Guardian's Ornate Table
      ctx.fillStyle = 'rgba(46, 16, 101, 0.92)';
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(-gTbl.w / 2, -gTbl.h / 2, gTbl.w, gTbl.h, 12);
      ctx.fill();
      ctx.stroke();

      // Fan of 21 Glowing Golden Cards on the Table
      for (let c = -3; c <= 3; c++) {
        ctx.save();
        ctx.translate(c * 16, -6 + Math.abs(c) * 1.5);
        ctx.rotate(c * 0.08);
        ctx.fillStyle = '#fef08a';
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 1;
        ctx.fillRect(-6, -9, 12, 18);
        ctx.strokeRect(-6, -9, 12, 18);
        ctx.restore();
      }

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`MESA DE LAS 21 CARTAS (${state.currentCardIndex}/21)`, 0, 22);
      ctx.fillStyle = '#e9d5ff';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText('Presiona [Espacio] con la Princesa', 0, 36);
      ctx.restore();

      // Top Header Banner for World 4
      ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.roundRect(145, 10, 510, 48, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#e9d5ff';
      ctx.font = 'bold 13px Cinzel, serif';
      ctx.textAlign = 'center';
      ctx.fillText('MUNDO 4: "NUESTRA HISTORIA EN UNA CARTA" • LIMA, PERÚ', 400, 30);
      ctx.fillStyle = '#fde047';
      ctx.font = '11px JetBrains Mono, monospace';
      ctx.fillText(`⏳ Reloj Continuo Activo • Error = -30:00 min • Cartas: ${state.currentCardIndex}/21`, 400, 47);
    }

    function drawWorld5Scene() {
      // "La Casa de los Faroles": Warm Japanese wood interior, glowing red & gold Chōchin paper lanterns, Noren curtains, Chef at the Ramen Bar & 4 lively ambient tables!
      const bgGrad = ctx.createLinearGradient(0, 0, 0, LOGICAL_H);
      bgGrad.addColorStop(0, '#14080a');
      bgGrad.addColorStop(0.35, '#261014');
      bgGrad.addColorStop(1, '#18121e');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, LOGICAL_W, LOGICAL_H);

      // Warm wooden floor planks
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.08)';
      ctx.lineWidth = 1.5;
      for (let y = 95; y < LOGICAL_H; y += 34) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(LOGICAL_W, y);
        ctx.stroke();
      }

      // Traditional Japanese Noren Curtain & Open Ramen Kitchen Bar at Top
      ctx.fillStyle = '#0f0708';
      ctx.fillRect(0, 0, LOGICAL_W, 92);
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, 92);
      ctx.lineTo(LOGICAL_W, 92);
      ctx.stroke();

      // Crimson Noren flaps along the top bar
      for (let nx = 35; nx < LOGICAL_W - 40; nx += 75) {
        ctx.fillStyle = '#991b1b';
        ctx.strokeStyle = '#fca5a5';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(nx, 62, 62, 34, 4);
        ctx.fill();
        ctx.stroke();
      }

      // Open Ramen Kitchen Counter with Itamae Chef & Steaming Pots
      ctx.save();
      ctx.fillStyle = 'rgba(69, 26, 3, 0.9)';
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(450, 96, 310, 42, 8);
      ctx.fill();
      ctx.stroke();
      ctx.font = '18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('👨‍🍳', 505, 122);
      ctx.fillText('🍲', 555, 122);
      ctx.fillText('🍣', 610, 122);
      ctx.fillText('🍶', 665, 122);
      ctx.fillStyle = '#fde68a';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText('Barra Japonesa • "¡Irasshaimase!"', 605, 134);
      ctx.restore();

      // 4 AMBIENT DINING TABLES WITH DINERS & STEAMING BOWLS (So the restaurant feels warm and alive)
      const ambientTables = [
        { x: 165, y: 195, icons: ['🍜', '🥢'], guests: ['#64748b', '#94a3b8'], chat: '«¡Qué rico caldo!»' },
        { x: 365, y: 175, icons: ['🍣', '🍵'], guests: ['#475569', '#64748b'], chat: '«Los makis están buenísimos»' },
        { x: 375, y: 390, icons: ['🍜', '🍹'], guests: ['#7c3aed', '#db2777'], chat: '«¡Salud por esta noche!»' },
        { x: 695, y: 395, icons: ['🍱', '🍶'], guests: ['#0284c7', '#0d9488'], chat: '«¡Arigato Gozaimasu!»' }
      ];

      const steamOffset = Math.sin(Date.now() * 0.004) * 3;
      ambientTables.forEach(tbl => {
        ctx.save();
        ctx.translate(tbl.x, tbl.y);

        [-46, 46].forEach((gx, gIdx) => {
          ctx.fillStyle = tbl.guests[gIdx];
          ctx.beginPath();
          ctx.roundRect(gx - 9, -4, 18, 18, 5);
          ctx.fill();
          ctx.fillStyle = '#fde68a';
          ctx.beginPath();
          ctx.arc(gx, -10, 8, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.fillStyle = 'rgba(69, 26, 3, 0.85)';
        ctx.strokeStyle = 'rgba(217, 119, 6, 0.65)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-36, -24, 72, 48, 10);
        ctx.fill();
        ctx.stroke();

        ctx.font = '15px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(tbl.icons[0], -14, 4 + steamOffset * 0.4);
        ctx.fillText(tbl.icons[1], 14, 4 - steamOffset * 0.4);

        ctx.fillStyle = 'rgba(254, 215, 170, 0.65)';
        ctx.font = 'italic 9px Inter, sans-serif';
        ctx.fillText(tbl.chat, 0, 35);
        ctx.restore();
      });

      // Glowing Hanging Chōchin Lanterns ("La Casa de los Faroles")
      const sway = Math.sin(Date.now() * 0.003) * 3;
      const lanternPositions = [
        { x: 110, y: 120 }, { x: 265, y: 118 }, { x: 420, y: 120 },
        { x: 120, y: 445 }, { x: 530, y: 445 }
      ];
      lanternPositions.forEach((lp, idx) => {
        ctx.save();
        ctx.translate(lp.x + (idx % 2 === 0 ? sway : -sway), lp.y);
        const lGlow = ctx.createRadialGradient(0, 0, 4, 0, 0, 52);
        lGlow.addColorStop(0, 'rgba(251, 146, 60, 0.55)');
        lGlow.addColorStop(0.5, 'rgba(239, 68, 68, 0.22)');
        lGlow.addColorStop(1, 'rgba(239, 68, 68, 0)');
        ctx.fillStyle = lGlow;
        ctx.beginPath();
        ctx.arc(0, 0, 52, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#dc2626';
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.ellipse(0, 0, 14, 19, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-7, -21, 14, 4);
        ctx.fillRect(-7, 17, 14, 4);
        ctx.restore();
      });

      // Top Header Sign: LA CASA DE LOS FAROLES
      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(160, 12, 480, 50, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 13px Cinzel, serif';
      ctx.textAlign = 'center';
      ctx.fillText('MUNDO 5: LA CASA DE LOS FAROLES • AQUELLA NOCHE', 400, 32);
      ctx.fillStyle = '#fecaca';
      ctx.font = '11px JetBrains Mono, monospace';
      ctx.fillText(`⏳ Reloj Continuo • Error = -02:00 HORAS • Pedido: ${state.w5CurrentMenuStep}/4 Cartas`, 400, 49);

      // Entrance Guardian of La Casa de los Faroles
      const gEnt = state.lanternGuardianW5;
      ctx.save();
      ctx.translate(gEnt.x, gEnt.y);
      ctx.beginPath();
      ctx.arc(0, 0, gEnt.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(127, 29, 29, 0.75)';
      ctx.fill();
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.font = '24px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🏮', 0, 0);
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillStyle = '#fde047';
      ctx.fillText('GUARDIÁN DE LA ENTRADA', 0, gEnt.r + 14);
      ctx.font = '10px Inter, sans-serif';
      ctx.fillStyle = '#fecaca';
      ctx.fillText('Explica el Desafío (-2h/error)', 0, gEnt.r + 26);
      ctx.restore();

      // Main Couple Table at La Casa de los Faroles
      const sTbl = state.lanternTableW5;
      ctx.save();
      ctx.translate(sTbl.x, sTbl.y);
      ctx.fillStyle = state.star5Earned ? 'rgba(16, 185, 129, 0.25)' : 'rgba(69, 10, 10, 0.90)';
      ctx.strokeStyle = state.star5Earned ? '#34d399' : '#facc15';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(-sTbl.w / 2, -sTbl.h / 2, sTbl.w, sTbl.h, 14);
      ctx.fill();
      ctx.stroke();

      if (state.star5Earned) {
        ctx.font = '22px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🍣', -42, -6);
        ctx.fillText('🍜', 0, -6);
        ctx.fillText('🍹', 42, -6);
        ctx.fillStyle = '#6ee7b7';
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.fillText('¡PEDIDO SERVIDO! (SIN POSTRE)', 0, 20);
      } else {
        ctx.font = '24px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🍱', 0, -10);
        ctx.fillStyle = '#fde047';
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.fillText(`NUESTRA MESA (${state.w5CurrentMenuStep}/4)`, 0, 14);
        ctx.fillStyle = '#fecaca';
        ctx.font = '10px Inter, sans-serif';
        ctx.fillText('Las 4 Cartas del Pedido', 0, 30);
      }
      ctx.restore();
    }

    function drawWorld6Scene() {
      // Grand Russian Aristocratic Red Hall: Deep imperial crimson & burgundy velvet, gilded gold filigree borders, marble columns, crystal chandeliers, and the 5 Imperial Wardrobes
      const bgGrad = ctx.createRadialGradient(400, 260, 40, 400, 260, 460);
      bgGrad.addColorStop(0, '#7f1d1d');   // Imperial ruby center
      bgGrad.addColorStop(0.55, '#450a0a'); // Deep aristocratic crimson
      bgGrad.addColorStop(1, '#1c0408');    // Dark velvet corners
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, LOGICAL_W, LOGICAL_H);

      // Ornate Gilded Russian Imperial Carpet & Filigree Frame
      ctx.save();
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.45)';
      ctx.lineWidth = 3;
      ctx.strokeRect(35, 88, LOGICAL_W - 70, LOGICAL_H - 108);
      ctx.strokeStyle = 'rgba(253, 224, 71, 0.22)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(45, 98, LOGICAL_W - 90, LOGICAL_H - 128);

      // Imperial Sunburst Medallion on the center carpet
      ctx.beginPath();
      ctx.arc(400, 275, 68, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(250, 204, 21, 0.07)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.28)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // Top Imperial Velvet Drapes & Crystal Chandeliers Header
      ctx.fillStyle = '#2a0509';
      ctx.fillRect(0, 0, LOGICAL_W, 80);
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, 80);
      ctx.lineTo(LOGICAL_W, 80);
      ctx.stroke();

      // Golden swags / aristocratic curtains along top
      for (let cx = 60; cx < LOGICAL_W; cx += 135) {
        ctx.save();
        ctx.fillStyle = '#991b1b';
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, 78, 42, Math.PI, 0, true);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      // Marble & Gold Columns along the sides of the Russian Hall
      [75, 725].forEach(colX => {
        [155, 315, 435].forEach(colY => {
          ctx.save();
          ctx.translate(colX, colY);
          ctx.fillStyle = '#fef3c7';
          ctx.strokeStyle = '#d97706';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, 0, 14, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        });
      });

      // Top Header Banner for World 6
      ctx.fillStyle = 'rgba(28, 4, 8, 0.94)';
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(130, 12, 540, 52, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 13px Cinzel, serif';
      ctx.textAlign = 'center';
      ctx.fillText('MUNDO 6: GRAN SALÓN ROJO IMPERIAL • LOS 5 ARMARIOS', 400, 32);
      ctx.fillStyle = '#fecdd3';
      ctx.font = '11px JetBrains Mono, monospace';
      ctx.fillText(`👸 Princesa en Solitario • Duque en la Cárcel del Silencio • Armarios: ${state.w6CurrentWardrobeStep}/5`, 400, 50);

      // Draw the 5 Imperial Wardrobes (Vestidos, Zapatos Princesa, Pulseras/Relojes, Ternos Duque, Zapatos Duque)
      const pulse = Math.sin(Date.now() * 0.006) * 4;
      wardrobesWorld6.forEach((w, idx) => {
        const isNext = idx === state.w6CurrentWardrobeStep && !state.star6Earned;
        ctx.save();
        ctx.translate(w.x, w.y);

        // Golden aura on the current target wardrobe
        if (isNext) {
          ctx.beginPath();
          ctx.arc(0, 0, w.r + 12 + pulse, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(250, 204, 21, 0.22)';
          ctx.fill();
        }

        // Ornate Russian Imperial Wardrobe Cabinet
        ctx.fillStyle = w.completed ? 'rgba(6, 78, 59, 0.9)' : 'rgba(69, 10, 10, 0.95)';
        ctx.strokeStyle = w.completed ? '#34d399' : (isNext ? '#facc15' : '#fda4af');
        ctx.lineWidth = isNext ? 3 : 2;
        ctx.beginPath();
        ctx.roundRect(-34, -36, 68, 72, 10);
        ctx.fill();
        ctx.stroke();

        // Double wardrobe door line
        ctx.strokeStyle = 'rgba(250, 204, 21, 0.4)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(0, -32);
        ctx.lineTo(0, 32);
        ctx.stroke();

        ctx.font = '24px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(w.completed ? '✅' : w.icon, 0, -4);

        ctx.font = 'bold 10px Inter, sans-serif';
        ctx.fillStyle = w.completed ? '#6ee7b7' : '#fde047';
        ctx.fillText(w.shortTitle, 0, 24);

        ctx.font = '9px Inter, sans-serif';
        ctx.fillStyle = '#fecdd3';
        ctx.fillText(w.completed ? 'Completado' : (isNext ? '¡Abrir ahora!' : `Armario ${w.num}`), 0, 48);
        ctx.restore();
      });

      // Draw Portal to World 7 (La Cárcel del Silencio) when all 5 Wardrobes are completed
      if (state.exitPortalWorld7.active) {
        const p7 = state.exitPortalWorld7;
        ctx.save();
        ctx.translate(p7.x, p7.y);
        ctx.beginPath();
        ctx.arc(0, 0, p7.r + pulse, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.font = '24px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⛓️', 0, 0);
        ctx.font = 'bold 11px Cinzel, serif';
        ctx.fillStyle = '#fde047';
        ctx.fillText('PORTAL AL MUNDO 7: LA CÁRCEL DEL SILENCIO', 0, p7.r + 15);
        ctx.restore();
      }
    }

    function drawWorld7Scene() {
      // 1. Romantic Caribbean Sunset Sky
      const skyGrad = ctx.createLinearGradient(0, 0, 0, 210);
      skyGrad.addColorStop(0, '#3b0764');
      skyGrad.addColorStop(0.45, '#be185d');
      skyGrad.addColorStop(0.85, '#f97316');
      skyGrad.addColorStop(1, '#fde047');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, LOGICAL_W, 210);

      const sunPulse = Math.sin(Date.now() * 0.002) * 3;
      const sunGrad = ctx.createRadialGradient(400, 155, 8, 400, 155, 78 + sunPulse);
      sunGrad.addColorStop(0, 'rgba(254, 249, 195, 1)');
      sunGrad.addColorStop(0.4, 'rgba(253, 224, 71, 0.75)');
      sunGrad.addColorStop(1, 'rgba(251, 146, 60, 0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(400, 155, 78 + sunPulse, 0, Math.PI * 2);
      ctx.fill();

      // 2. Caribbean Ocean
      const seaGrad = ctx.createLinearGradient(0, 165, 0, LOGICAL_H);
      seaGrad.addColorStop(0, '#0c4a6e');
      seaGrad.addColorStop(0.5, '#075985');
      seaGrad.addColorStop(1, '#082f49');
      ctx.fillStyle = seaGrad;
      ctx.fillRect(0, 165, LOGICAL_W, LOGICAL_H - 165);

      const waveT = Date.now() * 0.0025;
      ctx.strokeStyle = 'rgba(253, 224, 71, 0.32)';
      ctx.lineWidth = 2;
      for (let row = 0; row < 7; row++) {
        const wy = 185 + row * 40;
        const offset = Math.sin(waveT + row) * 14;
        ctx.beginPath();
        ctx.moveTo(310 + offset, wy);
        ctx.lineTo(490 + offset, wy);
        ctx.stroke();
      }

      // 3. The Largest Mega-Yacht in the Caribbean (All Decorated in White!)
      ctx.save();
      ctx.fillStyle = '#f8fafc';
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(155, 455);
      ctx.lineTo(645, 455);
      ctx.lineTo(690, 260);
      ctx.lineTo(400, 105);
      ctx.lineTo(110, 260);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(185, 438);
      ctx.lineTo(615, 438);
      ctx.lineTo(652, 268);
      ctx.lineTo(400, 125);
      ctx.lineTo(148, 268);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Upper Elevated White Deck
      ctx.fillStyle = '#f1f5f9';
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(245, 118, 310, 110, 24);
      ctx.fill();
      ctx.stroke();

      const flowerSpots = [
        [265, 138], [315, 126], [400, 122], [485, 126], [535, 138],
        [220, 310], [580, 310], [200, 390], [600, 390]
      ];
      flowerSpots.forEach(([fx, fy]) => {
        ctx.font = '18px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🤍', fx, fy);
      });

      ctx.fillStyle = '#e2e8f0';
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      for (let step = 0; step < 4; step++) {
        ctx.fillRect(355, 228 + step * 14, 90, 11);
        ctx.strokeRect(355, 228 + step * 14, 90, 11);
      }

      ctx.fillStyle = 'rgba(253, 224, 71, 0.14)';
      ctx.fillRect(365, 285, 70, 145);
      ctx.restore();

      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.roundRect(185, 12, 430, 44, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 13px Cinzel, serif';
      ctx.textAlign = 'center';
      ctx.fillText('MUNDO 7: LA CONFESIÓN • MEGAYATE EN EL CARIBE', 400, 31);
      ctx.fillStyle = '#f8fafc';
      ctx.font = '11px Inter, sans-serif';
      ctx.fillText('Trajes de Gala Color Vino & Negro (Elegidos en el Nivel 6)', 400, 47);
    }

    function drawGame() {
      ctx.clearRect(0, 0, LOGICAL_W, LOGICAL_H);

      if (state.currentWorld === 1) {
        drawWorld1Scene();
      } else if (state.currentWorld === 2) {
        drawWorld2Scene();
      } else if (state.currentWorld === 3) {
        drawWorld3Scene();
      } else if (state.currentWorld === 4) {
        drawWorld4Scene();
      } else if (state.currentWorld === 5) {
        drawWorld5Scene();
      } else if (state.currentWorld === 6) {
        drawWorld6Scene();
      } else {
        drawWorld7Scene();
      }

      if (state.targetPoint) {
        ctx.save();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(state.targetPoint.x, state.targetPoint.y, 10, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      const chars = (state.currentWorld === 6
        ? [{ obj: state.princess, isDuke: false, isCtrl: true }]
        : [
            { obj: state.duke, isDuke: true, isCtrl: state.activeChar === 'duke' },
            { obj: state.princess, isDuke: false, isCtrl: state.activeChar === 'princess' }
          ]
      ).sort((a, b) => a.obj.y - b.obj.y);

      chars.forEach(c => drawCharacter(c.obj, c.isDuke, c.isCtrl));

      // Ambient particles
      ctx.fillStyle = state.currentWorld === 2 ? 'rgba(253, 186, 116, 0.5)' : 'rgba(248, 250, 252, 0.55)';
      for (const p of state.particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Floating feedback texts
      for (const ft of state.floatingTexts) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, ft.alpha);
        ctx.font = 'bold 13px Inter, sans-serif';
        ctx.fillStyle = ft.color;
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      }
    }

    function gameLoop() {
      try {
        updateGame();
      } catch (error) {
        console.error('[7 Estrellas] Error en updateGame:', error);
      }
      try {
        drawGame();
      } catch (error) {
        console.error('[7 Estrellas] Error en drawGame:', error);
      }
      requestAnimationFrame(gameLoop);
    }

    // =========================================================
    // EVENT LISTENERS & CONTROLS
    // =========================================================
    window.addEventListener('keydown', e => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        if (document.activeElement.tagName !== 'INPUT') {
          e.preventDefault();
        }
      }
      if (document.activeElement.tagName === 'INPUT') return;

      state.keys[e.code] = true;

      // If the World 4 Cards Modal is open, block background movement/Space/Tab triggers and only allow card hotkeys 1-4 or A-D
      const w6WardrobeOpen = !document.getElementById('modal-world6-wardrobe').classList.contains('hidden');
      if (w6WardrobeOpen) {
        state.keys = {};
        if (!w6WardrobeLocked) {
          const keyMap6 = { Digit1: 0, Digit2: 1, Digit3: 2, Digit4: 3, KeyA: 0, KeyB: 1, KeyC: 2, KeyD: 3 };
          if (e.code in keyMap6) {
            const idx = keyMap6[e.code];
            const btns = document.querySelectorAll('#w6-options-grid button');
            if (btns[idx]) btns[idx].click();
          }
        }
        return;
      }

      const w5MenuOpen = !document.getElementById('modal-world5-menu').classList.contains('hidden');
      if (w5MenuOpen) {
        state.keys = {};
        const keyMap5 = { Digit1: 0, Digit2: 1, Digit3: 2, Digit4: 3, Digit5: 4, Digit6: 5 };
        if (e.code in keyMap5) {
          const idx = keyMap5[e.code];
          const btns = document.querySelectorAll('#w5-options-grid button');
          if (btns[idx]) btns[idx].click();
        }
        return;
      }

      const cardsModalOpen = !document.getElementById('modal-world4-cards').classList.contains('hidden');
      if (cardsModalOpen) {
        state.keys = {};
        if (!cardFlipLocked) {
          const keyMap = { Digit1: 0, Digit2: 1, Digit3: 2, Digit4: 3, KeyA: 0, KeyB: 1, KeyC: 2, KeyD: 3 };
          if (e.code in keyMap) {
            const idx = keyMap[e.code];
            const btns = document.querySelectorAll('#card-options-container button');
            if (btns[idx]) btns[idx].click();
          }
        }
        return;
      }

      if (e.code === 'Space' || e.code === 'KeyE' || e.code === 'Enter') {
        const prologueOpen = !document.getElementById('modal-prologue').classList.contains('hidden');
        if (prologueOpen) {
          const script = getActivePrologueScript();
          const nextStep = script[state.prologueStep]?.choices[0]?.next ?? -1;
          renderPrologueStep(nextStep);
        } else {
          triggerInteraction();
        }
      }
      if (e.code === 'Tab') {
        e.preventDefault();
        toggleActiveCharacter();
      }
    });

    window.addEventListener('keyup', e => {
      state.keys[e.code] = false;
    });

    canvas.addEventListener('pointerdown', e => {
      initAudio();
      const rect = canvas.getBoundingClientRect();
      const scaleX = LOGICAL_W / rect.width;
      const scaleY = LOGICAL_H / rect.height;
      const cx = (e.clientX - rect.left) * scaleX;
      const cy = (e.clientY - rect.top) * scaleY;

      state.targetPoint = { x: cx, y: cy };

      // In World 7, clicking directly on the Duke opens "La Confesión"
      if (state.currentWorld === 7) {
        if (Math.hypot(cx - state.duke.x, cy - state.duke.y) < 42) {
          openWorld7ConfessionModal(0);
          return;
        }
      }

      // In World 6, clicking on the Portal to World 7 enters World 7, or clicking a Wardrobe opens it
      if (state.currentWorld === 6) {
        if (state.exitPortalWorld7.active && Math.hypot(cx - state.exitPortalWorld7.x, cy - state.exitPortalWorld7.y) < state.exitPortalWorld7.r + 24) {
          enterWorld7Directly();
          return;
        }
        if (!state.star6Earned) {
          for (let i = 0; i < wardrobesWorld6.length; i++) {
            const w = wardrobesWorld6[i];
            if (!w.completed && Math.hypot(cx - w.x, cy - w.y) < w.r + 24) {
              openWorld6WardrobeModal(i);
              return;
            }
          }
        }
      }

      // In World 5, clicking directly on the couple's table opens the 4 Menu Cards immediately
      if (state.currentWorld === 5 && !state.star5Earned) {
        const sTbl = state.lanternTableW5;
        if (Math.abs(cx - sTbl.x) < sTbl.w / 2 + 25 && Math.abs(cy - sTbl.y) < sTbl.h / 2 + 35) {
          openWorld5MenuModal();
          return;
        }
      }
      if (state.currentWorld === 4 && !state.star4Earned) {
        const gTbl = state.guardianTableWorld4;
        if (Math.abs(cx - gTbl.x) < gTbl.w / 2 + 25 && Math.abs(cy - gTbl.y) < gTbl.h / 2 + 35) {
          openWorld4CardsModal();
          return;
        }
      }

      const nearby = findNearbyInteractable();
      if (nearby) {
        const player = getControlledChar();
        if (Math.hypot(player.x - cx, player.y - cy) < 65) {
          triggerInteraction();
        }
      }
    });

    document.querySelectorAll('.dpad-btn').forEach(btn => {
      const dir = btn.getAttribute('data-dir');
      const startMove = e => {
        e.preventDefault();
        initAudio();
        state.keys[dir] = true;
      };
      const endMove = e => {
        e.preventDefault();
        state.keys[dir] = false;
      };
      btn.addEventListener('pointerdown', startMove);
      btn.addEventListener('pointerup', endMove);
      btn.addEventListener('pointerleave', endMove);
    });

    document.getElementById('btn-action-interact').addEventListener('click', () => {
      initAudio();
      triggerInteraction();
    });

    document.getElementById('btn-talk-partner').addEventListener('click', () => {
      initAudio();
      triggerCoupleBanter();
    });

    document.getElementById('btn-sprint-boost').addEventListener('click', () => {
      activateRomanticSprint();
    });

    document.getElementById('btn-select-world1').addEventListener('click', () => {
      initAudio();
      switchTab('game');
      loadWorld(1, true);
    });

    document.getElementById('btn-select-world2').addEventListener('click', () => {
      initAudio();
      switchTab('game');
      loadWorld(2, true);
    });

    document.getElementById('btn-select-world3').addEventListener('click', () => {
      initAudio();
      switchTab('game');
      loadWorld(3, true);
    });

    document.getElementById('btn-select-world4').addEventListener('click', () => {
      initAudio();
      switchTab('game');
      loadWorld(4, true);
    });

    document.getElementById('btn-enter-world4-from-w3').addEventListener('click', () => {
      initAudio();
      document.getElementById('modal-world3-victory').classList.add('hidden');
      switchTab('game');
      loadWorld(4, true);
    });

    document.getElementById('btn-close-cards-modal').addEventListener('click', () => {
      document.getElementById('modal-world4-cards').classList.add('hidden');
    });

    document.getElementById('btn-close-world4-victory').addEventListener('click', () => {
      document.getElementById('modal-world4-victory').classList.add('hidden');
    });

    document.getElementById('btn-goto-map-from-w4').addEventListener('click', () => {
      enterWorld5Directly();
    });

    document.getElementById('btn-select-world5').addEventListener('click', () => {
      initAudio();
      switchTab('game');
      loadWorld(5, true);
    });

    document.getElementById('btn-select-world6').addEventListener('click', () => {
      initAudio();
      switchTab('game');
      loadWorld(6, true);
    });

    document.getElementById('btn-close-w6-wardrobe').addEventListener('click', () => {
      document.getElementById('modal-world6-wardrobe').classList.add('hidden');
      w6AutoOpenedIndex = -1;
      state.princess.y = Math.min(LOGICAL_H - 40, state.princess.y + 32);
    });

    document.getElementById('btn-close-world6-victory').addEventListener('click', () => {
      document.getElementById('modal-world6-victory').classList.add('hidden');
    });

    document.getElementById('btn-goto-map-from-w6').addEventListener('click', () => {
      enterWorld7Directly();
    });

    document.getElementById('btn-select-world7').addEventListener('click', () => {
      initAudio();
      switchTab('game');
      loadWorld(7, true);
    });

    document.getElementById('btn-w7-replay-video').addEventListener('click', () => {
      const vid = document.getElementById('w7-ending-yes-video');
      if (vid) {
        vid.currentTime = 0;
        vid.play().catch(() => {});
      }
    });

    document.getElementById('btn-w7-restart-yes').addEventListener('click', restartEntireGameFromZero);
    document.getElementById('btn-w7-restart-no').addEventListener('click', restartEntireGameFromZero);

    // El final positivo también permanece en pantalla al terminar el vídeo.
    // No se reinicia el juego automáticamente.

    document.getElementById('btn-close-w5-menu').addEventListener('click', () => {
      document.getElementById('modal-world5-menu').classList.add('hidden');
    });

    document.getElementById('btn-skill-recuerdo').addEventListener('click', () => {
      activateWorld5Skill('recuerdo');
    });

    document.getElementById('btn-skill-inventiva').addEventListener('click', () => {
      activateWorld5Skill('inventiva');
    });

    document.getElementById('btn-next-w5-conv').addEventListener('click', () => {
      if (state.w5ConvIndex < tableConversationWorld5.length - 1) {
        state.w5ConvIndex++;
        renderWorld5ConversationStep();
      }
    });

    document.getElementById('btn-close-world5-victory').addEventListener('click', () => {
      document.getElementById('modal-world5-victory').classList.add('hidden');
    });

    document.getElementById('btn-goto-map-from-w5').addEventListener('click', () => {
      enterWorld6Directly();
    });

    document.getElementById('btn-enter-world3-from-train').addEventListener('click', () => {
      initAudio();
      document.getElementById('modal-train-journey-world3').classList.add('hidden');
      switchTab('game');
      loadWorld(3, true);
    });

    document.getElementById('btn-close-dessert-menu').addEventListener('click', () => {
      document.getElementById('modal-world3-dessert').classList.add('hidden');
    });

    document.querySelectorAll('.dessert-option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        initAudio();
        const choice = btn.getAttribute('data-dessert');
        handleDessertChoice(choice);
      });
    });

    document.getElementById('btn-close-world3-victory').addEventListener('click', () => {
      document.getElementById('modal-world3-victory').classList.add('hidden');
    });

    document.getElementById('btn-goto-map-from-w3').addEventListener('click', () => {
      enterWorld4Directly();
    });

    document.getElementById('btn-replay-prologue').addEventListener('click', () => {
      initAudio();
      openPrologueModal();
    });

    document.getElementById('btn-skip-prologue').addEventListener('click', () => {
      closePrologueModal();
    });

    function toggleActiveCharacter() {
      if (state.currentWorld === 4 && !state.star4Earned) {
        state.activeChar = 'princess';
        sfxGuardianDeepVoice();
        addFloatingText(state.duke.x, state.duke.y - 25, '🤐 El Duque está bajo el sello de silencio', '#c084fc');
        setDialogue(
          'EL GUARDIÁN DE LA PUERTA',
          '👁️',
          'Regla del Mundo 4',
          '«En este salón el Duque no puede hablar ni tomar el mando. Es <b>la Princesa</b> quien debe avanzar y responder las 21 cartas.»'
        );
        return;
      }
      state.activeChar = state.activeChar === 'duke' ? 'princess' : 'duke';
      const btn = document.getElementById('btn-switch-char');
      btn.textContent = state.activeChar === 'duke'
        ? '👑 Duque (Cambiar a Princesa [Tab])'
        : '👸 Princesa (Cambiar a Duque [Tab])';
      playTone(440, 'triangle', 0.1, 0, 0.08);
    }

    document.getElementById('btn-switch-char').addEventListener('click', toggleActiveCharacter);

    function getWorldBgmMeta() {
      if (state.currentWorld === 7) return { icon: '🛥️', label: 'Música: Atardecer Caribe' };
      if (state.currentWorld === 6) return { icon: '👗', label: 'Música: Vals Imperial Ruso' };
      if (state.currentWorld === 5) return { icon: '🏮', label: 'Música: Koto de los Faroles' };
      if (state.currentWorld === 4) return { icon: '🃏', label: 'Sonido: Presión 21 Cartas' };
      if (state.currentWorld === 3) return { icon: '🌊', label: 'Música: Vals Miraflores' };
      if (state.currentWorld === 2) return { icon: '🚂', label: 'Música: Tren y Reloj' };
      return { icon: '🎄', label: 'Melodía: Noche de Paz' };
    }

    document.getElementById('btn-bgm-toggle').addEventListener('click', () => {
      initAudio();
      bgmEnabled = !bgmEnabled;
      const meta = getWorldBgmMeta();
      document.getElementById('bgm-icon').textContent = bgmEnabled ? meta.icon : '🔕';
      document.getElementById('bgm-label').textContent = bgmEnabled ? meta.label : 'Música: Pausada';
      if (bgmEnabled && !isMuted) {
        startWorldBGM();
      } else {
        stopChristmasBGM();
      }
    });

    document.getElementById('btn-mute').addEventListener('click', () => {
      isMuted = !isMuted;
      document.getElementById('mute-icon').textContent = isMuted ? '🔇' : '🔊';
      document.getElementById('mute-label').textContent = isMuted ? 'Silenciado' : 'Audio';
      if (isMuted) {
        stopChristmasBGM();
      } else if (bgmEnabled) {
        initAudio();
        startWorldBGM();
      }
    });

    document.getElementById('btn-close-flashback').addEventListener('click', () => {
      document.getElementById('modal-flashback').classList.add('hidden');
      document.getElementById('flashback-overlay').classList.add('hidden');
    });

    document.getElementById('btn-flashback-manual').addEventListener('click', () => {
      openFlashbackModal();
    });

    document.getElementById('btn-reset-level').addEventListener('click', resetLevel);

    document.getElementById('btn-close-victory').addEventListener('click', () => {
      document.getElementById('modal-victory').classList.add('hidden');
    });

    document.getElementById('btn-goto-worlds').addEventListener('click', () => {
      startSeamlessTransitionToWorld2();
    });

    document.getElementById('btn-trigger-portal-world2').addEventListener('click', () => {
      enterWorld2Directly();
    });

    document.getElementById('btn-close-transition').addEventListener('click', () => {
      document.getElementById('modal-world-transition').classList.add('hidden');
    });

    document.getElementById('btn-confirm-world2-ready').addEventListener('click', () => {
      enterWorld2Directly();
    });

    document.getElementById('btn-close-world2-victory').addEventListener('click', () => {
      document.getElementById('modal-world2-victory').classList.add('hidden');
    });

    document.getElementById('btn-board-train-world3').addEventListener('click', () => {
      playTrainWhistle();
      document.getElementById('modal-world2-victory').classList.add('hidden');
      document.getElementById('modal-train-journey-world3').classList.remove('hidden');
    });

    document.getElementById('btn-close-train-journey').addEventListener('click', () => {
      document.getElementById('modal-train-journey-world3').classList.add('hidden');
    });

    document.getElementById('btn-view-map-from-train').addEventListener('click', () => {
      enterWorld3Directly();
    });

    document.getElementById('btn-save-anecdote').addEventListener('click', () => {
      const val = document.getElementById('custom-anecdote').value.trim();
      const disp = document.getElementById('saved-anecdote-display');
      if (val) {
        disp.textContent = `✓ Recuerdo guardado en la Estrella 1: "${val}"`;
        disp.classList.remove('hidden');
        try {
          localStorage.setItem('mundo1_anecdota_21dic2025', val);
        } catch (err) {}
      }
    });

    document.getElementById('btn-copy-unity').addEventListener('click', () => {
      const code = document.getElementById('unity-code-block').innerText;
      const btn = document.getElementById('btn-copy-unity');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).catch(() => {});
      } else {
        const ta = document.createElement('textarea');
        ta.value = code;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      btn.textContent = '✓ ¡Código Copiado!';
      setTimeout(() => { btn.textContent = '📋 Copiar Código C#'; }, 2000);
    });

    function switchTab(tabName) {
      state.activeTab = tabName;
      const views = {
        game: document.getElementById('view-game'),
        worlds: document.getElementById('view-worlds'),
        unity: document.getElementById('view-unity')
      };
      const btns = {
        game: document.getElementById('tab-btn-game'),
        worlds: document.getElementById('tab-btn-worlds'),
        unity: document.getElementById('tab-btn-unity')
      };

      Object.keys(views).forEach(k => {
        if (k === tabName) {
          views[k].classList.remove('hidden');
          if (k !== 'game') views[k].classList.add('flex');
          btns[k].className = 'px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 text-slate-950 shadow transition flex items-center gap-1.5';
        } else {
          views[k].classList.add('hidden');
          views[k].classList.remove('flex');
          btns[k].className = 'px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800/80 text-slate-300 hover:bg-slate-800 transition flex items-center gap-1.5';
        }
      });
    }

    document.getElementById('tab-btn-game').addEventListener('click', () => switchTab('game'));
    document.getElementById('tab-btn-worlds').addEventListener('click', () => switchTab('worlds'));
    document.getElementById('tab-btn-unity').addEventListener('click', () => switchTab('unity'));

    // Dual Timers: 24-Hour Global System Clock + 5-Minute (300s) 02:30 PM Train Clock
    setInterval(() => {
      if (state.remainingSeconds > 0) {
        state.remainingSeconds--;
      }
      const hrs = String(Math.floor(state.remainingSeconds / 3600)).padStart(2, '0');
      const mins = String(Math.floor((state.remainingSeconds % 3600) / 60)).padStart(2, '0');
      const secs = String(state.remainingSeconds % 60).padStart(2, '0');
      document.getElementById('hud-timer').textContent = `${hrs}:${mins}:${secs}`;
      const modalCardTimer = document.getElementById('modal-card-live-timer');
      if (modalCardTimer) modalCardTimer.textContent = `${hrs}:${mins}:${secs}`;
      const modalW5Timer = document.getElementById('modal-w5-live-timer');
      if (modalW5Timer) modalW5Timer.textContent = `${hrs}:${mins}:${secs}`;
      const modalW6Timer = document.getElementById('modal-w6-live-timer');
      if (modalW6Timer) modalW6Timer.textContent = `${hrs}:${mins}:${secs}`;
      const prologueLiveTimer = document.getElementById('prologue-live-timer');
      if (prologueLiveTimer) prologueLiveTimer.textContent = `${hrs}:${mins}:${secs}`;

      saveGameSessionForWorld2();
      document.querySelectorAll('.live-global-clock-sync').forEach(el => {
        el.textContent = `${hrs}:${mins}:${secs}`;
      });
      if (state.currentWorld === 2 && !state.star2Earned) {
        if (state.trainRemainingSeconds > 0) {
          state.trainRemainingSeconds--;
        } else {
          // Soft time-loop rewind if the 5 minutes expire so the player never gets stuck
          state.trainRemainingSeconds = 300;
          playTrainWhistle();
          setDialogue(
            'SISTEMA CENTRAL',
            '⏳',
            'Rebobinado Temporal (02:25 PM)',
            '«¡El tren de las 02:30 PM estuvo a punto de partir sin ustedes! El Sistema rebobina el reloj de 5 minutos para que lo intenten tomados de la mano.»'
          );
        }
        const tMins = String(Math.floor(state.trainRemainingSeconds / 60)).padStart(2, '0');
        const tSecs = String(state.trainRemainingSeconds % 60).padStart(2, '0');
        document.getElementById('hud-train-timer').textContent = `${tMins}:${tSecs}`;
      }
    }, 1000);

    window.onload = () => {
      resizeCanvas();
      syncMinimumRemainingTime();
      loadWorld(1, true); // Inicia la aventura unificada en el Mundo 1 conectando en orden continuo: Mundo 1 -> 2 -> 3 -> 4 -> 5 -> 6
      requestAnimationFrame(gameLoop);
    };
    window.addEventListener('resize', resizeCanvas);
  