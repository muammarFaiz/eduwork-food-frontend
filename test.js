const testStr = 'hehe1hh0ee35'
const n = 32498957
const pr = "Rp. 88...9..rz000,,,dsfs33"
// const mod = testStr.replace(/[0-9]/gi, '')
// const mod = n.toLocaleString()
// const result = `Rp. ${mod}`
const mod = pr.replace(/,/gi, 'X')
const state = pr.match(/x/gi)
console.log(state);