// Údaje o betóne a oceli
const concreteClasses = {
    'C12/15': { fck: 12, fctm: 1.6 },
    'C16/20': { fck: 16, fctm: 1.9 },
    'C20/25': { fck: 20, fctm: 2.2 },
    'C25/30': { fck: 25, fctm: 2.6 },
    'C30/37': { fck: 30, fctm: 2.9 },
    'C35/45': { fck: 35, fctm: 3.2 },
    'C40/50': { fck: 40, fctm: 3.5 },
    'C45/55': { fck: 45, fctm: 3.8 },
    'C50/60': { fck: 50, fctm: 4.1 }
};

const steelClasses = {
    'B500B': { fyk: 500 },
    'B550B': { fyk: 550 },
    'B450B': { fyk: 450 }
};

// Tabuľka kotevnej dĺžky
const kotevnaTabulka = {
    headers: ['ϕ [mm]', '20', '25', '30', '35', '40', '45', '50', '60'],
    rows: [
        { diameter: '≤ 12', values: [47, 42, 38, 36, 33, 31, 30, 27] },
        { diameter: '14', values: [50, 44, 41, 38, 35, 33, 31, 29] },
        { diameter: '16', values: [52, 46, 42, 39, 37, 35, 33, 30] },
        { diameter: '18', values: [54, 48, 44, 41, 39, 36, 34, 31] },
        { diameter: '20', values: [56, 50, 46, 42, 40, 37, 35, 32] },
        { diameter: '25', values: [60, 54, 49, 46, 43, 40, 38, 35] },
        { diameter: '28', values: [63, 56, 51, 47, 44, 42, 40, 36] },
        { diameter: '32', values: [65, 58, 53, 49, 46, 44, 41, 38] }
    ]
};

// Tabuľka plôch výstuže
const reinforcementAreas = {
    headers: ['ϕ [mm]', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'hmotnosť [kg/m]'],
    rows: [
        { diameter: 6, values: [0.282, 0.57, 0.85, 1.13, 1.41, 1.70, 1.98, 2.26, 2.54], weight: 0.222 },
        { diameter: 7, values: [0.384, 0.77, 1.15, 1.54, 1.92, 2.31, 2.69, 3.08, 3.46], weight: 0.302 },
        { diameter: 8, values: [0.502, 1.01, 1.51, 2.01, 2.51, 3.02, 3.52, 4.02, 4.52], weight: 0.395 },
        { diameter: 10, values: [0.785, 1.57, 2.36, 3.14, 3.93, 4.71, 5.50, 6.28, 7.07], weight: 0.617 },
        { diameter: 12, values: [1.130, 2.26, 3.39, 4.52, 5.65, 6.79, 7.92, 9.05, 10.18], weight: 0.888 },
        { diameter: 14, values: [1.539, 3.08, 4.62, 6.16, 7.70, 9.24, 10.78, 12.32, 13.85], weight: 1.208 },
        { diameter: 16, values: [2.010, 4.02, 6.03, 8.04, 10.05, 12.06, 14.07, 16.08, 18.10], weight: 1.578 },
        { diameter: 18, values: [2.544, 5.09, 7.63, 10.18, 12.72, 15.27, 17.81, 20.36, 22.90], weight: 1.998 },
        { diameter: 20, values: [3.141, 6.28, 9.42, 12.57, 15.71, 18.85, 21.99, 25.13, 28.27], weight: 2.466 },
        { diameter: 22, values: [3.801, 7.60, 11.40, 15.21, 19.01, 22.81, 26.61, 30.41, 34.21], weight: 2.984 },
        { diameter: 25, values: [4.908, 9.82, 14.73, 19.63, 24.54, 29.45, 34.36, 39.27, 44.18], weight: 3.853 },
        { diameter: 28, values: [6.157, 12.32, 18.47, 24.63, 30.79, 36.95, 43.10, 49.26, 55.42], weight: 4.834 },
        { diameter: 32, values: [8.042, 16.08, 24.13, 32.17, 40.21, 48.25, 56.30, 64.34, 72.38], weight: 6.313 },
        { diameter: 36, values: [10.178, 20.36, 30.54, 40.72, 50.89, 61.07, 71.25, 81.43, 91.61], weight: 7.990 },
        { diameter: 40, values: [12.566, 25.13, 37.70, 50.27, 62.83, 75.40, 87.96, 100.53, 113.10], weight: 9.864 },
        { diameter: 45, values: [15.904, 31.81, 47.71, 63.62, 79.52, 95.43, 111.33, 127.23, 143.14], weight: 12.485 },
        { diameter: 50, values: [19.634, 39.27, 58.90, 78.54, 98.17, 117.81, 137.44, 157.08, 176.71], weight: 15.413 }
    ]
};

// Koeficienty pre typy ocele
const steelCoefficients = {
    'B450B': 0.85,
    'B500B': 1.0,
    'B550B': 1.15
};

// Funkcia na výpočet rozostupov výstuže
function calculateSpacing(width, height, c_nom, phi_sl, n, phi_ss) {
    if (n <= 1) return { spacing: 0, error: "Počet prutov musí byť väčší ako 1" };
    
    // Výpočet vnútornej šírky po odpočítaní krytia a priemerov
    const clearWidth = width - 2 * c_nom - 2 * phi_ss - phi_sl;
    
    // Výpočet rozostupu
    const spacing = clearWidth / (n - 1);
    
    return { 
        spacing: spacing, 
        clearWidth: clearWidth,
        error: null 
    };
}

