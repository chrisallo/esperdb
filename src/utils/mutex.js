import EsperLog from "./log";

export default class EsperMutex {
  constructor() {
    this.queue = [];
    this.locked = false;
  }
  async lock(routine) {
    if (!this.locked) {
      this.locked = true;
      try {
        await routine(() => this.unlock());
      } catch (e) {
        EsperLog.error(e.message);
        this.unlock();
      }
    } else {
      this.queue.push(routine);
    }
  }
  unlock() {
    if (this.locked) {
      this.locked = false;
      if (this.queue.length > 0) {
        const routine = this.queue.shift();
        this.lock(routine);
      }
    }
  }
}