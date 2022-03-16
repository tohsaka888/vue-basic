const depsMap = new Map()

function track(key, effect) {
  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, dep = new Set())
  }

  dep.add(effect)
}

function trigger(key) {
  let dep = depsMap.get(key)
  Array.from(dep).forEach(effect => effect())
}

let product = {
  price: 5,
  quantity: 2
}

let total = 0

let effect = () => {
  total = product.price * product.quantity
  console.log(total)
}

track('price', effect)
track('quantity', effect)

trigger('price')