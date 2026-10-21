export const HEIGHTS = [300, 350, 400, 420, 480, 500, 550, 600, 620, 700];
export const IMAGES = Array.from({ length: 10 }, (_, i) => {
    const h = HEIGHTS[i % HEIGHTS.length];
    const id = ((i * 137) % 1000) + 1;
    return `https://picsum.photos/id/${id}/400/${h}`;
});
