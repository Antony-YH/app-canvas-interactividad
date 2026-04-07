(() => {
    const canvas = document.getElementById("canvas-rebote");
    const ctx = canvas.getContext("2d");
    
    // Dimensiones que no abarcan toda la pantalla
    const width = 600, height = 500;
    canvas.width = width; 
    canvas.height = height;

    // Variables del Juego
    let circles = [];
    let currentLevel = 1;
    const maxLevels = 10;
    const circlesPerLevel = 10;
    let eliminatedInLevel = 0;
    let baseSpeed = 1;

    // Variables del Mouse
    let mouseX = -100;
    let mouseY = -100;

    // Actualizar posición del mouse
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });

    // Detectar clic en objetos
    canvas.addEventListener('click', () => {
        circles.forEach(circle => {
            if (circle.isHovered && !circle.isFading) {
                circle.isFading = true; // Inicia la desaparición lenta
                eliminatedInLevel++;
                updateUI();
                checkLevelProgression();
            }
        });
    });

    class Circle {
        constructor(radius, color, text, speedMultiplier) {
            this.radius = radius;
            // Inician fuera de la pantalla (por debajo del canvas)
            this.posX = Math.random() * (width - radius * 2) + radius;
            this.posY = height + radius + Math.random() * 200; 
            
            this.baseColor = color; 
            this.hoverColor = "#00ffcc"; // Color al pasar el mouse
            this.color = color;
            this.text = text;
            
            // Movimiento aleatorio, pero siempre hacia arriba (dy negativo)
            this.dx = (Math.random() - 0.5) * speedMultiplier * 2;
            this.dy = -(Math.random() * 1.5 + 1) * speedMultiplier; 
            
            this.isColliding = false;
            this.isHovered = false;
            
            // Propiedades para la desaparición (fade)
            this.isFading = false;
            this.alpha = 0.7; // Transparencia inicial
            this.isDead = false;
        }

        draw(context) {
            context.beginPath();
            
            // Convertimos el hex/rgb a rgba para manejar la opacidad
            context.globalAlpha = this.alpha;
            context.fillStyle = this.color;
            context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2);
            context.fill(); 
            
            context.strokeStyle = "rgba(255, 255, 255, 0.8)"; 
            context.lineWidth = 2;
            context.stroke();

            context.fillStyle = "white"; 
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.font = "bold 16px Arial";
            context.fillText(this.text, this.posX, this.posY);
            context.closePath();
            
            context.globalAlpha = 1.0; // Restaurar opacidad
        }

        update(context) {
            // Desaparición lenta si fue clickeado
            if (this.isFading) {
                this.alpha -= 0.03; // Velocidad de desaparición
                this.radius += 0.5; // Efecto de explosión ligera
                if (this.alpha <= 0) {
                    this.isDead = true;
                }
            } else {
                // Lógica normal de movimiento
                // Rebote en las paredes laterales
                if ((this.posX + this.radius) > width || (this.posX - this.radius) < 0) {
                    this.dx = -this.dx;
                }
                
                // Si salen por arriba, reaparecen abajo para que el jugador pueda intentar de nuevo
                if (this.posY + this.radius < 0) {
                    this.posY = height + this.radius;
                    this.posX = Math.random() * (width - this.radius * 2) + this.radius;
                }

                this.posX += this.dx; 
                this.posY += this.dy;

                // Detección de Hover (Mouse encima)
                const distMouse = Math.hypot(this.posX - mouseX, this.posY - mouseY);
                this.isHovered = distMouse < this.radius;

                // Reglas de color: Hover tiene prioridad, luego colisión, luego base
                if (this.isHovered) {
                    this.color = this.hoverColor;
                } else if (this.isColliding) {
                    this.color = "#ffcc00"; // Amarillo en colisión
                } else {
                    this.color = this.baseColor;
                }
            }

            this.draw(context);
        }
    }

    // Tu función original de colisiones adaptada
    function detectCollisions() {
        // No calcular colisiones para objetos que están desapareciendo
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

    // Inicializar Nivel
    function initLevel() {
        circles = [];
        eliminatedInLevel = 0;
        updateUI();
        
        for (let i = 0; i < circlesPerLevel; i++) {
            let radius = Math.floor(Math.random() * 15 + 20); // Tamaño un poco más grande
            // Usamos un color base naranja (se pasará a rgba en el draw)
            let color = "#ff4304"; 
            
            // La velocidad aumenta según el nivel (baseSpeed)
            circles.push(new Circle(radius, color, i + 1, baseSpeed)); 
        }
    }

    // Actualizar Interfaz
    function updateUI() {
        document.getElementById("ui-level").innerText = currentLevel;
        document.getElementById("ui-score").innerText = eliminatedInLevel;
        
        let percent = (eliminatedInLevel / circlesPerLevel) * 100;
        document.getElementById("ui-percent").innerText = Math.round(percent);
    }

    // Revisar si se debe pasar de nivel
    function checkLevelProgression() {
        if (eliminatedInLevel >= circlesPerLevel) {
            if (currentLevel >= maxLevels) {
                // Fin del juego
                document.getElementById("game-over-msg").classList.remove("d-none");
                circles = []; // Limpiar pantalla
            } else {
                // Siguiente Nivel
                currentLevel++;
                baseSpeed += 0.5; // Incrementar dificultad (velocidad)
                setTimeout(() => {
                    initLevel(); // Pausa breve antes del siguiente nivel
                }, 500);
            }
        }
    }

    // Bucle Principal
    function update() {
        if (currentLevel <= maxLevels) {
            requestAnimationFrame(update);
        }
        
        ctx.clearRect(0, 0, width, height);
        
        // Remover círculos muertos del array
        circles = circles.filter(circle => !circle.isDead);

        detectCollisions();
        
        for (let i = 0; i < circles.length; i++) {
            circles[i].update(ctx);
        }
    }

    // Iniciar el juego
    initLevel(); 
    update();

})();