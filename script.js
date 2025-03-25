document.addEventListener("DOMContentLoaded", function() {
    const teethRows = [
        { className: "row-1", teeth: [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28] },
        { className: "row-2", teeth: [55, 54, 53, 52, 51, 61, 62, 63, 64, 65] },
        { className: "row-3", teeth: [85, 84, 83, 82, 81, 71, 72, 73, 74, 75] },
        { className: "row-4", teeth: [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38] }
    ];
    const odontogramContainer = document.getElementById("odontogram");
    
    teethRows.forEach(row => {
        let rowDiv = document.createElement("div");
        rowDiv.classList.add("odontogram-row", row.className);
        
        row.teeth.forEach(num => {
            let tooth = document.createElement("div");
            tooth.classList.add("tooth");
            tooth.dataset.number = num;
            tooth.innerHTML = `<span>${num}</span>`;
            tooth.addEventListener("click", function() {
                addToTable(num, tooth);
            });
            rowDiv.appendChild(tooth);
        });
        
        odontogramContainer.appendChild(rowDiv);
    });

    document.getElementById("dentalForm").addEventListener("submit", function(event) {
        event.preventDefault();
        showSummary();
    });
});

function addToTable(num, toothElement) {
    let table = document.querySelector("#toothTable tbody");
    if ([...table.rows].some(row => row.cells[0].textContent == num)) return;
    
    let row = table.insertRow();
    row.insertCell(0).textContent = "KG" + num;
    
    let statusCell = row.insertCell(1);
    let select = document.createElement("select");
    ["Tambalan Amalgram", "Tambalan Composit", "GIC", "Karies"].forEach(option => {
        let opt = document.createElement("option");
        opt.value = option;
        opt.textContent = option;
        select.appendChild(opt);
    });
    statusCell.appendChild(select);
    
    let keteranganCell = row.insertCell(2);
    let input = document.createElement("input");
    input.type = "text";
    keteranganCell.appendChild(input);
    
    let actionCell = row.insertCell(3);
    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Hapus";
    deleteBtn.addEventListener("click", function() {
        row.remove();
        toothElement.classList.remove("selected");
    });
    actionCell.appendChild(deleteBtn);
    
    toothElement.classList.add("selected");
}

function showSummary() {
    let summaryContainer = document.getElementById("summary");
    if (!summaryContainer) {
        summaryContainer = document.createElement("div");
        summaryContainer.id = "summary";
        summaryContainer.style.padding = "20px";
        summaryContainer.style.margin = "20px auto";
        summaryContainer.style.maxWidth = "600px";
        summaryContainer.style.border = "1px solid black";
        summaryContainer.style.backgroundColor = "#f9f9f9";
        document.body.appendChild(summaryContainer);
    }
    
    let formData = new FormData(document.getElementById("dentalForm"));
    let tableData = [];
    document.querySelectorAll("#toothTable tbody tr").forEach(row => {
        let rowData = {
            nomorGigi: row.cells[0].textContent,
            status: row.cells[1].querySelector("select").value,
            keterangan: row.cells[2].querySelector("input").value
        };
        tableData.push(rowData);
    });
    
    let summaryHTML = "<h2>Pengkajian Gigi dan Mulut</h2>";
    formData.forEach((value, key) => {
        if (value.trim()) {
            summaryHTML += `<p><strong>${key}:</strong> ${value}</p>`;
        }
    });
    
    if (tableData.length > 0) {
        summaryHTML += "<h3>Data Gigi</h3><ul>";
        tableData.forEach(data => {
            summaryHTML += `<li>${data.nomorGigi}: ${data.status} (${data.keterangan})</li>`;
        });
        summaryHTML += "</ul>";
    }
    
    summaryContainer.innerHTML = summaryHTML;
}