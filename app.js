let cropper;
let images = [];
let currentIndex = 0;
const imageInput = document.getElementById('imageInput');
const image = document.getElementById('image');
const cropButton = document.getElementById('cropButton');
const canvas = document.getElementById('canvas');

imageInput.addEventListener('change', (event) => {
    images = Array.from(event.target.files);
    currentIndex = 0;
    if (images.length > 0) {
        loadAndCropImage(images[currentIndex]);
    }
});

function loadAndCropImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        image.src = e.target.result;
        image.style.display = 'block';
        cropButton.style.display = 'inline';
        if (cropper) {
            cropper.destroy();
        }
        cropper = new Cropper(image, {
            aspectRatio: 1,
            viewMode: 1
        });
    };
    reader.readAsDataURL(file);
}

cropButton.addEventListener('click', () => {
    const croppedCanvas = cropper.getCroppedCanvas({
        width: 200,
        height: 200,
    });
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous content
    ctx.drawImage(croppedCanvas, 0, 0);
    saveCurrentImage();
});

function saveCurrentImage() {
    canvas.toBlob((blob) => {
        if (blob.size >= 20480 && blob.size <= 102400) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `image_${currentIndex + 1}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            currentIndex++;
            if (currentIndex < images.length) {
                loadAndCropImage(images[currentIndex]);
            } else {
                resetInterface();
            }
        } else {
            alert('File size out of bounds. Please crop again.');
        }
    }, 'image/png');
}

function resetInterface() {
    image.style.display = 'none';
    cropButton.style.display = 'none';
    imageInput.value = '';
    images = [];
    currentIndex = 0;
    alert('All images processed and downloaded.');
}
