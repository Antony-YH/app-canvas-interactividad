# 🌌 Interactividad con Gráficos 2D

**Interactividad con Gráficos 2D** es un minijuego interactivo de estilo Cyberpunk desarrollado puramente con tecnologías web estándar (Vanilla JavaScript y HTML5 Canvas). El objetivo del juego es eliminar burbujas flotantes mediante clics antes de que escapen, avanzando a través de 10 niveles de dificultad progresiva y dinámica.

El proyecto destaca por su interfaz moderna que combina los estilos visuales de **Glassmorphism** (efecto vidrio esmerilado) y **Neón** de alto contraste.

---

## ✨ Características Principales

* **Físicas y Colisiones Personalizadas:** Las esferas rebotan entre sí y contra las paredes laterales utilizando cálculos vectoriales.
* **Progresión Dinámica (10 Niveles):** La dificultad no solo aumenta la velocidad; las esferas se vuelven más pequeñas y su movimiento horizontal se vuelve más errático e impredecible en niveles altos.
* **Interactividad Visual:** * Sistema de "Hover": Las esferas cambian a color cian brillante al pasar el ratón por encima.
  * Animaciones de Destrucción: Al hacer clic, las esferas se expanden y se desvanecen suavemente (Fade out).
* **Estética Cyberpunk:** Efectos de resplandor neón creados directamente en el renderizado del Canvas (`shadowBlur`), combinados con una interfaz de vidrio sobre un fondo oscuro y abstracto.
* **Marcadores en Tiempo Real:** Seguimiento del nivel actual, cantidad de objetos eliminados y porcentaje de progreso.

---

## 🛠️ Tecnologías Utilizadas

* **HTML5:** Estructura semántica y elemento `<canvas>` para el renderizado 2D.
* **CSS3:** * Variables CSS (Custom Properties).
  * Filtros de fondo (`backdrop-filter`) para el efecto Glassmorphism.
  * Sombras múltiples (`box-shadow`, `text-shadow`) para los efectos Neón.
* **JavaScript (ES6+):** * Programación Orientada a Objetos (Clases) para gestionar cada esfera de forma independiente.
  * `requestAnimationFrame` para un ciclo de juego (Game Loop) fluido y optimizado.
  * Manipulación del DOM para actualizar la interfaz gráfica.
* **Bootstrap 5:** Sistema de cuadrícula y componentes (NavBar, Footer, tipografía) para una maquetación rápida y responsiva.
* **Google Fonts:** Tipografía "Orbitron" para potenciar el aspecto futurista.

---

## 🚀 Instalación y Ejecución

El proyecto no requiere dependencias del lado del servidor, empaquetadores (como Webpack) ni bases de datos. Es un proyecto *frontend* completamente estático.

1. Clona o descarga este repositorio en tu computadora.
2. Asegúrate de tener los tres archivos principales en la misma carpeta:
   * `index.html`
   * `style.css`
   * `main.js`
3. Abre el archivo `index.html` en cualquier navegador web moderno (Chrome, Firefox, Edge, Safari).
4. ¡El juego comenzará automáticamente!

---

## 🎮 Cómo Jugar

1. El juego iniciará en el **Nivel 1**. Verás 10 esferas de luz ascendiendo por la pantalla.
2. **Apunta:** Mueve el cursor de tu ratón sobre las esferas. Verás que reaccionan cambiando de color.
3. **Dispara:** Haz clic izquierdo sobre una esfera para destruirla.
4. **Supervivencia:** Las esferas que salgan por la parte superior de la pantalla reaparecerán por debajo, dándote otra oportunidad.
5. **Avanza:** Destruye las 10 esferas para pasar al siguiente nivel. El sistema se reiniciará al completar el Nivel 10.

---

## 📈 Sistema de Dificultad (Balanceo)

La dificultad se calcula matemáticamente en cada transición de nivel para evitar picos frustrantes:
* **Velocidad (`speed`):** Incrementa gradualmente en saltos de `0.25` por nivel.
* **Erraticidad (`erraticness`):** El movimiento en el eje X (de lado a lado) se multiplica, obligando al jugador a predecir el rebote.
* **Precisión (`radius`):** El tamaño máximo y mínimo de generación de las esferas se reduce `1.5px` por nivel. En el nivel 10, las esferas son pequeñas balas de luz.

---

## 📁 Estructura del Proyecto

```text
/
├── index.html              # Estructura del documento, maquetación UI e importaciones.
└── assets/
    ├── css/
    │   └── styles.css      # Estilos Neón, Glassmorphism y capas de imagen de fondo.
    ├── img/
    |   ├── favicon.png     # Imagen del Icono de la aplicaión.
    │   └── fondo.jpg       # Imagen abstracta de fondo.
    └── js/
        └── main.js         # Lógica del motor 2D, físicas, colisiones y estado del juego.
```
```

---

## 👤 Autor

* Desarrollado por Antonio Yáñez Hernández.
* Materia: Graficaión.
