// Funkcie pre ukladanie a načítanie projektov
const ProjectManager = {
    // Pridanie projektu do localStorage
    saveProject: function(name, data) {
        if (!name) {
            return { success: false, message: "Zadajte názov projektu" };
        }
        
        // Získanie existujúcich projektov
        let projects = this.getProjects();
        
        // Pridanie alebo aktualizácia projektu
        projects[name] = data;
        
        // Uloženie do localStorage
        try {
            localStorage.setItem('reinforcementProjects', JSON.stringify(projects));
            return { success: true, message: "Projekt bol úspešne uložený" };
        } catch (e) {
            return { success: false, message: "Nepodarilo sa uložiť projekt: " + e.message };
        }
    },
    
    // Načítanie projektu z localStorage
    loadProject: function(name) {
        const projects = this.getProjects();
        
        if (projects[name]) {
            return { success: true, data: projects[name] };
        } else {
            return { success: false, message: "Projekt sa nenašiel" };
        }
    },
    
    // Získanie všetkých projektov
    getProjects: function() {
        const projectsJSON = localStorage.getItem('reinforcementProjects');
        return projectsJSON ? JSON.parse(projectsJSON) : {};
    },
    
    // Získanie zoznamu názvov projektov
    getProjectNames: function() {
        const projects = this.getProjects();
        return Object.keys(projects);
    },
    
    // Export projektu do súboru
    exportProject: function(name) {
        const result = this.loadProject(name);
        
        if (!result.success) {
            return result;
        }
        
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result.data));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", name + ".json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        
        return { success: true, message: "Projekt bol exportovaný" };
    },
    
    // Import projektu zo súboru
    importProject: function(file, callback) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                const name = file.name.replace('.json', '');
                
                const result = ProjectManager.saveProject(name, data);
                callback(result);
            } catch (e) {
                callback({ success: false, message: "Neplatný súbor: " + e.message });
            }
        };
        
        reader.readAsText(file);
    }
};