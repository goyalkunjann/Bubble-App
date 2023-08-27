const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const resetButton = document.getElementById('resetButton');

const circleColors = ['red', 'green', 'blue', 'orange'];
const circleRadius = 30;
const circleSpacing = 100;
const arrowLength = 50;
const arrowOffset = 10;
const arrowSpeed = 2;

let circles = [];

for (let i = 0; i < circleColors.length; i++) {
    const circleX = circleRadius + 20;
    const circleY = circleRadius + (i * circleSpacing);
    const arrowX = canvas.width - arrowLength - arrowOffset;
    const arrowY = circleY;

    circles.push({
        circleX,
        circleY,
        arrowX,
        arrowY,
        targetX: circleX + circleRadius, // Target the outer surface of the circle
        targetY: circleY,
        color: circleColors[i],
        hit: false
    });
}

function drawCircle(x, y, color) {
    ctx.beginPath();
    ctx.arc(x, y, circleRadius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
}

function drawArrow(x, y, hit) {
    ctx.beginPath();
    ctx.moveTo(x + arrowLength, y);
    ctx.lineTo(x, y);
    ctx.lineTo(x + arrowOffset, y - arrowOffset);
    ctx.moveTo(x, y);
    ctx.lineTo(x + arrowOffset, y + arrowOffset);
    ctx.strokeStyle = hit ? 'gray' : 'black';
    ctx.lineWidth = 3; // Make the arrow bold
    ctx.stroke();
}

function animateArrow(circle) {
    const dx = circle.targetX - (circle.arrowX + arrowLength);
    const dy = circle.targetY - circle.arrowY;
    const distance = Math.sqrt(dx ** 2 + dy ** 2);

    if (distance > arrowSpeed) {
        circle.arrowX += (dx / distance) * arrowSpeed;
        circle.arrowY += (dy / distance) * arrowSpeed;
    } else {
        circle.arrowX = circle.targetX - arrowLength;
        circle.arrowY = circle.targetY;
        circle.hit = true;
        circle.color = 'gray'; // Change the color upon hitting
    }

    drawCirclesAndArrows();

    if (!circle.hit) {
        requestAnimationFrame(() => animateArrow(circle));
    }
}

function drawCirclesAndArrows() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    circles.forEach(circle => {
        drawCircle(circle.circleX, circle.circleY, circle.color);
        drawArrow(circle.arrowX, circle.arrowY, circle.hit);
    });
}

// Function to generate a random color
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

canvas.addEventListener('click', event => {
    const clickX = event.offsetX;
    const clickY = event.offsetY;

    circles.forEach(circle => {
        const distance = Math.sqrt((clickX - circle.circleX) ** 2 + (clickY - circle.circleY) ** 2);
        if (distance <= circleRadius && !circle.hit) {
            circle.targetX = circle.circleX + circleRadius;
            circle.targetY = circle.circleY;
            circle.color = getRandomColor(); // Change the circle color randomly
            animateArrow(circle);
        }
    });
});

resetButton.addEventListener('click', () => {
    circles.forEach(circle => {
        circle.arrowX = canvas.width - arrowLength - arrowOffset;
        circle.arrowY = circle.circleY;
        circle.hit = false;
        circle.color = circleColors[circles.indexOf(circle)];
    });
    drawCirclesAndArrows();
});

drawCirclesAndArrows();
