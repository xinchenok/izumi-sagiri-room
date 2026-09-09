"use strict";

(() => {
  const E = CONTENT.roomExperience;
  const {
    StateStore,
    AssetCache,
    SoundDirector,
    clamp,
    smallScreen,
    lowData,
    imageFile,
    roomFile,
    media,
  } = RoomKit;
  const $ = (selector) => document.querySelector(selector);
  const make = (tag, attributes = {}, ...children) => {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(attributes)) {
      if (key === "class") node.className = value;
      else if (key === "hidden") node.hidden = value;
      else if (value !== undefined && value !== null)
        node.setAttribute(key, value);
    }
    for (const child of children.flat())
      if (child !== null && child !== undefined)
        node.append(
          child instanceof Node
            ? child
            : document.createTextNode(String(child)),
        );
    return node;
  };
  const button = (text, attributes = {}) =>
    make("button", { type: "button", ...attributes }, text);
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  class SceneDirector {
    constructor(app) {
      this.app = app;
      this.token = 0;
      this.animation = null;
      this.image = $("#roomCharacter");
      this.background = $("#roomBackdrop");
      this.ghost = this.image.cloneNode(false);
      this.ghost.removeAttribute("id");
      this.ghost.alt = "";
      this.ghost.setAttribute("aria-hidden", "true");
      this.ghost.classList.add("actor-ghost");
      this.ghost.style.opacity = "0";
      this.image.after(this.ghost);
      this.current = null;
    }
    async show(sceneId, pose, outfit) {
      const token = ++this.token,
        app = this.app;
      const night = app.forceNight || app.store.data.lighting === "night";
      const scene = E.scenes[sceneId];
      app.assetRetry.hidden = true;
      app.stage.dataset.loading = "true";
      const actorUrl = imageFile(outfit, pose);
      const backgroundUrl = roomFile(night);
      try {
        const [actorAsset] = await Promise.all([
          app.assets.load(actorUrl),
          app.assets.load(backgroundUrl),
        ]);
        if (token !== this.token) return false;
        this.animation?.cancel();
        this.ghost.src = this.image.currentSrc || this.image.src;
        this.image.removeAttribute("srcset");
        this.background.removeAttribute("srcset");
        this.image.src = actorUrl;
        this.background.src = backgroundUrl;
        this.image.alt =
          CONTENT.outfits[outfit].name +
          "的纱雾，" +
          (pose.startsWith("desk")
            ? "坐在桌边认真画画"
            : pose.startsWith("bed")
              ? "抱着猫咪玩偶安静休息"
              : pose === "reading-peek"
                ? "从画册后悄悄看你"
                : "回头看向你，伸手邀请你坐下");
        let actor = [...scene.actor];
        if (pose === "reading-peek") actor = [49, 1, 44, 99];
        const aspect =
          actorAsset.image.naturalWidth / actorAsset.image.naturalHeight;
        if (!smallScreen()) {
          actor[2] = Math.max(
            actor[2],
            ((((app.canvas.clientHeight * actor[3]) / 100) * aspect) /
              app.canvas.clientWidth) *
              100,
          );
          actor[0] = Math.min(actor[0], 100 - actor[2]);
        }
        this.current = {
          sceneId,
          pose,
          outfit,
          night,
          camera: scene.camera,
          actor,
          aspect,
        };
        app.stage.dataset.scene = sceneId;
        app.stage.dataset.pose = pose;
        app.stage.dataset.outfit = outfit;
        app.stage.dataset.night = String(night);
        app.world.style.transform = "scale(" + scene.camera[0] + ")";
        app.world.style.transformOrigin =
          scene.camera[1] + "% " + scene.camera[2] + "%";
        app.stage.style.setProperty("--mobile-bg-x", scene.mobileX + "%");
        for (const node of [this.image, this.ghost, app.characterButton]) {
          node.style.setProperty("--actor-x", actor[0] + "%");
          node.style.setProperty("--actor-y", actor[1] + "%");
          node.style.setProperty("--actor-w", actor[2] + "%");
          node.style.setProperty("--actor-h", actor[3] + "%");
        }
        if (!app.still()) {
          this.animation = this.ghost.animate(
            [{ opacity: 1 }, { opacity: 0 }],
            {
              duration: 210,
              easing: "cubic-bezier(.16,1,.3,1)",
              fill: "forwards",
            },
          );
          this.animation.finished.catch(() => {});
        } else this.ghost.style.opacity = "0";
        app.stage.dataset.loading = "false";
        app.updateDrawingBoard();
        app.sceneStatus.textContent = app.store.available
          ? ""
          : E.ui.storageError;
        document.dispatchEvent(
          new CustomEvent("sagiri:scenechange", {
            detail: { sceneId, pose, outfit },
          }),
        );
        return true;
      } catch {
        if (token !== this.token) return false;
        app.stage.dataset.loading = "false";
        app.sceneStatus.textContent = E.ui.imageError;
        app.assetRetry.hidden = false;
        app.retryImage = () => this.show(sceneId, pose, outfit);
        return false;
      }
    }
  }

  class RoomApp {
    constructor() {
      this.store = new StateStore();
      this.assets = new AssetCache();
      this.sound = new SoundDirector(this.store);
      this.stage = $("#roomStage");
      this.world = $("#roomWorld");
      this.sceneId = "room";
      this.panelId = "";
      this.pose = "standing-neutral";
      this.busy = false;
      this.navigationToken = 0;
      this.interactionToken = 0;
      this.activeCue = null;
      this.entryChosen = false;
      this.forceNight = false;
      this.storyMode = "";
      this.lastActivity = performance.now();
      this.enteredAt = this.lastActivity;
      this.invitationUsed = false;
      this.autonomousCount = 0;
      this.quietLast = performance.now();
      this.inView = true;
      this.lastQuietBeat = -1;
      this.historyLines = [];
      this.voices = {
        ...CONTENT.cinematicVoices,
        ...CONTENT.livingRoom.voices,
        ...E.voice,
      };
      this.installShell();
      this.director = new SceneDirector(this);
      this.inspector = new RoomInspector({
        assets: this.assets,
        getScene: () => ({
          ...this.director.current,
          drawingBoard: this.drawingBoardState(),
        }),
        getGallery: () => CONTENT.gallery[this.store.data.galleryIndex],
        onGalleryStep: (direction) =>
          this.changeGallery(direction, { speak: false }),
        getCaption: () => $("#roomDialogue"),
        onClose: () => this.activity(),
      });
      this.bind();
      const root = document.documentElement;
      root.dataset.js = "true";
      this.applyMotion();
      this.navigate(location.hash || "room", {
        push: false,
        speak: false,
      }).then(() => {
        if (!location.hash) {
          const memory = this.store.latestMemory();
          this.caption(
            memory && this.store.data.visitCount > 1
              ? memory.text
              : E.scenes.room.line,
          );
        }
        root.dataset.ready = "true";
      });
      this.tick = setInterval(() => this.onTick(), 500);
      this.scheduleIdle();
      if (!this.store.available)
        this.sceneStatus.textContent = E.ui.storageError;
    }
    installShell() {
      for (const [id, url] of [
        ["roomBackdrop", roomFile(this.store.data.lighting === "night")],
        [
          "roomCharacter",
          imageFile(this.store.data.outfit, "standing-neutral"),
        ],
      ]) {
        const image = document.getElementById(id),
          picture = image.closest("picture");
        image.src = url;
        image.removeAttribute("srcset");
        if (picture) picture.replaceWith(image);
      }
      this.canvas = make("div", { class: "scene-canvas", id: "sceneCanvas" });
      this.stage.prepend(this.canvas);
      this.canvas.append(this.world, $("#roomCharacter"), $("#roomHotspots"));
      this.characterButton = button("", {
        id: "callSagiri",
        class: "character-control",
        "aria-label": "轻声叫一声纱雾",
      });
      this.characterButton.append($("#roomCharacter"));
      this.canvas.append(this.characterButton);
      this.drawingBoard = RoomKit.createDrawingBoard(this.characterButton);
      this.sceneStatus = make("p", {
        class: "scene-status",
        id: "sceneStatus",
        role: "status",
        "aria-live": "polite",
      });
      this.assetRetry = button("重新打开画面", {
        id: "assetRetry",
        hidden: true,
      });
      this.canvas.append(this.sceneStatus, this.assetRetry);
      this.viewerButton = button("放大看看", {
        id: "openRoomViewer",
        class: "scene-viewer",
        "aria-label": "放大观察当前房间",
      });
      this.canvas.append(this.viewerButton);
      this.memoryPin = button("", {
        class: "memory-pin",
        id: "sharedMemoryPin",
        "data-action": "memories",
        hidden: true,
      });
      this.canvas.append(this.memoryPin);
      this.captionHome = make("span", { id: "captionHome", hidden: true });
      $("#roomDialogue").before(this.captionHome);
      this.voiceTools = make("div", { class: "voice-tools" });
      this.voiceTools.append(
        button("再听一次", { id: "voiceReplay" }),
        button("停止", { id: "voiceStop" }),
        button("回看对话", { "data-action": "transcript" }),
      );
      $("#roomDialogue").append(this.voiceTools);
      this.voiceTools.hidden = true;
      this.nearby = make("div", {
        id: "nearbyObjects",
        class: "nearby-objects",
        "aria-label": "当前地点可做的小事",
      });
      this.stage.append(this.nearby);
      this.panel = make("section", {
        id: "roomPanel",
        class: "room-panel",
        hidden: true,
        "aria-labelledby": "panelTitle",
      });
      this.panelTitle = make("h2", { id: "panelTitle", tabindex: "-1" });
      this.panelBody = make("div", { id: "panelBody", class: "panel-body" });
      this.panelFooter = make("div", { class: "panel-footer" });
      this.panel.append(
        make(
          "header",
          { class: "panel-header" },
          this.panelTitle,
          button("回到房间", {
            id: "panelClose",
            "aria-label": "收起当前内容，回到房间",
          }),
        ),
        this.panelBody,
        this.panelFooter,
      );
      this.stage.append(this.panel);
      this.soundConsent = make("section", {
        id: "soundConsent",
        class: "sound-consent",
        hidden: true,
        "aria-label": "选择这次拜访的声音",
      });
      this.soundConsent.append(
        make("p", {}, "这次，想听见房间的声音吗？"),
        make(
          "div",
          { class: "choice-row" },
          button("有声进入", { "data-sound-choice": "on" }),
          button("安静进入", { "data-sound-choice": "off" }),
        ),
      );
      this.stage.append(this.soundConsent);
      this.settings = make("section", {
        id: "settingsPanel",
        class: "settings-panel",
        hidden: true,
        "aria-label": "房间设置",
      });
      const volume = make("input", {
        id: "voiceVolume",
        type: "range",
        min: "0",
        max: "1",
        step: ".05",
        value: this.store.data.voiceVolume,
        "aria-label": "角色语音音量",
      });
      const ambience = make("input", {
        id: "ambienceVolume",
        type: "range",
        min: "0",
        max: ".6",
        step: ".02",
        value: this.store.data.ambienceVolume,
        "aria-label": "环境声音量",
      });
      this.settings.append(
        make(
          "header",
          {},
          make("h2", {}, "房间里的声音与光"),
          button("收起", { id: "settingsClose" }),
        ),
        button("角色语音", {
          id: "voiceMute",
          "aria-pressed": String(this.store.data.voiceMuted),
        }),
        make("label", {}, "她的声音", volume),
        button("物件拟音", {
          id: "foleyMute",
          "aria-pressed": String(this.store.data.roomSoundMuted),
        }),
        button("持续环境声", {
          id: "ambientMute",
          "aria-pressed": String(this.store.data.ambientMuted),
        }),
        make("label", {}, "房间的声音", ambience),
        make(
          "div",
          { class: "choice-row" },
          button("日光", { "data-light": "day" }),
          button("夜灯", { "data-light": "night" }),
        ),
        make(
          "div",
          { class: "choice-row" },
          button("晴朗", { "data-weather": "clear" }),
          button("细雨", { "data-weather": "rain" }),
        ),
        make(
          "p",
          { class: "small-note" },
          "天气是房间里的氛围选择，不是实时天气。",
        ),
      );
      this.stage.append(this.settings);
      this.settings.append(
        button("回看这次说过的话", { "data-action": "transcript" }),
      );
      this.resumeSound = button("恢复房间声音", {
        id: "resumeSound",
        class: "resume-sound",
        hidden: true,
      });
      this.stage.append(this.resumeSound);
      this.invite = make(
        "aside",
        {
          id: "inviteNote",
          class: "invite-note",
          hidden: true,
          "aria-label": "纱雾的小邀请",
        },
        make("p", {}, E.ui.invitation),
        make(
          "div",
          { class: "choice-row" },
          button("过去看看", { id: "inviteAccept" }),
          button("先待一会儿", { id: "inviteDismiss" }),
        ),
      );
      this.stage.append(this.invite);
      this.rain = make("div", { class: "window-rain", "aria-hidden": "true" });
      this.world.append(this.rain);
      this.updateSettings();
    }
    bind() {
      document.addEventListener("click", (event) => {
        const target = event.target.closest("button");
        if (!target || target.disabled) return;
        if (
          target.closest("#inspectDialog") &&
          !["voiceReplay", "voiceStop"].includes(target.id) &&
          target.dataset.action !== "transcript"
        )
          return;
        this.activity();
        const d = target.dataset,
          id = target.id;
        if (d.soundChoice) return this.chooseSound(d.soundChoice);
        if (id === "soundButton") return this.showConsent();
        if (id === "settingsButton") {
          this.settings.hidden = !this.settings.hidden;
          this.invite.hidden = true;
          return;
        }
        if (id === "settingsClose") {
          this.settings.hidden = true;
          return;
        }
        if (id === "motionButton") {
          this.store.data.motionMode =
            this.store.data.motionMode === "quiet" ? "lively" : "quiet";
          this.store.save();
          this.applyMotion();
          return;
        }
        if (id === "voiceMute") {
          this.sound.setVoiceMuted(!this.store.data.voiceMuted);
          this.updateSettings();
          return;
        }
        if (id === "foleyMute") {
          this.sound.setEffectsMuted(!this.store.data.roomSoundMuted);
          this.updateSettings();
          return;
        }
        if (id === "ambientMute") {
          this.sound.setAmbientMuted(!this.store.data.ambientMuted);
          this.syncAmbience();
          this.updateSettings();
          return;
        }
        if (d.light) return this.changeLight(d.light);
        if (d.weather) return this.changeWeather(d.weather);
        if (id === "resumeSound") {
          this.sound.resume();
          this.syncAmbience();
          this.resumeSound.hidden = true;
          return;
        }
        if (id === "voiceStop") return this.sound.stopVoice();
        if (id === "voiceReplay") {
          if (this.sound.lastCue) this.perform(this.sound.lastCue);
          return;
        }
        if (id === "assetRetry") return this.retryImage?.();
        if (id === "panelClose") return this.closePanel();
        if (id === "inviteDismiss") {
          this.invite.hidden = true;
          this.invitationUsed = true;
          return;
        }
        if (id === "inviteAccept") {
          this.invite.hidden = true;
          this.invitationUsed = true;
          return this.enterThen(() =>
            this.navigate(
              this.store.data.drawingDraft
                ? "drawing-story"
                : this.invitationTarget || "drawing-story",
            ),
          );
        }
        if (id === "openRoomViewer")
          return this.enterThen(() => this.inspector.openScene(target));
        if (id === "callSagiri")
          return this.enterThen(() => this.perform(this.characterCue()));
        if (id === "approachButton")
          return this.enterThen(() => this.navigate("desk"));
        if (id === "lookButton")
          return this.enterThen(() => {
            this.nearby.classList.toggle("is-expanded");
            this.caption("可以慢慢看。想靠近哪里，就告诉我。");
          });
        if (d.place) return this.enterThen(() => this.navigate(d.place));
        if (d.outfit) return this.changeOutfit(d.outfit);
        if (d.galleryIndex !== undefined)
          return this.changeGallery(Number(d.galleryIndex), { absolute: true });
        if (d.secret) return this.discover(d.secret);
        if (d.choiceKind) return this.chooseStory(d.choiceKind, d.choiceValue);
        if (id === "galleryPrev") return this.changeGallery(-1);
        if (id === "galleryNext") return this.changeGallery(1);
        if (id === "openGalleryViewer")
          return this.inspector.openGallery(target);
        if (id === "drawingResume") {
          this.drawingActive = true;
          this.renderDrawing();
          this.perform("draft-resume");
          return;
        }
        if (id === "drawingRestart") return this.startDrawing(true);
        if (id === "pauseDrawing") return this.closePanel();
        if (id === "quietBack") return this.action("drawing-back", target);
        if (d.action === "drawing-back" && this.panelId === "drawing")
          return this.action(d.action, target);
        if (id === "drawingListen")
          return this.enterThen(() =>
            this.perform(
              this.drawingListenCue ||
                (this.store.data.drawingDraft
                  ? E.drawingStages[this.store.data.drawingDraft.step].voice
                  : "artwork-reveal"),
              { pose: "desk-shy" },
            ),
          );
        if (id === "quietContinue") {
          this.accumulateQuiet();
          this.store.data.drawingDraft.mode = "choices";
          this.store.data.drawingDraft.step = 1;
          this.store.save();
          this.renderDrawing();
          return;
        }
        if (id === "peekDraft") return this.peek();
        if (id === "nextFortune") return this.nextFortune();
        if (id === "copyFortune") return this.copyFortune();
        if (id === "keepFortune") return this.keepFortune();
        if (id === "goodnightVoice")
          return this.perform("goodnight", { pose: "bed-sleepy" });
        if (id === "openSharedDrawing")
          return this.inspector.openImage(
            this.artInfo(this.store.data.sharedDrawing),
            target,
          );
        if (d.action)
          return this.enterThen(() => this.action(d.action, target));
      });
      document.addEventListener("keydown", (event) => {
        if (event.defaultPrevented) return;
        this.activity();
        if (event.key === "Escape" && !$("#inspectDialog")?.open) {
          if (!this.settings.hidden) this.settings.hidden = true;
          else if (!this.soundConsent.hidden) {
            this.soundConsent.hidden = true;
            this.pendingEntry = null;
          } else if (this.panelId) this.closePanel();
        }
      });
      document.addEventListener("pointerdown", () => this.activity(), {
        passive: true,
      });
      window.addEventListener("scroll", () => this.activity(), {
        passive: true,
      });
      window.addEventListener(
        "resize",
        () => {
          this.renderHotspots();
          this.layoutRain();
          if (this.director.current && !this.busy && !this.pendingRoute)
            this.director.show(this.sceneId, this.pose, this.store.data.outfit);
        },
        { passive: true },
      );
      window.addEventListener("popstate", () =>
        this.navigate(location.hash || "room", { push: false, speak: false }),
      );
      window.addEventListener("hashchange", () => {
        if (location.hash !== this.currentHash)
          this.navigate(location.hash || "room", { push: false, speak: false });
      });
      document.addEventListener("visibilitychange", () => {
        document.documentElement.dataset.paused = String(
          document.hidden || !this.inView,
        );
        this.accumulateQuiet();
        if (document.hidden) {
          this.sound.hide();
          clearTimeout(this.idleTimer);
        } else {
          this.quietLast = performance.now();
          this.resumeSound.hidden = !this.sound.resumePending;
          this.scheduleIdle();
        }
      });
      window.addEventListener("pagehide", () => {
        this.accumulateQuiet();
        this.store.save();
        this.sound.stopAll();
      });
      media.addEventListener("change", () => this.applyMotion());
      $("#voiceVolume").addEventListener("input", (event) => {
        this.store.data.voiceVolume = Number(event.target.value);
        if (this.sound.currentVoice)
          this.sound.currentVoice.volume = this.store.data.voiceVolume;
        this.store.save();
      });
      $("#ambienceVolume").addEventListener("input", (event) => {
        this.store.data.ambienceVolume = Number(event.target.value);
        this.sound.updateEnvironmentGain();
        this.store.save();
      });
      this.sound.addEventListener("sound", (event) =>
        this.onSound(event.detail),
      );
      new IntersectionObserver(
        (entries) => {
          this.accumulateQuiet();
          this.inView = entries[0].isIntersecting;
          document.documentElement.dataset.paused = String(
            document.hidden || !this.inView,
          );
          if (!this.inView) clearTimeout(this.idleTimer);
          else this.scheduleIdle();
        },
        { threshold: 0 },
      ).observe(this.canvas);
    }
    enterThen(action) {
      if (this.entryChosen) return action();
      this.pendingEntry = action;
      this.showConsent();
    }
    showConsent() {
      this.soundConsent.hidden = false;
      this.invite.hidden = true;
    }
    chooseSound(value) {
      this.entryChosen = true;
      this.soundConsent.hidden = true;
      this.enteredAt = performance.now();
      if (value === "on") this.sound.enable();
      else this.sound.quiet();
      this.updateSettings();
      this.syncAmbience();
      const action = this.pendingEntry;
      this.pendingEntry = null;
      if (action) action();
      else if (value === "on") this.perform("welcome");
    }
    route(value) {
      const id = String(value).replace(/^#/, "");
      if (
        [
          "gallery",
          "drawing-story",
          "desk-secrets",
          "secrets",
          "memories",
          "wardrobe-story",
          "gallery-story",
        ].includes(id)
      )
        return {
          scene: id === "wardrobe-story" ? "wardrobe" : "desk",
          panel:
            id === "drawing-story"
              ? "drawing"
              : id === "desk-secrets"
                ? "secrets"
                : id.endsWith("-story")
                  ? id.split("-")[0]
                  : id,
        };
      if (id === "goodnight") return { scene: "bed", panel: "goodnight" };
      if (["home", "room", "living-room", "cinematic-visit", ""].includes(id))
        return { scene: "room", panel: "" };
      return {
        scene: E.scenes[id] ? id : "room",
        panel: id === "wardrobe" ? "wardrobe" : "",
      };
    }
    async navigate(value, { push = true, speak = true } = {}) {
      this.accumulateQuiet();
      this.interactionToken++;
      this.sound.stopVoice(false);
      this.activeCue = null;
      this.pendingRoute = { value, push, speak };
      const token = ++this.navigationToken,
        route = this.route(value);
      this.busy = true;
      this.invite.hidden = true;
      this.storyMode = "";
      if (route.panel === "goodnight") this.forceNight = true;
      else this.forceNight = false;
      const pose =
        route.panel === "gallery"
          ? "reading-peek"
          : route.panel === "goodnight"
            ? "bed-sleepy"
            : E.scenes[route.scene].pose;
      const ok = await this.director.show(
        route.scene,
        pose,
        this.store.data.outfit,
      );
      if (!ok || token !== this.navigationToken) {
        if (token === this.navigationToken) {
          this.busy = false;
          this.retryImage = () => this.navigate(value, { push, speak });
        }
        return false;
      }
      this.sceneId = route.scene;
      this.pose = pose;
      this.store.data.roomScene = route.scene;
      if (CONTENT.livingRoom.places[route.scene])
        this.store.data.livingPlace = route.scene;
      this.store.save();
      this.busy = false;
      this.pendingRoute = null;
      this.stage.classList.remove("visit-ended");
      if (push) {
        this.currentHash = "#" + String(value).replace(/^#/, "");
        history.pushState({ scene: route.scene }, "", this.currentHash);
      } else this.currentHash = location.hash;
      this.renderScene();
      if (route.panel) this.openPanel(route.panel);
      else this.hidePanel();
      if (String(value).includes("wardrobe-story")) this.startWardrobeStory();
      if (String(value).includes("gallery-story")) this.startGalleryStory();
      this.syncAmbience();
      this.quietLast = performance.now();
      this.scheduleIdle();
      const specialStory = /^(#)?(wardrobe-story|gallery-story)$/.test(
        String(value),
      );
      if (speak && !specialStory) {
        if (route.panel === "drawing") {
          if (this.store.data.drawingDraft?.mode === "quiet")
            this.renderQuietBeat(true);
          else this.perform("draw-invite");
        } else if (route.panel === "gallery")
          this.perform("gallery-open", { pose: "reading-peek" });
        else if (route.panel === "goodnight")
          this.perform("goodnight", { pose: "bed-sleepy" });
        else this.perform(E.scenes[route.scene].voice);
      } else if (!speak) {
        if (
          route.panel === "drawing" &&
          this.store.data.drawingDraft?.mode === "quiet"
        )
          this.renderQuietBeat(true);
        else this.caption(E.scenes[route.scene].line);
      }
      return true;
    }
    renderScene() {
      this.stage.dataset.scene = this.sceneId;
      for (const node of document.querySelectorAll(
        ".place-navigation [data-place]",
      )) {
        const selected = node.dataset.place === this.sceneId;
        node.classList.toggle("is-current", selected);
        node.setAttribute("aria-pressed", String(selected));
      }
      const actions = E.scenes[this.sceneId].actions;
      $("#roomActions").replaceChildren(
        ...actions.map(([label, action], index) =>
          button(label, {
            class: index ? "secondary-action" : "primary-action",
            "data-action": action,
          }),
        ),
      );
      if (this.sceneId === "room") {
        const [first, second] = $("#roomActions").children;
        first.id = "approachButton";
        first.insertAdjacentHTML(
          "beforeend",
          '<svg class="action-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>',
        );
        second.id = "lookButton";
      }
      this.renderHotspots();
      this.renderMemoryPin();
      this.layoutRain();
      this.caption(E.scenes[this.sceneId].line);
    }
    renderHotspots() {
      const scene = E.scenes[this.sceneId],
        cam = scene.camera;
      const original = {
        wardrobe: [10.53, 24.89],
        drawing: [82.27, 35.47],
        gallery: [90.78, 73.08],
      };
      const targets = scene.objects;
      $("#roomHotspots").replaceChildren(
        ...targets.map(([label, action, x, y]) => {
          if (this.sceneId === "room" && original[action])
            [x, y] = original[action];
          else {
            x = (x - cam[1]) * cam[0] + cam[1];
            y = (y - cam[2]) * cam[0] + cam[2];
          }
          const node = button(label, {
            class: "object-hotspot",
            "data-action": action,
          });
          node.prepend(
            make("span", { class: "hotspot-dot", "aria-hidden": "true" }),
          );
          node.style.left =
            clamp(
              x,
              3,
              100 -
                ((label.length * 20 + 42) /
                  Math.max(this.canvas.clientWidth, 320)) *
                  100,
            ) + "%";
          node.style.top = clamp(y, 16, 82) + "%";
          return node;
        }),
      );
      this.nearby.replaceChildren(
        make("span", { class: "nearby-label" }, "可以慢慢看看"),
        ...targets.map(([label, action]) =>
          button(label, { "data-action": action }),
        ),
        button("轻轻敲门", { "data-action": "knock" }),
      );
    }
    caption(zh, ja = "", { keepVoice = false } = {}) {
      if (!keepVoice) {
        this.interactionToken++;
        this.sound.stopVoice(false);
        this.activeCue = null;
        this.busy = false;
        this.stage.dataset.speaking = "false";
      }
      $("#subtitleZh").textContent = zh;
      $("#subtitleJa").textContent = ja;
      $("#subtitleJa").hidden = !ja;
      $("#voiceStatus").hidden = true;
      this.voiceTools.hidden = true;
      if (zh && this.historyLines.at(-1)?.zh !== zh) {
        this.historyLines.push({ zh, ja });
        if (this.historyLines.length > 80) this.historyLines.shift();
      }
    }
    reactionPose() {
      if (this.panelId === "gallery") return "reading-peek";
      if (this.sceneId === "desk") return "desk-shy";
      if (this.sceneId === "bed")
        return this.panelId === "goodnight" ? "bed-sleepy" : "bed-hug";
      return "standing-shy";
    }
    characterCue() {
      this.voiceBags ||= {};
      let bag = this.voiceBags[this.sceneId];
      if (!bag?.length) {
        bag = [...E.characterVoicePools[this.sceneId]];
        for (let i = bag.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [bag[i], bag[j]] = [bag[j], bag[i]];
        }
        if (bag.at(-1) === this.lastCharacterCue) bag.unshift(bag.pop());
        this.voiceBags[this.sceneId] = bag;
      }
      const id = bag.pop();
      this.lastCharacterCue = id;
      return id === "outfit-current" ? "outfit-" + this.store.data.outfit : id;
    }
    async perform(value, { pose, fx, record } = {}) {
      const cue = typeof value === "string" ? this.voices[value] : value;
      if (!cue) return;
      const token = ++this.interactionToken,
        started = performance.now();
      this.busy = true;
      this.invite.hidden = true;
      this.activeCue = cue;
      this.caption(
        cue.chinese || cue.textZh || "",
        cue.japanese || cue.textJa || "",
        { keepVoice: true },
      );
      this.voiceTools.hidden = !cue.file;
      if (fx) this.sound.playEffect(CONTENT.cinematicFoley[fx]?.file || fx);
      const voice = this.sound.playVoice(cue);
      const frame = this.director.show(
        this.sceneId,
        pose || this.reactionPose(),
        this.store.data.outfit,
      );
      if (record) this.store.remember(this.sceneId, record, cue.id);
      await Promise.all([voice, frame]);
      await wait(Math.max(0, 1200 - (performance.now() - started)));
      if (token !== this.interactionToken) return;
      this.busy = false;
      this.pose = this.restingPose();
      await this.director.show(this.sceneId, this.pose, this.store.data.outfit);
      this.scheduleIdle();
    }
    onSound({ phase, cue }) {
      if (phase === "suspended" || phase === "quiet") {
        this.interactionToken++;
        this.busy = false;
        this.stage.dataset.speaking = "false";
        this.stage.dataset.voiceState = phase;
        $("#voiceStatus").hidden = false;
        $("#voiceStatus").textContent =
          phase === "quiet"
            ? E.ui.audioMuted
            : "声音先停在这里，回来后可以继续。";
        if (phase === "suspended") this.resumeSound.hidden = false;
        return;
      }
      if (phase.endsWith("-error")) {
        this.settings.dataset.audioNotice =
          "声音暂时没有准备好，可以重新开启。";
        return;
      }
      if (cue && cue !== this.activeCue) return;
      const status = {
        loading: E.ui.audioLoading,
        playing: E.ui.audioPlaying,
        ended: E.ui.audioReady,
        muted: E.ui.audioMuted,
        error: E.ui.audioError,
        stopped: "声音已停下，台词仍然留着。",
      }[phase];
      if (status) {
        $("#voiceStatus").hidden = false;
        $("#voiceStatus").textContent = status;
      }
      this.stage.dataset.speaking = String(
        phase === "playing" || phase === "loading",
      );
      this.stage.dataset.voiceState = phase;
      if (phase === "muted") this.voiceTools.hidden = true;
    }
    updateSettings() {
      $("#voiceMute").setAttribute(
        "aria-pressed",
        String(this.store.data.voiceMuted),
      );
      $("#foleyMute").setAttribute(
        "aria-pressed",
        String(this.store.data.roomSoundMuted),
      );
      $("#ambientMute").setAttribute(
        "aria-pressed",
        String(this.store.data.ambientMuted),
      );
      $("#voiceMute").textContent =
        "角色语音 · " + (this.store.data.voiceMuted ? "关" : "开");
      $("#foleyMute").textContent =
        "物件拟音 · " + (this.store.data.roomSoundMuted ? "关" : "开");
      $("#ambientMute").textContent =
        "持续环境声 · " + (this.store.data.ambientMuted ? "关" : "开");
      $("#soundButton").setAttribute(
        "aria-label",
        this.sound.enabled ? "声音已开启，调整声音" : "打开房间声音",
      );
    }
    still() {
      return media.matches || this.store.data.motionMode === "quiet";
    }
    applyMotion() {
      this.idleSequence = (this.idleSequence || 0) + 1;
      document.documentElement.dataset.motion = this.still()
        ? "quiet"
        : "lively";
      this.stage.dataset.reducedMotion = String(media.matches);
      $("#motionButton").disabled = media.matches;
      $("#motionButton").setAttribute("aria-pressed", String(this.still()));
      $("#motionButton").setAttribute(
        "aria-label",
        media.matches
          ? "系统已启用减少动态效果"
          : this.still()
            ? "恢复房间的小动作"
            : "让房间静一静",
      );
      $("#motionButton span").textContent = this.still() ? "安静" : "动态";
      clearTimeout(this.idleTimer);
      if (!this.still()) this.scheduleIdle();
      else if (this.director?.current && !this.busy && !this.pendingRoute)
        this.director.show(this.sceneId, this.pose, this.store.data.outfit);
    }
    syncAmbience() {
      this.stage.dataset.weather = this.store.data.livingWeather;
      const file =
        this.store.data.livingWeather === "rain"
          ? "assets/audio/v8/weather-rain-window.mp3"
          : null;
      if (!this.sound.resumePending) this.sound.setEnvironment(file);
    }
    layoutRain() {
      if (!this.rain) return;
      const glass = E.windowGlass,
        w = this.world.clientWidth,
        h = this.world.clientHeight;
      if (!w || !h || !glass) return;
      const scale = Math.max(w / glass.width, h / glass.height);
      const offsetX =
        (w - glass.width * scale) *
        (smallScreen() ? E.scenes[this.sceneId].mobileX / 100 : 0.5);
      const offsetY = (h - glass.height * scale) * 0.5;
      this.rain.replaceChildren(
        ...glass.polygons.map((points, index) => {
          const xs = points.map((point) => point[0]),
            ys = points.map((point) => point[1]);
          const x = Math.min(...xs),
            y = Math.min(...ys),
            width = Math.max(...xs) - x,
            height = Math.max(...ys) - y;
          const pane = make("span", { class: "rain-pane" });
          pane.style.left = x * scale + offsetX + "px";
          pane.style.top = y * scale + offsetY + "px";
          pane.style.width = width * scale + "px";
          pane.style.height = height * scale + "px";
          pane.style.clipPath =
            "polygon(" +
            points
              .map(
                (point) =>
                  ((point[0] - x) / width) * 100 +
                  "% " +
                  ((point[1] - y) / height) * 100 +
                  "%",
              )
              .join(",") +
            ")";
          for (let i = 0; i < 4; i++) {
            const drop = make("i");
            drop.style.setProperty("--rain-x", 13 + i * 23 + "%");
            drop.style.setProperty(
              "--rain-delay",
              -index * 0.37 - i * 0.64 + "s",
            );
            pane.append(drop);
          }
          return pane;
        }),
      );
    }
    keepSelectionVisible(container, selected) {
      requestAnimationFrame(() => {
        if (container.isConnected && selected)
          container.scrollLeft = clamp(
            selected.offsetLeft -
              container.offsetLeft -
              container.clientWidth / 2 +
              selected.clientWidth / 2,
            0,
            container.scrollWidth - container.clientWidth,
          );
      });
    }
    async changeLight(value) {
      this.store.data.lighting = value;
      this.forceNight = false;
      this.store.save();
      if (this.pendingRoute) {
        const pending = this.pendingRoute;
        return this.navigate(pending.value, {
          push: pending.push,
          speak: false,
        });
      }
      this.interactionToken++;
      this.sound.stopVoice(false);
      this.busy = false;
      const token = this.interactionToken,
        navToken = this.navigationToken;
      const ok = await this.director.show(
        this.sceneId,
        this.pose,
        this.store.data.outfit,
      );
      if (
        !ok ||
        token !== this.interactionToken ||
        navToken !== this.navigationToken
      )
        return;
      this.caption(
        value === "night"
          ? "台灯还亮着。可以再安静待一会儿。"
          : "窗边又亮起来了。今天的画，也慢慢来。",
      );
    }
    changeWeather(value) {
      this.store.data.livingWeather = value;
      this.store.save();
      this.syncAmbience();
      if (value === "rain") this.perform("window-rain");
      else this.caption("雨声轻轻停下。可以听见纸页翻过的声音了。");
    }
    async action(action, opener) {
      if (E.scenes[action]) return this.navigate(action);
      if (
        ["drawing", "gallery", "goodnight", "secrets", "memories"].includes(
          action,
        )
      )
        return this.navigate(
          { drawing: "drawing-story", secrets: "desk-secrets" }[action] ||
            action,
        );
      if (action === "outfits") return this.navigate("wardrobe");
      if (action === "look") {
        this.nearby.classList.toggle("is-expanded");
        return;
      }
      if (action === "inspect")
        return this.inspector.openScene(opener || this.viewerButton);
      if (action === "weather")
        return this.changeWeather(
          this.store.data.livingWeather === "rain" ? "clear" : "rain",
        );
      if (action === "wardrobe-story") return this.startWardrobeStory();
      if (action === "gallery-story") return this.startGalleryStory();
      if (action === "quiet") {
        await this.navigate("drawing-story", { speak: false });
        this.startDrawing(false);
        return this.chooseStory("presence", "quiet");
      }
      if (action === "knock")
        return this.perform("door-knock-wait", {
          fx: "door-knock-soft",
          record: "你轻轻敲过门，等她回应以后才走近。",
        });
      if (action === "curtain")
        return this.perform("room-curtain", {
          fx: "room-curtain-slide",
          record: "你替她拉了一点窗帘，让画面看起来更清楚。",
        });
      if (action === "wardrobe-hanger")
        return this.perform("room-wardrobe-hanger", {
          fx: "wardrobe-hanger-slide",
          record: "你替她扶稳了晃动的衣架。",
        });
      if (action === "wardrobe-sleeve")
        return this.perform("outfit-" + this.store.data.outfit, {
          fx: "wardrobe-sleeve-rustle",
        });
      if (action === "plush")
        return this.perform("bed-plush", {
          pose: "bed-hug",
          fx: "goodnight-plush-squeeze",
          record: "你陪她抱着猫咪玩偶，在床边安静待了一会儿。",
        });
      if (action === "blanket")
        return this.perform("room-bed-blanket", {
          fx: "assets/audio/v14/bed-blanket-fold.mp3",
          record: "你帮她接住了滑下来的毯角。",
        });
      if (action === "transcript") {
        this.settings.hidden = true;
        if (this.inspector.dialog?.open) {
          this.inspector.close();
          setTimeout(() => this.openPanel("transcript"), 0);
          return;
        }
        return this.openPanel("transcript");
      }
      if (action === "feedback-ask") return this.perform("feedback-ask");
      if (action === "drawing-back") {
        const draft = this.store.data.drawingDraft;
        if (draft) {
          draft.step = Math.max(0, draft.step - 1);
          draft.mode = "choices";
          draft.updatedAt = Date.now();
          this.store.save();
          this.renderDrawing();
          this.respondToDrawing("可以再选一次……我还没有往下画。", {
            pose: "desk-focus",
          });
        }
        return;
      }
    }
    openPanel(id) {
      this.panelFooter.querySelector(".drawing-tools")?.remove();
      this.panelId = id;
      this.panel.dataset.panel = id;
      this.panel.hidden = false;
      this.stage.classList.add("has-panel");
      $("#roomActions").hidden = true;
      this.panelFooter.append($("#roomDialogue"));
      this.panelTitle.textContent =
        {
          drawing: E.episodes.drawing.title,
          wardrobe: "衣橱里，都是安心的颜色",
          gallery: "她慢慢推过来的画册",
          goodnight: "今天的纸条，交给你",
          secrets: "她收起来的小东西",
          memories: "一起留下来的画",
          transcript: "刚才说过的话",
        }[id] || "房间里的小事";
      this.panelBody.replaceChildren();
      if (id === "wardrobe") this.renderWardrobe();
      if (id === "gallery") this.renderGallery();
      if (id === "drawing") {
        this.drawingActive = !this.store.data.drawingDraft;
        this.renderDrawing();
      }
      if (id === "secrets") this.renderSecrets();
      if (id === "goodnight") this.renderGoodnight();
      if (id === "memories") this.renderMemories();
      if (id === "transcript")
        for (const line of this.historyLines) {
          this.panelBody.append(make("p", {}, line.zh));
          if (line.ja)
            this.panelBody.append(
              make("p", { class: "small-note", lang: "ja" }, line.ja),
            );
        }
    }
    hidePanel() {
      this.panelFooter.querySelector(".drawing-tools")?.remove();
      this.panelId = "";
      this.panel.dataset.panel = "";
      this.panel.hidden = true;
      this.stage.classList.remove("has-panel");
      this.captionHome.after($("#roomDialogue"));
      $("#roomActions").hidden = false;
      this.storyMode = "";
    }
    closePanel() {
      this.accumulateQuiet();
      this.interactionToken++;
      this.sound.stopVoice();
      this.hidePanel();
      this.busy = false;
      this.stage.dataset.speaking = "false";
      this.currentHash = "#" + this.sceneId;
      history.pushState({ scene: this.sceneId }, "", this.currentHash);
      this.pose = E.scenes[this.sceneId].pose;
      this.director.show(this.sceneId, this.pose, this.store.data.outfit);
      $(".place-navigation [data-place='" + this.sceneId + "']")?.focus({
        preventScroll: true,
      });
    }
    renderWardrobe() {
      const active = this.store.data.outfit;
      const intro = make("p", {}, CONTENT.outfits[active].description);
      const strip = make("div", {
        id: "outfitOptions",
        class: "outfit-options",
        "aria-label": "五套日常衣服",
      });
      for (const [id, outfit] of Object.entries(CONTENT.outfits)) {
        const choice = button("", {
          "data-outfit": id,
          "aria-pressed": String(id === active),
          "aria-label": "换上" + outfit.name,
        });
        choice.append(
          make("img", {
            src: imageFile(id, "standing-neutral", "720"),
            alt: "",
            loading: "lazy",
            width: "160",
            height: "224",
          }),
          make("span", {}, outfit.name),
        );
        strip.append(choice);
      }
      this.panelBody.replaceChildren(
        intro,
        strip,
        button("陪她认真选一件", {
          "data-action": "wardrobe-story",
          class: "subtle-action",
        }),
      );
      this.keepSelectionVisible(
        strip,
        strip.querySelector('[aria-pressed="true"]'),
      );
      if (this.storyMode === "wardrobe") this.renderWardrobeStory();
    }
    async changeOutfit(id) {
      if (!CONTENT.outfits[id]) return;
      this.interactionToken++;
      this.sound.stopVoice(false);
      this.busy = true;
      const token = ++this.navigationToken;
      const ok = await this.director.show(this.sceneId, this.pose, id);
      if (!ok || token !== this.navigationToken) {
        if (token === this.navigationToken) {
          this.busy = false;
          this.retryImage = () => this.changeOutfit(id);
        }
        return;
      }
      this.store.data.outfit = id;
      this.store.data.lastOutfitMemory = {
        outfit: id,
        rememberedAt: Date.now(),
      };
      if (this.storyMode === "wardrobe") {
        const progress = this.store.data.episodeProgress.wardrobe;
        progress.choices.outfit = id;
        progress.step = 2;
        progress.updatedAt = Date.now();
      }
      this.store.save();
      this.busy = false;
      this.renderWardrobe();
      this.perform("outfit-" + id, { fx: "wardrobe-sleeve-rustle" });
    }
    startWardrobeStory() {
      this.storyMode = "wardrobe";
      const saved = this.store.data.episodeProgress.wardrobe;
      if (!saved || saved.completedAt)
        this.store.data.episodeProgress.wardrobe = {
          step: 0,
          choices: {},
          updatedAt: Date.now(),
        };
      this.store.save();
      this.openPanel("wardrobe");
      this.renderWardrobeStory();
      this.perform("wardrobe-compare");
    }
    renderWardrobeStory() {
      $("#wardrobeStory")?.remove();
      const progress = this.store.data.episodeProgress.wardrobe;
      const box = make("section", {
        id: "wardrobeStory",
        class: "little-story",
      });
      if (progress.step === 0)
        box.append(
          make("h3", {}, "今天，想怎么帮她挑？"),
          this.choices("wardrobe-priority", {
            comfort: "先看穿着舒不舒服",
            color: "认真比一比颜色",
          }),
        );
      else if (progress.step === 1)
        box.append(
          make("p", {}, E.ui.wardrobePriorities[progress.choices.priority]),
          make(
            "p",
            { class: "small-note" },
            "上面五套都可以试。她会把选中的衣服穿去房间的每一个角落。",
          ),
        );
      else if (progress.step === 2)
        box.append(
          make("h3", {}, "选好了，也说一句具体的话吧。"),
          this.choices("wardrobe-comment", E.ui.wardrobeComments),
        );
      else
        box.append(
          make(
            "p",
            {},
            "她没有急着换回去。你认真说过的那一句，也被收进了今天。",
          ),
        );
      this.panelBody.append(box);
    }
    renderGallery() {
      const item = CONTENT.gallery[this.store.data.galleryIndex];
      const image = make("img", {
        id: "galleryImage",
        src: item.small,
        alt: item.alt,
        width: "720",
        height: "540",
      });
      const figure = make(
        "figure",
        { class: "gallery-figure" },
        button("", {
          id: "openGalleryViewer",
          "aria-label": "放大查看" + item.title,
        }),
        make(
          "figcaption",
          {},
          make("h3", {}, item.title),
          make(
            "details",
            {},
            make("summary", {}, "听听这张画背后的小事"),
            make("p", {}, item.note),
          ),
        ),
      );
      figure.firstChild.append(image);
      const controls = make(
        "div",
        { class: "gallery-controls" },
        button("上一张", { id: "galleryPrev", "aria-label": "上一张画稿" }),
        make(
          "span",
          {},
          this.store.data.galleryIndex + 1 + " / " + CONTENT.gallery.length,
        ),
        button("下一张", { id: "galleryNext", "aria-label": "下一张画稿" }),
      );
      const strip = make("div", {
        id: "galleryStrip",
        class: "gallery-strip",
        "aria-label": "画册中的十一张画",
      });
      CONTENT.gallery.forEach((entry, index) => {
        const node = button("", {
          "data-gallery-index": index,
          "aria-label": entry.title,
          "aria-pressed": String(index === this.store.data.galleryIndex),
        });
        node.append(
          make("img", {
            src: entry.thumb,
            alt: "",
            width: "120",
            height: "90",
            loading: "lazy",
          }),
        );
        strip.append(node);
      });
      this.panelBody.replaceChildren(
        figure,
        controls,
        strip,
        button("这张画，我想多说一点", {
          "data-action": "gallery-story",
          class: "subtle-action",
        }),
      );
      this.panelBody.scrollTop = 0;
      this.keepSelectionVisible(
        strip,
        strip.querySelector('[aria-pressed="true"]'),
      );
      if (this.storyMode === "gallery") this.renderGalleryStory();
    }
    async changeGallery(value, { absolute = false, speak = true } = {}) {
      const index = absolute
        ? value
        : (this.store.data.galleryIndex + value + CONTENT.gallery.length) %
          CONTENT.gallery.length;
      this.store.data.galleryIndex = clamp(
        index,
        0,
        CONTENT.gallery.length - 1,
      );
      this.store.save();
      this.renderGallery();
      if (speak)
        this.perform("gallery-turn", {
          pose: "reading-peek",
          fx: "gallery-page-turn",
        });
      if (!lowData())
        for (const step of [-1, 1])
          this.assets.prime(
            CONTENT.gallery[
              (index + step + CONTENT.gallery.length) % CONTENT.gallery.length
            ].small,
          );
    }
    startGalleryStory() {
      this.storyMode = "gallery";
      const saved = this.store.data.episodeProgress.gallery;
      if (!saved || saved.completedAt)
        this.store.data.episodeProgress.gallery = {
          step: 0,
          choices: { index: this.store.data.galleryIndex },
          updatedAt: Date.now(),
        };
      this.store.save();
      this.renderGallery();
      this.perform("gallery-favorite", { pose: "reading-peek" });
    }
    renderGalleryStory() {
      $("#galleryStory")?.remove();
      const progress = this.store.data.episodeProgress.gallery;
      const box = make("section", {
        id: "galleryStory",
        class: "little-story",
      });
      if (progress.step === 0)
        box.append(
          make("h3", {}, "你最先注意到哪里？"),
          this.choices("gallery-detail", {
            lines: "线条里的认真",
            expression: "人物的眼神",
            color: "柔软的配色",
          }),
        );
      else if (progress.step === 1)
        box.append(
          make("p", {}, E.ui.galleryDetails[progress.choices.detail]),
          this.choices("gallery-thought", {
            ask: "问她这一页的故事",
            favorite: "告诉她：我喜欢这一页",
          }),
        );
      else
        box.append(
          make("p", {}, E.ui.galleryThoughts[progress.choices.thought]),
          make(
            "p",
            { class: "small-note" },
            CONTENT.gallery[progress.choices.index].note,
          ),
        );
      this.panelBody.append(box);
    }
    choices(kind, options) {
      return make(
        "div",
        { class: "story-choices" },
        Object.entries(options).map(([value, item]) => {
          const label = typeof item === "string" ? item : item.label;
          const b = button("", {
            "data-choice-kind": kind,
            "data-choice-value": value,
          });
          if (["presence", "subject", "palette", "praise"].includes(kind)) {
            const selected =
              this.store.data.drawingDraft?.choices[kind] === value;
            b.setAttribute("aria-pressed", String(selected));
            if (kind === "subject")
              b.append(
                make("img", {
                  class: "subject-sketch",
                  src: this.artInfo({
                    subject: value,
                    artVersion: this.store.data.drawingDraft?.artVersion,
                  }).thumb,
                  alt: "",
                  width: "120",
                  height: "90",
                  loading: "lazy",
                }),
              );
            if (kind === "palette") {
              const swatch = make("span", {
                class: "swatch",
                "aria-hidden": "true",
              });
              for (const color of E.drawingPaletteSwatches[value]) {
                const chip = make("i");
                chip.style.backgroundColor = color;
                swatch.append(chip);
              }
              b.append(swatch);
            }
            if (selected)
              b.append(make("small", { class: "choice-mark" }, "已选"));
          }
          b.append(make("span", {}, label));
          if (item.detail) b.append(make("small", {}, item.detail));
          return b;
        }),
      );
    }
    startDrawing(restart = false) {
      if (!this.store.data.drawingDraft || restart)
        this.store.data.drawingDraft = {
          choices: {},
          artVersion: "v20",
          step: 0,
          mode: "choices",
          quietElapsedMs: 0,
          peekCount: 0,
          responses: [],
          updatedAt: Date.now(),
        };
      this.drawingActive = true;
      this.quietLast = performance.now();
      this.lastQuietBeat = -1;
      this.store.save();
      this.renderDrawing();
    }
    renderDrawing() {
      this.panelFooter.querySelector(".drawing-tools")?.remove();
      const draft = this.store.data.drawingDraft;
      this.peekSequence = (this.peekSequence || 0) + 1;
      this.drawingPeekState = draft?.step >= 3 ? "revealed" : "covered";
      this.drawingListenCue = null;
      this.panelBody.replaceChildren();
      this.updateDrawingBoard();
      if (draft && !this.drawingActive) {
        this.panelBody.append(
          make("p", {}, "上次那张还没画完的稿子，她一直留着。"),
          button("接着上次没画完的地方", {
            id: "drawingResume",
            class: "subtle-action",
          }),
          button("换一张空白稿纸", { id: "drawingRestart" }),
        );
        return;
      }
      if (!draft) {
        this.startDrawing(false);
        return;
      }
      if (draft.step === 0)
        this.panelBody.append(
          make("p", { class: "story-intro" }, E.episodes.drawing.intro),
        );
      if (draft.mode === "quiet") {
        const elapsed = numberOr(draft.quietElapsedMs, 0);
        const status = make(
          "p",
          { id: "quietStatus", "data-elapsed": elapsed },
          E.ui.quietLine,
        );
        this.panelBody.append(
          make("h3", { id: "quietBeatTitle" }, "她重新握住了笔。"),
          status,
          make(
            "ol",
            {
              id: "quietBeats",
              class: "quiet-beats",
              "aria-label": "这段安静的陪伴",
            },
            CONTENT.drawingStory.quietBeats.map((beat) =>
              make("li", {}, beat.title),
            ),
          ),
          make(
            "p",
            { class: "small-note" },
            "只在你留在这里、页面看得见时记住这段安静。",
          ),
        );
        this.appendDrawingTools();
        this.quietLast = performance.now();
        this.renderQuietBeat(true);
        return;
      }
      const kinds = ["presence", "subject", "palette", "praise"];
      const groups = [
        CONTENT.drawingStory.presence,
        CONTENT.drawingStory.subjects,
        CONTENT.drawingStory.palettes,
        CONTENT.drawingStory.praises,
      ];
      const titles = [
        "你想怎样陪着她？",
        "先画一只怎样的小猫？",
        "这张画，染上哪一种颜色？",
        "你最喜欢画里的哪一点？",
      ];
      this.panelBody.append(make("h3", {}, titles[draft.step]));
      const stage = E.drawingStages[draft.step];
      this.panelBody.append(
        make(
          "p",
          { id: "drawingStageNote", class: "drawing-stage-note" },
          stage.title +
            "。" +
            (draft.step === 2 && draft.choices.subject
              ? CONTENT.drawingStory.subjects[draft.choices.subject].stageNote
              : stage.note),
        ),
      );
      const workspace = make("div", { class: "drawing-workspace" });
      if (draft.choices.subject)
        workspace.append(
          this.artwork(
            { ...draft.choices, artVersion: draft.artVersion },
            false,
          ),
        );
      workspace.append(this.choices(kinds[draft.step], groups[draft.step]));
      this.panelBody.append(workspace);
      if (draft.step === 3)
        this.panelBody.append(
          button("听听她想问什么", {
            "data-action": "feedback-ask",
            class: "subtle-action",
          }),
        );
      if (draft.step > 0)
        this.panelBody.append(
          button("回到上一个选择", {
            "data-action": "drawing-back",
            class: "subtle-action",
          }),
        );
      this.appendDrawingTools();
    }
    chooseStory(kind, value) {
      const now = Date.now();
      if (kind === "wardrobe-priority") {
        const p = this.store.data.episodeProgress.wardrobe;
        p.choices.priority = value;
        p.step = 1;
        p.updatedAt = now;
        this.store.save();
        this.renderWardrobeStory();
        this.caption(E.ui.wardrobePriorities[value]);
        return;
      }
      if (kind === "wardrobe-comment") {
        const p = this.store.data.episodeProgress.wardrobe;
        p.choices.comment = value;
        p.step = 3;
        p.updatedAt = now;
        p.completedAt = now;
        this.store.remember(
          "wardrobe",
          "你选了" +
            CONTENT.outfits[this.store.data.outfit].name +
            "，还认真说：“" +
            E.ui.wardrobeComments[value] +
            "。”",
          "wardrobe-story",
        );
        this.renderWardrobeStory();
        this.perform("praise-received");
        return;
      }
      if (kind === "gallery-detail") {
        const p = this.store.data.episodeProgress.gallery;
        p.choices.detail = value;
        p.choices.index = this.store.data.galleryIndex;
        p.step = 1;
        p.updatedAt = now;
        this.store.save();
        this.renderGalleryStory();
        this.caption(E.ui.galleryDetails[value]);
        return;
      }
      if (kind === "gallery-thought") {
        const p = this.store.data.episodeProgress.gallery;
        p.choices.index = this.store.data.galleryIndex;
        p.choices.thought = value;
        p.step = 2;
        p.updatedAt = now;
        p.completedAt = now;
        if (value === "favorite")
          this.store.data.galleryFavorite = {
            id: CONTENT.gallery[p.choices.index].id,
            index: p.choices.index,
            detail: p.choices.detail,
            updatedAt: now,
          };
        this.store.remember(
          "desk",
          "你认真看过“" +
            CONTENT.gallery[p.choices.index].title +
            "”，也说出了喜欢的细节。",
          "gallery-story",
        );
        this.renderGalleryStory();
        this.perform("praise-received", { pose: "reading-peek" });
        return;
      }
      const draft = this.store.data.drawingDraft;
      if (!draft) return;
      const map = {
        presence: CONTENT.drawingStory.presence,
        subject: CONTENT.drawingStory.subjects,
        palette: CONTENT.drawingStory.palettes,
        praise: CONTENT.drawingStory.praises,
      };
      if (!map[kind]?.[value]) return;
      draft.choices[kind] = value;
      draft.updatedAt = now;
      const option = map[kind][value];
      if (!Array.isArray(draft.responses)) draft.responses = [];
      draft.responses.push({ kind, value });
      draft.responses = draft.responses.slice(-16);
      if (kind === "presence") {
        draft.step = 1;
        if (value === "quiet") {
          draft.mode = "quiet";
          this.quietLast = performance.now();
        }
        this.store.save();
        this.renderDrawing();
        this.respondToDrawing(option.line, {
          pose: value === "distance" ? "desk-shy" : "desk-focus",
        });
        return;
      }
      if (kind === "subject") {
        draft.step = 2;
        this.store.save();
        this.renderDrawing();
        this.respondToDrawing(option.line, { fx: "drawing-stylus-line" });
        return;
      }
      if (kind === "palette") {
        draft.step = 3;
        this.store.save();
        this.renderDrawing();
        this.respondToDrawing(option.line, { fx: "gallery-photo-slide" });
        return;
      }
      this.completeDrawing();
    }
    restingPose() {
      if (this.panelId === "gallery") return "reading-peek";
      if (this.panelId === "goodnight") return "bed-sleepy";
      const draft = this.store.data.drawingDraft;
      if (this.panelId === "drawing" && draft?.mode === "quiet") {
        const beat = CONTENT.drawingStory.quietBeats.findLast(
          (item) => draft.quietElapsedMs >= item.at,
        );
        return beat?.frame === "shy" ? "desk-shy" : "desk-focus";
      }
      return E.scenes[this.sceneId].pose;
    }
    async respondToDrawing(line, { pose = "desk-shy", fx } = {}) {
      this.caption(line);
      const token = this.interactionToken;
      this.busy = true;
      this.invite.hidden = true;
      this.stage.dataset.voiceState = "text";
      $("#voiceStatus").hidden = false;
      $("#voiceStatus").textContent = "文字回应";
      if (fx) this.sound.playEffect(CONTENT.cinematicFoley[fx]?.file || fx);
      await this.director.show(this.sceneId, pose, this.store.data.outfit);
      if (!this.still()) await wait(700);
      if (token !== this.interactionToken) return;
      this.busy = false;
      this.pose = this.restingPose();
      await this.director.show(this.sceneId, this.pose, this.store.data.outfit);
      this.scheduleIdle();
    }
    appendDrawingTools() {
      this.panelFooter.querySelector(".drawing-tools")?.remove();
      const toolsRow = make("div", { class: "choice-row drawing-tools" });
      const currentDraft = this.store.data.drawingDraft;
      if (currentDraft?.mode === "quiet")
        toolsRow.append(
          button("现在继续一起画", {
            id: "quietContinue",
            class: "subtle-action",
          }),
          button("回到刚才那一步", { id: "quietBack" }),
        );
      else if (currentDraft?.choices.subject)
        toolsRow.append(
          button("偷看画到哪里了", {
            id: "peekDraft",
            "aria-controls": "draftPreview",
            "aria-expanded": String(this.drawingPeekState === "revealed"),
          }),
        );
      toolsRow.append(
        button(E.drawingCopy.voice, {
          id: "drawingListen",
          class: "subtle-action",
        }),
        button(E.drawingCopy.pause, { id: "pauseDrawing" }),
      );
      this.panelFooter.prepend(toolsRow);
      const draft =
        this.store.data.drawingDraft || this.store.data.sharedDrawing;
      if (!draft) return;
      const groups = {
        presence: CONTENT.drawingStory.presence,
        subject: CONTENT.drawingStory.subjects,
        palette: CONTENT.drawingStory.palettes,
        praise: CONTENT.drawingStory.praises,
      };
      const choices = draft.choices || draft;
      const responses = Array.isArray(draft.responses)
        ? draft.responses
        : Object.entries(choices)
            .filter(([kind]) => groups[kind])
            .map(([kind, value]) => ({ kind, value }));
      const log = make(
        "details",
        { id: "drawingResponseLog", class: "drawing-response-log" },
        make("summary", {}, E.drawingCopy.log),
      );
      for (const { kind, value } of responses) {
        const option =
          kind === "peek"
            ? CONTENT.drawingStory.peekReactions[value]
            : groups[kind]?.[value];
        if (option)
          log.append(
            make(
              "p",
              {},
              (option.label || "偷看画稿") +
                "：“" +
                (option.line || option.text) +
                "”",
            ),
          );
      }
      if (log.children.length > 1) this.panelBody.append(log);
    }
    renderQuietBeat(force = false) {
      const draft = this.store.data.drawingDraft;
      if (!draft || draft.mode !== "quiet" || !$("#quietStatus")) return;
      const index = CONTENT.drawingStory.quietBeats.findLastIndex(
        (beat) => draft.quietElapsedMs >= beat.at,
      );
      if (!force && index === this.lastQuietBeat) return;
      this.lastQuietBeat = index;
      const beat = CONTENT.drawingStory.quietBeats[index];
      $("#quietBeatTitle").textContent = beat?.title || "她重新握住了笔。";
      $("#quietStatus").textContent = beat?.line || E.ui.quietLine;
      $("#quietStatus").dataset.elapsed = String(
        Math.floor(draft.quietElapsedMs),
      );
      $("#quietStatus").dataset.beat = String(index);
      for (const [i, node] of [...$("#quietBeats").children].entries()) {
        node.dataset.reached = String(i <= index);
        node.setAttribute("aria-current", i === index ? "step" : "false");
      }
      if ((force || !this.still()) && !this.busy && !document.hidden) {
        this.pose = beat?.frame === "shy" ? "desk-shy" : "desk-focus";
        this.director.show("desk", this.pose, this.store.data.outfit);
      }
    }
    artInfo(choices) {
      if (!choices?.subject) return null;
      const subject = CONTENT.drawingStory.subjects[choices.subject];
      if (choices.artVersion === "v18") return subject;
      return {
        ...subject,
        ...E.artworks[choices.subject]?.[choices.palette || "strawberry"],
      };
    }
    drawingBoardState() {
      const current = this.director?.current;
      const draft = this.store.data.drawingDraft;
      const choices = draft
        ? { ...draft.choices, artVersion: draft.artVersion }
        : this.store.data.sharedDrawing;
      return {
        visible: current?.sceneId === "desk" && current.pose.startsWith("desk"),
        aspect: current?.aspect || 1062 / 1481,
        size: smallScreen() ? "720" : "1440",
        artwork: this.artInfo(choices)?.small || "",
        paperState:
          this.panelId === "drawing" && draft
            ? this.drawingPeekState || "covered"
            : "revealed",
      };
    }
    updateDrawingBoard() {
      this.drawingBoard?.update(this.drawingBoardState());
    }
    artwork(choices, completed) {
      const subject = this.artInfo(choices);
      if (!subject) return make("span");
      const figure = make(
        "figure",
        {
          class:
            "shared-art palette-" +
            (choices.palette || "strawberry") +
            (choices.artVersion === "v18" ? " is-legacy" : ""),
          id: completed ? "sharedDrawing" : "draftPreview",
        },
        make(
          "div",
          { class: "art-tint" },
          make("img", {
            src: subject.small,
            alt: subject.alt,
            width: "720",
            height: "540",
            loading: "lazy",
          }),
        ),
        make(
          "figcaption",
          {},
          subject.label,
          choices.palette
            ? " · " + CONTENT.drawingStory.palettes[choices.palette].label
            : "",
        ),
      );
      if (!completed && this.panelId === "drawing") {
        figure.classList.add("draft-paper");
        figure.dataset.peekState = this.drawingPeekState || "covered";
        figure
          .querySelector(".art-tint")
          .append(
            make(
              "div",
              { id: "draftCover", class: "draft-cover", "aria-hidden": "true" },
              make("span", {}, "先不许偷看。"),
            ),
          );
        figure.append(
          make(
            "p",
            { class: "draft-hint" },
            figure.dataset.peekState === "revealed"
              ? "这次，可以认真看看了。"
              : E.drawingCopy.covered,
          ),
        );
      }
      return figure;
    }
    completeDrawing() {
      const d = this.store.data,
        draft = d.drawingDraft;
      if (
        !draft ||
        !["presence", "subject", "palette", "praise"].every(
          (key) => draft.choices[key],
        )
      )
        return;
      const drawing = {
        ...draft.choices,
        artVersion: draft.artVersion,
        completedAt: Date.now(),
        responses: Array.isArray(draft.responses)
          ? draft.responses.slice(-16)
          : [],
      };
      d.sharedDrawing = drawing;
      d.sharedDrawings.push(drawing);
      d.drawingDraft = null;
      this.store.save();
      this.panelBody.replaceChildren(
        make("h3", {}, "画好了。先给你看。"),
        make(
          "div",
          { class: "choice-row" },
          button("把这张画放大看看", { id: "openSharedDrawing" }),
          button("再画一张", { id: "drawingRestart", class: "subtle-action" }),
        ),
        this.artwork(drawing, true),
        make(
          "p",
          {},
          "你说：“" +
            CONTENT.drawingStory.praises[drawing.praise].memory +
            "。”她把这句话记在了背面。",
        ),
      );
      this.panelBody.scrollTop = 0;
      $("#sharedDrawing").classList.add("is-revealed");
      this.panelBody.prepend(
        make(
          "p",
          { id: "drawingStageNote", class: "drawing-stage-note" },
          E.drawingCopy.reveal,
        ),
      );
      this.panelBody.append(
        make(
          "p",
          { id: "drawingMemoryText", class: "drawing-memory-text" },
          this.drawingMemoryText(drawing),
        ),
      );
      this.appendDrawingTools();
      this.updateDrawingBoard();
      this.renderMemoryPin();
      this.drawingListenCue = "artwork-reveal";
      this.respondToDrawing(CONTENT.drawingStory.praises[drawing.praise].line, {
        pose: "desk-shy",
        fx: "drawing-sheet-push",
      });
    }
    async peek() {
      const draft = this.store.data.drawingDraft;
      const paper = $(".draft-paper");
      if (!draft || !paper) return;
      draft.peekCount = Math.min(3, (draft.peekCount || 0) + 1);
      draft.updatedAt = Date.now();
      const index = draft.peekCount - 1,
        reaction = CONTENT.drawingStory.peekReactions[index];
      $("#drawingResponseLog")?.append(
        make("p", {}, reaction.label + "：“" + reaction.text + "”"),
      );
      if (!Array.isArray(draft.responses)) draft.responses = [];
      draft.responses.push({ kind: "peek", value: index });
      draft.responses = draft.responses.slice(-16);
      this.store.save();
      this.drawingListenCue = [
        "draft-noticed",
        "drawing-peek-again",
        "drawing-you-are-there",
      ][index];
      this.respondToDrawing(reaction.text, {
        pose: "desk-shy",
        fx: "drawing-paper-cover",
      });
      const sequence = (this.peekSequence = (this.peekSequence || 0) + 1);
      const set = (state) => {
        if (
          sequence !== this.peekSequence ||
          !paper.isConnected ||
          this.panelId !== "drawing" ||
          draft !== this.store.data.drawingDraft
        )
          return false;
        paper.dataset.peekState = state;
        this.drawingPeekState = state;
        this.updateDrawingBoard();
        paper.querySelector(".draft-hint").textContent =
          state === "caught"
            ? E.drawingCopy.caught
            : state === "corner"
              ? E.drawingCopy.corner
              : reaction.label;
        $("#peekDraft")?.setAttribute(
          "aria-expanded",
          String(state !== "caught" && state !== "covered"),
        );
        return true;
      };
      if (this.still()) {
        set("corner");
        return;
      }
      if (!set("reveal")) return;
      await wait(260);
      if (!set("caught")) return;
      await wait(360);
      set("corner");
    }
    accumulateQuiet() {
      const now = performance.now(),
        draft = this.store.data.drawingDraft;
      if (
        draft?.mode === "quiet" &&
        this.panelId === "drawing" &&
        this.drawingActive &&
        this.inView &&
        !document.hidden
      ) {
        draft.quietElapsedMs = clamp(
          numberOr(draft.quietElapsedMs, 0) +
            Math.min(2000, now - this.quietLast),
          0,
          75000,
        );
        draft.updatedAt = Date.now();
        this.store.save();
        const status = $("#quietStatus");
        if (status) {
          status.dataset.elapsed = String(Math.floor(draft.quietElapsedMs));
          this.renderQuietBeat();
        }
      }
      this.quietLast = now;
    }
    renderSecrets() {
      const list = make("div", {
        id: "secretObjects",
        class: "secret-objects",
      });
      for (const [id, secret] of Object.entries(CONTENT.secrets))
        list.append(
          button(secret.label, {
            "data-secret": id,
            "aria-pressed": String(this.store.data.secrets.includes(id)),
          }),
        );
      this.panelBody.replaceChildren(
        make(
          "p",
          {},
          "抽屉和画桌上收着一些小东西。你可以一件一件听她说，不用着急。",
        ),
        list,
        make("p", { id: "secretDetail" }, "选一件你想了解的小东西。"),
        make(
          "blockquote",
          { id: "secretMessage", hidden: this.store.data.secrets.length < 5 },
          E.ui.secretClosing,
        ),
      );
    }
    discover(id) {
      const item = CONTENT.secrets[id];
      if (!item) return;
      if (!this.store.data.secrets.includes(id))
        this.store.data.secrets.push(id);
      this.store.remember(
        this.sceneId,
        "你认真看过她收好的" + item.label + "。",
        "secret-" + id,
      );
      this.renderSecrets();
      $("#secretDetail").textContent =
        id === "drawer"
          ? "钥匙在薄荷色铅笔盒下面。她愿意和你一起打开，里面是一张认真收好的留言。"
          : item.text;
      const mapping = {
        tablet: ["room-pen-tip", "room-stylus-glide"],
        headphones: ["secrets-headphones", "secrets-headphones-set"],
        manuscript: ["secrets-draft", "secrets-paper-lift"],
        plush: ["bed-plush", "goodnight-plush-squeeze"],
        drawer: ["secrets-drawer", "secrets-drawer-latch"],
      };
      const [voice, fx] = mapping[id];
      if (this.voices[voice]) this.perform(voice, { fx });
      else {
        this.sound.playEffect(CONTENT.cinematicFoley[fx].file);
        this.caption($("#secretDetail").textContent);
      }
    }
    renderGoodnight() {
      this.fortune = this.personalFortune();
      this.panelBody.replaceChildren(
        make(
          "p",
          {},
          "今天的拜访，可以慢慢收好了。纸条写给真正发生过的这一刻。",
        ),
        make("blockquote", { id: "fortuneText" }, this.fortune),
        make(
          "div",
          { class: "choice-row" },
          button("再抽一张", { id: "nextFortune" }),
          button("复制纸条文字", { id: "copyFortune" }),
        ),
        button("听她说晚安", { id: "goodnightVoice", class: "subtle-action" }),
        button("收下纸条，轻轻带上门", {
          id: "keepFortune",
          class: "finish-action",
        }),
      );
    }
    personalFortune() {
      const d = this.store.data,
        start = d.lastVisitAt || 0;
      if (d.sharedDrawing?.completedAt >= start)
        return (
          "今天一起画的“" +
          CONTENT.drawingStory.subjects[d.sharedDrawing.subject].label +
          "”，已经好好保存了。明天……也可以来。"
        );
      if (d.lastEvent?.at >= start)
        return d.lastEvent.text + " 谢谢你今天没有急着离开。";
      if (d.lastOutfitMemory?.rememberedAt >= start)
        return (
          "今天选的" +
          CONTENT.outfits[d.lastOutfitMemory.outfit].name +
          "，我会再穿一会儿。晚安。"
        );
      return (
        d.keptFortune ||
        CONTENT.fortunes[Math.floor(Math.random() * CONTENT.fortunes.length)]
      );
    }
    nextFortune() {
      const choices = CONTENT.fortunes.filter((line) => line !== this.fortune);
      this.fortune = choices[Math.floor(Math.random() * choices.length)];
      $("#fortuneText").textContent = this.fortune;
      this.sound.playEffect(CONTENT.cinematicFoley["gallery-photo-slide"].file);
    }
    async copyFortune() {
      const text = this.fortune || $("#fortuneText")?.textContent || "";
      try {
        await navigator.clipboard.writeText(text);
        $("#copyFortune").textContent = "已经复制好了";
        this.perform("note-kept");
      } catch {
        const area = make(
          "textarea",
          { "aria-label": "复制这张纸条", class: "copy-fallback" },
          text,
        );
        this.panelBody.append(area);
        area.select();
        $("#copyFortune").textContent = "长按或按 Ctrl+C 复制";
      }
    }
    async keepFortune() {
      this.store.data.keptFortune = this.fortune;
      this.store.data.keptFortuneAt = Date.now();
      this.store.save();
      this.sound.stopVoice(false);
      this.sound.playEffect(CONTENT.cinematicFoley["goodnight-latch"].file);
      await this.navigate("room", { speak: false });
      this.sound.environments.forEach((player) => player.pause());
      this.sound.environmentFile = "";
      this.stage.classList.add("visit-ended");
      this.caption(E.ui.closedLine);
      this.forceNight = false;
    }
    renderMemoryPin() {
      const drawing = this.store.data.sharedDrawing;
      this.memoryPin.hidden = !drawing;
      if (drawing)
        this.memoryPin.replaceChildren(
          make("img", {
            src: this.artInfo(drawing).thumb,
            alt:
              "上次一起画的" +
              CONTENT.drawingStory.subjects[drawing.subject].label,
            loading: "lazy",
          }),
          make("span", {}, "上次那张，还在这里"),
        );
    }
    drawingMemoryText(drawing) {
      const data = CONTENT.drawingStory;
      return (
        "你" +
        data.presence[drawing.presence].memory +
        "，一起选了“" +
        data.subjects[drawing.subject].label +
        "”和" +
        data.palettes[drawing.palette].label +
        "。你说“" +
        data.praises[drawing.praise].memory +
        "”，她还记得。"
      );
    }
    renderMemories() {
      const drawings = this.store.data.sharedDrawings;
      this.panelBody.replaceChildren(
        make(
          "p",
          {},
          drawings.length ? "这些画，都是一起认真选出来的。" : E.ui.noMemory,
        ),
      );
      for (const drawing of [...drawings].reverse()) {
        const figure = this.artwork(drawing, false);
        figure.removeAttribute("id");
        figure
          .querySelector("figcaption")
          .append(
            make(
              "small",
              { class: "drawing-date" },
              new Date(drawing.completedAt).toLocaleDateString("zh-CN"),
            ),
          );
        this.panelBody.append(
          figure,
          make(
            "p",
            { class: "drawing-memory-text" },
            this.drawingMemoryText(drawing),
          ),
        );
      }
    }
    activity() {
      document.documentElement.dataset.idleRest = "false";
      this.idleSequence = (this.idleSequence || 0) + 1;
      this.lastActivity = performance.now();
      this.autonomousCount = 0;
      clearTimeout(this.idleTimer);
      this.scheduleIdle();
    }
    scheduleIdle() {
      clearTimeout(this.idleTimer);
      if (
        this.still() ||
        lowData() ||
        document.hidden ||
        !this.inView ||
        this.autonomousCount >= 3
      )
        return;
      this.idleTimer = setTimeout(
        async () => {
          if (
            this.busy ||
            this.inspector.dialog?.open ||
            this.panelId === "gallery" ||
            this.panelId === "goodnight"
          ) {
            this.scheduleIdle();
            return;
          }
          const pose =
            this.sceneId === "desk"
              ? "desk-blink"
              : ["room", "wardrobe", "window"].includes(this.sceneId)
                ? "standing-blink"
                : null;
          if (pose) {
            const token = this.interactionToken;
            const idleSequence = this.idleSequence;
            try {
              await this.assets.load(imageFile(this.store.data.outfit, pose));
            } catch {
              return;
            }
            if (
              this.still() ||
              document.hidden ||
              this.busy ||
              idleSequence !== this.idleSequence ||
              token !== this.interactionToken
            )
              return;
            await this.director.show(
              this.sceneId,
              pose,
              this.store.data.outfit,
            );
            await wait(145);
            if (token === this.interactionToken && !this.busy && !this.still())
              await this.director.show(
                this.sceneId,
                this.pose,
                this.store.data.outfit,
              );
          }
          this.autonomousCount++;
          document.documentElement.dataset.idleRest = String(
            this.autonomousCount >= 3,
          );
          this.scheduleIdle();
        },
        4500 + Math.random() * 3200,
      );
    }
    onTick() {
      this.accumulateQuiet();
      const elapsed = performance.now();
      if (
        !this.entryChosen ||
        this.invitationUsed ||
        document.hidden ||
        !this.inView ||
        this.busy ||
        this.panelId ||
        !this.settings.hidden ||
        this.inspector.dialog?.open
      )
        return;
      if (
        elapsed - this.enteredAt < 30000 ||
        elapsed - this.lastActivity < 8000
      )
        return;
      this.invitationTarget = this.store.data.drawingDraft
        ? "drawing-story"
        : !this.store.data.episodeProgress.wardrobe?.completedAt
          ? "wardrobe-story"
          : !this.store.data.episodeProgress.gallery?.completedAt
            ? "gallery-story"
            : "drawing-story";
      this.invite.hidden = false;
      this.invitationUsed = true;
    }
  }
  const numberOr = (value, fallback) =>
    Number.isFinite(value) ? value : fallback;
  window.sagiriRoom = new RoomApp();
})();
