const canvas = document.getElementById("canvas-rebote");
const ctx = canvas.getContext("2d");

// Dimensiones fijas
const width = 600, height = 500;
canvas.width = width;
canvas.height = height;

// Variables del Juego
let circles = [];
let currentLevel = 1;
const maxLevels = 10;
const circlesPerLevel = 10;
let eliminatedInLevel = 0;

// Variables del Mouse
let mouseX = -100;
let mouseY = -100;

// Colores Neón para el Canvas
const COLORS = {
    base: "#ff007f", // Rosa intenso
    hover: "#0ff",   // Cian
    collide: "#39ff14", // Verde neón
    text: "#ffffff"
};

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});

canvas.addEventListener('click', () => {
    circles.forEach(circle => {
        if (circle.isHovered && !circle.isFading) {
            circle.isFading = true;
            eliminatedInLevel++;
            updateUI();
            checkLevelProgression();
        }
    });
});

class Circle {
    // Añadimos el factor "erraticness" (movimiento horizontal)
    constructor(radius, color, text, speedMultiplier, erraticness) {
        this.radius = radius;
        this.posX = Math.random() * (width - radius * 2) + radius;
        this.posY = height + radius + Math.random() * 300;

        this.baseColor = color;
        this.color = color;
        this.text = text;

        // Dificultad balanceada:
        // dx (movimiento horizontal) se multiplica por el factor de erraticidad
        this.dx = (Math.random() - 0.5) * speedMultiplier * erraticness;
        // dy (velocidad vertical) 
        this.dy = -(Math.random() * 1.5 + 1) * speedMultiplier;

        this.isColliding = false;
        this.isHovered = false;

        this.isFading = false;
        this.alpha = 0.8;
        this.isDead = false;
    }

    draw(context) {
        context.save();

        if (!this.isFading) {
            context.shadowBlur = 15;
            context.shadowColor = this.color;
        } else {
            context.shadowBlur = 5;
            context.shadowColor = "#fff";
        }

        context.beginPath();
        context.globalAlpha = this.alpha;
        context.fillStyle = this.color;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2);
        context.fill();

        context.strokeStyle = "rgba(255, 255, 255, 0.9)";
        context.lineWidth = 2;
        context.stroke();
        context.closePath();

        context.shadowBlur = 0;
        context.globalAlpha = Math.min(this.alpha + 0.2, 1);
        context.fillStyle = COLORS.text;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = `bold ${Math.max(10, this.radius * 0.8)}px Orbitron, Arial`;
        context.fillText(this.text, this.posX, this.posY);

        context.restore();
    }

    update(context) {
        if (this.isFading) {
            this.alpha -= 0.04;
            this.radius *= 1.03;
            if (this.alpha <= 0) {
                this.isDead = true;
            }
        } else {
            if ((this.posX + this.radius) > width || (this.posX - this.radius) < 0) {
                this.dx = -this.dx;
            }
            if (this.posY + this.radius < 0) {
                this.posY = height + this.radius;
                this.posX = Math.random() * (width - this.radius * 2) + this.radius;
            }

            this.posX += this.dx;
            this.posY += this.dy;

            const distMouse = Math.hypot(this.posX - mouseX, this.posY - mouseY);
            this.isHovered = distMouse < this.radius;

            if (this.isHovered) {
                this.color = COLORS.hover;
            } else if (this.isColliding) {
                this.color = COLORS.collide;
            } else {
                this.color = this.baseColor;
            }
        }

        this.draw(context);
    }
}

function detectCollisions() {
    let activeCircles = circles.filter(c => !c.isFading);
    for (let i = 0; i < activeCircles.length; i++) activeCircles[i].isColliding = false;

    for (let i = 0; i < activeCircles.length; i++) {
        for (let j = i + 1; j < activeCircles.length; j++) {
            let dx = activeCircles[j].posX - activeCircles[i].posX;
            let dy = activeCircles[j].posY - activeCircles[i].posY;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < activeCircles[i].radius + activeCircles[j].radius) {
                activeCircles[i].isColliding = true;
                activeCircles[j].isColliding = true;

                let angle = Math.atan2(dy, dx);
                let sin = Math.sin(angle), cos = Math.cos(angle);

                let v1 = { x: activeCircles[i].dx * cos + activeCircles[i].dy * sin, y: activeCircles[i].dy * cos - activeCircles[i].dx * sin };
                let v2 = { x: activeCircles[j].dx * cos + activeCircles[j].dy * sin, y: activeCircles[j].dy * cos - activeCircles[j].dx * sin };

                let temp = v1.x; v1.x = v2.x; v2.x = temp;

                activeCircles[i].dx = v1.x * cos - v1.y * sin;
                activeCircles[i].dy = v1.y * cos + v1.x * sin;
                activeCircles[j].dx = v2.x * cos - v2.y * sin;
                activeCircles[j].dy = v2.y * cos + v2.x * sin;

                let overlap = (activeCircles[i].radius + activeCircles[j].radius) - distance;
                let sepX = overlap * cos / 2, sepY = overlap * sin / 2;
                activeCircles[i].posX -= sepX; activeCircles[i].posY -= sepY;
                activeCircles[j].posX += sepX; activeCircles[j].posY += sepY;
            }
        }
    }
}

function initLevel() {
    circles = [];
    eliminatedInLevel = 0;
    updateUI();

    // --- CÁLCULO DE DIFICULTAD DINÁMICA ---
    // 1. Velocidad base (Sube gradualmente)
    let levelSpeed = 1.0 + (currentLevel * 0.25);

    // 2. Comportamiento errático (Se mueven más a los lados en niveles altos)
    let levelErraticness = 1.0 + (currentLevel * 0.4);

    // 3. Tamaño (Se reducen progresivamente, exigiendo más precisión al jugador)
    // Nivel 1: ~25-30px | Nivel 10: ~10-15px
    let minRadius = Math.max(10, 25 - (currentLevel * 1.5));
    let maxRadius = Math.max(15, 32 - (currentLevel * 1.5));

    for (let i = 0; i < circlesPerLevel; i++) {
        let radius = Math.floor(Math.random() * (maxRadius - minRadius)) + minRadius;
        circles.push(new Circle(radius, COLORS.base, i + 1, levelSpeed, levelErraticness));
    }
}

function updateUI() {
    document.getElementById("ui-level").innerText = currentLevel;
    document.getElementById("ui-score").innerText = eliminatedInLevel;
    let percent = (eliminatedInLevel / circlesPerLevel) * 100;
    document.getElementById("ui-percent").innerText = Math.round(percent);
}

function checkLevelProgression() {
    if (eliminatedInLevel >= circlesPerLevel) {
        if (currentLevel >= maxLevels) {
            document.getElementById("game-over-msg").classList.remove("d-none");
            circles = [];
        } else {
            currentLevel++;
            setTimeout(() => {
                initLevel();
            }, 600);
        }
    }
}

function update() {
    if (currentLevel <= maxLevels) {
        requestAnimationFrame(update);
    }
    ctx.clearRect(0, 0, width, height);
    circles = circles.filter(circle => !circle.isDead);
    detectCollisions();
    for (let i = 0; i < circles.length; i++) {
        circles[i].update(ctx);
    }
}

initLevel();
update();