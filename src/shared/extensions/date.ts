import "";

declare global {
  interface Date {
    toDotted(): string;
  }
}

Date.prototype.toDotted = function():string {
    let d = this.getDate().toString();
    if(d.length < 2) {
        d = "0" + d;
    }
    let m = (this.getMonth() + 1).toString();
    if(m.length < 2) {
        m = "0" + m;
    }
    return `${d}.${m}.${this.getFullYear()}`;
}
