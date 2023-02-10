import app from '../config/app';

function title(str) {
    document.title = str  + ' - ' + app.name;
}

export {
    title,
}