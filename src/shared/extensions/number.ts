import "";

declare global {
    interface Number {
        pad0(): string, 
    }
}

Number.prototype.pad0 = function():string {
    let pad = this < 10 && this >= 0 ? "" : ""
}