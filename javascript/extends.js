function addSampleButton(caption, clickHandler) {
    var btn = document.createElement('input');
    btn.type = 'button';
    btn.value = caption;

    if (btn.attachEvent)
        btn.attachEvent('onclick', clickHandler);
    else
        btn.addEventListener('click', clickHandler, false);

    // add the button to the Sample UI
    document.getElementById('sample-ui').appendChild(btn);
}

function addSampleUIHtml(html) {
    document.getElementById('sample-ui').innerHTML += html;
}
