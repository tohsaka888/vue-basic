const targetMap = new WeakMap()

const track = (target, key) => {
  let depsMap = targetMap.get(target)

  if (!depsMap) {
    targetMap.set(target, depsMap = new Map())
  }

  let dep = depsMap.get(key)

  if (!dep) {
    depsMap.set(key, dep = new Set())
  }

  dep.add(effect)
}

const trigger = (target, key) => {
  let depsMap = targetMap.get(target)

  if (!depsMap) {
    return
  }

  let dep = depsMap.get(key)

  if (!dep) {
    return
  }

  Array.from(dep).forEach(effect => effect())
}

const reactive = (obj) => {
  const handler = {
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver)
      track(target, key)
      return result
    },
    set(target, key, value, receiver) {
      let preValue = target[key]
      const result = Reflect.set(target, key, value, receiver)
      if (preValue !== value) {
        trigger(target, key)
      }
      return result
    }
  }

  return new Proxy(obj, handler)
}

const product = reactive({
  price: 2,
  quantity: 5
})

let total

const effect = () => {
  // 调用get是track缓存effect
  total = product.quantity * product.price
}

console.log(product.quantity * product.price)

product.price = 10

console.log(total)