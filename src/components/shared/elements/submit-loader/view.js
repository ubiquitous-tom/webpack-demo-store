import { View } from 'backbone'

import loader from './svg/loading-circle.svg'
import './stylesheet.scss'

class SubmitLoader extends View {
  initialize() {
    console.log('SubmitLoader initialize')
    this.placeholderText = ''
    this.loadingSVG = $('<img/>').attr({
      src: loader,
      class: 'svg-loader',
    })
  }

  render() {
    console.log('SubmitLoader render')

    return this
  }

  loadingStart(el) {
    const width = el.outerWidth()
    const height = el.outerHeight()
    this.placeholderText = el.html()
    // debugger
    el.attr({
      style: `width:${width}px;height:${height}px;padding:0px;`,
    })
      .prop('disabled', true)
    el.addClass('loading').html(this.loadingSVG)
  }

  loadingStop(el) {
    el.removeAttr('style')
    el.html(this.placeholderText).prop('disabled', false)
    // debugger
  }
}

export default SubmitLoader
