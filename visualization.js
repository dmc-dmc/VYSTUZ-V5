// Funkcia na vykreslenie prierezu
function drawCrossSection(canvas, params) {
    const ctx = canvas.getContext('2d');
    
    // Nastavenie veľkosti canvasu podľa rozmerov kontajnera
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Vyčistenie canvasu
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const { width, height, c_nom, phi_ss, phi_sl_bottom, n_bottom, phi_sl_top, n_top } = params;
    
    // Stanovenie mierky pre vykreslenie
    const padding = 80;
    const scale = Math.min(
        (canvas.width - 2 * padding) / width,
        (canvas.height - 2 * padding) / height
    );
    
    // Stred canvasu
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Počiatočné a koncové súradnice pre prierez
    const startX = centerX - (width * scale) / 2;
    const startY = centerY - (height * scale) / 2;
    const endX = centerX + (width * scale) / 2;
    const endY = centerY + (height * scale) / 2;
    
    // Vykreslenie obrysu prierezu
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 2;
    ctx.strokeRect(startX, startY, width * scale, height * scale);
    
    // Vykreslenie krytia
    ctx.strokeStyle = '#bdc3c7';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(
        startX + c_nom * scale,
        startY + c_nom * scale,
        (width - 2 * c_nom) * scale,
        (height - 2 * c_nom) * scale
    );
    ctx.setLineDash([]);
    
    // Vykreslenie dolnej výstuže
    if (n_bottom > 0 && phi_sl_bottom > 0) {
        const spacing = calculateSpacing(width, height, c_nom, phi_sl_bottom, n_bottom, phi_ss);
        
        // Pozícia prvého prúta od ľavého okraja
        const firstBarX = startX + c_nom * scale + phi_ss * scale + phi_sl_bottom * scale / 2;
        const barY = endY - c_nom * scale - phi_ss * scale - phi_sl_bottom * scale / 2;
        
        ctx.fillStyle = '#e74c3c';
        
        for (let i = 0; i < n_bottom; i++) {
            const barX = i === 0 ? firstBarX : firstBarX + i * spacing.spacing * scale;
            ctx.beginPath();
            ctx.arc(barX, barY, phi_sl_bottom * scale / 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Vykreslenie hornej výstuže
    if (n_top > 0 && phi_sl_top > 0) {
        const spacing = calculateSpacing(width, height, c_nom, phi_sl_top, n_top, phi_ss);
        
        // Pozícia prvého prúta od ľavého okraja
        const firstBarX = startX + c_nom * scale + phi_ss * scale + phi_sl_top * scale / 2;
        const barY = startY + c_nom * scale + phi_ss * scale + phi_sl_top * scale / 2;
        
        ctx.fillStyle = '#e74c3c';
        
        for (let i = 0; i < n_top; i++) {
            const barX = i === 0 ? firstBarX : firstBarX + i * spacing.spacing * scale;
            ctx.beginPath();
            ctx.arc(barX, barY, phi_sl_top * scale / 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Vykreslenie strmeňov
    if (phi_ss > 0) {
        ctx.strokeStyle = '#3498db';
        ctx.lineWidth = phi_ss * scale / 2;
        
        // Vnútorná strana strmeňov
        const stirrupX = startX + c_nom * scale + phi_ss * scale / 2;
        const stirrupY = startY + c_nom * scale + phi_ss * scale / 2;
        const stirrupWidth = (width - 2 * c_nom - phi_ss) * scale;
        const stirrupHeight = (height - 2 * c_nom - phi_ss) * scale;
        
        ctx.strokeRect(stirrupX, stirrupY, stirrupWidth, stirrupHeight);
    }
    
    // Pridanie rozmerov a popisu výstuže do canvasu
    ctx.font = '14px Arial';
    ctx.fillStyle = '#2c3e50';

    // Výpočet rozostupu dolnej výstuže pre popis
    let spacingInfoBottom = "";
    if (n_bottom > 1 && phi_sl_bottom > 0) {
        const spacing = calculateSpacing(width, height, c_nom, phi_sl_bottom, n_bottom, phi_ss);
        if (!spacing.error) {
            spacingInfoBottom = `${n_bottom}ϕ${phi_sl_bottom}/${spacing.spacing.toFixed(0)}`;
        } else {
            spacingInfoBottom = `${n_bottom}ϕ${phi_sl_bottom}`;
        }
    }

    // Výpočet rozostupu hornej výstuže pre popis
    let spacingInfoTop = "";
    if (n_top > 1 && phi_sl_top > 0) {
        const spacing = calculateSpacing(width, height, c_nom, phi_sl_top, n_top, phi_ss);
        if (!spacing.error) {
            spacingInfoTop = `${n_top}ϕ${phi_sl_top}/${spacing.spacing.toFixed(0)}`;
        } else {
            spacingInfoTop = `${n_top}ϕ${phi_sl_top}`;
        }
    }

    // Zobrazenie informácií o dolnej výstuži
    if (spacingInfoBottom) {
        ctx.fillText(spacingInfoBottom, centerX - 20, endY + 30);
    }

    // Zobrazenie informácií o hornej výstuži
    if (spacingInfoTop) {
        ctx.fillText(spacingInfoTop, centerX - 20, startY - 15);
    }

    // Zobrazenie šírky prvku
    ctx.fillText(`${width} mm`, centerX - 20, endY + 55);

    // Otočený text pre výšku - proti smeru hodinových ručičiek
    // Stred textu zarovnaný na stred výšky prvku
    ctx.save();
    ctx.translate(endX + 30, centerY);
    ctx.rotate(-Math.PI/2); // Rotácia proti smeru hodinových ručičiek
    ctx.textAlign = 'center'; // Zarovnanie textu na stred
    ctx.fillText(`${height} mm`, 0, 0);
    ctx.textAlign = 'start'; // Návrat na pôvodné zarovnanie pre ostatný text
    ctx.restore();
}

// Funkcia na aktualizáciu legendy
function updateLegend(params) {
    const { width, height, c_nom, phi_sl_bottom, n_bottom, phi_sl_top, n_top, phi_ss } = params;
    const legendElement = document.getElementById('visualization-legend');
    
    // Vytvorenie HTML pre legendu
    let legendHtml = `
        <div class="legend-item"><strong>Rozmery prvku:</strong> ${width} × ${height} mm</div>
        <div class="legend-item"><strong>Krytie výstuže:</strong> ${c_nom} mm</div>
        <div class="legend-item"><strong>Dolná výstuž:</strong> ${n_bottom}×ϕ${phi_sl_bottom}</div>
        <div class="legend-item"><strong>Horná výstuž:</strong> ${n_top}×ϕ${phi_sl_top}</div>
        <div class="legend-item"><strong>Strmene:</strong> ϕ${phi_ss}</div>
    `;
    
    // Nastavenie HTML do elementu legendy
    legendElement.innerHTML = legendHtml;
}