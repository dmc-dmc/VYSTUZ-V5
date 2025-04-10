document.addEventListener('DOMContentLoaded', function() {
    // Naplnenie dropdown-ov pre triedy betónu a ocele
    populateMaterialDropdowns();
    
    // Naplnenie dropdown-ov pre priemery výstuže
    populateReinforcementDiametersDropdowns();
    
    // Inicializácia tabuľky kotevnej dĺžky
    createAnchorageTable();
    
    // Inicializácia tabuľky plôch výstuže
    createReinforcementTable();
    
    // Inicializácia ovládačov záložiek
    initTabs();
    
    // Inicializácia modálneho okna
    initModal();
    
    // Inicializácia ovládačov pre projekty
    initProjectControls();
    
    // Inicializácia tlačidiel pre výpočty
    initCalculationButtons();
    
    // Inicializácia tlačidiel pre zobrazenie detailov
    initToggleButtons();
});

// Funkcia na naplnenie dropdown-ov pre materiály
function populateMaterialDropdowns() {
    const concreteSelects = [
        document.getElementById('concrete-class'),
        document.getElementById('anchorage-concrete-class')
    ];
    
    const steelSelects = [
        document.getElementById('steel-class'),
        document.getElementById('anchorage-steel-class')
    ];
    
    // Naplnenie dropdown-ov pre betón
    for (const select of concreteSelects) {
        for (const concreteClass in concreteClasses) {
            const option = document.createElement('option');
            option.value = concreteClass;
            option.textContent = concreteClass;
            select.appendChild(option);
        }
    }
    
    // Naplnenie dropdown-ov pre oceľ
    for (const select of steelSelects) {
        for (const steelClass in steelClasses) {
            const option = document.createElement('option');
            option.value = steelClass;
            option.textContent = steelClass;
            select.appendChild(option);
        }
    }
}

// Funkcia na naplnenie dropdown-ov pre priemery výstuže
function populateReinforcementDiametersDropdowns() {
    const diameterSelects = [
        document.getElementById('phi_sl_bottom'),
        document.getElementById('phi_sl_top'),
        document.getElementById('phi_ss'),
        document.getElementById('anchorage-phi')
    ];
    
    // Získanie priemerov z tabuľky
    const availableDiameters = reinforcementAreas.rows.map(row => row.diameter);
    
    // Pridanie prázdnej možnosti
    for (const select of diameterSelects) {
        const emptyOption = document.createElement('option');
        emptyOption.value = "";
        emptyOption.textContent = "-- Vyberte priemer --";
        select.appendChild(emptyOption);
        
        // Naplnenie dropdown-ov priemery
        for (const diameter of availableDiameters) {
            const option = document.createElement('option');
            option.value = diameter;
            option.textContent = `ϕ${diameter} mm`;
            select.appendChild(option);
        }
    }
}

