// 不触发一次点击事件是没办法自动播放背景音乐的
// 不过目前看来就先这样吧

let firstClick = false

const play = (name, volume = 0.5) => {
    if (firstClick) {
        let filename = '/assets/audios/' + name
        let audio = new Audio(filename)
        audio.volume = volume
        audio.load()
        audio.play().then(r => {
            console.log('play audio: ' + name, r)

        }).catch(e => {
            console.log('play audio error: ' + name, e)
        })
    }
}

window.addEventListener('click', () => {
    // let isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
    // if (!isSafari) {
    //
    // }

    if (!firstClick) {
        firstClick = true

        play('empty.mp3', 0)
        play('Popcorn.ogg', 0)
    }
})

export default play