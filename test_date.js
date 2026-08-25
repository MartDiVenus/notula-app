const expirationDate = '2026-08-25';
const d = new Date(expirationDate);
console.log("d1:", d.toISOString());
d.setDate(d.getDate() + 1);
console.log("d2:", d.toISOString().split('T')[0]);
