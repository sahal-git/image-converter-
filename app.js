let cropper;
const imageInput = document.getElementById('imageInput');
const image = document.getElementById('image');
const cropButton = document.getElementById('cropButton');
const convertButton = document.getElementById('convertButton');
const canvas = document.getElementById('canvas');
const downloadLink = document.getElementById('downloadLink');

imageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
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
});

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
    cropButton.style.display = 'none';
    image.style.display = 'none';
});

convertButton.addEventListener('click', () => {
    canvas.toBlob((blob) => {
        if (blob.size >= 20480 && blob.size <= 102400) {
            const url = URL.createObjectURL(blob);
            downloadLink.href = url;
            downloadLink.download = 'converted_image.png';
            downloadLink.style.display = 'inline';
            downloadLink.innerText = 'Download';
        } else {
            alert('File size out of bounds. Please crop again.');
        }
    }, 'image/png');
});
