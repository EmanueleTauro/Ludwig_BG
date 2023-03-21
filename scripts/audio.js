const audio = {
    Map: new Howl({
      src: '/assets/audio/map.mp3',
      html5: true,
      loop: true,
      volume: 0.1
    }),
    Honedge: new Howl({
      src: '/assets/audio/honedge.mp3',
      html5: true,
      volume: 0.5
    })
}

let clicked = false
addEventListener('click', () => {
  if (!clicked) {
    audio.Map.play()
    clicked = true
  }
})