const windowElem = document.createElement('div')
windowElem.className = 'window__elem'

function showId(id) {
    if(document.getElementById(id).id === id){
        windowElem.style.display = 'flex'
    }
}