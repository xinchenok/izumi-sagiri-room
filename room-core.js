"use strict";

const RoomKit = (() => {
  const KEY = "sagiri-room-state-v2";
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const number = (value, fallback) =>
    Number.isFinite(value) ? value : fallback;
  const known = (group, value, fallback) =>
    Object.prototype.hasOwnProperty.call(group, value) ? value : fallback;
  const object = (value) =>
    value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const media = matchMedia("(prefers-reduced-motion: reduce)");
  const smallScreen = () => matchMedia("(max-width: 760px)").matches;
  const lowData = () =>
    Boolean(
      navigator.connection?.saveData ||
      /^(slow-)?2g$/.test(navigator.connection?.effectiveType || ""),
    );
  const imageFile = (outfit, pose, size = smallScreen() ? "720" : "1440") =>
    "assets/v20/character/" + outfit + "/" + pose + "-" + size + ".webp";
  const roomFile = (night, size = smallScreen() ? "720" : "1440") =>
    "assets/v20/room/room-panorama-" +
    (night ? "night" : "day") +
    "-" +
    size +
    ".webp";

  class StateStore {
    constructor() {
      this.available = true;
      let raw = {};
      try {
        raw = object(JSON.parse(localStorage.getItem(KEY)));
        if (!Object.keys(raw).length)
          raw = object(
            JSON.parse(localStorage.getItem("sagiri-room-state-v1")),
          );
      } catch {
        this.available = false;
      }
      const defaults = {
        outfit: "home",
        secrets: [],
        visitCount: 0,
        lastVisitAt: 0,
        previousVisitAt: 0,
        galleryIndex: 0,
        voiceVolume: 0.85,
        voiceMuted: false,
        roomSoundMuted: false,
        sharedDrawing: null,
        drawingDraft: null,
        lastRoomMemory: null,
        lastOutfitMemory: null,
        livingPlace: "desk",
        livingWeather: "clear",
        motionMode: "lively",
        keptFortune: "",
        keptFortuneAt: 0,
        roomScene: "room",
        episodeProgress: {},
        galleryFavorite: null,
        sharedDrawings: [],
        ambientMuted: false,
        ambienceVolume: 0.2,
        lastEvent: null,
        soundChoice: "quiet",
        lighting: "day",
      };
      this.data = { ...defaults, ...raw };
      const d = this.data;
      d.outfit = known(CONTENT.outfits, d.outfit, "home");
      d.secrets = [
        ...new Set(
          Array.isArray(d.secrets)
            ? d.secrets.filter((id) => CONTENT.secrets[id])
            : [],
        ),
      ];
      d.galleryIndex = clamp(
        Math.trunc(number(d.galleryIndex, 0)),
        0,
        CONTENT.gallery.length - 1,
      );
      d.voiceVolume = clamp(number(d.voiceVolume, 0.85), 0, 1);
      d.ambienceVolume = clamp(number(d.ambienceVolume, 0.2), 0, 0.6);
      d.motionMode = d.motionMode === "quiet" ? "quiet" : "lively";
      d.roomScene = known(CONTENT.roomExperience.scenes, d.roomScene, "room");
      d.livingPlace = known(CONTENT.livingRoom.places, d.livingPlace, "desk");
      d.livingWeather = d.livingWeather === "rain" ? "rain" : "clear";
      d.lighting = d.lighting === "night" ? "night" : "day";
      d.episodeProgress = object(d.episodeProgress);
      d.keptFortune = typeof d.keptFortune === "string" ? d.keptFortune : "";
      d.sharedDrawing = this.validDrawing(d.sharedDrawing)
        ? d.sharedDrawing
        : null;
      d.sharedDrawings = Array.isArray(d.sharedDrawings)
        ? d.sharedDrawings.filter((value) => this.validDrawing(value))
        : [];
      if (
        d.sharedDrawing &&
        !d.sharedDrawings.some(
          (value) => value.completedAt === d.sharedDrawing.completedAt,
        )
      )
        d.sharedDrawings.push(d.sharedDrawing);
      for (const drawing of [...d.sharedDrawings, d.sharedDrawing].filter(
        Boolean,
      ))
        drawing.artVersion = drawing.artVersion === "v20" ? "v20" : "v18";
      if (d.drawingDraft) {
        const draft = object(d.drawingDraft);
        draft.choices = object(draft.choices);
        draft.artVersion = draft.artVersion === "v20" ? "v20" : "v18";
        draft.step = clamp(Math.trunc(number(draft.step, 0)), 0, 3);
        draft.quietElapsedMs = clamp(number(draft.quietElapsedMs, 0), 0, 75000);
        draft.peekCount = clamp(Math.trunc(number(draft.peekCount, 0)), 0, 3);
        draft.mode = draft.mode === "quiet" ? "quiet" : "choices";
        d.drawingDraft = draft;
      }
      for (const key of ["voiceMuted", "roomSoundMuted", "ambientMuted"])
        d[key] = d[key] === true;
      const now = Date.now();
      const sameDay =
        new Date(number(d.lastVisitAt, 0)).toDateString() ===
        new Date(now).toDateString();
      if (!d.lastVisitAt || !sameDay || now - d.lastVisitAt >= 14400000) {
        d.previousVisitAt = number(d.lastVisitAt, 0);
        d.lastVisitAt = now;
        d.visitCount = number(d.visitCount, 0) + 1;
      }
      this.save();
    }
    validDrawing(value) {
      return Boolean(
        value &&
        ["presence", "subject", "palette", "praise"].every((key, index) =>
          Object.prototype.hasOwnProperty.call(
            CONTENT.drawingStory[
              ["presence", "subjects", "palettes", "praises"][index]
            ],
            value[key],
          ),
        ),
      );
    }
    save() {
      try {
        localStorage.setItem(KEY, JSON.stringify(this.data));
        this.available = true;
      } catch {
        this.available = false;
      }
    }
    remember(scene, text, id) {
      this.data.lastEvent = { scene, text, id, at: Date.now() };
      this.save();
    }
    latestMemory() {
      const d = this.data,
        memories = [];
      if (d.keptFortune && d.keptFortuneAt)
        memories.push({
          at: d.keptFortuneAt,
          text: "上次收好的纸条：" + d.keptFortune,
        });
      if (d.sharedDrawing)
        memories.push({
          at: d.sharedDrawing.completedAt || 0,
          text:
            "上次一起画的“" +
            CONTENT.drawingStory.subjects[d.sharedDrawing.subject].label +
            "”，还在这里。",
        });
      if (d.lastOutfitMemory && CONTENT.outfits[d.lastOutfitMemory.outfit])
        memories.push({
          at: d.lastOutfitMemory.rememberedAt || 0,
          text:
            "上次认真选过的，是" +
            CONTENT.outfits[d.lastOutfitMemory.outfit].name +
            "。",
        });
      const old = d.lastRoomMemory;
      const moment =
        old && CONTENT.livingRoom.places[old.place]?.moments[old.momentIndex];
      if (moment)
        memories.push({
          at: old.rememberedAt || 0,
          text: "上次，你" + moment.memory + "。",
        });
      if (d.lastEvent?.text)
        memories.push({ at: d.lastEvent.at, text: d.lastEvent.text });
      return memories.sort((a, b) => b.at - a.at)[0] || null;
    }
  }

  class AssetCache {
    constructor(limit = 14) {
      this.items = new Map();
      this.limit = limit;
    }
    load(url) {
      if (this.items.has(url)) {
        const item = this.items.get(url);
        this.items.delete(url);
        this.items.set(url, item);
        return item;
      }
      const promise = new Promise((resolve, reject) => {
        const image = new Image();
        image.decoding = "async";
        image.onload = async () => {
          try {
            await image.decode();
            resolve({ url, image });
          } catch (error) {
            reject(error);
          }
        };
        image.onerror = () => reject(new Error("画面暂时没有打开"));
        image.src = url;
      }).catch((error) => {
        this.items.delete(url);
        throw error;
      });
      this.items.set(url, promise);
      while (this.items.size > this.limit)
        this.items.delete(this.items.keys().next().value);
      return promise;
    }
    prime(url) {
      if (!lowData()) this.load(url).catch(() => {});
    }
  }

  class SoundDirector extends EventTarget {
    constructor(store) {
      super();
      this.store = store;
      this.enabled = false;
      this.sequence = 0;
      this.cache = new Map();
      this.currentVoice = null;
      this.voiceCue = null;
      this.fx = new Audio();
      this.fx.preload = "none";
      this.fx.dataset.channel = "foley";
      this.environments = [new Audio(), new Audio()];
      this.environments.forEach((player) => {
        player.preload = "none";
        player.loop = true;
        player.volume = 0;
        player.dataset.channel = "ambient";
        player.addEventListener("error", () => this.emit("environment-error"));
      });
      this.environmentIndex = 0;
      this.environmentFile = "";
      this.environmentToken = 0;
      this.resumePending = false;
      this.speaking = false;
      this.ramps = new WeakMap();
      this.lastCue = null;
    }
    emit(phase, cue = null, extra = {}) {
      this.dispatchEvent(
        new CustomEvent("sound", { detail: { phase, cue, ...extra } }),
      );
    }
    enable() {
      this.enabled = true;
      this.store.data.soundChoice = "sound";
      this.resumePending = false;
      this.store.save();
    }
    quiet() {
      this.enabled = false;
      this.store.data.soundChoice = "quiet";
      this.stopAll();
      this.store.save();
      this.emit("quiet");
    }
    prepare(cue) {
      if (!cue?.file || !this.enabled || this.store.data.voiceMuted)
        return null;
      if (this.cache.has(cue.file)) return this.cache.get(cue.file);
      const player = new Audio();
      player.preload = "auto";
      player.dataset.channel = "voice";
      player.src = cue.file;
      this.cache.set(cue.file, player);
      while (this.cache.size > 4) {
        const first = this.cache.keys().next().value;
        const old = this.cache.get(first);
        if (old === this.currentVoice) {
          this.cache.delete(first);
          this.cache.set(first, old);
          continue;
        }
        this.cache.delete(first);
        old.removeAttribute("src");
        old.load();
      }
      return player;
    }
    playVoice(cue) {
      this.stopVoice(false);
      const token = ++this.sequence;
      this.lastCue = cue;
      this.voiceCue = cue;
      if (!cue?.file || !this.enabled || this.store.data.voiceMuted) {
        this.emit("muted", cue);
        return Promise.resolve("muted");
      }
      const player = this.prepare(cue);
      this.currentVoice = player;
      player.volume = this.store.data.voiceVolume;
      this.speaking = true;
      this.updateEnvironmentGain();
      this.emit("loading", cue);
      try {
        player.currentTime = 0;
      } catch {}
      return new Promise((resolve) => {
        let finished = false;
        const finish = (phase) => {
          if (finished) return;
          finished = true;
          player.onplaying = null;
          player.onended = null;
          player.onerror = null;
          if (token === this.sequence) {
            this.currentVoice = null;
            this.voiceCue = null;
            this.speaking = false;
            this.updateEnvironmentGain();
            this.emit(phase, cue);
          }
          resolve(phase);
        };
        this.finishVoice = finish;
        player.onplaying = () => {
          if (token === this.sequence) this.emit("playing", cue);
        };
        player.onended = () => finish("ended");
        player.onerror = () => finish("error");
        try {
          const result = player.play();
          if (result?.catch)
            result.catch(() =>
              finish(token === this.sequence ? "error" : "cancelled"),
            );
        } catch {
          finish("error");
        }
      });
    }
    stopVoice(notify = true) {
      const cue = this.voiceCue;
      this.sequence++;
      if (this.currentVoice) {
        this.currentVoice.pause();
        try {
          this.currentVoice.currentTime = 0;
        } catch {}
      }
      if (this.finishVoice) {
        this.finishVoice("cancelled");
        this.finishVoice = null;
      }
      this.currentVoice = null;
      this.voiceCue = null;
      this.speaking = false;
      this.updateEnvironmentGain();
      if (notify && cue) this.emit("stopped", cue);
    }
    playEffect(file) {
      if (!this.enabled || this.store.data.roomSoundMuted || !file) return;
      this.fx.pause();
      this.fx.src = file;
      this.fx.volume = 0.58;
      this.fx.onerror = () => this.emit("effect-error");
      try {
        this.fx.play()?.catch(() => this.emit("effect-error"));
      } catch {
        this.emit("effect-error");
      }
    }
    ramp(player, target, duration = 400) {
      const previous = this.ramps.get(player);
      if (previous) cancelAnimationFrame(previous);
      const from = player.volume,
        started = performance.now();
      const tick = (now) => {
        const progress = clamp((now - started) / duration, 0, 1);
        player.volume = clamp(
          from + (target - from) * (1 - Math.pow(1 - progress, 3)),
          0,
          1,
        );
        if (progress < 1) this.ramps.set(player, requestAnimationFrame(tick));
        else this.ramps.delete(player);
      };
      this.ramps.set(player, requestAnimationFrame(tick));
    }
    updateEnvironmentGain() {
      const d = this.store.data;
      const target =
        this.enabled &&
        !d.ambientMuted &&
        this.environmentFile &&
        !this.resumePending
          ? d.ambienceVolume * (this.speaking ? 0.398 : 1)
          : 0;
      this.ramp(
        this.environments[this.environmentIndex],
        target,
        this.speaking ? 120 : 600,
      );
    }
    setEnvironment(file) {
      const token = ++this.environmentToken;
      if (!this.enabled || this.store.data.ambientMuted || !file) {
        this.environmentFile = "";
        this.environments.forEach((player) => this.ramp(player, 0));
        setTimeout(() => {
          if (token === this.environmentToken)
            this.environments.forEach((player) => player.pause());
        }, 450);
        return;
      }
      if (file === this.environmentFile) {
        const current = this.environments[this.environmentIndex];
        if (current.paused) {
          try {
            current
              .play()
              ?.then(() => {
                if (token === this.environmentToken)
                  this.updateEnvironmentGain();
              })
              .catch(() => {
                if (token === this.environmentToken) {
                  this.environmentFile = "";
                  this.emit("environment-error");
                }
              });
          } catch {
            this.environmentFile = "";
            this.emit("environment-error");
          }
        } else this.updateEnvironmentGain();
        return;
      }
      const old = this.environments[this.environmentIndex];
      this.environmentIndex = 1 - this.environmentIndex;
      const next = this.environments[this.environmentIndex];
      next.pause();
      next.src = file;
      next.volume = 0;
      this.environmentFile = file;
      try {
        next
          .play()
          ?.then(() => {
            if (token !== this.environmentToken) return;
            this.ramp(old, 0, 900);
            this.updateEnvironmentGain();
            setTimeout(() => {
              if (token === this.environmentToken) old.pause();
            }, 950);
          })
          .catch(() => {
            if (token === this.environmentToken) {
              this.environmentFile = "";
              this.emit("environment-error");
            }
          });
      } catch {
        this.environmentFile = "";
        this.emit("environment-error");
      }
    }
    setVoiceMuted(value) {
      this.store.data.voiceMuted = value;
      if (value) this.stopVoice();
      this.store.save();
    }
    setEffectsMuted(value) {
      this.store.data.roomSoundMuted = value;
      if (value) this.fx.pause();
      this.store.save();
    }
    setAmbientMuted(value) {
      this.store.data.ambientMuted = value;
      this.environmentToken++;
      if (value) this.environments.forEach((player) => player.pause());
      this.store.save();
      this.environmentFile = "";
    }
    stopAll() {
      this.environmentToken++;
      this.environmentFile = "";
      this.stopVoice(false);
      this.fx.pause();
      this.environments.forEach((player) => player.pause());
    }
    hide() {
      this.resumePending = this.enabled;
      this.stopAll();
      if (this.resumePending) this.emit("suspended");
    }
    resume() {
      this.enabled = true;
      this.resumePending = false;
      this.emit("resumed");
    }
  }

  function createDrawingBoard(host) {
    const root = document.createElement("div");
    root.className = "drawing-board-stage";
    root.hidden = true;
    const board = document.createElement("img");
    board.className = "lap-drawing-board";
    board.alt = "";
    const art = document.createElement("img");
    art.className = "board-artwork";
    art.alt = "正在一起画的小猫";
    art.width = 720;
    art.height = 540;
    art.hidden = true;
    root.append(board, art);
    host.append(root);
    let config = { visible: false, aspect: 1062 / 1481, artwork: "" };
    const layout = () => {
      const height = host.clientHeight,
        width = host.clientWidth;
      if (!height || !width) return;
      const renderedWidth = Math.min(width, height * config.aspect);
      const renderedHeight = renderedWidth / config.aspect;
      root.style.left = (width - renderedWidth) / 2 + "px";
      root.style.top = height - renderedHeight + "px";
      root.style.width = renderedWidth + "px";
      root.style.height = renderedHeight + "px";
      const source = CONTENT.roomExperience.drawingBoard;
      if (!source || !config.artwork) return;
      const points = source.corners.map((point) => [
        (point[0] / source.width) * renderedWidth,
        (point[1] / source.height) * renderedHeight,
      ]);
      const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = points;
      const dx1 = x1 - x2,
        dx2 = x3 - x2,
        dx3 = x0 - x1 + x2 - x3,
        dy1 = y1 - y2,
        dy2 = y3 - y2,
        dy3 = y0 - y1 + y2 - y3;
      const denominator = dx1 * dy2 - dx2 * dy1;
      const g =
        Math.abs(denominator) < 0.001
          ? 0
          : (dx3 * dy2 - dx2 * dy3) / denominator;
      const h =
        Math.abs(denominator) < 0.001
          ? 0
          : (dx1 * dy3 - dx3 * dy1) / denominator;
      const a = x1 - x0 + g * x1,
        b = x3 - x0 + h * x3,
        d = y1 - y0 + g * y1,
        e = y3 - y0 + h * y3;
      art.style.transform =
        "matrix3d(" +
        [
          a / 720,
          d / 720,
          0,
          g / 720,
          b / 540,
          e / 540,
          0,
          h / 540,
          0,
          0,
          1,
          0,
          x0,
          y0,
          0,
          1,
        ].join(",") +
        ")";
    };
    const observer = new ResizeObserver(layout);
    observer.observe(host);
    return {
      root,
      update(values) {
        config = { ...config, ...values };
        root.dataset.paperState = config.paperState || "revealed";
        root.hidden = !config.visible;
        if (config.visible) {
          const source = CONTENT.roomExperience.drawingBoard;
          const file =
            config.size === "4k"
              ? source.image
              : config.size === "1440"
                ? source.medium
                : source.small;
          if (board.getAttribute("src") !== file) board.src = file;
          art.hidden = !config.artwork;
          if (config.artwork && art.getAttribute("src") !== config.artwork)
            art.src = config.artwork;
          layout();
        }
      },
      destroy() {
        observer.disconnect();
        root.remove();
      },
    };
  }

  return {
    StateStore,
    AssetCache,
    SoundDirector,
    clamp,
    smallScreen,
    lowData,
    imageFile,
    roomFile,
    media,
    createDrawingBoard,
  };
})();
