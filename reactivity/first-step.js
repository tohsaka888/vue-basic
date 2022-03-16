let price = 5
let quantity = 2
let total = 0

// this is the calculate function that we should storge
let calculateTotalPrice = () => {
  total = quantity * price
  console.log(total)
}

// this is where we storage the function
let dep = new Set()

// We store it by calling tack
const track = () => {
  dep.add(calculateTotalPrice)
}
// run trigger that we will run all the code i have saved

const trigger = () => {
  Array.from(dep).forEach(effect => effect())
}

track()
trigger()

quantity = 10
trigger()