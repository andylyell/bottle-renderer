export function bottlePreviewTemplate (altText, imageData) {

    const template = `
    <img alt="${altText}" src="${imageData}" class="image-preview"> 
    `;

    return template;

}