// Funkcia na vytvorenie tabuľky kotevnej dĺžky
function createAnchorageTable() {
    const tableContainer = document.getElementById('kotevna-tabulka');
    
    // Vytvorenie tabuľky
    const table = document.createElement('table');
    
    // Vytvorenie hlavičky
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    // Pridanie hlavičky s fcm hodnotami
    for (const header of kotevnaTabulka.headers) {
        const th = document.createElement('th');
        if (header === 'ϕ [mm]') {
            th.textContent = header;
        } else {
            th.innerHTML = `f<sub>ck</sub> = ${header}`;
        }
        headerRow.appendChild(th);
    }
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Vytvorenie tela tabuľky
    const tbody = document.createElement('tbody');
    
    for (const row of kotevnaTabulka.rows) {
        const tr = document.createElement('tr');
        
        // Priemer prúta
        const diameterCell = document.createElement('td');
        diameterCell.textContent = row.diameter;
        tr.appendChild(diameterCell);
        
        // Hodnoty koeficientov
        for (const value of row.values) {
            const td = document.createElement('td');
            td.textContent = value;
            tr.appendChild(td);
        }
        
        tbody.appendChild(tr);
    }
    
    table.appendChild(tbody);
    tableContainer.appendChild(table);
    
    // Pridanie poznámky
    const note = document.createElement('p');
    note.textContent = "POZNÁMKA: Hodnoty tabuľky sú odvodené zo vzorca (11.3).";
    tableContainer.appendChild(note);
    
    // Pridanie poznámky pre typy ocele
    const steelNote = document.createElement('p');
    steelNote.innerHTML = `
        <ul>
            <li>Pre betonársku oceľ B450 treba l<sub>bd</sub> prenásobiť súčiniteľom 0,85</li>
            <li>Pre betonársku oceľ B550 treba l<sub>bd</sub> prenásobiť súčiniteľom 1,15</li>
        </ul>
    `;
    tableContainer.appendChild(steelNote);
    
    // Pridanie vzorca pre stykovaciu dĺžku
    const formula = document.createElement('div');
    formula.classList.add('formula');
    formula.innerHTML = `
        <p>l<sub>sd</sub> = l<sub>bd</sub> &times; k<sub>ls</sub></p>
        <p>Kde: platí k<sub>ls</sub> = 1,2</p>
        <p>l<sub>sd</sub> - stykovacia dĺžka prúta</p>
        <p>l<sub>bd</sub> - kotevná dĺžka stĺpa</p>
    `;
    tableContainer.appendChild(formula);
}

// Funkcia na vytvorenie tabuľky plôch výstuže
function createReinforcementTable() {
    const tableContainer = document.getElementById('reinforcement-table');
    
    // Vytvorenie tabuľky
    const table = document.createElement('table');
    
    // Vytvorenie hlavičky
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    // Pridanie hlavičky
    for (const header of reinforcementAreas.headers) {
        const th = document.createElement('th');
        th.innerHTML = header;
        headerRow.appendChild(th);
    }
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Vytvorenie tela tabuľky
    const tbody = document.createElement('tbody');
    
    for (const row of reinforcementAreas.rows) {
        const tr = document.createElement('tr');
        
        // Priemer prúta
        const diameterCell = document.createElement('td');
        diameterCell.textContent = row.diameter;
        tr.appendChild(diameterCell);
        
        // Hodnoty plôch pre rôzne počty prútov
        for (const value of row.values) {
            const td = document.createElement('td');
            td.textContent = value;
            tr.appendChild(td);
        }
        
        // Hmotnosť
        const weightCell = document.createElement('td');
        weightCell.textContent = row.weight;
        tr.appendChild(weightCell);
        
        tbody.appendChild(tr);
    }
    
    table.appendChild(tbody);
    tableContainer.appendChild(table);
    
    // Pridanie poznámky
    const note = document.createElement('p');
    note.textContent = "Plochy výstuže A_s sú uvedené v cm², hmotnosť je uvedená v kg/m.";
    tableContainer.appendChild(note);
    
    // Pridanie vysvetlenia
    const explanation = document.createElement('div');
    explanation.innerHTML = `
        <p>Pre výpočet plochy výstuže s počtom prútov väčším ako 9 sa používa kombinácia hodnôt z tabuľky.</p>
        <p>Napríklad pre 21 prútov ϕ16 sa použije 3× hodnota pre 7 prútov: 3 × 14,07 = 42,21 cm²</p>
    `;
    tableContainer.appendChild(explanation);
}

