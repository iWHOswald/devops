document.addEventListener("DOMContentLoaded", function () {
    const centerElement = document.querySelector('.center');
	const terms = ["sweet", "fruit", "candy", "lychee", "tropical", "tangerine", "grapefruit", "coconut", "pineapple", "papaya", "guava", "banana", "mango", "apricot", "peach", "apple", "cherry", "strawberry", "red berry", "dark berry", "blueberry", "berry", "grape", "melon", "butterscotch", "bready", "cereal", "cream", "tart", "chocolate", "dairy", "honey", "vanilla", "ripe", "citrus", "lemon", "lime", "sour", "floral", "diesel", "gas", "earth", "musky", "wood", "pine", "camphoric", "mentholic", "terpenic", "grass", "green", "tea", "herbal", "plant", "vegetables", "pepper", "mint", "rosemary", "spicy", "bitter", "fatty", "sharp", "waxy", "sulfuric", "skunk", "cheese", "blue cheese", "astringent", "chemical", "ammonia", "moth balls", "allacieous", "garlic", "savory"];
	const numberOfRectangles = terms.length;

    let isDragging = false;

	const BarWidth = 20;
	const colorStops = [
	{h: 298, s: 100, l: 50},
	{h: 188, s: 100, l: 49},
	{h: 52, s: 97, l: 62},
	{h: 44, s: 84, l: 59},
	{h: 35, s: 36, l: 57},
	{h: 82, s: 10, l: 51}

    ];//f600ff, 00dafa, fce43e, eec03d, b9986b, 858e75
    // Set the image width
    const imageElement = document.getElementById('dynamicImage');
    imageElement.style.width = `${numberOfRectangles * BarWidth}px`;


	for(let i = 0; i < numberOfRectangles; i++) {
		const totalWidth = BarWidth * numberOfRectangles;
		const rectangle = document.createElement('div');
		rectangle.classList.add('rectangle');
		rectangle.style.left = `calc(50% + ${i * BarWidth}px - ${totalWidth / 2}px)`;
		centerElement.appendChild(rectangle);
		rectangle.dataset.index = i;

		const label = document.createElement('div');
		label.classList.add('label');
		label.textContent = terms[i];
		label.style.left = `calc(50% + ${i * BarWidth}px - ${totalWidth / 2}px)`;
		centerElement.appendChild(label);

	}

	// Add a separate loop or function call to initialize colors after all rectangles are appended.
	document.querySelectorAll('.rectangle').forEach(rectangle => {
		initializeRectangleColor(rectangle);
});



    const horizontalRectangle = document.createElement('div');
    horizontalRectangle.classList.add('horizontal-rectangle');
    //centerElement.appendChild(horizontalRectangle);

    //const line = document.querySelector('.line');
    //line.style.width = `${numberOfRectangles * 10}px`;

    horizontalRectangle.style.backgroundImage = `linear-gradient(to right, ${colorStops.map(color => `hsl(${color.h}, ${color.s}%, ${color.l}%)`).join(', ')})`;

    document.querySelectorAll('.rectangle').forEach(rectangle => {
        rectangle.addEventListener('mousedown', function(e) {
            isDragging = true;
            handleRectangleClick(e, rectangle);
        });

        rectangle.addEventListener('mousemove', function(e) {
            if (isDragging) {
                handleRectangleClick(e, rectangle);
            }
        });

        rectangle.addEventListener('mouseup', function() {
            isDragging = false;
        });

        rectangle.addEventListener('mouseleave', function() {
            isDragging = false;
        });
    });

    document.getElementById('getValuesButton').addEventListener('click', function() {
        const rectangleValuesList = document.getElementById('rectangleValues');
        rectangleValuesList.innerHTML = '';

        document.querySelectorAll('.rectangle').forEach(rectangle => {
            const bgImage = window.getComputedStyle(rectangle).backgroundImage;
            const colorStopMatch = bgImage.match(/(\d+(?:\.\d+)?)%/);
			
            
            const li = document.createElement('li');
            if (colorStopMatch) {
                const value = 1 - (parseFloat(colorStopMatch[1]) / 100);  // Adjusted line
                li.textContent = value.toFixed(2);
            } else {
                li.textContent = '0.00';
            }
            rectangleValuesList.appendChild(li);
        });
    });
});

