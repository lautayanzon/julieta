// CSV público de Google Sheets
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTzv4lNx2IhX8bXMNd8vtTrzRkMHub5LudSDHA3ww2Ih5koN8piVjHyRbdaZDdOGl_TBNom7shYsK-x/pub?output=csv";

// -------------------------
// 1. Cargar datos del CSV
// -------------------------
async function cargarDatos() {
    const res = await fetch(SHEET_URL);
    const csv = await res.text();
    return parseCSV(csv);
}

// -------------------------
// 2. Parsear CSV → array objetos
// -------------------------
function parseCSV(csv) {
    const lineas = csv.trim().split("\n");
    const columnas = lineas[0].split(",");

    return lineas.slice(1).map(linea => {
        const valores = linea.split(",");
        let obj = {};

        columnas.forEach((col, i) => {
            let valor = valores[i] ? valores[i].trim() : "";

            // Limpieza específica para columnas de imagen
            if (col.trim() === "imagen" || col.trim() === "imagen_final") {
                valor = valor
                    .replace(/^"+|"+$/g, "") // quita comillas iniciales y finales
                    .replace(/\r/g, "")     // quita retorno de carro
                    .trim();
            }

            obj[col.trim()] = valor;
        });

        return obj;
    });
}

// -------------------------
// 3. Renderizar usando TEMPLATE
// -------------------------
function renderRanking(datos) {
    const cont = document.getElementById("app");
    const template = document.getElementById("card-template");

    cont.innerHTML = "";

    datos
        .sort((a, b) => parseFloat(b.puntaje) - parseFloat(a.puntaje))
        .forEach(item => {
            const clone = template.content.cloneNode(true);

            clone.querySelector(".card-img").src = item.imagen;
            clone.querySelector(".card-img").alt = item.nombre;

            clone.querySelector(".card-title").textContent = item.nombre;
            clone.querySelector(".card-score").textContent = `Puntaje: ${item.puntaje}`;

            if (item.comentario) {
                const p = document.createElement("p");
                p.className = "card-comment";
                p.textContent = item.comentario;
                clone.querySelector(".card").appendChild(p);
            }

            cont.appendChild(clone);
        });
}

// Ejecutar
cargarDatos().then(renderRanking);
