let menu_icon = document.querySelector('.burger')
let leftpanel = document.querySelector('.left_panel')
let menu_close = document.querySelector('.menu_close')

menu_icon.addEventListener('click', () => {
    // leftpanel.style.display = 'flex'
    leftpanel.style.width = '100%'
    menu_close.style.display = 'inline-block'
});
menu_close.addEventListener('click', () => {
    // leftpanel.style.display = 'none'
    leftpanel.style.width = '0'
    menu_close.style.display = 'none'
});