// Funkcia na inicializáciu záložiek
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Odstránenie active class zo všetkých tlačidiel a obsahu
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Pridanie active class k vybranému tlačidlu a obsahu
            button.classList.add('active');
            const tabId = button.dataset.tab + '-tab';
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Funkcia na inicializáciu modálneho okna
function initModal() {
    // Modálne okno pre kotevnú dĺžku
    const kotevnyModal = document.getElementById('tableModal');
    const kotevnyBtn = document.getElementById('showTable');
    const kotevnySpan = kotevnyModal.querySelector('.close');
    
    kotevnyBtn.addEventListener('click', () => {
        kotevnyModal.style.display = 'block';
    });
    
    kotevnySpan.addEventListener('click', () => {
        kotevnyModal.style.display = 'none';
    });
    
    // Modálne okno pre plochy výstuže
    const reinforcementModal = document.getElementById('reinforcementTableModal');
    const reinforcementBtn = document.getElementById('showReinforcementTable');
    const reinforcementSpan = reinforcementModal.querySelector('.close');
    
    reinforcementBtn.addEventListener('click', () => {
        reinforcementModal.style.display = 'block';
    });
    
    reinforcementSpan.addEventListener('click', () => {
        reinforcementModal.style.display = 'none';
    });
    
    // Zatvoriť modálne okná kliknutím mimo obsahu
    window.addEventListener('click', (event) => {
        if (event.target === kotevnyModal) {
            kotevnyModal.style.display = 'none';
        }
        if (event.target === reinforcementModal) {
            reinforcementModal.style.display = 'none';
        }
    });
}

// Funkcia na inicializáciu ovládačov pre projekty
function initProjectControls() {
    const saveBtn = document.getElementById('saveProject');
    const loadBtn = document.getElementById('loadProject');
    const projectName = document.getElementById('projectName');
    const projectsList = document.getElementById('projectsList');
    
    // Tlačidlo pre uloženie projektu
    saveBtn.addEventListener('click', () => {
        const data = collectFormData();
        const result = ProjectManager.saveProject(projectName.value, data);
        
        if (result.success) {
            alert(result.message);
        } else {
            alert(result.message);
        }
    });
    
    // Tlačidlo pre načítanie projektu
    loadBtn.addEventListener('click', () => {
        // Naplnenie a zobrazenie dropdown-u s projektami
        const projectNames = ProjectManager.getProjectNames();
        
        projectsList.innerHTML = '';
        projectNames.forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            projectsList.appendChild(option);
        });
        
        // Zobrazenie dropdownu alebo hlásenie, že nie sú projekty
        if (projectNames.length > 0) {
            projectsList.style.display = 'inline-block';
            
            projectsList.addEventListener('change', () => {
                const name = projectsList.value;
                const result = ProjectManager.loadProject(name);
                
                if (result.success) {
                    fillFormWithData(result.data);
                    projectName.value = name;
                    projectsList.style.display = 'none';
                } else {
                    alert(result.message);
                }
            });
        } else {
            alert('Žiadne uložené projekty');
        }
    });
}

// Funkcia na zber dát z formulára
function collectFormData() {
    return {
        // Základné parametre
        width: parseFloat(document.getElementById('width').value),
        height: parseFloat(document.getElementById('height').value),
        c_nom: parseFloat(document.getElementById('c_nom').value),
        
        // Materiály
        concreteClass: document.getElementById('concrete-class').value,
        steelClass: document.getElementById('steel-class').value,
        gammaC: parseFloat(document.getElementById('gamma-c').value),
        gammaS: parseFloat(document.getElementById('gamma-s').value),
        
        // Dolná výstuž
        phi_sl_bottom: parseInt(document.getElementById('phi_sl_bottom').value),
        n_bottom: parseInt(document.getElementById('n_bottom').value),
        
        // Horná výstuž
        phi_sl_top: parseInt(document.getElementById('phi_sl_top').value),
        n_top: parseInt(document.getElementById('n_top').value),
        
        // Strmene
        phi_ss: parseInt(document.getElementById('phi_ss').value),
        
        // Vystuženie
        minReinforcement: parseFloat(document.getElementById('min-reinforcement').value),
        maxReinforcement: parseFloat(document.getElementById('max-reinforcement').value),
        
        // Kotevná dĺžka
        anchorageConcreteClass: document.getElementById('anchorage-concrete-class').value,
        anchorageSteelClass: document.getElementById('anchorage-steel-class').value,
        anchoragePhi: parseInt(document.getElementById('anchorage-phi').value)
    };
}

