# LAS 07 ESTRELLAS
### A 2D narrative adventure game built with HTML, CSS and JavaScript

**LAS 07 ESTRELLAS** es un videojuego de aventura narrativa en 2D desarrollado para navegador. La experiencia combina exploración, interacción con personajes y objetos, resolución de desafíos y progresión mediante la recuperación de siete recuerdos.

El jugador recorre siete mundos conectados por una historia central. Cada escenario introduce una situación y una mecánica específica que contribuye al avance de la experiencia hasta llegar al desenlace narrativo.

**Live Demo:** https://alexmio11.github.io/las07estrellas/  
**Source Code:** https://github.com/alexmio11/las07estrellas

---

## 1. Project Overview

| Attribute | Description |
|---|---|
| Project | LAS 07 ESTRELLAS |
| Type | 2D narrative adventure game |
| Platform | Web browser |
| Rendering | HTML Canvas 2D |
| Core technologies | HTML5, CSS3, JavaScript |
| Styling framework | Tailwind CSS |
| Typography | Google Fonts |
| Audio | Web Audio API |
| Language | Spanish |
| Structure | Seven interconnected worlds |
| Deployment | GitHub Pages |

The application runs in the browser and does not require a separate game-engine installation to launch the web version.

## 2. Core Features

- **Seven-world progression:** a sequence of narrative environments connected through the recovery of seven stars.
- **Interactive 2D environment:** canvas-based rendering and player interaction.
- **Character interaction:** dialogue sequences and narrative events involving the main characters.
- **Object interaction:** collection and use of objects required to advance through specific scenarios.
- **Time-based challenges:** countdown mechanics, including a train departure sequence.
- **Decision-based progression:** interactive challenges in which player choices or answers affect the immediate outcome.
- **World-specific challenges:** different objectives and interaction rules across the seven environments.
- **Audio controls:** background music and sound effects, with mute and playback controls.
- **Responsive interface elements:** on-screen controls and pointer-based interaction in addition to keyboard input.

## 3. World Structure

The experience is organized into seven narrative environments:

| World | Scenario | Main gameplay element |
|---|---|---|
| 01 | Christmas memory | Object interaction and reconstruction of a shared memory |
| 02 | The 02:30 PM Train | Timed movement, obstacles and train-platform objective |
| 03 | Miraflores memory | Exploration and narrative interaction |
| 04 | 21 Cards | Card-based challenge and decision-making |
| 05 | La Casa de los Faroles | Menu-order reconstruction challenge |
| 06 | Red Imperial Hall | Five-wardrobe progression challenge |
| 07 | La Confesión | Final narrative sequence aboard a Caribbean megayacht |

Each world contributes to the overall progression and the recovery of the seven stars.

## 4. Technology Stack

### Frontend

- **HTML5:** document structure, interface elements, navigation, dialogue panels and modal windows.
- **CSS3:** visual styling, animations, layout and interface presentation.
- **JavaScript:** application state, gameplay logic, interactions, progression and event handling.
- **Canvas API:** 2D game rendering and visual updates.
- **Tailwind CSS:** utility-based styling loaded through its CDN.
- **Google Fonts:** typography resources loaded externally.

### Browser APIs

- **Web Audio API:** audio synthesis and playback of musical sequences and sound effects.
- **Local Storage:** browser-side storage is referenced by the application for timer-state synchronization.

## 5. Repository Structure

```text
las07estrellas/
│
├── index.html
│
├── css/
│   └── style.css
│
├── js/
│   └── app.js
│
├── unity-csharp/
│   └── TrainStationLevelManager.cs
│
├── docs/
│   └── REGISTRO_DE_INTEGRIDAD.md
│
├── MANIFEST_SHA256.json
└── README.md
```

### File responsibilities

| File | Responsibility |
|---|---|
| `index.html` | Main document structure and interface |
| `css/style.css` | Custom styles and animations |
| `js/app.js` | Game state, rendering, interaction and gameplay logic |
| `unity-csharp/TrainStationLevelManager.cs` | Separate reference copy of the C# code displayed in the application |
| `docs/REGISTRO_DE_INTEGRIDAD.md` | Record of the source-file separation and integrity checks |
| `MANIFEST_SHA256.json` | File integrity manifest |

The JavaScript implementation is maintained in a single application file. It has not been divided into independent modules.

## 6. How to Run

### Option A — Online

Open the deployed application:

https://alexmio11.github.io/las07estrellas/

### Option B — Local execution

1. Clone or download the repository.
2. Preserve the existing directory structure.
3. Open the project folder in Visual Studio Code.
4. Launch `index.html` using Live Server, or open it in a modern browser.
5. Ensure an Internet connection is available for the external Tailwind CSS and Google Fonts resources.

No compilation or package installation step is defined in the current repository.

## 7. Controls

The interface provides keyboard, pointer and on-screen controls.

| Input | Action |
|---|---|
| W / A / S / D | Character movement |
| Arrow keys | Character movement |
| Pointer / touch | Movement target and direct interaction with supported objects |
| Space | Interaction or action |
| Shift | Running action |
| On-screen directional controls | Touch and mouse movement |
| Interface buttons | Dialogue, audio and game actions |

Specific interactions depend on the current world and its active gameplay state.

## 8. Development and Source Integrity

The repository preserves the separation of the original application into HTML, CSS and JavaScript files.

According to the project's integrity record:

- The CSS and JavaScript blocks were extracted from the original HTML source.
- The original JavaScript identifiers and execution order were preserved.
- The JavaScript remains in one file to avoid changing its global scope and dependencies.
- The C# preview remains in the HTML interface.
- A separate `.cs` copy was created from the C# code displayed in that preview.
- The JavaScript file was checked using `node --check`.
- A reconstruction comparison was performed to verify the integrity of the HTML, CSS and JavaScript separation.

These checks establish source separation and JavaScript syntax validation. They should not be interpreted as automated end-to-end browser testing.

## 9. Scope and Technical Notes

The published game is a browser-based implementation using HTML, CSS and JavaScript.

The presence of a C# reference file does not mean that the current web application is a Unity build. The `.cs` file is not integrated into the browser runtime and is not, by itself, a complete Unity project.

The current repository also uses external CDN resources for Tailwind CSS and Google Fonts. Their availability therefore depends on network access.

## 10. Project Status

The seven-world experience has been completed and manually tested by its developer.

The repository includes the source files, the deployed browser version and documentation concerning the separation of the original source code.

This project is presented as a completed personal development project, not as a commercial game release or a production-certified software product.

## 11. Author

**Alex Junior La Torre Mio**

Industrial Mechatronics Technician  
Independent Software and Interactive Project Development

GitHub: https://github.com/alexmio11

---

*LAS 07 ESTRELLAS — An independent project focused on interactive storytelling, browser-based game development and JavaScript programming.*
