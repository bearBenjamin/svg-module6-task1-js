const TRANSITION_DEFAULT = 'r 0.155s ease-in-out';
const TRANSITION_EXPAND = 'r 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
const TRANSITTION_NARROW = 'r 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

const preview = document.querySelector('.preview');
const previewSpan = preview.querySelector('span');

const svgMask = preview.querySelector('.svg-mask');
const holes = svgMask.querySelectorAll('circle');

let isClick = false;

// получаю размеры контейнера preview
function getPreviewSize() {
    const rect = preview.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
}

function setTransition(value) {
    holes.forEach((element) => {
        element.style.transition = value;
    });
}

// функция для случаных значений аттрибутов circle
function randomHole(width, height) {
    // Минимальный и максимальный радиус — можно вынести в константы
    const minR = 30;
    const maxR = Math.min(width, height) / 2;  // не больше половины меньшей стороны
    
    const r = minR + Math.random() * (maxR - minR);
    
    // cx/cy с учётом радиуса — круг полностью внутри
    const cx = r + Math.random() * (width - 2 * r);
    const cy = r + Math.random() * (height - 2 * r);
    
    return {
        r: r + 'px',
        cx: cx + 'px',
        cy: cy + 'px'
    };
}

function coverRadius(width, height) {
    // Диагональ .preview + запас 10%
    return Math.sqrt(width * width + height * height) * 1.1;
}

function applyHoles(holesConfig, show) {
    const { width, height } = getPreviewSize();

    holesConfig.forEach((element) => {
         if (show) {
            const attrs = randomHole(width, height);
            element.style.r = attrs.r;
            element.style.cx = attrs.cx;
            element.style.cy = attrs.cy;
        } else {
            element.style.r = '0px';
        }
    });
}

function expandHoles() {
    const { width, height } = getPreviewSize();
    const r = coverRadius(width, height);
    
    holes.forEach((element) => {
        element.style.r = r + 'px';
    });
}

preview.addEventListener('mouseenter', () => {
    setTransition(TRANSITION_DEFAULT);
    applyHoles(holes, true)
});

preview.addEventListener('mouseleave', () => {
    if (!isClick) {
        setTransition(TRANSITION_DEFAULT);
    } else {
        setTransition(TRANSITTION_NARROW);
        isClick = false;
    }
    applyHoles(holes, false);
    
});

previewSpan.addEventListener('click', () => {
    if (isClick) return;
    setTransition(TRANSITION_EXPAND);
    expandHoles();
    isClick = true;
})