// Funkcia na naplnenie formulára dátami
function fillFormWithData(data) {
    // Základné parametre
    document.getElementById('width').value = data.width || '';
    document.getElementById('height').value = data.height || '';
    document.getElementById('c_nom').value = data.c_nom || '';
    
    // Materiály
    if (data.concreteClass) document.getElementById('concrete-class').value = data.concreteClass;
    if (data.steelClass) document.getElementById('steel-class').value = data.steelClass;
    document.getElementById('gamma-c').value = data.gammaC || 1.5;
    document.getElementById('gamma-s').value = data.gammaS || 1.15;
    
    // Dolná výstuž
    if (data.phi_sl_bottom) document.getElementById('phi_sl_bottom').value = data.phi_sl_bottom;
    document.getElementById('n_bottom').value = data.n_bottom || '';
    
    // Horná výstuž
    if (data.phi_sl_top) document.getElementById('phi_sl_top').value = data.phi_sl_top;
    document.getElementById('n_top').value = data.n_top || '';
    
    // Strmene
    if (data.phi_ss) document.getElementById('phi_ss').value = data.phi_ss;
    
    // Vystuženie
    document.getElementById('min-reinforcement').value = data.minReinforcement || 0.2;
    document.getElementById('max-reinforcement').value = data.maxReinforcement || 4.0;
    
    // Kotevná dĺžka
    if (data.anchorageConcreteClass) document.getElementById('anchorage-concrete-class').value = data.anchorageConcreteClass;
    if (data.anchorageSteelClass) document.getElementById('anchorage-steel-class').value = data.anchorageSteelClass;
    if (data.anchoragePhi) document.getElementById('anchorage-phi').value = data.anchoragePhi;
}

// Funkcia na inicializáciu tlačidiel pre výpočty
function initCalculationButtons() {
    const spacingButton = document.getElementById('calculateSpacing');
    const anchorageButton = document.getElementById('calculateAnchorage');
    
    // Tlačidlo pre výpočet rozostupov
    spacingButton.addEventListener('click', () => {
        calculateAndDisplaySpacing();
    });
    
    // Tlačidlo pre výpočet kotevnej dĺžky
    anchorageButton.addEventListener('click', () => {
        calculateAndDisplayAnchorage();
    });
}

