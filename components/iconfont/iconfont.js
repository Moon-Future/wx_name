Component({
  externalClasses: ['my-class'], // 外部控制样式
  properties: {
    type: {
      // 图标类型
      type: String,
      value: '',
    },
    size: {
      // 图标大小,可不传
      type: String,
      value: '',
    },
    color: {
      // 图标颜色,可不传
      type: String,
      value: '',
    },
  },
})
