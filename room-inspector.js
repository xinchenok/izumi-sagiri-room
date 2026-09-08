"use strict";

// 观察器只接管自己的视口；页面原生滚动与唯一字幕节点仍由房间持有。
window.RoomInspector = class RoomInspector {
  constructor({ assets, getScene, getGallery, onGalleryStep, getCaption, onClose } = {}) {
    this.assets = assets || new RoomKit.AssetCache();
    this.getScene = getScene || (() => ({}));
    this.getGallery = getGallery || (() => null);
    this.onGalleryStep = onGalleryStep || (() => {});
    this.getCaption = getCaption || (() => document.getElementById("roomDialogue"));
    this.onClose = onClose || (() => {});
    this.sequence = 0;
    this.zoom = 1;
    this.pan = { x: 0, y: 0 };
    this.pointers = new Map();
    this.imageAspect = 1681 / 936;
    this.isOpen = false;
    this.lastVisual = null;
    this.resizeFrame = 0;
    this.dialog = document.createElement("dialog");
    this.dialog.id = "inspectDialog";
    this.dialog.className = "room-inspector";
    this.dialog.setAttribute("aria-labelledby", "inspectTitle");
    this.dialog.innerHTML = `
      <header class="inspect-heading">
        <div><h2 id="inspectTitle">靠近看看</h2><p id="inspectHint">拖动画面，或用滚轮放大；按 Esc 回到房间。</p></div>
        <button id="inspectClose" class="inspect-icon-button" type="button" aria-label="关闭观察，回到房间"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg><span>关闭</span></button>
      </header>
      <div id="inspectViewport" class="inspect-viewport" tabindex="0" aria-label="图片观察区，可拖动、缩放，方向键移动" aria-describedby="inspectHint">
        <div id="inspectPlane" class="inspect-plane" data-zoom="1"></div>
        <p class="inspect-empty" id="inspectEmpty">画面正在慢慢展开。</p>
      </div>
      <div class="inspect-controls">
        <div class="inspect-gallery-controls" id="inspectGalleryControls" hidden>
          <button id="inspectPrevious" type="button" aria-label="查看上一张画"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6"/></svg><span>上一张</span></button>
          <button id="inspectNext" type="button" aria-label="查看下一张画"><span>下一张</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 6 6 6-6 6"/></svg></button>
        </div>
        <label class="inspect-zoom-control" for="inspectZoom"><span>放大</span><input id="inspectZoom" type="range" min="1" max="2" step="0.01" value="1" aria-label="画面缩放比例"><output id="inspectZoomValue" for="inspectZoom">100%</output></label>
        <button id="inspectReset" type="button" aria-label="复位画面位置与缩放">复位</button>
      </div>
      <div class="inspect-status-line"><p id="inspectStatus" role="status" aria-live="polite"></p><button id="inspectRetry" type="button" hidden>重新打开画面</button></div>
      <div class="inspect-feedback" id="inspectFeedback"></div>`;
    document.body.append(this.dialog);
    const find = id => this.dialog.querySelector("#" + id);
    this.viewport = find("inspectViewport");
    this.plane = find("inspectPlane");
    this.title = find("inspectTitle");
    this.empty = find("inspectEmpty");
    this.status = find("inspectStatus");
    this.retryButton = find("inspectRetry");
    this.slider = find("inspectZoom");
    this.zoomValue = find("inspectZoomValue");
    this.galleryControls = find("inspectGalleryControls");
    this.feedback = find("inspectFeedback");
    find("inspectClose").addEventListener("click", () => this.close());
    find("inspectReset").addEventListener("click", () => this.reset());
    find("inspectPrevious").addEventListener("click", () => this.stepGallery(-1));
    find("inspectNext").addEventListener("click", () => this.stepGallery(1));
    this.retryButton.addEventListener("click", () => this.requestVisual());
    this.slider.addEventListener("input", () => this.setZoom(Number(this.slider.value)));
    this.dialog.addEventListener("cancel", event => { event.preventDefault(); this.close(); });
    this.dialog.addEventListener("close", () => { if (!this.dialog.open) this.finishClose(); });
    this.dialog.addEventListener("keydown", event => {
      if (event.key === "Escape") { event.preventDefault(); this.close(); }
    });
    this.viewport.addEventListener("keydown", event => this.handleKey(event));
    this.viewport.addEventListener("wheel", event => {
      event.preventDefault();
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? this.viewport.clientHeight : 1);
      this.setZoom(this.zoom * Math.exp(-delta * 0.002), this.point(event.clientX, event.clientY));
    }, { passive: false });
    this.viewport.addEventListener("dblclick", event => {
      event.preventDefault();
      this.setZoom(this.zoom >= 1.5 ? 1 : 2, this.point(event.clientX, event.clientY));
    });
    this.viewport.addEventListener("pointerdown", event => this.pointerDown(event));
    this.viewport.addEventListener("pointermove", event => this.pointerMove(event));
    for (const name of ["pointerup", "pointercancel", "lostpointercapture"]) {
      this.viewport.addEventListener(name, event => this.pointerEnd(event));
    }
    this.resizeObserver = new ResizeObserver(() => {
      if (!this.isOpen || this.resizeFrame) return;
      this.resizeFrame = requestAnimationFrame(() => { this.resizeFrame = 0; this.fit(); });
    });
    this.resizeObserver.observe(this.viewport);
    this.resizeObserver.observe(this.feedback);
  }

  openScene(opener) {
    this.mode = "scene";
    this.item = null;
    return this.open(opener);
  }

  openGallery(opener) {
    this.mode = "gallery";
    this.item = this.getGallery();
    return this.open(opener);
  }

  openImage(item, opener) {
    this.mode = "image";
    this.item = typeof item === "string" ? { image: item } : item;
    return this.open(opener);
  }

  open(opener) {
    if (!this.isOpen) {
      this.opener = opener instanceof HTMLElement ? opener : document.activeElement;
      this.savedScroll = { x: window.scrollX, y: window.scrollY };
      const root = document.documentElement;
      this.savedStyles = ["overflow", "scroll-behavior"].map(name => ({ name, value: root.style.getPropertyValue(name), priority: root.style.getPropertyPriority(name) }));
      root.style.setProperty("scroll-behavior", "auto", "important");
      this.restoreScroll();
      root.style.setProperty("overflow", "hidden");
      this.caption = this.getCaption();
      if (this.caption?.parentNode) {
        this.captionParent = this.caption.parentNode;
        this.captionNext = this.caption.nextSibling;
        this.captionMarker = document.createComment("room-dialogue-position");
        this.captionParent.insertBefore(this.captionMarker, this.caption);
        this.feedback.append(this.caption);
      }
      this.isOpen = true;
      this.dialog.showModal();
      this.viewport.focus({ preventScroll: true });
    }
    this.galleryControls.hidden = this.mode !== "gallery";
    this.reset();
    return this.requestVisual();
  }

  async stepGallery(direction) {
    if (!this.isOpen || this.mode !== "gallery") return;
    try {
      this.onGalleryStep(direction);
      this.item = this.getGallery();
      this.reset();
      await this.requestVisual();
    } catch {
      this.status.textContent = "这一页暂时没有翻过来。可以再试一次，或先回到房间。";
      this.retryButton.hidden = false;
    }
  }

  async requestVisual() {
    if (!this.isOpen) return false;
    const sequence = ++this.sequence;
    const mode = this.mode;
    const size = RoomKit.smallScreen() ? "1440" : "4k";
    this.retryButton.hidden = true;
    this.status.textContent = "正在把画面拿近一点……";
    this.viewport.setAttribute("aria-busy", "true");
    try {
      let visual;
      if (mode === "scene") {
        const state = this.getScene();
        const scene = { ...state, camera: [...(state.camera || [1, 50, 50])], actor: [...(state.actor || [30, 0, 40, 100])], drawingBoard: state.drawingBoard ? { ...state.drawingBoard, size } : { visible: false } };
        const boardLoads = [];
        if (scene.drawingBoard.visible) {
          const board = CONTENT.roomExperience.drawingBoard;
          boardLoads.push(this.assets.load(size === "4k" ? board.image : board.medium));
          if (scene.drawingBoard.artwork) boardLoads.push(this.assets.load(scene.drawingBoard.artwork));
        }
        const [background, character] = await Promise.all([
          this.assets.load(RoomKit.roomFile(scene.night, size)),
          this.assets.load(RoomKit.imageFile(scene.outfit || "home", scene.pose || "standing-neutral", size)),
          ...boardLoads
        ]);
        visual = { kind: "scene", background, character, scene, title: "看看房间", aspect: background.image.naturalWidth / background.image.naturalHeight };
      } else {
        const item = mode === "gallery" ? this.getGallery() : this.item;
        if (!item) throw new Error("还没有可以打开的画面");
        const url = size === "1440" ? item.medium || item.small || item.image || item.src || item.file : item.image || item.src || item.file || item.medium || item.small;
        if (!url) throw new Error("画面路径暂时没有准备好");
        const loaded = await this.assets.load(url);
        visual = { kind: "image", loaded, title: item.title || "把这张画拿近一点", alt: item.alt || item.title || "纱雾的画稿", aspect: loaded.image.naturalWidth / loaded.image.naturalHeight };
      }
      if (sequence !== this.sequence || !this.isOpen) return false;
      this.lastVisual = visual;
      this.mountVisual(visual);
      this.status.textContent = "可以拖动、放大，慢慢看看细节。";
      this.viewport.setAttribute("aria-busy", "false");
      return true;
    } catch {
      if (sequence !== this.sequence || !this.isOpen) return false;
      this.status.textContent = this.lastVisual ? "新画面暂时没有打开，上一张还在。可以重试，或先回到房间。" : "画面暂时没有打开。她还在这里，可以重试，或先回到房间。";
      this.empty.textContent = "不着急，画面一会儿再看也可以。";
      this.empty.hidden = Boolean(this.lastVisual);
      this.retryButton.hidden = false;
      this.viewport.setAttribute("aria-busy", "false");
      return false;
    }
  }

  mountVisual(visual) {
    const makeImage = (loaded, className, alt) => {
      const image = document.createElement("img");
      image.className = className;
      image.src = loaded.url;
      image.alt = alt;
      image.draggable = false;
      image.decoding = "async";
      return image;
    };
    this.boardRenderer?.destroy();
    this.boardRenderer = null;
    const fragment = document.createDocumentFragment();
    let actorHost = null;
    if (visual.kind === "scene") {
      const scene = visual.scene;
      const background = makeImage(visual.background, "inspect-room-background", "纱雾房间里的家具与窗边光线");
      const actor = makeImage(visual.character, "inspect-room-character", "穿着当前衣服的纱雾");
      actorHost = document.createElement("div");
      actorHost.className = "inspect-actor";
      background.style.transform = "scale(" + scene.camera[0] + ")";
      background.style.transformOrigin = scene.camera[1] + "% " + scene.camera[2] + "%";
      ["left", "top", "width", "height"].forEach((property, index) => { actorHost.style[property] = scene.actor[index] + "%"; });
      actorHost.append(actor);
      fragment.append(background, actorHost);
      this.plane.dataset.scene = scene.sceneId || "room";
    } else {
      fragment.append(makeImage(visual.loaded, "inspect-single-image", visual.alt));
      delete this.plane.dataset.scene;
    }
    this.plane.replaceChildren(fragment);
    this.plane.dataset.kind = visual.kind;
    this.title.textContent = visual.title;
    this.imageAspect = Number.isFinite(visual.aspect) && visual.aspect > 0 ? visual.aspect : 1;
    this.empty.hidden = true;
    this.fit();
    if (actorHost && visual.scene.drawingBoard?.visible) {
      this.boardRenderer = RoomKit.createDrawingBoard(actorHost);
      this.boardRenderer.update({ ...visual.scene.drawingBoard, aspect: visual.scene.drawingBoard.aspect || visual.scene.aspect || visual.character.image.naturalWidth / visual.character.image.naturalHeight });
    }
  }

  point(clientX, clientY) {
    const rect = this.viewport.getBoundingClientRect();
    return { x: clientX - rect.left - rect.width / 2, y: clientY - rect.top - rect.height / 2 };
  }

  fit() {
    if (!this.isOpen) return;
    const width = this.viewport.clientWidth;
    const height = this.viewport.clientHeight;
    if (!width || !height) return;
    this.baseWidth = Math.min(width, height * this.imageAspect);
    this.baseHeight = this.baseWidth / this.imageAspect;
    this.plane.style.width = this.baseWidth + "px";
    this.plane.style.height = this.baseHeight + "px";
    this.renderTransform();
    this.restartGesture();
  }

  bounds() {
    return {
      x: Math.max(0, ((this.baseWidth || 0) * this.zoom - this.viewport.clientWidth) / 2),
      y: Math.max(0, ((this.baseHeight || 0) * this.zoom - this.viewport.clientHeight) / 2)
    };
  }

  renderTransform() {
    const bounds = this.bounds();
    this.pan.x = RoomKit.clamp(this.pan.x, -bounds.x, bounds.x);
    this.pan.y = RoomKit.clamp(this.pan.y, -bounds.y, bounds.y);
    this.plane.style.transform = `translate(-50%, -50%) translate(${this.pan.x}px, ${this.pan.y}px) scale(${this.zoom})`;
    this.plane.dataset.zoom = String(Number(this.zoom.toFixed(4)));
    this.viewport.dataset.zoomed = String(this.zoom > 1.001);
    this.slider.value = String(this.zoom);
    const percent = Math.round(this.zoom * 100) + "%";
    this.zoomValue.textContent = percent;
    this.slider.setAttribute("aria-valuetext", percent);
  }

  defaultZoomAnchor() {
    const visual = this.lastVisual;
    if (this.mode !== "scene" || visual?.kind !== "scene" || visual.scene.sceneId === "window" || !this.baseWidth || !this.baseHeight) return { x: 0, y: 0 };
    const [left, top, width, height] = visual.scene.actor;
    return {
      x: ((left + width * 0.54) / 100 - 0.5) * this.baseWidth * this.zoom + this.pan.x,
      y: ((top + height * 0.27) / 100 - 0.5) * this.baseHeight * this.zoom + this.pan.y
    };
  }

  setZoom(value, anchor = this.defaultZoomAnchor()) {
    const next = RoomKit.clamp(Number.isFinite(value) ? value : 1, 1, 2);
    const ratio = next / this.zoom;
    this.pan.x = anchor.x - (anchor.x - this.pan.x) * ratio;
    this.pan.y = anchor.y - (anchor.y - this.pan.y) * ratio;
    this.zoom = next;
    this.renderTransform();
  }

  reset() {
    this.zoom = 1;
    this.pan = { x: 0, y: 0 };
    this.renderTransform();
    this.restartGesture();
  }

  handleKey(event) {
    const step = event.shiftKey ? 80 : 40;
    const moves = { ArrowLeft: [step, 0], ArrowRight: [-step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] };
    if (moves[event.key]) {
      event.preventDefault();
      this.pan.x += moves[event.key][0]; this.pan.y += moves[event.key][1];
      this.renderTransform();
    } else if (["+", "=", "-", "_", "Home"].includes(event.key)) {
      event.preventDefault();
      if (event.key === "Home") this.reset();
      else this.setZoom(this.zoom + (["+", "="].includes(event.key) ? 0.2 : -0.2));
    }
  }

  pointerDown(event) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.preventDefault();
    this.viewport.focus({ preventScroll: true });
    this.pointers.set(event.pointerId, this.point(event.clientX, event.clientY));
    try { this.viewport.setPointerCapture(event.pointerId); } catch {}
    this.viewport.dataset.dragging = "true";
    this.restartGesture();
  }

  restartGesture() {
    const points = [...this.pointers.values()];
    if (points.length >= 2) {
      this.gesture = { midpoint: { x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2 }, distance: Math.max(1, Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y)), zoom: this.zoom, pan: { ...this.pan } };
    } else this.gesture = points.length === 1 ? { point: { ...points[0] }, pan: { ...this.pan } } : null;
  }

  pointerMove(event) {
    if (!this.pointers.has(event.pointerId)) return;
    event.preventDefault();
    this.pointers.set(event.pointerId, this.point(event.clientX, event.clientY));
    const points = [...this.pointers.values()];
    if (points.length >= 2 && this.gesture?.midpoint) {
      const midpoint = { x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2 };
      const distance = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
      this.zoom = RoomKit.clamp(this.gesture.zoom * distance / this.gesture.distance, 1, 2);
      const ratio = this.zoom / this.gesture.zoom;
      this.pan.x = midpoint.x - (this.gesture.midpoint.x - this.gesture.pan.x) * ratio;
      this.pan.y = midpoint.y - (this.gesture.midpoint.y - this.gesture.pan.y) * ratio;
    } else if (points.length === 1 && this.gesture?.point) {
      this.pan.x = this.gesture.pan.x + points[0].x - this.gesture.point.x;
      this.pan.y = this.gesture.pan.y + points[0].y - this.gesture.point.y;
    }
    this.renderTransform();
  }

  pointerEnd(event) {
    if (!this.pointers.delete(event.pointerId)) return;
    this.viewport.dataset.dragging = String(this.pointers.size > 0);
    this.restartGesture();
  }

  restoreScroll() {
    if (!this.savedScroll) return;
    try { window.scrollTo({ left: this.savedScroll.x, top: this.savedScroll.y, behavior: "instant" }); }
    catch { window.scrollTo(this.savedScroll.x, this.savedScroll.y); }
  }

  close() {
    if (!this.isOpen) return;
    if (this.dialog.open) this.dialog.close();
    this.finishClose();
  }

  finishClose() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.sequence += 1;
    this.pointers.clear(); this.gesture = null;
    this.viewport.dataset.dragging = "false";
    if (this.resizeFrame) cancelAnimationFrame(this.resizeFrame);
    this.resizeFrame = 0;
    if (this.caption) {
      if (this.captionMarker?.parentNode) this.captionMarker.replaceWith(this.caption);
      else if (this.captionParent?.isConnected) this.captionParent.insertBefore(this.caption, this.captionNext?.parentNode === this.captionParent ? this.captionNext : null);
      else document.body.append(this.caption);
    }
    const root = document.documentElement;
    // 先解除滚动锁并复位，再恢复调用方自己的平滑滚动声明。
    const overflow = this.savedStyles?.find(item => item.name === "overflow");
    if (overflow?.value) root.style.setProperty("overflow", overflow.value, overflow.priority);
    else root.style.removeProperty("overflow");
    this.restoreScroll();
    const behavior = this.savedStyles?.find(item => item.name === "scroll-behavior");
    if (behavior?.value) root.style.setProperty("scroll-behavior", behavior.value, behavior.priority);
    else root.style.removeProperty("scroll-behavior");
    if (this.opener?.isConnected) this.opener.focus({ preventScroll: true });
    this.caption = null; this.captionMarker = null;
    this.onClose();
  }
};