// Funkcia na výpočet a zobrazenie rozostupov
function calculateAndDisplaySpacing() {
    // Získanie hodnôt z formulára
    const width = parseFloat(document.getElementById('width').value);
    const height = parseFloat(document.getElementById('height').value);
    const c_nom = parseFloat(document.getElementById('c_nom').value);
    const phi_sl_bottom = parseInt(document.getElementById('phi_sl_bottom').value);
    const n_bottom = parseInt(document.getElementById('n_bottom').value);
    const phi_sl_top = parseInt(document.getElementById('phi_sl_top').value);
    const n_top = parseInt(document.getElementById('n_top').value);
    const phi_ss = parseInt(document.getElementById('phi_ss').value);
    
    // Kontrola vstupov
    if (isNaN(width) || isNaN(height) || isNaN(c_nom) || isNaN(phi_ss)) {
        alert('Zadajte všetky základné parametre (šírka, výška, krytie, priemer strmeňa)');
        return;
    }
    
    if ((isNaN(phi_sl_bottom) || isNaN(n_bottom)) && (isNaN(phi_sl_top) || isNaN(n_top))) {
        alert('Zadajte parametre aspoň pre jednu skupinu výstuže (dolná alebo horná)');
        return;
    }
    
    // Výpočet rozostupov pre dolnú výstuž
    let spacingBottom = { error: "Nezadané parametre pre dolnú výstuž" };
    if (!isNaN(phi_sl_bottom) && !isNaN(n_bottom) && n_bottom > 0) {
        spacingBottom = calculateSpacing(width, height, c_nom, phi_sl_bottom, n_bottom, phi_ss);
    }
    
    // Výpočet rozostupov pre hornú výstuž
    let spacingTop = { error: "Nezadané parametre pre hornú výstuž" };
    if (!isNaN(phi_sl_top) && !isNaN(n_top) && n_top > 0) {
        spacingTop = calculateSpacing(width, height, c_nom, phi_sl_top, n_top, phi_ss);
    }
    
    // Výpočet materiálových charakteristík
    const concreteClass = document.getElementById('concrete-class').value;
    const steelClass = document.getElementById('steel-class').value;
    const gammaC = parseFloat(document.getElementById('gamma-c').value);
    const gammaS = parseFloat(document.getElementById('gamma-s').value);
    const materialProps = calculateMaterialProperties(concreteClass, steelClass, gammaC, gammaS);
    
    // Výpočet stupňa vystuženia
    const reinforcement = calculateReinforcement(
        width, height, 
        isNaN(phi_sl_bottom) ? 0 : phi_sl_bottom, 
        isNaN(n_bottom) ? 0 : n_bottom, 
        isNaN(phi_sl_top) ? 0 : phi_sl_top, 
        isNaN(n_top) ? 0 : n_top
    );
    
    // Posúdenie stupňa vystuženia
    const minReinforcement = parseFloat(document.getElementById('min-reinforcement').value) / 100;
    const maxReinforcement = parseFloat(document.getElementById('max-reinforcement').value) / 100;
    
    let reinforcementStatus = "V poriadku";
    let reinforcementStatusClass = "success";
    
    if (reinforcement.reinforcement_ratio < minReinforcement) {
        reinforcementStatus = "Nedostatočné vystuženie";
        reinforcementStatusClass = "error";
    } else if (reinforcement.reinforcement_ratio > maxReinforcement) {
        reinforcementStatus = "Nadmerné vystuženie";
        reinforcementStatusClass = "warning";
    }
    
    // Zobrazenie výsledkov
    const resultsContent = document.getElementById('results-content');
    
    let resultsHTML = `
        <h3>Materiálové charakteristiky</h3>
        <p>Betón ${concreteClass}: f<sub>ck</sub> = ${materialProps.fck} MPa, f<sub>cd</sub> = ${materialProps.fcd.toFixed(2)} MPa, f<sub>ctm</sub> = ${materialProps.fctm} MPa</p>
        <p>Oceľ ${steelClass}: f<sub>yk</sub> = ${materialProps.fyk} MPa, f<sub>yd</sub> = ${materialProps.fyd.toFixed(2)} MPa</p>
        
        <h3>Rozostupy výstuže</h3>
    `;
    
    if (spacingBottom.error === null) {
        resultsHTML += `
            <p>Dolná výstuž (${n_bottom}×ϕ${phi_sl_bottom}): ${spacingBottom.spacing.toFixed(2)} mm</p>
        `;
    } else if (spacingBottom.error !== "Nezadané parametre pre dolnú výstuž") {
        resultsHTML += `
            <p class="error">Dolná výstuž: ${spacingBottom.error}</p>
        `;
    }
    
    if (spacingTop.error === null) {
        resultsHTML += `
            <p>Horná výstuž (${n_top}×ϕ${phi_sl_top}): ${spacingTop.spacing.toFixed(2)} mm</p>
        `;
    } else if (spacingTop.error !== "Nezadané parametre pre hornú výstuž") {
        resultsHTML += `
            <p class="error">Horná výstuž: ${spacingTop.error}</p>
        `;
    }
    
    resultsHTML += `
        <h3>Stupeň vystuženia</h3>
        <p>Plocha dolnej výstuže: ${reinforcement.area_bottom.toFixed(2)} cm²</p>
        <p>Plocha hornej výstuže: ${reinforcement.area_top.toFixed(2)} cm²</p>
        <p>Celková plocha výstuže: ${reinforcement.total_area.toFixed(2)} cm²</p>
        <p>Plocha betónu: ${reinforcement.concrete_area.toFixed(2)} cm²</p>
        <p>Stupeň vystuženia: ${reinforcement.reinforcement_ratio.toFixed(6)} 
           (${reinforcement.reinforcement_percent.toFixed(4)}%, 
           ${reinforcement.reinforcement_permille.toFixed(2)}‰)</p>
        <p class="${reinforcementStatusClass}">Posúdenie: ${reinforcementStatus} 
           (limit: ${(minReinforcement * 100).toFixed(2)}-${(maxReinforcement * 100).toFixed(2)}%)</p>
    `;
    
    resultsContent.innerHTML = resultsHTML;
    
    // Vykreslenie grafického znázornenia
    const canvas = document.getElementById('visualization-canvas');
    const params = {
        width, height, c_nom, phi_ss,
        phi_sl_bottom: isNaN(phi_sl_bottom) ? 0 : phi_sl_bottom,
        n_bottom: isNaN(n_bottom) ? 0 : n_bottom,
        phi_sl_top: isNaN(phi_sl_top) ? 0 : phi_sl_top,
        n_top: isNaN(n_top) ? 0 : n_top
    };
    
    drawCrossSection(canvas, params);
    updateLegend(params);
    
    // Zostavenie detailov výpočtu
    const calcDetailsContent = document.getElementById('calc-details-content');
    
    let detailsHTML = `
        <h4>Parametre výpočtu</h4>
        <p>Šírka prvku b = ${width} mm</p>
        <p>Výška prvku h = ${height} mm</p>
        <p>Krytie výstuže c_nom = ${c_nom} mm</p>
        <p>Priemer strmeňa ϕ_ss = ${phi_ss} mm</p>
    `;
    
    if (!isNaN(phi_sl_bottom) && !isNaN(n_bottom) && n_bottom > 0) {
        detailsHTML += `
            <h4>Výpočet rozostupu dolnej výstuže</h4>
            <p>Priemer pozdĺžnej výstuže ϕ_sl = ${phi_sl_bottom} mm</p>
            <p>Počet prutov n = ${n_bottom}</p>
            <p>Vnútorná šírka po odpočítaní krytia a priemerov = ${spacingBottom.clearWidth.toFixed(2)} mm</p>
            <p>Výpočet rozostupu: (b - 2×c_nom - 2×ϕ_ss - ϕ_sl) / (n-1) = 
               (${width} - 2×${c_nom} - 2×${phi_ss} - ${phi_sl_bottom}) / (${n_bottom}-1) = 
               ${spacingBottom.spacing.toFixed(2)} mm</p>
        `;
    }
    
    if (!isNaN(phi_sl_top) && !isNaN(n_top) && n_top > 0) {
        detailsHTML += `
            <h4>Výpočet rozostupu hornej výstuže</h4>
            <p>Priemer pozdĺžnej výstuže ϕ_sl = ${phi_sl_top} mm</p>
            <p>Počet prutov n = ${n_top}</p>
            <p>Vnútorná šírka po odpočítaní krytia a priemerov = ${spacingTop.clearWidth.toFixed(2)} mm</p>
            <p>Výpočet rozostupu: (b - 2×c_nom - 2×ϕ_ss - ϕ_sl) / (n-1) = 
               (${width} - 2×${c_nom} - 2×${phi_ss} - ${phi_sl_top}) / (${n_top}-1) = 
               ${spacingTop.spacing.toFixed(2)} mm</p>
        `;
    }
    
    detailsHTML += `
        <h4>Výpočet stupňa vystuženia</h4>
        <p>Plocha dolnej výstuže = ${reinforcement.area_bottom.toFixed(2)} cm² (podľa tabuľky pre ${isNaN(n_bottom) ? 0 : n_bottom} prútov ϕ${isNaN(phi_sl_bottom) ? 0 : phi_sl_bottom})</p>
        <p>Plocha hornej výstuže = ${reinforcement.area_top.toFixed(2)} cm² (podľa tabuľky pre ${isNaN(n_top) ? 0 : n_top} prútov ϕ${isNaN(phi_sl_top) ? 0 : phi_sl_top})</p>
        <p>Celková plocha výstuže = ${reinforcement.area_bottom.toFixed(2)} + ${reinforcement.area_top.toFixed(2)} = 
           ${reinforcement.total_area.toFixed(2)} cm²</p>
        <p>Plocha betónového prvku = b × h = ${width} × ${height} = ${reinforcement.concrete_area.toFixed(2)} cm²</p>
        <p>Stupeň vystuženia = A_s / (b × h) = ${reinforcement.total_area.toFixed(2)} / ${reinforcement.concrete_area.toFixed(2)} = 
           ${reinforcement.reinforcement_ratio.toFixed(6)}</p>
        <p>Stupeň vystuženia v percentách = ρ × 100% = ${reinforcement.reinforcement_ratio.toFixed(6)} × 100% = 
           ${reinforcement.reinforcement_percent.toFixed(4)}%</p>
        <p>Stupeň vystuženia v promile = ρ × 1000‰ = ${reinforcement.reinforcement_ratio.toFixed(6)} × 1000‰ = 
           ${reinforcement.reinforcement_permille.toFixed(2)}‰</p>
    `;
    
    calcDetailsContent.innerHTML = detailsHTML;
}

