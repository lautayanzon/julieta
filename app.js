// Pega acá TU link público del CSV exportado desde Google Sheets
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTzv4lNx2IhX8bXMNd8vtTrzRkMHub5LudSDHA3ww2Ih5koN8piVjHyRbdaZDdOGl_TBNom7shYsK-x/pub?output=csv";

async function cargarDatos() {
    const res = await fetch(SHEET_URL);
    const csv = await res.text();
    return parseCSV(csv);
}

function parseCSV(csv) {
    const lineas = csv.trim().split("\n");
    const columnas = lineas[0].split(",");

    return lineas.slice(1).map(linea => {
        const valores = linea.split(",");
        let obj = {};
        columnas.forEach((col, i) => obj[col.trim()] = valores[i].trim());
        return obj;
    });
}

function renderRanking(datos) {
    const cont = document.getElementById("ranking");

    datos
        .sort((a, b) => parseFloat(b.puntaje) - parseFloat(a.puntaje))
        .forEach(item => {
            const div = document.createElement("div");
            div.className = "item";
            div.innerHTML = `
        <strong>${item.nombre}</strong>
        Puntaje: ${item.puntaje}<br>
        <em>${item.comentario || ""}</em>
      `;
            cont.appendChild(div);
        });
}

cargarDatos().then(renderRanking);