// Funkcia na získanie plochy výstuže z tabuľky
function getReinforcementArea(diameter, count) {
    // Ak nie je zadaný počet prutov alebo priemer, vrátime 0
    if (count <= 0 || diameter <= 0) {
        return 0;
    }
    
    // Nájdenie riadka pre daný priemer
    const row = reinforcementAreas.rows.find(r => r.diameter === diameter);
    
    if (!row) {
        // Ak priemer nie je v tabuľke, použijeme vzorec
        return count * (Math.PI * Math.pow(diameter, 2) / 4) / 100; // Konverzia z mm² na cm²
    }
    
    // Ak je počet prútov <= 9, vrátime priamo hodnotu z tabuľky
    if (count <= 9) {
        return row.values[count - 1];
    }
    
    // Ak je počet prútov > 9, nájdeme najlepšiu kombináciu
    // Začneme s najvyšším možným násobkom
    for (let i = 9; i >= 1; i--) {
        if (count % i === 0) {
            // Ak sa počet prutov delí bezo zvyšku, použijeme násobky
            return row.values[i - 1] * (count / i);
        }
    }
    
    // Ak žiadny z výpočtov nevyhovuje, rozložíme počet prútov na kombináciu
    // Napr. 21 = 9 + 9 + 3
    let remainingCount = count;
    let totalArea = 0;
    
    while (remainingCount > 0) {
        if (remainingCount >= 9) {
            totalArea += row.values[8]; // Pre 9 prútov
            remainingCount -= 9;
        } else {
            totalArea += row.values[remainingCount - 1];
            remainingCount = 0;
        }
    }
    
    return totalArea;
}

// Funkcia na výpočet stupňa vystuženia
function calculateReinforcement(width, height, phi_sl_bottom, n_bottom, phi_sl_top, n_top) {
    // Plocha dolnej výstuže v cm²
    const area_bottom = getReinforcementArea(phi_sl_bottom, n_bottom);
    
    // Plocha hornej výstuže v cm²
    const area_top = getReinforcementArea(phi_sl_top, n_top);
    
    // Celková plocha výstuže v cm²
    const total_reinforcement_area = area_bottom + area_top;
    
    // Plocha betónového prvku v cm²
    const concrete_area = (width * height) / 100; // Konverzia z mm² na cm²
    
    // Výpočet stupňa vystuženia
    const reinforcement_ratio = total_reinforcement_area / concrete_area;
    
    return {
        area_bottom: area_bottom,
        area_top: area_top,
        total_area: total_reinforcement_area,
        concrete_area: concrete_area,
        reinforcement_ratio: reinforcement_ratio,
        reinforcement_percent: reinforcement_ratio * 100,
        reinforcement_permille: reinforcement_ratio * 1000
    };
}

// Funkcia na výpočet materiálových charakteristík
function calculateMaterialProperties(concreteClass, steelClass, gammaC, gammaS) {
    const concrete = concreteClasses[concreteClass];
    const steel = steelClasses[steelClass];
    
    // Návrhová pevnosť betónu
    const fcd = concrete.fck / gammaC;
    
    // Návrhová pevnosť ocele
    const fyd = steel.fyk / gammaS;
    
    return {
        fck: concrete.fck,
        fctm: concrete.fctm,
        fcd: fcd,
        fyk: steel.fyk,
        fyd: fyd
    };
}

// Funkcia na výpočet kotevnej dĺžky
function calculateAnchorageLength(concreteClass, steelClass, phi) {
    const concrete = concreteClasses[concreteClass];
    const fck = concrete.fck;
    
    // Nájdenie správneho indexu fck v hlavičke tabuľky
    const fckIndex = kotevnaTabulka.headers.findIndex(header => parseInt(header) === fck);
    
    if (fckIndex === -1) {
        return { error: `Trieda betónu ${concreteClass} (fck = ${fck} MPa) nie je v tabuľke` };
    }
    
    // Nájdenie správneho riadka pre priemer
    let row = null;
    for (const r of kotevnaTabulka.rows) {
        if (r.diameter === phi.toString()) {
            row = r;
            break;
        } else if (r.diameter === '≤ 12' && phi <= 12) {
            row = r;
            break;
        } else {
            // Porovnaj číselné hodnoty
            const rowDiam = r.diameter === '≤ 12' ? 12 : parseInt(r.diameter);
            if (rowDiam === phi) {
                row = r;
                break;
            }
        }
    }
    
    if (!row) {
        return { error: `Priemer ${phi} mm nie je v tabuľke` };
    }
    
    // Získať koeficient pre kotevnú dĺžku
    const coefficient = row.values[fckIndex - 1]; // -1 pretože prvá hodnota v headers je "ϕ [mm]"
    
    if (coefficient === undefined) {
        return { error: "Nepodarilo sa nájsť koeficient v tabuľke" };
    }
    
    // Výpočet základnej kotevnej dĺžky
    const anchorageLength = coefficient * phi;
    
    // Úprava pre typ ocele
    const steelCoefficient = steelCoefficients[steelClass] || 1.0;
    const adjustedAnchorageLength = anchorageLength * steelCoefficient;
    
    // Výpočet stykovacej dĺžky
    const spliceLength = adjustedAnchorageLength * 1.2; // kls = 1.2
    
    return {
        anchorageLength: adjustedAnchorageLength,
        spliceLength: spliceLength,
        steelCoefficient: steelCoefficient,
        coefficient: coefficient,
        error: null
    };
}