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