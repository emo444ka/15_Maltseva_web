// Базовый класс Block
class Block {
    constructor(content) {
        this.content = content;
    }

    toHTML() {
        throw new Error("Метод render должен быть реализован в дочернем классе");
    }
}

// Класс для текстового блока
class TextBlock extends Block {
    toHTML() {
        return `<div class="block text-block" contenteditable="false">${this.content}</div>`;
    }
}

// Класс для блока с изображением
class ImageBlock extends Block {
    constructor(src, caption = "") {
        super(src); 
        this.caption = caption; 
    }

    toHTML() {
        return `
            <div class="block image-block" contenteditable="false">
                <img src="${this.content}" alt="Image">
                <div class="image-caption" contenteditable="false">${this.caption}</div>
            </div>
        `;
    }
}

// Класс для блока с ссылкой
class LinkBlock extends Block {
    toHTML() {
        return `<div class="block link-block" contenteditable="false">
                    <a href="${this.content}" target="_blank">${this.content}</a>
                </div>`;
    }
}

// Функция для сборки страницы
function buildPage(blocks) {
    const textContainer = document.querySelector('.text-container');
    const imageContainer = document.querySelector('.image-container');
    textContainer.innerHTML = ''; 
    imageContainer.innerHTML = ''; 

    blocks.forEach((block) => {
        if (block instanceof TextBlock || block instanceof LinkBlock) {
            textContainer.innerHTML += block.toHTML();
        } else if (block instanceof ImageBlock) {
            imageContainer.innerHTML += block.toHTML();
        }
    });

    const editableBlocks = document.querySelectorAll('.block');
    editableBlocks.forEach(block => {
        block.contentEditable = editMode;
    });

    localStorage.setItem('blocks', JSON.stringify(blocks.map(block => {
        return {
            type: block.constructor.name,
            content: block.content,
            caption: block.caption || "" 
        };
    })));
}

// Инициализация страницы
let editMode = false;
let blocks = [];

// Загрузка блоков из localStorage
const savedBlocks = JSON.parse(localStorage.getItem('blocks'));
if (savedBlocks) {
    blocks = savedBlocks.map(blockData => {
        switch (blockData.type) {
            case 'TextBlock':
                return new TextBlock(blockData.content);
            case 'ImageBlock':
                return new ImageBlock(blockData.content, blockData.caption); 
            case 'LinkBlock':
                return new LinkBlock(blockData.content);
            default:
                return null;
        }
    }).filter(block => block !== null);
} else {
    blocks = [
        new TextBlock("-Привет, меня зовут Сода, полное имя - Гидрокарбонат натрия, короткое - СЛЕЗАЙ ОТСЮДА"),
        new TextBlock("-Я родилась первого апреля"),
        new TextBlock("-Я люблю бегать и прыгать, и крушить, и ломать, и грызть, и бить, и есть (особенно волосы), и бегать там ещё..."),
        new TextBlock("-У меня две мамы"),
        new TextBlock("-Мяу"),
        new ImageBlock("resources/bat.jpg", "Это я на страже Готэма"), 
        new ImageBlock("resources/moon.jpg", "Это я колонизировала Луну"), 
        new LinkBlock("https://youtu.be/s1iBYOEnKhM?si=pdV2djwhBQoiBRqg")
    ];
}

document.addEventListener('DOMContentLoaded', () => {
    buildPage(blocks);

    // Режим редактирования
    document.getElementById('editToggle').addEventListener('click', () => {
        editMode = !editMode;

        if (!editMode) {
            saveBlockContents();
        }

        buildPage(blocks); 
    });

    document.getElementById('addBlock').addEventListener('click', () => {
        addBlock();
    });

    document.getElementById('removeBlock').addEventListener('click', () => {
        removeBlock();
    });
});

// Сохранение содержимого блоков
function saveBlockContents() {
    const editableBlocks = document.querySelectorAll('.block');
    editableBlocks.forEach((block, index) => {
        if (blocks[index]) {
            if (blocks[index] instanceof TextBlock || blocks[index] instanceof LinkBlock) {
                blocks[index].content = block.textContent;
            } else if (blocks[index] instanceof ImageBlock) {
                const img = block.querySelector('img');
                const caption = block.querySelector('.image-caption');
                if (img) {
                    blocks[index].content = img.src;
                }
                if (caption) {
                    blocks[index].caption = caption.textContent;
                }
            }
        }
    });

    localStorage.setItem('blocks', JSON.stringify(blocks.map(block => {
        return {
            type: block.constructor.name,
            content: block.content,
            caption: block.caption || "" 
        };
    })));
}

// Добавление нового блока
function addBlock() {
    const newBlock = new TextBlock("Новый текстовый блок"); 
    blocks.push(newBlock); 
    buildPage(blocks); 
}

// Удаление последнего блока
function removeBlock() {
    if (blocks.length > 0) {
        blocks.pop(); 
        buildPage(blocks); 
    }
}