const selectedImagesContainer = document.getElementById('selected-images');
const imageInput = document.getElementById('image-input');

// Hàm để tạo một phần tử ảnh và nút xóa tương ứng
function createImageElement(file) {
    const imageWrapper = document.createElement('div');
    imageWrapper.classList.add('selected-image-wrapper');

    const img = document.createElement('img');
    img.classList.add('selected-image');
    img.src = URL.createObjectURL(file);

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.textContent = 'Xóa';
    deleteButton.addEventListener('click', () => {
        imageWrapper.remove();
    });

    imageWrapper.appendChild(img);
    imageWrapper.appendChild(deleteButton);

    return imageWrapper;
}

// Lắng nghe sự kiện khi người dùng chọn tập tin ảnh mới
imageInput.addEventListener('change', (event) => {
    const files = event.target.files;

    // Lặp qua danh sách các tập tin ảnh và thêm chúng vào selectedImagesContainer
    for (const file of files) {
        if (file.type.startsWith('image/')) {
            const imageElement = createImageElement(file);
            selectedImagesContainer.appendChild(imageElement);
        }
    }

    // Đặt giá trị của input về null để cho phép người dùng chọn cùng tập tin ảnh lần tiếp theo
    event.target.value = null;
});


function submit(){
    // Lấy tất cả các phần tử con có lớp là 'selected-image'
    const selectedImageElements = selectedImagesContainer.querySelectorAll('.selected-image');

    // Mảng để lưu trữ các giá trị (ảnh)
    const selectedImages = [];

    // Lặp qua danh sách các phần tử và lấy giá trị (src của ảnh)
    selectedImageElements.forEach((imageElement) => {
        const imageUrl = imageElement.getAttribute('src');
        selectedImages.push(imageUrl);
    });

    // selectedImages giờ chứa danh sách các ảnh đã chọn
    console.log(selectedImages);
}
