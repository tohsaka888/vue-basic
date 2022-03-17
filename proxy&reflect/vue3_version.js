const targetMap = new WeakMap()

function effect() {
  total = product.price * product.quantity
}

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

function reactive(target) {
  const handler = {
    get(target, key, receiver) {
      // Reflect是为了使this正确的指向调用它的对象
      let result = Reflect.get(target, key, receiver)
      track(target, key)
      return result
    },
    // set方法应该返回一个bool值
    set(target, key, value, receiver) {
      let oldValue = target[key]
      let result = Reflect.set(target, key, value, receiver)
      if (oldValue !== value) {
        trigger(target, key)
      }
      return result
    }
  }
  return new Proxy(target, handler)
}

// console.log(proxiedProduct.price)

// console.log(product.price)

const product = reactive({
  price: 5,
  quantity: 2
})


let total = 0

effect()

product.quantity = 3

console.log(total)