
export default class EsperMutex {
  constructor() {
    this.queue = [];
    this.locked = false;
  }
  lock(routine) {
    if (!this.locked) {
      this.locked = true;
      routine(() => this.unlock());
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