setTimeout(function () {
    document.getElementById('splash-container').classList.add('hide');

    
    setTimeout(function () {
        document.getElementById('splash-container').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
    }, 1000);
}, 3000);

window.addEventListener('load', function() {
    document.getElementById('permissionSnackbar').style.display = 'block';
});

document.getElementById('closeSnackbarBtn').addEventListener('click', function() {
    document.getElementById('permissionSnackbar').style.display = 'none';
});