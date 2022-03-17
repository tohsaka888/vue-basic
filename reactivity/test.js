const targetMap = new WeakMap()

// 添加副作用
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

// 执行副作用
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

let person1 = {
  name: 'sdd',
  age: 20
}

let person2 = {
  name: 'lhc',
  age: 20
}

const effect = () => {
  console.log(person1.name, person1.age)
  console.log(person2.name, person2.age)
}

track(person1, 'name')
track(person1, 'age')
track(person2, 'name')
track(person2, 'age')

person1.age = 22
person2.age = 24

trigger(person1, 'age')
trigger(person2, 'age')
