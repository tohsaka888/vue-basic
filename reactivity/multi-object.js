const targetMap = new WeakMap()

function track(target, key) {
  let depsMap = targetMap.get(target)

  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }

  let deps = depsMap.get(key)

  if (!deps) {
    depsMap.set(key, deps = new Set())
  }

  deps.add(effect)
}

function trigger(target, key) {
  const depsMap = targetMap.get(target)
  if (!depsMap) {
    reutrn
  }
  const dep = depsMap.get(key)
  if (!dep) {
    return
  }

  Array.from(dep).forEach(effect => effect())
}

let product = {
  price: 2,
  quantity: 5
}

let total = 0

effect() // 10

function effect() {
  total = product.price * product.quantity
  console.log(total)
}

product.price = 10

track(product, 'price')

trigger(product, 'price') // 50
