
function C(a) {
    this.a = a;
}

C.prototype.met1 = function met1(x) {
    return this.a + x;
};

function D(a, b) {
    C.call(this, a);
    this.b = b;
}

D.prototype = Object.create(C.prototype);
D.prototype.constructor = D;

D.prototype.met2 = function(y) {
    return this.met1(y) + this.b;
}

const obj1 = new C(10);
const obj2 = new D(10, 20);

console.log(obj1.constructor.name);
console.log(obj1 instanceof C);
console.log(obj1 instanceof D);
console.log(obj2.constructor.name);
console.log(obj2 instanceof C);
console.log(obj2 instanceof D);
console.log(Object.getPrototypeOf(Object.getPrototypeOf(obj2)).constructor.name);
console.log(Object.getPrototypeOf(Object.getPrototypeOf(obj1)).constructor.name);
console.log(obj1.met1(10));
console.log(obj1.met2(10));
console.log(obj2.met2(10));