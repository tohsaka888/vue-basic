# 响应式原理

当我们需要响应式更新某个值,首先我们需要编写一个改变该值的函数,之后我们需要将他存储在某个地方,这里我们称它为 `dep`,因此,我们还需要一个存储改变状态函数的函数,我们称它为 `track`,此外,我们还需要一个执行所有存储函数的函数,我们称它为 `trigger`

```js
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
```

> `dep`的数据类型选择使用set时因为,set不允许有重复项,所以存储空间中不会出现重复的effect

通常情况下,我们定义的对象中有多个属性,并且每一个属性都需要它们自己的 `dep`(effect的集合),我们需要在值改变时去执行 `trigger`

## 实现对象响应式

首先我们需要一个地方来存储对象的所有属性,这里我们选用 `map`我们将对象的属性当作键,对象属性对应的effect集合(dep)当作值存储在 `map`中就可以实现了

```js

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
```

## 实现多个对象响应式

想要实现多个对象响应式,我们就需要一个存储多个对象的结构,这里选择的weakMap,我们将整个对象当作键,将其对应的 `depsMap`当作值存储,就可以实现了

> 为什么选用weakMap
>
> 1. weakMap必须对象当作键
> 2. 当weakMap中的值没有被引用,它可以被javaScript当作垃圾回收
>
> [详情可见]()
