# Proxy & Reflect

`part1`我们实现了多个对象的响应式,但是我们任然需要通过 `track`和 `trigger`来手动实现,然而,我们希望我们写的响应式程序能够自动的执行,于是有了这部分内容

## 拦截 `get`和 `set`

实际上当我们运行effect的时候,如果访问了对象的属性,或者说我们使用了 `get`,这正是我们想要去执行 `track`的时机

如果对象的属性改变了,也就是说执行了 `set`方法时,这是我们需要调用 `trigger`来执行effect

所以我们要如何拦截这些get和set方法呢?

### 在Vue2.0x中

使用 `Object.defineProperty()`对对象get和set方法重写,如下所示

```js
const obj = {
  a: 1,
  b: 2,
}

const convert = (obj) => {
  Object.keys(obj).forEach(key => {
    let intervalValue = obj[key]

    Object.defineProperty(obj, key, {
      get() {
        // track 这里以console.log('get!')代替
        console.log('get!')
        return intervalValue
      },
      set(newValue) {
        // trigger 这里以console.log('set!')代替
        console.log('set!')
        intervalValue = newValue
      }
    })
  })
}

convert(obj)

// 调用get
obj.a

// 调用set
obj.a = 3
```

### 在Vue3.0x中

使用Proxy拦截对象

```js
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
```
