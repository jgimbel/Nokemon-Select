/* global L turf */
'use strict'

const SelectedNokemon = []

const defaultPosition = [40.7, -96.6]
const map = L.map('map').setView(defaultPosition, 12)

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map)

var legend = L.control({position: 'bottomright'})

legend.onAdd = function legendAdd (map) {
  this._div = L.DomUtil.create('div', 'nokemon')
  this.update()
  return this._div
}
legend.update = function legendUpate () {
  this._div.innerHTML = SelectedNokemon.sort((a, b) => a - b).map(nokemon => `<img src="img/pokemon/${nokemon}.png" />`).join(' ')
}
legend.addTo(map)

let userPosition = defaultPosition
navigator.geolocation.getCurrentPosition(function (pos) {
  userPosition = [pos.coords.latitude, pos.coords.longitude]
  map.setView(userPosition, 16)
  L.marker(userPosition, {
    icon: L.icon({
      iconUrl: 'https://cdn1.iconfinder.com/data/icons/map-objects/154/map-object-user-login-man-point-512.png',
      iconSize: [50, 50]
    })
  }).addTo(map)
  addNokemon()
})



function addNokemon () {
  var timeout = setTimeout(() => {
    clearTimeout(timeout)
    const nextLocation = turf.destination(
      turf.point([userPosition[1], userPosition[0]]),
      Math.random() * 1000,
      (Math.random() * 360) - 180,
      'meters'
    )
    const nokemon = Math.floor(Math.random() * 152)
    L.marker(nextLocation.geometry.coordinates.reverse(), {
      icon: L.icon({
        iconUrl: `img/pokemon/${nokemon}.png`
      })
    })
    .addTo(map)
    .on('click', selectNokemon.bind(this, nokemon))
    addNokemon()
  }, (Math.random() * 8 * 1000) + 1000)
}



function selectNokemon (nokemon, event) {
  if ((Math.random() * 100 * (1 + (151 - selectNokemon.length / 151))) > 33) {
    if (SelectedNokemon.indexOf(nokemon) === -1) {
      SelectedNokemon.push(nokemon) // Select Nokemon
    }
    legend.update()
    event.target.remove()
  } else if (Math.random() * 10 > 5) {
    event.target.remove() // Nokemon Runs
  }
}
