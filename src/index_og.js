import _ from 'underscore'
import './style.css'
import Icon from './icon.png'
import Print from './print';

function component() {
  const element = document.createElement('div')
  const btn = document.createElement('button')

  // Lodash, now imported by this script
  element.innerHTML = ['Hello', 'webpack'].join(' ')
  element.classList.add('hello')
  element.onclick = Print.bind(null, 'Hello webpack!')

  // Add the image to our existing div.
  const myIcon = new Image()
  myIcon.src = Icon

  element.appendChild(myIcon)

  // btn.innerHTML = 'Hello, everyone!'
  // btn.onclick = Print.bind(null, 'Hello everyone')

  // element.appendChild(btn)

  return element
}

document.body.appendChild(component())
