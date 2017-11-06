/*
 * @name 文字动画 (实际上是图片啦)
 * @param { Object } options: {
 *                     el: String 元素容器Id,
 *                     row: Number 行数, 默认3
 *                     column: Number 列数, 默认5
 *                     width: Number 宽度, 默认500
 *                     height: Number 高度, 默认300
 *                     data<String>: 数据
 *                   }
 * @authorBy wilson wang
 * @date 2017-11-06
 */
class WordAnimate {
  constructor (options) {
    this.el = document.getElementById(options.el)
    this.data = options.data || []
    this.row = options.row || 3
    this.column = options.column || 5
    this.width = options.width || 500
    this.height = options.height || 300
    this.createCanvas()
  }
  /*
   * @name 获取随机色
   * @return { String } 颜色值
   */
  getRandomColor () {
    return '#' + (Math.random() * 0xffffff << 0).toString(16) 
  }
  /*
   * @name 获取随机数
   * @param { Number } min: 最小值
   * @param { Number } max: 最大值
   * @return { Number } 数字
   */
  getRandomNumber (min, max) {
    return Math.random() * (max - min) + min
  }
  /*
   * @name canvas生成图片
   */
  createCanvas () {

    if (!this.canvas) {
      this.canvas = document.createElement('canvas')
      this.canvas.width = this.width
      this.canvas.height = this.height
      this.ctx = this.canvas.getContext('2d')
    }

    this.ctx.clearRect(0, 0, this.width, this.height)

    var radis = []
    this.data.forEach(item => {
      this.ctx.save()
      this.ctx.beginPath()
      this.ctx.fillStyle = this.getRandomColor()
      var textHeight = this.getRandomNumber(12, 40)
      this.ctx.font = textHeight + 'px Arial'

      var textWidth = this.ctx.measureText(item).width


      var randomX, randomY, isRepeat

      do {
        randomX = this.getRandomNumber(0, this.width - textWidth)
        randomY = this.getRandomNumber(textHeight, this.height - textHeight)

        // 防止文字覆盖 - 简单的碰撞检测
        for (var i = 0; i < radis.length; i ++) {
          var box = radis[i]
          if (box) {
            if (randomX > box.width || (randomY + textHeight) < box.y || (randomX + textWidth) < box.x || randomY > box.height) {
              isRepeat = false
            } else {
              isRepeat = true
              break
            }
          }
        }

      } while (isRepeat)


      radis.push({
        x: randomX,
        width: randomX + textWidth,
        y: randomY,
        height: randomY + textHeight,
        text: item
      })

      this.ctx.fillText(item, randomX, randomY)
      this.ctx.restore()
    })

    this.imgUrl = this.canvas.toDataURL('image/png')
    this.init()
  }

  // 主要的动画
  init () {

    this.el.innerHTML = ''

    let everyWidth = this.width / this.column
    let everyHeight = this.height / this.row

    let fragment = document.createDocumentFragment()

    // 生成一堆div
    for (let i = 0; i < this.row; i++) {
      for (let j = 0; j < this.column; j++) {
        let div = document.createElement('div')
        let cssText = {
          width: everyWidth + 'px',
          height: everyHeight + 'px',
          left: j * everyWidth + 'px',
          top: i * everyHeight + 'px',
          opacity: 0,
          'background-image': 'url(' + this.imgUrl + ')',
          'background-position': (-j * everyWidth) + 'px ' + (-i * everyHeight) + 'px' 
        }

        div.style.cssText = Object.keys(cssText).map(key => key + ':' + cssText[key]).join(';') + ';'
        var duration = this.getRandomNumber(1, 1.8) + 's'
        div.style.transition = div.style.MozTransition = div.style.WebkitTransition = 'all ' + duration + ' ease'

        var translateX = this.getRandomNumber(-200, 200)
        var translateY = this.getRandomNumber(-200, 200)
        var rotateDeg = this.getRandomNumber(-90, 90)
        var scale = this.getRandomNumber(0, 2)
        div.style.transform = div.style.MozTransform = div.style.WebkitTransform = 'perspective(800px) translate3d(' + translateX + 'px, ' + translateY + 'px, 300px) rotate(' + rotateDeg + 'deg) scale(' + scale + ')'
        
        fragment.appendChild(div)
      }
    }

    this.el.appendChild(fragment)

    setTimeout(() => {
      this.el.classList.add('set')
    }, 1000)
  }

  /*
   * @name 添加单个数据
   */
  add (data) {
    this.el.classList.remove('set')
    this.data.push(data)
    this.createCanvas()
  }

  /*
   * @name 更新整个数据
   */
  update (dataArray) {
    this.el.classList.remove('set')
    this.data = dataArray
    this.createCanvas()
  }
}