function handleRectangleClick(e, rectangle) {
    const clickPosition = e.clientY - rectangle.getBoundingClientRect().top;
    const rectangleHeight = rectangle.offsetHeight;
    const colorPercentage = (clickPosition / rectangleHeight) * 100; 
    const rectangleColor = getColor(rectangle.dataset.index, rectangle.parentNode.querySelectorAll('.rectangle').length);
    const transparentColor = rectangleColor.replace(')', ', 0.0)'); 

    // Ensure that the gradient starts with the transparent version of the color.
    rectangle.style.backgroundImage = `linear-gradient(${transparentColor} ${colorPercentage}%, ${rectangleColor} ${colorPercentage}%)`;
}

/*
function initializeRectangleColor(rectangle) {
    const rectangleColor = getColor(rectangle.dataset.index, rectangle.parentNode.querySelectorAll('.rectangle').length);
    console.log("Original Color: ", rectangleColor);  // Debugging line to see the original color
    // Replace the closing parenthesis of HSL with , alpha) to convert HSL to HSLA
    const transparentColor = rectangleColor.replace(')', ', 0.3)'); 
    console.log("Transparent Color: ", transparentColor);  // Debugging line to see the transparent color
    rectangle.style.backgroundImage = `linear-gradient(${transparentColor}, ${transparentColor})`;
}
*/

function initializeRectangleColor(rectangle) {
    const rectangleColor = getColor(rectangle.dataset.index, rectangle.parentNode.querySelectorAll('.rectangle').length);
    // Replace the closing parenthesis of HSL with , alpha) to convert HSL to HSLA
    const transparentColor = rectangleColor.replace(')', ', 0.3)'); 
    
    // Applying the gradient to ::before pseudo-element via inline style
    rectangle.style.setProperty('--initial-gradient', `linear-gradient(${transparentColor}, ${transparentColor})`);
}


function getColor(index, totalRectangles) {
    const colorStops = [
        {h: 298, s: 100, l: 50},
        {h: 188, s: 100, l: 49},
        {h: 52, s: 97, l: 62},
        {h: 44, s: 84, l: 59},
        {h: 35, s: 36, l: 57},
        {h: 82, s: 10, l: 51}
    ];

    const factor = index / (totalRectangles - 1);
    const colorAIndex = Math.floor(factor * (colorStops.length - 1));
    const colorBIndex = Math.ceil(factor * (colorStops.length - 1));
    
    // Debugging: Log the calculated indices and check if they are within bounds
    console.log("Indices:", colorAIndex, colorBIndex, "Total Rectangles:", totalRectangles);

    const colorA = colorStops[colorAIndex];
    const colorB = colorStops[colorBIndex];

    // Debugging: Log the colors to check if they are undefined
    console.log("Colors:", colorA, colorB);

    const colorFactor = factor * (colorStops.length - 1) - colorAIndex;
    const h = colorA.h + (colorB.h - colorA.h) * colorFactor;
    const s = colorA.s + (colorB.s - colorA.s) * colorFactor;
    const l = colorA.l + (colorB.l - colorA.l) * colorFactor;
    
    return `hsl(${h}, ${s}%, ${l}%)`;
}

function getColor_hex(index, totalRectangles) {
    const lerp = (start, end, factor) => Math.round(start + (end - start) * factor);
    const factor = index / (totalRectangles - 1);
    
    const startColor = parseInt(colorStops[0].substring(1), 16);
    const endColor = parseInt(colorStops[1].substring(1), 16);

    const start = {
        r: (startColor >> 16) & 255,
        g: (startColor >> 8) & 255,
        b: startColor & 255,
    };

    const end = {
        r: (endColor >> 16) & 255,
        g: (endColor >> 8) & 255,
        b: endColor & 255,
    };

    const interpolated = {
        r: lerp(start.r, end.r, factor),
        g: lerp(start.g, end.g, factor),
        b: lerp(start.b, end.b, factor),
    };

    return `rgb(${interpolated.r}, ${interpolated.g}, ${interpolated.b})`;
}

