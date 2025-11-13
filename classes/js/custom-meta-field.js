document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('button[id$="_button"]').forEach(function (button) {
        button.addEventListener('click', function (e) {
            e.preventDefault();

            const inputField = button.previousElementSibling;
            const mediaUploader = wp.media({
                title: 'Select File',
                button: { text: 'Use this file' },
                multiple: false,
            });

            mediaUploader.on('select', function () {
                const attachment = mediaUploader.state().get('selection').first().toJSON();
                inputField.value = attachment.id;

                const existingInfo = button.nextElementSibling;
                if (existingInfo && existingInfo.tagName === 'P') {
                    existingInfo.remove();
                }

                const fileInfo = document.createElement('p');
                fileInfo.innerHTML = `<strong>Selected File:</strong> <a href="${attachment.url}" target="_blank">${attachment.title}</a>`;
                button.parentNode.appendChild(fileInfo);
            });

            mediaUploader.open();
        });
    });
});