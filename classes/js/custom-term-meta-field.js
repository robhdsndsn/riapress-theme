document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".photo-upload-button").forEach(function (button) {
        button.addEventListener("click", function () {
            const target = this.getAttribute("data-target");
            const frame = wp.media({
                title: "Select or Upload Image",
                button: { text: "Use this image" },
                multiple: false
            });

            frame.on("select", function () {
                const attachment = frame.state().get("selection").first().toJSON();
                const preview = document.getElementById(target + "_preview");
                const input = document.getElementById(target);
                const removeButton = document.querySelector(`.photo-remove-button[data-target="${target}"]`);

                input.value = attachment.id;
                preview.src = attachment.sizes.thumbnail.url;
                preview.style.display = "block";
                removeButton.style.display = "inline-block";
            });

            frame.open();
        });
    });

    document.querySelectorAll(".photo-remove-button").forEach(function (button) {
        button.addEventListener("click", function () {
            const target = this.getAttribute("data-target");
            const input = document.getElementById(target);
            const preview = document.getElementById(target + "_preview");

            input.value = "";
            preview.style.display = "none";
            this.style.display = "none";
        });
    });
});