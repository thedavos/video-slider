const iframeGroup = document.querySelectorAll('.iframe')
const playerGroup = document.querySelectorAll('.iframe-player')
const backgroundGroup = document.querySelectorAll('.iframe-background')
const overlay = document.getElementById('overlay')
const slides = document.querySelectorAll('.iframe-item')
const imageBackgrounds = [
    "https://images.unsplash.com/photo-1527148191484-193c02d12e83?ixlib=rb-0.3.5&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjE0NTg5fQ&s=cec38fea83f5ae0ee81aa8b661de9652",
    "https://images.unsplash.com/photo-1526243741027-444d633d7365?ixlib=rb-0.3.5&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjE0NTg5fQ&s=91cd8f3f1c7e6ebdfaaa347cfeadebb8",
    "https://images.unsplash.com/photo-1526395050546-dc5b0fe8df5f?ixlib=rb-0.3.5&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjE0NTg5fQ&s=c9584b19cace1361796f12893becc50d",
    "https://images.unsplash.com/photo-1523988285112-e6abb433b39c?ixlib=rb-0.3.5&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjE0NTg5fQ&s=dfb2205b08ab9f9ce6135437d666c027",
    "https://images.unsplash.com/photo-1528208079124-a2387f039c99?ixlib=rb-0.3.5&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjE0NTg5fQ&s=558b79f5c40973315e5c2f4707b1a117"
];
let slideIndex;

(function () {
  backgroundGroup.forEach(image => {
    let random = Math.floor(Math.random() * 5)
    image.style.backgroundImage = `url(${imageBackgrounds[random]})`;
  })
})();

function elementDisplay(el, value) {
    el = el || []
    if (el.length > 1) {
        for(let i = 0; i < el.length; i++) {
            el[i].style.display = value
        }
    } else {
        el.style.display = value
    }
}


function plusSlides(n) {
    showSlides(slideIndex += n)
}

function showSlides(n) {
    if (n > slides.length) {
        slideIndex = 1
    }

    if (n < 1) {
        slideIndex = slides.length
    }

    for (let i = 0; i < slides.length; i++) {
        let iframe = slides[i].querySelector('iframe')
        iframe.contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*')
        elementDisplay(slides[i], 'none')
    }
    
    const slide = slides[slideIndex - 1]

    elementDisplay(slide, 'block')

    const iframe = slide.querySelector('iframe')
    const player = slide.querySelector('.iframe-player')

    elementDisplay([player, player.previousElementSibling], 'none')

    iframe.contentWindow.postMessage('{"event":"command","func":"' + 'playVideo' + '","args":""}', '*')

    slide.classList.add('iframe-active')
}

const next = document.getElementById('next')
next.addEventListener('click', (ev) => {
    if (ev.target == next) {
        plusSlides(1)
    }
})

const prev = document.getElementById('previous')
prev.addEventListener('click', (ev) => {
    if (ev.target == prev) {
        plusSlides(-1)
    }
})

playerGroup.forEach((player, index) => {

  player.addEventListener('click', ev => {
    
    // Index del player
    slideIndex = index + 1
    
    // Imagen del player
    // Imagen del background
    elementDisplay([player, player.previousElementSibling], 'none')

    overlay.classList.add('overlay-active')
    elementDisplay([next, prev], 'block')

    // iframe item
    const iframeItem = player.parentNode
    iframeItem.classList.add('iframe-active')
    
    // Obteniendo el elemento iframe del padre
    const iframe = iframeItem.querySelector('iframe')
    
    iframe.contentWindow.postMessage('{"event":"command","func":"' + 'playVideo' + '","args":""}', '*')

  })
})

overlay.addEventListener('click', ev => {

  if (overlay == ev.target) {
    overlay.classList.remove('overlay-active')
    
    playerGroup.forEach(player => {

        const iframeItem = player.parentNode
        iframeItem.classList.remove('iframe-active')

        const iframe = iframeItem.querySelector('iframe')

        iframe.contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*')

        // Imagen del player
        elementDisplay(player, 'flex')
        
        // Imagen del background
        elementDisplay(player.previousElementSibling, 'block')
        
    })

    // Haciendo que aparezcan los slides acabado el overlay
    for (let i = 0; i < slides.length; i++) {
        elementDisplay(slides[i], 'block')
    }

    elementDisplay([next, prev], 'none')
  }
  
})