// Funkcia na výpočet a zobrazenie kotevnej dĺžky
function calculateAndDisplayAnchorage() {
    // Získanie hodnôt z formulára
    const concreteClass = document.getElementById('anchorage-concrete-class').value;
    const steelClass = document.getElementById('anchorage-steel-class').value;
    const phi = parseInt(document.getElementById('anchorage-phi').value);
    
    // Kontrola vstupov
    if (isNaN(phi)) {
        alert('Zadajte priemer prúta');
        return;
    }
    
    // Výpočet kotevnej dĺžky
    const result = calculateAnchorageLength(concreteClass, steelClass, phi);
    
    // Zobrazenie výsledkov
    const resultsContent = document.getElementById('anchorage-results-content');
    
    if (result.error) {
        resultsContent.innerHTML = `<p class="error">${result.error}</p>`;
        return;
    }
    
    const resultsHTML = `
        <h3>Kotevná a stykovacia dĺžka</h3>
        <p>Trieda betónu: ${concreteClass}</p>
        <p>Trieda ocele: ${steelClass}</p>
        <p>Priemer prúta: ϕ${phi} mm</p>
        <p>Koeficient z tabuľky: ${result.coefficient}</p>
        <p>Koeficient pre oceľ: ${result.steelCoefficient}</p>
        <p>Kotevná dĺžka: l<sub>bd</sub> = ${result.anchorageLength.toFixed(2)} mm</p>
        <p>Stykovacia dĺžka: l<sub>sd</sub> = l<sub>bd</sub> × k<sub>ls</sub> = ${result.anchorageLength.toFixed(2)} × 1.2 = ${result.spliceLength.toFixed(2)} mm</p>
    `;
    
    resultsContent.innerHTML = resultsHTML;
}

// Funkcia na inicializáciu tlačidiel pre zobrazenie detailov
function initToggleButtons() {
    const calcDetailsBtn = document.getElementById('showCalcDetails');
    const calcDetailsContent = document.getElementById('calculation-details');
    
    calcDetailsBtn.addEventListener('click', () => {
        if (calcDetailsContent.style.display === 'none') {
            calcDetailsContent.style.display = 'block';
            calcDetailsBtn.textContent = 'Skryť detaily výpočtu';
        } else {
            calcDetailsContent.style.display = 'none';
            calcDetailsBtn.textContent = 'Zobraziť detaily výpočtu';
        }
    });
}